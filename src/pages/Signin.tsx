import {useAuthContext} from '@/context/AuthContext';
import {useCustomerLogin} from '@/lib/react-query/Auth/auth';
import {signInSchema} from '@/lib/validation/signInSchema';
import {zodResolver} from '@hookform/resolvers/zod';
import {Link, useNavigate} from '@tanstack/react-router';
import {jwtDecode, JwtPayload} from 'jwt-decode';
import React, {useState, useEffect} from 'react';
import {useForm} from 'react-hook-form';
import {FiEye, FiMail, FiLock, FiUser, FiArrowRight} from 'react-icons/fi';
import {LuEyeOff} from 'react-icons/lu';
import {z} from 'zod';
import logo from '../../public/logo.png';

type SignInFormValues = z.infer<typeof signInSchema>;

interface DecodedToken extends JwtPayload {
  role: string;
}

const SignIn: React.FC = () => {
  const navigate = useNavigate();
  const {mutateAsync: signIn, isError, isPending} = useCustomerLogin();
  const {
    register,
    handleSubmit,
    formState: {errors, isSubmitting},
  } = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      identifier: '',
      password: '',
    },
  });

  const {setUser, setIsAuthenticated, setToken, setCustomer} = useAuthContext();
  const [showPassword, setShowPassword] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const onSubmit = async (values: SignInFormValues) => {
    try {
      const res = await signIn({
        username: values.identifier,
        password: values.password,
      });

      setUser(jwtDecode(res.data.token.accessToken || ''));
      setCustomer(res.data?.customer);
      setToken(res.data?.token);
      setIsAuthenticated(true);

      const decoded = jwtDecode<DecodedToken>(res.data.token.accessToken || '');
      const role = decoded.role;

      if (role === 'ADMIN') {
        window.location.href = '/dashboard';
      }
      if (role === 'CUSTOMER') {
        window.location.href = '/customer/dashboard';
      }
    } catch {
      // error shown via isError
    }
  };

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center bg-white text-slate-800">
      <button
        className="group absolute left-6 top-6 mb-6 flex cursor-pointer items-center gap-1.5 p-2 text-sm font-medium text-slate-400 transition-colors duration-200 hover:text-slate-800"
        onClick={() => navigate({to: '/landing'})}
      >
        <span className="transform transition-transform group-hover:-translate-x-1">
          ←
        </span>{' '}
        Back to home
      </button>

      <div className="mx-auto w-full max-w-md px-4 py-8">
        <div
          className={`w-full transform transition-all duration-700 ${
            mounted ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
          }`}
        >
          {/* Back Button */}

          {/* Logo and Header */}
          <div className="mb-8 text-center">
            <div className="relative mb-4 inline-block">
              <img
                src={logo}
                alt="Logo"
                className="h-12 w-auto object-contain sm:h-14 md:h-16 lg:h-20 xl:h-24"
              />
            </div>

            <h2 className="mb-2 text-3xl font-bold tracking-tight text-slate-900">
              Welcome Back
            </h2>
            <p className="text-sm font-medium text-slate-400">
              Sign in to continue your journey
            </p>
          </div>

          {/* Main Card */}
          <div className="rounded-2xl border border-slate-100 bg-white p-8 shadow-sm md:p-10">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {/* Identifier / CRN */}
              <div className="space-y-1.5">
                <label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
                  <FiUser className="text-slate-400" />
                  CRN Number
                </label>
                <div className="group/input relative">
                  <input
                    type="text"
                    placeholder="Enter your CRN number"
                    {...register('identifier')}
                    className={`w-full rounded-xl border bg-slate-50 px-4 py-3.5 text-slate-900 placeholder-slate-400 outline-none transition-all duration-200 ${
                      errors.identifier
                        ? 'border-red-300 focus:border-red-500 focus:bg-white'
                        : 'border-slate-100 focus:border-slate-400 focus:bg-white'
                    } pr-12`}
                  />
                  <FiMail
                    className={`absolute right-4 top-1/2 -translate-y-1/2 text-lg transition-colors duration-200 ${
                      errors.identifier ? 'text-red-400' : 'text-slate-400'
                    }`}
                  />
                </div>
                {errors.identifier && (
                  <p className="animate-shake flex items-center gap-1 text-xs font-medium text-red-500">
                    <span>•</span> {errors.identifier.message}
                  </p>
                )}
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
                  <FiLock className="text-slate-400" />
                  Password
                </label>
                <div className="group/input relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    {...register('password')}
                    className={`w-full rounded-xl border bg-slate-50 px-4 py-3.5 text-slate-900 placeholder-slate-400 outline-none transition-all duration-200 ${
                      errors.password
                        ? 'border-red-300 focus:border-red-500 focus:bg-white'
                        : 'border-slate-100 focus:border-slate-400 focus:bg-white'
                    } pr-12`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 transition-colors duration-200 hover:text-slate-700"
                  >
                    {showPassword ? (
                      <LuEyeOff size={18} />
                    ) : (
                      <FiEye size={18} />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="animate-shake flex items-center gap-1 text-xs font-medium text-red-500">
                    <span>•</span> {errors.password.message}
                  </p>
                )}
              </div>

              {/* Error Message */}
              {isError && (
                <div className="animate-slideIn rounded-xl border border-red-100 bg-red-50/50 p-3.5">
                  <p className="text-center text-sm font-medium text-red-600">
                    Invalid CRN or password. Please try again.
                  </p>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isPending || isSubmitting}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                className="relative w-full transform overflow-hidden rounded-xl bg-slate-900 px-6 py-3.5 font-semibold text-white shadow-sm transition-all duration-200 hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <span className="flex items-center justify-center gap-2">
                  {isPending || isSubmitting ? (
                    <>
                      <svg
                        className="h-5 w-5 animate-spin text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      <span>Signing in...</span>
                    </>
                  ) : (
                    <>
                      <span>Sign In</span>
                      <FiArrowRight
                        className={`transform transition-transform duration-200 ${
                          isHovered ? 'translate-x-0.5' : ''
                        }`}
                      />
                    </>
                  )}
                </span>
              </button>

              {/* Sign Up Link */}
              <p className="mt-4 text-center text-sm font-medium text-slate-400">
                Don't have an account?{' '}
                <Link
                  to="/registrationform"
                  className="group/link relative inline-flex items-center gap-0.5 font-semibold text-slate-900 transition-colors duration-200 hover:text-slate-600"
                >
                  Sign up
                  <FiArrowRight className="-translate-x-1 transform opacity-0 transition-all duration-200 group-hover/link:translate-x-0 group-hover/link:opacity-100" />
                </Link>
              </p>
            </form>
          </div>

          {/* Footer */}
          <p className="mt-8 text-center text-xs font-medium text-slate-400">
            © 2026 Your Company. All rights reserved.
          </p>
        </div>
      </div>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-4px); }
          75% { transform: translateX(4px); }
        }
        .animate-shake {
          animation: shake 0.4s ease-in-out;
        }
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(-8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slideIn {
          animation: slideIn 0.25s ease-out;
        }
      `}</style>
    </div>
  );
};

export default SignIn;
