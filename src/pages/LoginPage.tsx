import React, { useState, FormEvent } from 'react';
import { Navigate, useLocation, Link } from 'react-router-dom';


import LoadingSpinner from '@/components/icons/LoadingSpinner';
import LoginBackground from '@/components/LoginBackground';
import PageContainer from '@/components/PageContainer';
import { APP_NAME, WarningIcon } from '@/constants';
import { useAuth } from '@/contexts/AuthContext';

const LoginPage: React.FC = () => {
  const auth = useAuth();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/dashboard';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoadingPage, setIsLoadingPage] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);
    setIsLoadingPage(true);
    try {
      await auth.login(email, password);
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setIsLoadingPage(false);
    }
  };

  if (auth.isLoadingAuth && !auth.user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-primary-600 to-primary-400 dark:from-secondary-900 dark:to-secondary-800">
        <LoadingSpinner className="w-12 h-12 text-white" />
      </div>
    );
  }

  if (auth.user) {
    return <Navigate to={from} replace />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-100 via-primary-50 to-secondary-50 dark:from-secondary-900 dark:via-secondary-800 dark:to-secondary-950 flex items-center justify-center p-4 relative overflow-hidden">
      <LoginBackground />
      <div className="w-full max-w-md relative z-10">
        <PageContainer
          title={`Welcome to ${APP_NAME}`}
          titleClassName="text-center w-full text-2xl sm:text-3xl"
        >
          <p className="text-center text-secondary-600 dark:text-secondary-400 mb-6 -mt-2">
            Sign in to access your dashboard.
          </p>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-3 bg-red-100 text-red-700 border border-red-300 rounded-md flex items-center">
                <WarningIcon className="h-5 w-5 mr-2 text-red-500" />
                <span>{error}</span>
              </div>
            )}

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-secondary-700 dark:text-secondary-300"
              >
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-secondary-300 dark:border-secondary-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm bg-white dark:bg-secondary-700 text-secondary-900 dark:text-secondary-100"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-secondary-700 dark:text-secondary-300"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-secondary-300 dark:border-secondary-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm bg-white dark:bg-secondary-700 text-secondary-900 dark:text-secondary-100"
              />
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoadingPage}
                className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-70 transition duration-150 ease-in-out"
              >
                {isLoadingPage ? (
                  <LoadingSpinner className="w-5 h-5" />
                ) : (
                  'Sign in'
                )}
              </button>
            </div>
          </form>

          {/* Forgot Password Link */}
          <div className="mt-4 text-center">
            <Link
              to="/forgot-password"
              className="text-sm text-primary-600 hover:underline"
            >
              Forgot Password?
            </Link>
          </div>
        </PageContainer>
      </div>
    </div>
  );
};

export default LoginPage;
