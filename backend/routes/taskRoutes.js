const express = require('express');
const { body, param } = require('express-validator');
const {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  getTaskStats
} = require('../controllers/taskController');
const { protect } = require('../middleware/auth');
const { handleValidationErrors } = require('../middleware/validate');

const router = express.Router();

// Validation rules for task creation
const createTaskValidation = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Task title is required')
    .isLength({ min: 3 })
    .withMessage('Title must be at least 3 characters'),
  body('description')
    .trim()
    .notEmpty()
    .withMessage('Task description is required'),
  body('priority')
    .optional()
    .isIn(['Low', 'Medium', 'High'])
    .withMessage('Priority must be Low, Medium, or High'),
  body('status')
    .optional()
    .isIn(['Pending', 'In Progress', 'Completed'])
    .withMessage('Status must be Pending, In Progress, or Completed'),
  body('dueDate')
    .notEmpty()
    .withMessage('Due date is required')
    .isISO8601()
    .withMessage('Due date must be a valid ISO date'),
  body('assignedUser')
    .notEmpty()
    .withMessage('Assigned user is required')
    .isMongoId()
    .withMessage('Invalid assigned user ID'),
  handleValidationErrors
];

// Validation rules for task update
const updateTaskValidation = [
  param('id').isMongoId().withMessage('Invalid task ID'),
  body('title')
    .optional()
    .trim()
    .isLength({ min: 3 })
    .withMessage('Title must be at least 3 characters'),
  body('priority')
    .optional()
    .isIn(['Low', 'Medium', 'High'])
    .withMessage('Priority must be Low, Medium, or High'),
  body('status')
    .optional()
    .isIn(['Pending', 'In Progress', 'Completed'])
    .withMessage('Status must be Pending, In Progress, or Completed'),
  body('dueDate')
    .optional()
    .isISO8601()
    .withMessage('Due date must be a valid ISO date'),
  body('assignedUser')
    .optional()
    .isMongoId()
    .withMessage('Invalid assigned user ID'),
  handleValidationErrors
];

// All task routes require JWT authentication
router.use(protect);

// Statistics endpoint (must be declared before /:id)
router.get('/tasks/stats', getTaskStats);

// Tasks collection endpoints
router.get('/tasks', getTasks);
router.post('/tasks', createTaskValidation, createTask);

// Single task endpoints
router.get('/tasks/:id', param('id').isMongoId().withMessage('Invalid task ID'), handleValidationErrors, getTaskById);
router.put('/tasks/:id', updateTaskValidation, updateTask);
router.delete('/tasks/:id', param('id').isMongoId().withMessage('Invalid task ID'), handleValidationErrors, deleteTask);

module.exports = router;
