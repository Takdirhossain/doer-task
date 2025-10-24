const fs = require("fs");
const { parse } = require("csv-parse");
const service = require("./student.service");
const { studentSchema, profileUpdateSchema } = require("./student.validation");
const apiResponse = require("../../utils/apiResponse");
const catchAsync = require("../../utils/catchAsync");
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

exports.create = catchAsync(async (req, res) => {
    const data = await service.create(req);
    res.json(apiResponse(true, 'Student created successfully', data));
});

exports.list = catchAsync(async (req, res) => {
    const { page = 1, limit = 10, search } = req.query;
    let teacherId = req.user.id;
    const data = await service.list({ page, limit, search, teacherId });
    res.json(apiResponse(true, 'Student list fetched successfully', data));
});

exports.getById = catchAsync(async (req, res) => {
   const studentId = req.params.id;
    const student = await service.getById(studentId);
    if (!student) return res.status(404).json(apiResponse(false, "Student not found"));
    res.json(apiResponse(true, 'Student fetched successfully', student));
});

exports.update = catchAsync(async (req, res) => {
    const studentId = req.params.id;
    const data = profileUpdateSchema.validate(req.body);
    console.log(data)
    if (data.error) return res.status(400).json({ success: false, message: data.error.details[0].message });
    const updated = await service.update(studentId, data.value);
    res.json(apiResponse(true, 'Student updated successfully', updated));
});

exports.remove = catchAsync(async (req, res) => {
    await service.remove(req.params.id);
    res.json(apiResponse(true, 'Student deleted successfully'));
});