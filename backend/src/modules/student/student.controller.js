const fs = require("fs");
const { parse } = require("csv-parse");
const service = require("./student.service");
const {
  studentSchema,
  profileUpdateSchema,
  studentUpdateSchema,
  studentIdParamSchema,
} = require("./student.validation");
const apiResponse = require("../../utils/apiResponse");
const catchAsync = require("../../utils/catchAsync");
const AppError = require("../../utils/AppError");

exports.uploadCsv = catchAsync(async (req, res, next) => {
  if (!req.file) return next(new AppError("CSV file required", 400));
  const { id: teacherId, username } = req.user;

  const duplicateUsers = [];
  const uniqueUsers = [];

  const parser = fs
    .createReadStream(req.file.path)
    .pipe(parse({ columns: true, skip_empty_lines: true, trim: true }));

  let rowIndex = 0;
  for await (const record of parser) {
    rowIndex++;

    const data = {
      username: record.user_name?.trim(),
      email: record.email?.trim(),
      mobileNumber: record.mobile_number?.trim(),
      firstName: record.first_name?.trim() || null,
      lastName: record.last_name?.trim() || null,
      class: record.class ? Number(record.class) : null,
      dateOfBirth: record.date_of_birth ? new Date(record.date_of_birth) : null,
      rollNumber: record.roll_number ? Number(record.roll_number) : null,
      password_hash: record.password_hash?.trim() || "123456",
      address: record.address?.trim() || null,
    };

    const { error } = studentSchema.validate(data);
    if (error) {
      duplicateUsers.push({
        rowNumber: rowIndex + 1,
        reason: error.details.map((d) => d.message).join(", "),
        ...data,
      });
      continue;
    }

    uniqueUsers.push(data);
  }

  await fs.promises.unlink(req.file.path);

  const { finalUniqueUsers, finalDuplicateUsers } =
    await service.filterExistingUsers(
      uniqueUsers,
      duplicateUsers,
      teacherId,
      username
    );

  res.json(
    apiResponse(true, "CSV processed successfully", {
      uniqueCount: finalUniqueUsers.length,
      duplicateCount: finalDuplicateUsers.length,
      uniqueUsers: finalUniqueUsers,
      duplicateUsers: finalDuplicateUsers,
    })
  );
});

exports.saveCsv = catchAsync(async (req, res) => {
  const teacherId = req.user.id;
  const username = req.user.username;
  const data = await service.insertUsers(req.body, teacherId, username);
  res.json(apiResponse(true, "Student created successfully", data));
});

exports.list = catchAsync(async (req, res) => {
  const { page = 1, limit = 10, search } = req.query;
  let teacherId = req.user.id;
  const data = await service.list({ page, limit, search, teacherId });
  res.json(apiResponse(true, "Student list fetched successfully", data));
});
exports.createStudent = catchAsync(async (req, res, next) => {
  const { id, username } = req.user;
  const { error, value } = studentSchema.validate(req.body);
  if (error) return next(new AppError(error.message, 400));
  const data = await service.createStudent(value, id, username);
  res.status(201).json(apiResponse(true, "Student created successfully", data));
});

exports.getById = catchAsync(async (req, res, next) => {
  const studentId = req.params.id;
  const student = await service.getById(studentId);
  if (!student)
    return res.status(404).json(apiResponse(false, "Student not found"));
  res
    .status(200)
    .json(apiResponse(true, "Student fetched successfully", student));
});

exports.update = catchAsync(async (req, res, next) => {
  const { id, username } = req.user;
  const studentId = req.params.id;
  const { error, value } = profileUpdateSchema.validate(req.body);
  if (error) return next(new AppError(error.message, 400));
  const updated = await service.update(studentId, value);
  res.json(apiResponse(true, "Student updated successfully", updated));
});

exports.remove = catchAsync(async (req, res, next) => {
  const { id, username } = req.user;
  const studentId = req.params.id;
  if (!studentId) return next(new AppError("Student id is required", 400));
  await service.remove(studentId, id, username);
  res.json(apiResponse(true, "Student deleted successfully"));
});
exports.updateStudent = catchAsync(async (req, res, next) => {
  const { error: paramError } = studentIdParamSchema.validate(req.params);
  if (paramError) return next(new AppError(paramError.details[0].message, 400));
  const studentId = req.params.id;
  const teacherId = req.user.id;
  const teacherName = req.user.username;
  const { error, value } = studentUpdateSchema.validate(req.body);
  if (error) return next(new AppError(error.message, 400));
  const updated = await service.updateStudent(value, teacherId, studentId,teacherName);
  res.json(apiResponse(true, "Student updated successfully", updated));
});

exports.exportStudents = catchAsync(async (req, res) => {
  const teacherId = req.user.id;
  const teacherName = req.user.username;
  const search = req.query.search;
  const buffer = await service.exportStudents(teacherId, teacherName, search);
  res.setHeader("Content-Type", "text/csv");
  res.setHeader("Content-Disposition", "attachment; filename=students.csv");
  res.send(buffer);
});
