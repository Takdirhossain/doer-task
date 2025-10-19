const fs = require("fs");
const { parse } = require("csv-parse");
const service = require("./student.service");
const { studentSchema, profileUpdateSchema } = require("./student.validation");
const apiResponse = require("../../utils/apiResponse");

exports.uploadCsv = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "CSV file required" });

    const rows = [];
    const parser = fs.createReadStream(req.file.path).pipe(
      parse({ columns: true, skip_empty_lines: true, trim: true })
    );

    for await (const record of parser) rows.push(record);
    fs.unlinkSync(req.file.path);

    const result = await service.importFromCsv(rows);
    res.json({ success: true, ...result });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    const data = await service.create(req);
    res.status(201).json({ success: true, data });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.list = async (req, res) => {
  try {
    const { page = 1, limit = 10, search } = req.query;
    let teacherId = req.user.id;
    const data = await service.list({ page, limit, search, teacherId });
    res.json(apiResponse(true, 'Student list fetched successfully', data));
  } catch (err) {
    res.status(500).json(apiResponse(false, err.message));
  }
};

exports.getById = async (req, res) => {
  try {
   const studentId = req.params.id;
    const student = await service.getById(studentId);
    if (!student) return res.status(404).json({ message: "Student not found" });
    res.json({ success: true, data: student });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const studentId = req.params.id;
    const data = profileUpdateSchema.validate(req.body);
    console.log(data)
    if (data.error) return res.status(400).json({ success: false, message: data.error.details[0].message });
    const updated = await service.update(studentId, data.value);
    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.remove = async (req, res) => {
  try {
    await service.remove(req.params.id);
    res.json({ success: true, message: "Deleted successfully" });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};