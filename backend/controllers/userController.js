const User = require('../models/User');

// @desc    Get all registered users for task assignment
// @route   GET /users
// @access  Private
const getUsers = async (req, res) => {
  try {
    const users = await User.find({})
      .select('_id name email createdAt')
      .sort({ name: 1 });

    return res.status(200).json({
      success: true,
      count: users.length,
      users
    });
  } catch (error) {
    console.error('[GetUsers Error]:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error fetching user list',
      error: error.message
    });
  }
};

module.exports = {
  getUsers
};
