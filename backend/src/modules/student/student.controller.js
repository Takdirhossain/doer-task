const fs = require("fs");
const { parse } = require("csv-parse");
const service = require("./student.service");
const { studentSchema, profileUpdateSchema, studentUpdateSchema } = require("./student.validation");
const apiResponse = require("../../utils/apiResponse");
const catchAsync = require("../../utils/catchAsync");
const AppError = require("../../utils/AppError");
exports.uploadCsv = catchAsync(async (req, res) => {
  
    if (!req.file) return res.status(400).json(apiResponse(false, "CSV file required"));

    const rows = [];
    const parser = fs.createReadStream(req.file.path).pipe(
      parse({ columns: true, skip_empty_lines: true, trim: true })
    );

    for await (const record of parser) rows.push(record);
    fs.unlinkSync(req.file.path);

    const result = await service.importFromCsv(rows);
    res.json(apiResponse(true, 'Student imported successfully', result));
  
});

exports.saveCsv = catchAsync(async (req, res) => {
    const data = await service.create(req);
    res.json(apiResponse(true, 'Student created successfully', data));
});

exports.list = catchAsync(async (req, res) => {
    const { page = 1, limit = 10, search } = req.query;
    let teacherId = req.user.id;
    const data = await service.list({ page, limit, search, teacherId });
    res.json(apiResponse(true, 'Student list fetched successfully', data));
});
exports.createStudent = catchAsync(async (req, res) => {
    const {id, username} = req.user;
    const{error, value} = studentSchema.validate(req.body);
    if (error) throw new AppError(error.message, 400);
    const data = await service.createStudent(value, id, username);
    res.status(201).json(apiResponse(true, 'Student created successfully', data));
});

exports.getById = catchAsync(async (req, res) => {
   const studentId = req.params.id;
    const student = await service.getById(studentId);
    if (!student) return res.status(404).json(apiResponse(false, "Student not found"));
    res.status(200).json(apiResponse(true, 'Student fetched successfully', student));
});

exports.update = catchAsync(async (req, res) => {
    const studentId = req.params.id;
    const data = profileUpdateSchema.validate(req.body);
    if (data.error) return res.status(400).json({ success: false, message: data.error.details[0].message });
    const updated = await service.update(studentId, data.value);
    res.json(apiResponse(true, 'Student updated successfully', updated));
});

exports.remove = catchAsync(async (req, res) => {
    const {id, username} = req.user;
    const studentId = req.params.id;
    if (!studentId) return res.status(400).json(apiResponse(false, "Student id is required"));
    await service.remove(studentId, id, username);
    res.json(apiResponse(true, 'Student deleted successfully'));
});
exports.updateStudent = catchAsync(async (req, res) => {
    const studentId = req.params.id;
    const teacherId = req.user.id;
    const {error, value} = studentUpdateSchema.validate(req.body);
    if (error) throw new AppError(error.message, 400);
    const updated = await service.updateStudent( value, teacherId, studentId);
    res.json(apiResponse(true, 'Student updated successfully', updated));
});