import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { CheckSquare, Lock, Mail, User, ArrowRight, AlertCircle } from 'lucide-react';
import { registerUserAsync, clearAuthError } from '../store/authSlice';
import { useForm } from '../hooks/useForm';
import { useToast } from '../context/ToastContext';

const RegisterPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const toast = useToast();
  const { isAuthenticated, loading, error } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    dispatch(clearAuthError());
  }, [dispatch]);

  const validate = (values) => {
    const errs = {};
    if (!values.name || values.name.trim().length < 2) {
      errs.name = 'Name must be at least 2 characters';
    }
    if (!values.email) {
      errs.email = 'Email address is required';
    } else if (!/^\S+@\S+\.\S+$/.test(values.email)) {
      errs.email = 'Please enter a valid email address';
    }
    if (!values.password) {
      errs.password = 'Password is required';
    } else if (values.password.length < 6) {
      errs.password = 'Password must be at least 6 characters';
    }
    if (values.confirmPassword !== values.password) {
      errs.confirmPassword = 'Passwords do not match';
    }
    return errs;
  };

  const {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit
  } = useForm(
    {
      name: '',
      email: '',
      password: '',
      confirmPassword: ''
    },
    validate
  );

  const onSubmit = async (formData) => {
    const { name, email, password } = formData;
    const result = await dispatch(registerUserAsync({ name, email, password }));
    if (registerUserAsync.fulfilled.match(result)) {
      toast.success('Account created successfully! Welcome to TaskFlow.');
      navigate('/dashboard', { replace: true });
    } else {
      toast.error(result.payload || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-slate-50 via-teal-50/20 to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="w-full max-w-md">
        {/* Logo and Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-brand-600 to-teal-400 text-white shadow-xl shadow-brand-500/25 mb-4">
            <CheckSquare className="w-7 h-7" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Create an Account
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
            Get started with modern task management for your team.
          </p>
        </div>

        {/* Card */}
        <div className="bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl backdrop-blur-xl">
          {error && (
            <div className="mb-5 p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-600 dark:text-rose-400 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Full Name */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  name="name"
                  value={values.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="e.g. Vansh Seth"
                  className={`w-full pl-10 pr-4 py-2.5 rounded-xl text-sm bg-white dark:bg-slate-800/90 border text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 transition ${
                    touched.name && errors.name
                      ? 'border-rose-400 dark:border-rose-500'
                      : 'border-slate-300 dark:border-slate-700'
                  }`}
                />
              </div>
              {touched.name && errors.name && (
                <p className="mt-1 text-xs text-rose-500">{errors.name}</p>
              )}
            </div>

            {/* Email Address */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  name="email"
                  value={values.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="name@example.com"
                  className={`w-full pl-10 pr-4 py-2.5 rounded-xl text-sm bg-white dark:bg-slate-800/90 border text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 transition ${
                    touched.email && errors.email
                      ? 'border-rose-400 dark:border-rose-500'
                      : 'border-slate-300 dark:border-slate-700'
                  }`}
                />
              </div>
              {touched.email && errors.email && (
                <p className="mt-1 text-xs text-rose-500">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                Password (min 6 characters)
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  name="password"
                  value={values.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="••••••••"
                  className={`w-full pl-10 pr-4 py-2.5 rounded-xl text-sm bg-white dark:bg-slate-800/90 border text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 transition ${
                    touched.password && errors.password
                      ? 'border-rose-400 dark:border-rose-500'
                      : 'border-slate-300 dark:border-slate-700'
                  }`}
                />
              </div>
              {touched.password && errors.password && (
                <p className="mt-1 text-xs text-rose-500">{errors.password}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  name="confirmPassword"
                  value={values.confirmPassword}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="••••••••"
                  className={`w-full pl-10 pr-4 py-2.5 rounded-xl text-sm bg-white dark:bg-slate-800/90 border text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 transition ${
                    touched.confirmPassword && errors.confirmPassword
                      ? 'border-rose-400 dark:border-rose-500'
                      : 'border-slate-300 dark:border-slate-700'
                  }`}
                />
              </div>
              {touched.confirmPassword && errors.confirmPassword && (
                <p className="mt-1 text-xs text-rose-500">
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 px-4 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-sm shadow-md hover:shadow-lg transition-all duration-150 flex items-center justify-center gap-2 disabled:opacity-50 active:scale-[0.99]"
            >
              {loading ? (
                'Creating Account...'
              ) : (
                <>
                  <span>Create Account</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Login Link */}
          <p className="text-center text-xs text-slate-500 dark:text-slate-400 mt-5">
            Already have an account?{' '}
            <Link
              to="/login"
              className="font-semibold text-brand-600 dark:text-brand-400 hover:underline"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
