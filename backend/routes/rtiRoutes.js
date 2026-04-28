const express = require('express');
const router = express.Router();
const {
  createRTI,
  getAllRTIs,
  getRTIById,
  updateRTI,
  deleteRTI,
} = require('../controllers/rtiController');
const { validateRTI, validateRTIUpdate } = require('../middleware/validation');
const upload = require('../middleware/upload');
const auth = require('../middleware/auth');

// Protect all RTI routes
router.use(auth);

/**
 * @swagger
 * components:
 *   schemas:
 *     Document:
 *       type: object
 *       properties:
 *         filename:
 *           type: string
 *         originalName:
 *           type: string
 *         path:
 *           type: string
 *         mimetype:
 *           type: string
 *     RTI:
 *       type: object
 *       required:
 *         - applicantName
 *         - contactNumber
 *         - subject
 *         - department
 *         - dateOfReceipt
 *         - dueDate
 *       properties:
 *         _id:
 *           type: string
 *           description: Auto-generated MongoDB ID
 *         applicantName:
 *           type: string
 *           description: Name of the applicant
 *         gender:
 *           type: string
 *           enum: [Male, Female, Other]
 *         email:
 *           type: string
 *           format: email
 *         contactNumber:
 *           type: string
 *         address:
 *           type: string
 *         rtiCaseNumber:
 *           type: string
 *           description: Auto-generated RTI case number (format RTI/YYYY/DEPT/XXXX)
 *         subject:
 *           type: string
 *         description:
 *           type: string
 *         applicationMode:
 *           type: string
 *           enum: [Online, Offline, Email, Post]
 *         department:
 *           type: string
 *           enum: [Manager, Supervisor, Accountant, HR, Legal, IT, Finance, Administration]
 *         assignedOfficer:
 *           type: string
 *         dateOfReceipt:
 *           type: string
 *           format: date
 *         dueDate:
 *           type: string
 *           format: date
 *         extendedDueDate:
 *           type: string
 *           format: date
 *         reminderFrequency:
 *           type: string
 *           enum: [Daily, 3 Days, Weekly, Monthly]
 *         status:
 *           type: string
 *           enum: [Pending, Verified, Rejected, Draft]
 *           default: Pending
 *         documents:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Document'
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     Pagination:
 *       type: object
 *       properties:
 *         total:
 *           type: integer
 *         page:
 *           type: integer
 *         limit:
 *           type: integer
 *         pages:
 *           type: integer
 */

/**
 * @swagger
 * /api/rti:
 *   post:
 *     summary: Create a new RTI application
 *     tags: [RTI]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - applicantName
 *               - contactNumber
 *               - subject
 *               - department
 *               - dateOfReceipt
 *               - dueDate
 *             properties:
 *               applicantName:
 *                 type: string
 *               gender:
 *                 type: string
 *                 enum: [Male, Female, Other]
 *               email:
 *                 type: string
 *               contactNumber:
 *                 type: string
 *               address:
 *                 type: string
 *               subject:
 *                 type: string
 *               description:
 *                 type: string
 *               applicationMode:
 *                 type: string
 *                 enum: [Online, Offline, Email, Post]
 *               department:
 *                 type: string
 *                 enum: [Manager, Supervisor, Accountant, HR, Legal, IT, Finance, Administration]
 *               assignedOfficer:
 *                 type: string
 *               dateOfReceipt:
 *                 type: string
 *                 format: date
 *               dueDate:
 *                 type: string
 *                 format: date
 *               extendedDueDate:
 *                 type: string
 *                 format: date
 *               reminderFrequency:
 *                 type: string
 *                 enum: [Daily, 3 Days, Weekly, Monthly]
 *               status:
 *                 type: string
 *                 enum: [Pending, Verified, Rejected, Draft]
 *               application:
 *                 type: string
 *                 format: binary
 *               attachments:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       201:
 *         description: RTI application created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/RTI'
 *       400:
 *         description: Validation error
 */
router.post('/', upload, validateRTI, createRTI);

/**
 * @swagger
 * /api/rti:
 *   get:
 *     summary: Get all RTI applications with pagination and filters
 *     tags: [RTI]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of items per page
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [Pending, Verified, Rejected, Draft]
 *         description: Filter by status
 *       - in: query
 *         name: department
 *         schema:
 *           type: string
 *         description: Filter by department
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter by start date (dateOfReceipt)
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter by end date (dateOfReceipt)
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by applicant name or RTI case number
 *     responses:
 *       200:
 *         description: List of RTI applications
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/RTI'
 *                 pagination:
 *                   $ref: '#/components/schemas/Pagination'
 */
router.get('/', getAllRTIs);

/**
 * @swagger
 * /api/rti/{id}:
 *   get:
 *     summary: Get a single RTI application by ID
 *     tags: [RTI]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: RTI application ID
 *     responses:
 *       200:
 *         description: RTI application details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/RTI'
 *       404:
 *         description: RTI application not found
 */
router.get('/:id', getRTIById);

/**
 * @swagger
 * /api/rti/{id}:
 *   put:
 *     summary: Update an RTI application
 *     tags: [RTI]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: RTI application ID
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               applicantName:
 *                 type: string
 *               gender:
 *                 type: string
 *                 enum: [Male, Female, Other]
 *               email:
 *                 type: string
 *               contactNumber:
 *                 type: string
 *               address:
 *                 type: string
 *               subject:
 *                 type: string
 *               description:
 *                 type: string
 *               applicationMode:
 *                 type: string
 *                 enum: [Online, Offline, Email, Post]
 *               department:
 *                 type: string
 *                 enum: [Manager, Supervisor, Accountant, HR, Legal, IT, Finance, Administration]
 *               assignedOfficer:
 *                 type: string
 *               dateOfReceipt:
 *                 type: string
 *                 format: date
 *               dueDate:
 *                 type: string
 *                 format: date
 *               extendedDueDate:
 *                 type: string
 *                 format: date
 *               reminderFrequency:
 *                 type: string
 *                 enum: [Daily, 3 Days, Weekly, Monthly]
 *               status:
 *                 type: string
 *                 enum: [Pending, Verified, Rejected, Draft]
 *               application:
 *                 type: string
 *                 format: binary
 *               attachments:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       200:
 *         description: RTI application updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/RTI'
 *       404:
 *         description: RTI application not found
 */
router.put('/:id', upload, validateRTIUpdate, updateRTI);

/**
 * @swagger
 * /api/rti/{id}:
 *   delete:
 *     summary: Delete an RTI application
 *     tags: [RTI]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: RTI application ID
 *     responses:
 *       200:
 *         description: RTI application deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *       404:
 *         description: RTI application not found
 */
router.delete('/:id', deleteRTI);

module.exports = router;
