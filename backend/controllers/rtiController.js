const RTI = require('../models/RTI');
const fs = require('fs');
const path = require('path');

// @desc    Create a new RTI application
// @route   POST /api/rti
const createRTI = async (req, res, next) => {
  try {
    const rtiData = { ...req.body };

    // Handle file uploads
    const documents = [];
    if (req.files) {
      if (req.files.application) {
        req.files.application.forEach((file) => {
          documents.push({
            filename: file.filename,
            originalName: file.originalname,
            path: file.path,
            mimetype: file.mimetype,
          });
        });
      }
      if (req.files.attachments) {
        req.files.attachments.forEach((file) => {
          documents.push({
            filename: file.filename,
            originalName: file.originalname,
            path: file.path,
            mimetype: file.mimetype,
          });
        });
      }
    }

    if (documents.length > 0) {
      rtiData.documents = documents;
    }

    const rti = await RTI.create(rtiData);

    res.status(201).json({
      success: true,
      data: rti,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all RTI applications with pagination and filters
// @route   GET /api/rti
const getAllRTIs = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 10,
      status,
      department,
      startDate,
      endDate,
      search,
    } = req.query;

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    // Build filter object
    const filter = {};

    if (status) {
      filter.status = status;
    }

    if (department) {
      filter.department = department;
    }

    if (startDate || endDate) {
      filter.dateOfReceipt = {};
      if (startDate) {
        filter.dateOfReceipt.$gte = new Date(startDate);
      }
      if (endDate) {
        filter.dateOfReceipt.$lte = new Date(endDate);
      }
    }

    if (search) {
      filter.$or = [
        { applicantName: { $regex: search, $options: 'i' } },
        { rtiCaseNumber: { $regex: search, $options: 'i' } },
      ];
    }

    const [data, total] = await Promise.all([
      RTI.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limitNum).lean(),
      RTI.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      data,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        pages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single RTI application by ID
// @route   GET /api/rti/:id
const getRTIById = async (req, res, next) => {
  try {
    const rti = await RTI.findById(req.params.id);

    if (!rti) {
      return res.status(404).json({
        success: false,
        message: 'RTI application not found',
      });
    }

    res.status(200).json({
      success: true,
      data: rti,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update RTI application
// @route   PUT /api/rti/:id
const updateRTI = async (req, res, next) => {
  try {
    const rti = await RTI.findById(req.params.id);

    if (!rti) {
      return res.status(404).json({
        success: false,
        message: 'RTI application not found',
      });
    }

    const updateData = { ...req.body };

    // Handle new file uploads
    if (req.files) {
      const newDocuments = [];
      if (req.files.application) {
        req.files.application.forEach((file) => {
          newDocuments.push({
            filename: file.filename,
            originalName: file.originalname,
            path: file.path,
            mimetype: file.mimetype,
          });
        });
      }
      if (req.files.attachments) {
        req.files.attachments.forEach((file) => {
          newDocuments.push({
            filename: file.filename,
            originalName: file.originalname,
            path: file.path,
            mimetype: file.mimetype,
          });
        });
      }
      if (newDocuments.length > 0) {
        updateData.documents = [...(rti.documents || []), ...newDocuments];
      }
    }

    const updatedRTI = await RTI.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: updatedRTI,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete RTI application
// @route   DELETE /api/rti/:id
const deleteRTI = async (req, res, next) => {
  try {
    const rti = await RTI.findById(req.params.id);

    if (!rti) {
      return res.status(404).json({
        success: false,
        message: 'RTI application not found',
      });
    }

    // Delete associated files from disk
    if (rti.documents && rti.documents.length > 0) {
      rti.documents.forEach((doc) => {
        const filePath = path.resolve(doc.path);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      });
    }

    await RTI.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'RTI application deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createRTI,
  getAllRTIs,
  getRTIById,
  updateRTI,
  deleteRTI,
};
