const Task = require('../models/Task');
const mongoose = require('mongoose');

// @desc    Get all tasks with search, filter, sort, and pagination
// @route   GET /tasks
// @access  Private
const getTasks = async (req, res) => {
  try {
    const {
      search,
      status,
      priority,
      sort,
      page = 1,
      limit = 10,
      all = false
    } = req.query;

    const query = {};

    // Filter by Status
    if (status && status !== 'all') {
      query.status = status;
    }

    // Filter by Priority
    if (priority && priority !== 'all') {
      query.priority = priority;
    }

    // Search by title or description
    if (search && search.trim() !== '') {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [{ title: searchRegex }, { description: searchRegex }];
    }

    // Sorting options
    let sortOptions = { createdAt: -1 }; // default newest first
    if (sort) {
      if (sort === 'dueDate:asc') sortOptions = { dueDate: 1 };
      else if (sort === 'dueDate:desc') sortOptions = { dueDate: -1 };
      else if (sort === 'createdAt:asc') sortOptions = { createdAt: 1 };
      else if (sort === 'createdAt:desc') sortOptions = { createdAt: -1 };
      else if (sort === 'title:asc') sortOptions = { title: 1 };
      else if (sort === 'title:desc') sortOptions = { title: -1 };
      else if (sort === 'priority:desc') {
        // High -> Medium -> Low sorting handled or via custom mapping
        sortOptions = { priority: -1 };
      }
    }

    const total = await Task.countDocuments(query);

    let taskQuery = Task.find(query)
      .populate('assignedUser', 'name email')
      .populate('createdBy', 'name email')
      .sort(sortOptions);

    // If 'all' is true, return without pagination limit (useful for Kanban board)
    if (all === 'true' || all === true) {
      const tasks = await taskQuery.exec();
      return res.status(200).json({
        success: true,
        count: tasks.length,
        total,
        totalPages: 1,
        currentPage: 1,
        tasks
      });
    }

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 10;
    const skip = (pageNum - 1) * limitNum;

    const tasks = await taskQuery.skip(skip).limit(limitNum).exec();

    return res.status(200).json({
      success: true,
      count: tasks.length,
      total,
      totalPages: Math.ceil(total / limitNum) || 1,
      currentPage: pageNum,
      limit: limitNum,
      tasks
    });
  } catch (error) {
    console.error('[GetTasks Error]:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error retrieving tasks',
      error: error.message
    });
  }
};

// @desc    Get single task by ID
// @route   GET /tasks/:id
// @access  Private
const getTaskById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({
        success: false,
        message: 'Task not found: invalid ID format'
      });
    }

    const task = await Task.findById(id)
      .populate('assignedUser', 'name email')
      .populate('createdBy', 'name email');

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    return res.status(200).json({
      success: true,
      task
    });
  } catch (error) {
    console.error('[GetTaskById Error]:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error retrieving task details',
      error: error.message
    });
  }
};

// @desc    Create a new task
// @route   POST /tasks
// @access  Private
const createTask = async (req, res) => {
  try {
    const { title, description, priority, dueDate, status, assignedUser } =
      req.body;

    const newTask = await Task.create({
      title,
      description,
      priority: priority || 'Medium',
      dueDate,
      status: status || 'Pending',
      assignedUser,
      createdBy: req.user._id
    });

    const populatedTask = await Task.findById(newTask._id)
      .populate('assignedUser', 'name email')
      .populate('createdBy', 'name email');

    return res.status(201).json({
      success: true,
      message: 'Task created successfully',
      task: populatedTask
    });
  } catch (error) {
    console.error('[CreateTask Error]:', error);
    return res.status(400).json({
      success: false,
      message: 'Failed to create task',
      error: error.message
    });
  }
};

// @desc    Update an existing task
// @route   PUT /tasks/:id
// @access  Private (Creator can edit all, Assignee can update status)
const updateTask = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    const task = await Task.findById(id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    const isCreator = task.createdBy.toString() === req.user._id.toString();
    const isAssignee = task.assignedUser.toString() === req.user._id.toString();

    // Check permissions
    if (!isCreator && !isAssignee) {
      return res.status(403).json({
        success: false,
        message: 'Permission denied: Only task creator or assignee can modify this task'
      });
    }

    // If assignee (but not creator), they are only allowed to update status
    if (!isCreator && isAssignee) {
      const allowedFields = ['status'];
      const updates = Object.keys(req.body);
      const isOnlyStatus = updates.every((key) => allowedFields.includes(key));

      if (!isOnlyStatus) {
        return res.status(403).json({
          success: false,
          message:
            'Permission denied: Only the creator can modify full task details. Assignees may only update task status.'
        });
      }
    }

    // Apply allowed updates
    const updatableFields = [
      'title',
      'description',
      'priority',
      'dueDate',
      'status',
      'assignedUser'
    ];

    updatableFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        task[field] = req.body[field];
      }
    });

    await task.save();

    const updatedTask = await Task.findById(id)
      .populate('assignedUser', 'name email')
      .populate('createdBy', 'name email');

    return res.status(200).json({
      success: true,
      message: 'Task updated successfully',
      task: updatedTask
    });
  } catch (error) {
    console.error('[UpdateTask Error]:', error);
    return res.status(400).json({
      success: false,
      message: 'Failed to update task',
      error: error.message
    });
  }
};

// @desc    Delete a task
// @route   DELETE /tasks/:id
// @access  Private (Creator only)
const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    const task = await Task.findById(id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    // Creator only check
    if (task.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Permission denied: Only the creator can delete this task'
      });
    }

    await Task.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: 'Task deleted successfully',
      taskId: id
    });
  } catch (error) {
    console.error('[DeleteTask Error]:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error deleting task',
      error: error.message
    });
  }
};

// @desc    Get dashboard metrics & statistics
// @route   GET /tasks/stats
// @access  Private
const getTaskStats = async (req, res) => {
  try {
    const [statusStats, priorityStats, totalTasks] = await Promise.all([
      Task.aggregate([
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 }
          }
        }
      ]),
      Task.aggregate([
        {
          $group: {
            _id: '$priority',
            count: { $sum: 1 }
          }
        }
      ]),
      Task.countDocuments()
    ]);

    // Format status metrics with defaults
    const statusCounts = {
      Pending: 0,
      'In Progress': 0,
      Completed: 0
    };
    statusStats.forEach((item) => {
      if (item._id && statusCounts[item._id] !== undefined) {
        statusCounts[item._id] = item.count;
      }
    });

    // Format priority metrics with defaults
    const priorityCounts = {
      Low: 0,
      Medium: 0,
      High: 0
    };
    priorityStats.forEach((item) => {
      if (item._id && priorityCounts[item._id] !== undefined) {
        priorityCounts[item._id] = item.count;
      }
    });

    // Overdue tasks count
    const overdueCount = await Task.countDocuments({
      status: { $ne: 'Completed' },
      dueDate: { $lt: new Date() }
    });

    return res.status(200).json({
      success: true,
      stats: {
        total: totalTasks,
        pending: statusCounts.Pending,
        inProgress: statusCounts['In Progress'],
        completed: statusCounts.Completed,
        overdue: overdueCount,
        priorityBreakdown: priorityCounts,
        completionRate:
          totalTasks > 0
            ? Math.round((statusCounts.Completed / totalTasks) * 100)
            : 0
      }
    });
  } catch (error) {
    console.error('[GetTaskStats Error]:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error retrieving task statistics',
      error: error.message
    });
  }
};

module.exports = {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  getTaskStats
};
