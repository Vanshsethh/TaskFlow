import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { loginUser, registerUser, getCurrentUser } from '../services/authService';

// Initialize state from storage
const storedToken =
  localStorage.getItem('taskflow_token') ||
  sessionStorage.getItem('taskflow_token');

let storedUser = null;
try {
  const rawUser =
    localStorage.getItem('taskflow_user') ||
    sessionStorage.getItem('taskflow_user');
  if (rawUser) storedUser = JSON.parse(rawUser);
} catch (e) {
  console.error('Error parsing stored user:', e);
}

const initialState = {
  user: storedUser,
  token: storedToken,
  isAuthenticated: Boolean(storedToken),
  loading: false,
  error: null
};

export const loginUserAsync = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const data = await loginUser(credentials);
      const { token, user, rememberMe } = data;

      // Handle locked decision #2: Remember Me behavior
      if (rememberMe) {
        localStorage.setItem('taskflow_token', token);
        localStorage.setItem('taskflow_user', JSON.stringify(user));
        sessionStorage.removeItem('taskflow_token');
        sessionStorage.removeItem('taskflow_user');
      } else {
        sessionStorage.setItem('taskflow_token', token);
        sessionStorage.setItem('taskflow_user', JSON.stringify(user));
        localStorage.removeItem('taskflow_token');
        localStorage.removeItem('taskflow_user');
      }

      return { user, token };
    } catch (err) {
      return rejectWithValue(err.message || 'Login failed');
    }
  }
);

export const registerUserAsync = createAsyncThunk(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      const data = await registerUser(userData);
      const { token, user } = data;

      // Default registration saved to localStorage
      localStorage.setItem('taskflow_token', token);
      localStorage.setItem('taskflow_user', JSON.stringify(user));

      return { user, token };
    } catch (err) {
      return rejectWithValue(err.message || 'Registration failed');
    }
  }
);

export const loadUserAsync = createAsyncThunk(
  'auth/loadUser',
  async (_, { rejectWithValue }) => {
    try {
      const data = await getCurrentUser();
      return data.user;
    } catch (err) {
      return rejectWithValue(err.message || 'Session expired');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
      localStorage.removeItem('taskflow_token');
      localStorage.removeItem('taskflow_user');
      sessionStorage.removeItem('taskflow_token');
      sessionStorage.removeItem('taskflow_user');
    },
    clearAuthError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUserAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUserAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(loginUserAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Register
      .addCase(registerUserAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUserAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(registerUserAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Load User
      .addCase(loadUserAsync.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(loadUserAsync.rejected, (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
      });
  }
});

export const { logout, clearAuthError } = authSlice.actions;
export default authSlice.reducer;
