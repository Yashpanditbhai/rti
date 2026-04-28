const { z } = require('zod');

const rtiCreateSchema = z.object({
  applicantName: z
    .string({ required_error: 'Applicant name is required' })
    .min(2, 'Applicant name must be at least 2 characters'),
  gender: z.enum(['Male', 'Female', 'Other']).optional(),
  email: z.string().email('Invalid email address').optional().or(z.literal('')),
  contactNumber: z.string({ required_error: 'Contact number is required' }).min(1, 'Contact number is required'),
  address: z.string().optional(),
  rtiCaseNumber: z.string().optional(),
  subject: z.string({ required_error: 'Subject is required' }).min(1, 'Subject is required'),
  description: z.string().optional(),
  applicationMode: z.enum(['Online', 'Offline', 'Email', 'Post']).optional(),
  department: z.string({ required_error: 'Department is required' }).min(1, 'Department is required'),
  assignedOfficer: z.string().optional(),
  dateOfReceipt: z.string({ required_error: 'Date of receipt is required' }).min(1, 'Date of receipt is required'),
  dueDate: z.string({ required_error: 'Due date is required' }).min(1, 'Due date is required'),
  extendedDueDate: z.string().optional(),
  reminderFrequency: z.enum(['Daily', '3 Days', 'Weekly', 'Monthly']).optional(),
  status: z.enum(['Pending', 'Verified', 'Rejected', 'Draft']).optional(),
});

const rtiUpdateSchema = z.object({
  applicantName: z.string().min(2, 'Applicant name must be at least 2 characters').optional(),
  gender: z.enum(['Male', 'Female', 'Other']).optional(),
  email: z.string().email('Invalid email address').optional().or(z.literal('')),
  contactNumber: z.string().optional(),
  address: z.string().optional(),
  rtiCaseNumber: z.string().optional(),
  subject: z.string().optional(),
  description: z.string().optional(),
  applicationMode: z.enum(['Online', 'Offline', 'Email', 'Post']).optional(),
  department: z.string().optional(),
  assignedOfficer: z.string().optional(),
  dateOfReceipt: z.string().optional(),
  dueDate: z.string().optional(),
  extendedDueDate: z.string().optional(),
  reminderFrequency: z.enum(['Daily', '3 Days', 'Weekly', 'Monthly']).optional(),
  status: z.enum(['Pending', 'Verified', 'Rejected', 'Draft']).optional(),
});

const validateRTI = (req, res, next) => {
  try {
    rtiCreateSchema.parse(req.body);
    next();
  } catch (error) {
    const errors = error.errors.map((err) => ({
      field: err.path.join('.'),
      message: err.message,
    }));
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors,
    });
  }
};

const validateRTIUpdate = (req, res, next) => {
  try {
    rtiUpdateSchema.parse(req.body);
    next();
  } catch (error) {
    const errors = error.errors.map((err) => ({
      field: err.path.join('.'),
      message: err.message,
    }));
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors,
    });
  }
};

module.exports = { validateRTI, validateRTIUpdate };
