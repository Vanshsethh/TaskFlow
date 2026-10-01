require('dotenv').config({ path: __dirname + '/../.env' });
const mongoose = require('mongoose');
const User = require('../models/User');
const Task = require('../models/Task');

const seedData = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/taskflow';
    console.log(`[Seed] Connecting to MongoDB: ${mongoUri}...`);
    await mongoose.connect(mongoUri);

    console.log('[Seed] Clearing existing tasks and users...');
    await Task.deleteMany({});
    await User.deleteMany({});

    console.log('[Seed] Creating pre-seeded user accounts...');
    
    // Primary test user as per spec
    const primaryUser = await User.create({
      name: 'Vansh Seth',
      email: 'testuser@example.com',
      password: 'Test@1234'
    });

    // Secondary user for team assignment demonstration
    const teammateUser = await User.create({
      name: 'Alex Rivera',
      email: 'alex.rivera@example.com',
      password: 'Alex@1234'
    });

    // Third user for diverse team collaboration
    const designerUser = await User.create({
      name: 'Sarah Chen',
      email: 'sarah.chen@example.com',
      password: 'Sarah@1234'
    });

    console.log('[Seed] Users created:');
    console.log(` - ${primaryUser.name} (${primaryUser.email}) [Default login]`);
    console.log(` - ${teammateUser.name} (${teammateUser.email})`);
    console.log(` - ${designerUser.name} (${designerUser.email})`);

    const now = new Date();
    const addDays = (d) => new Date(now.getTime() + d * 24 * 60 * 60 * 1000);

    const sampleTasks = [
      {
        title: 'Design high-fidelity UI design system in Figma',
        description: 'Complete component library with dark mode tokens, buttons, inputs, cards, and modal dialogs adhering to Tailwind color palette.',
        priority: 'High',
        status: 'Completed',
        dueDate: addDays(-2),
        assignedUser: designerUser._id,
        createdBy: primaryUser._id
      },
      {
        title: 'Implement JWT authentication & protected routes',
        description: 'Set up bcrypt password hashing, JSON Web Tokens with 30-day Remember Me option, and client-side route guards.',
        priority: 'High',
        status: 'Completed',
        dueDate: addDays(1),
        assignedUser: primaryUser._id,
        createdBy: primaryUser._id
      },
      {
        title: 'Build Drag & Drop Kanban task board',
        description: 'Interactive Kanban board allowing team members to drag task cards between Pending, In Progress, and Completed columns with optimistic updates.',
        priority: 'High',
        status: 'In Progress',
        dueDate: addDays(3),
        assignedUser: primaryUser._id,
        createdBy: primaryUser._id
      },
      {
        title: 'Configure MongoDB Atlas database & aggregation pipelines',
        description: 'Design schemas for Users and Tasks with proper indexing, validation rules, and stats aggregation for dashboard metrics.',
        priority: 'Medium',
        status: 'In Progress',
        dueDate: addDays(4),
        assignedUser: teammateUser._id,
        createdBy: primaryUser._id
      },
      {
        title: 'Implement server-side search, filtering, and pagination',
        description: 'Allow querying tasks by status, priority, title keyword search, date sorting, and clean pagination query parameters.',
        priority: 'Medium',
        status: 'In Progress',
        dueDate: addDays(5),
        assignedUser: primaryUser._id,
        createdBy: teammateUser._id
      },
      {
        title: 'Add interactive metrics & priority distribution charts',
        description: 'Create visual SVG status distribution and priority breakdowns on the executive dashboard view.',
        priority: 'Medium',
        status: 'Pending',
        dueDate: addDays(6),
        assignedUser: designerUser._id,
        createdBy: primaryUser._id
      },
      {
        title: 'Set up Docker containerization for Client and Server',
        description: 'Create multi-stage Dockerfile and docker-compose.yml files for reproducible one-command local spins.',
        priority: 'Low',
        status: 'Pending',
        dueDate: addDays(8),
        assignedUser: teammateUser._id,
        createdBy: primaryUser._id
      },
      {
        title: 'Write comprehensive README and export Postman API collection',
        description: 'Document architecture, API endpoints, setup instructions, deployment steps for Vercel/Render, and sample requests.',
        priority: 'Medium',
        status: 'Pending',
        dueDate: addDays(10),
        assignedUser: primaryUser._id,
        createdBy: primaryUser._id
      }
    ];

    console.log(`[Seed] Inserting ${sampleTasks.length} realistic tasks...`);
    await Task.insertMany(sampleTasks);

    console.log('[Seed] Database successfully seeded! 🎉');
    console.log('----------------------------------------------------');
    console.log('Test Credentials:');
    console.log('  Email:    testuser@example.com');
    console.log('  Password: Test@1234');
    console.log('----------------------------------------------------');

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('[Seed Error]:', error);
    process.exit(1);
  }
};

seedData();
