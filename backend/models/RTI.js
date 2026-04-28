const mongoose = require('mongoose');

const rtiSchema = new mongoose.Schema(
  {
    applicantName: {
      type: String,
      required: [true, 'Applicant name is required'],
      trim: true,
    },
    gender: {
      type: String,
      enum: ['Male', 'Female', 'Other'],
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
    },
    contactNumber: {
      type: String,
      required: [true, 'Contact number is required'],
      trim: true,
    },
    address: {
      type: String,
      trim: true,
    },
    rtiCaseNumber: {
      type: String,
      unique: true,
      required: [true, 'RTI case number is required'],
    },
    subject: {
      type: String,
      required: [true, 'Subject is required'],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    applicationMode: {
      type: String,
      enum: ['Online', 'Offline', 'Email', 'Post'],
    },
    department: {
      type: String,
      required: [true, 'Department is required'],
      enum: ['Manager', 'Supervisor', 'Accountant', 'HR', 'Legal', 'IT', 'Finance', 'Administration'],
    },
    assignedOfficer: {
      type: String,
      trim: true,
    },
    dateOfReceipt: {
      type: Date,
      required: [true, 'Date of receipt is required'],
    },
    dueDate: {
      type: Date,
      required: [true, 'Due date is required'],
    },
    extendedDueDate: {
      type: Date,
    },
    reminderFrequency: {
      type: String,
      enum: ['Daily', '3 Days', 'Weekly', 'Monthly'],
    },
    status: {
      type: String,
      enum: ['Pending', 'Verified', 'Rejected', 'Draft'],
      default: 'Pending',
    },
    documents: [
      {
        filename: String,
        originalName: String,
        path: String,
        mimetype: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Pre-save hook to auto-generate rtiCaseNumber if not provided
rtiSchema.pre('save', async function (next) {
  if (this.rtiCaseNumber && this.rtiCaseNumber !== '') {
    return next();
  }

  const year = new Date().getFullYear();
  const deptCode = this.department ? this.department.toUpperCase().slice(0, 3) : 'GEN';

  // Find the latest RTI for this year and department to determine the next sequence number
  const latestRTI = await mongoose
    .model('RTI')
    .findOne({
      rtiCaseNumber: { $regex: `^RTI/${year}/${deptCode}/` },
    })
    .sort({ rtiCaseNumber: -1 })
    .lean();

  let sequence = 1;
  if (latestRTI && latestRTI.rtiCaseNumber) {
    const parts = latestRTI.rtiCaseNumber.split('/');
    const lastSequence = parseInt(parts[3], 10);
    if (!isNaN(lastSequence)) {
      sequence = lastSequence + 1;
    }
  }

  const paddedSequence = String(sequence).padStart(4, '0');
  this.rtiCaseNumber = `RTI/${year}/${deptCode}/${paddedSequence}`;

  next();
});

module.exports = mongoose.model('RTI', rtiSchema);
