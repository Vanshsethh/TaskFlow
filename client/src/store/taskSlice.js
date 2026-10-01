import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  getTaskStats
} from '../services/taskService';

export const fetchTasksAsync = createAsyncThunk(
  'tasks/fetchTasks',
  async (params = {}, { rejectWithValue }) => {
    try {
      const data = await getTasks(params);
      return data;
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to fetch tasks');
    }
  }
);

export const fetchTaskByIdAsync = createAsyncThunk(
  'tasks/fetchTaskById',
  async (id, { rejectWithValue }) => {
    try {
      const data = await getTaskById(id);
      return data.task;
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to fetch task');
    }
  }
);

export const createTaskAsync = createAsyncThunk(
  'tasks/createTask',
  async (taskData, { rejectWithValue }) => {
    try {
      const data = await createTask(taskData);
      return data.task;
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to create task');
    }
  }
);

export const updateTaskAsync = createAsyncThunk(
  'tasks/updateTask',
  async ({ id, taskData }, { rejectWithValue }) => {
    try {
      const data = await updateTask(id, taskData);
      return data.task;
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to update task');
    }
  }
);

export const deleteTaskAsync = createAsyncThunk(
  'tasks/deleteTask',
  async (id, { rejectWithValue }) => {
    try {
      await deleteTask(id);
      return id;
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to delete task');
    }
  }
);

export const fetchTaskStatsAsync = createAsyncThunk(
  'tasks/fetchTaskStats',
  async (_, { rejectWithValue }) => {
    try {
      const data = await getTaskStats();
      return data.stats;
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to fetch statistics');
    }
  }
);

const initialState = {
  tasks: [],
  currentTask: null,
  stats: {
    total: 0,
    pending: 0,
    inProgress: 0,
    completed: 0,
    overdue: 0,
    priorityBreakdown: { Low: 0, Medium: 0, High: 0 },
    completionRate: 0
  },
  pagination: {
    currentPage: 1,
    totalPages: 1,
    total: 0,
    limit: 10
  },
  filters: {
    search: '',
    status: 'all',
    priority: 'all',
    sort: 'createdAt:desc'
  },
  loading: false,
  statsLoading: false,
  error: null
};

const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    setFilter: (state, action) => {
      const { key, value } = action.payload;
      state.filters[key] = value;
      state.pagination.currentPage = 1; // reset to page 1 on filter changes
    },
    resetFilters: (state) => {
      state.filters = {
        search: '',
        status: 'all',
        priority: 'all',
        sort: 'createdAt:desc'
      };
      state.pagination.currentPage = 1;
    },
    setPage: (state, action) => {
      state.pagination.currentPage = action.payload;
    },
    // Optimistic status update for smooth Drag & Drop Kanban experience
    optimisticUpdateTaskStatus: (state, action) => {
      const { id, status } = action.payload;
      const task = state.tasks.find((t) => t._id === id);
      if (task) {
        task.status = status;
      }
      if (state.currentTask && state.currentTask._id === id) {
        state.currentTask.status = status;
      }
    },
    clearCurrentTask: (state) => {
      state.currentTask = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Tasks
      .addCase(fetchTasksAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTasksAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = action.payload.tasks || [];
        state.pagination.currentPage = action.payload.currentPage || 1;
        state.pagination.totalPages = action.payload.totalPages || 1;
        state.pagination.total = action.payload.total || 0;
        state.pagination.limit = action.payload.limit || 10;
      })
      .addCase(fetchTasksAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch Task by ID
      .addCase(fetchTaskByIdAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTaskByIdAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.currentTask = action.payload;
      })
      .addCase(fetchTaskByIdAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Create Task
      .addCase(createTaskAsync.fulfilled, (state, action) => {
        state.tasks.unshift(action.payload);
        state.pagination.total += 1;
      })

      // Update Task
      .addCase(updateTaskAsync.fulfilled, (state, action) => {
        const index = state.tasks.findIndex((t) => t._id === action.payload._id);
        if (index !== -1) {
          state.tasks[index] = action.payload;
        }
        if (state.currentTask && state.currentTask._id === action.payload._id) {
          state.currentTask = action.payload;
        }
      })

      // Delete Task
      .addCase(deleteTaskAsync.fulfilled, (state, action) => {
        state.tasks = state.tasks.filter((t) => t._id !== action.payload);
        state.pagination.total = Math.max(0, state.pagination.total - 1);
        if (state.currentTask && state.currentTask._id === action.payload) {
          state.currentTask = null;
        }
      })

      // Task Stats
      .addCase(fetchTaskStatsAsync.pending, (state) => {
        state.statsLoading = true;
      })
      .addCase(fetchTaskStatsAsync.fulfilled, (state, action) => {
        state.statsLoading = false;
        state.stats = action.payload;
      })
      .addCase(fetchTaskStatsAsync.rejected, (state) => {
        state.statsLoading = false;
      });
  }
});

export const {
  setFilter,
  resetFilters,
  setPage,
  optimisticUpdateTaskStatus,
  clearCurrentTask
} = taskSlice.actions;

export default taskSlice.reducer;
