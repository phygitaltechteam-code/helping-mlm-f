import logo from '/logo.png';
import { useAuthContext } from '@/context/AuthContext';
import { useCustomerLogin } from '@/lib/react-query/Auth/auth';
import { signInSchema } from '@/lib/validation/signInSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from '@tanstack/react-router';
import { jwtDecode, JwtPayload } from 'jwt-decode';
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { FiEye, FiMail, FiLock, FiUser, FiArrowRight } from 'react-icons/fi';
import { LuEyeOff } from 'react-icons/lu';
import { z } from 'zod';
import logoImage from '../assets/images/header/logo.png';


type SignInFormValues = z.infer<typeof signInSchema>;

interface DecodedToken extends JwtPayload {
  role: string;
}

const SignIn: React.FC = () => {
  const { mutateAsync: signIn, isError, isPending } = useCustomerLogin();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      identifier: '',
      password: '',
    },
  });

  const { setUser, setIsAuthenticated, setToken, setCustomer } = useAuthContext();
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
    <div className="min-h-screen bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] text-white relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Floating orbs */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
        <div className="absolute top-40 right-10 w-72 h-72 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
        <div className="absolute bottom-20 left-20 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000" />
        
        {/* Grid pattern */}
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px]" />
        
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0f0c29] via-transparent to-transparent" />
      </div>

      {/* Star particles */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_1px_at_center,rgba(255,255,255,0.3)_1px,transparent_0)] bg-[length:50px_50px] animate-pulse-slow" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_1.5px_at_center,rgba(255,255,255,0.2)_1.5px,transparent_0)] bg-[length:80px_80px] animate-pulse-slower" />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8 flex items-center justify-center min-h-screen">
        <div 
          className={`w-full max-w-md transform transition-all duration-1000 ${
            mounted ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}
        >
          {/* Logo and Header */}
          <div className="text-center mb-8">
            <div className="relative inline-block mb-6">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full blur-xl opacity-50 animate-pulse" />
              <img
                src={logoImage}
                alt="Company Logo"
                className="relative mx-auto w-24 h-24 rounded-full border-4 border-white/10 shadow-2xl transform hover:scale-110 transition-transform duration-300"
              />
            </div>
            
            <h2 className="text-4xl font-bold mb-2 bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 text-transparent bg-clip-text">
              Welcome Back
            </h2>
            <p className="text-gray-300 text-lg">Sign in to continue your journey</p>
          </div>

          {/* Main Card */}
          <div className="relative group">
            {/* Animated border gradient */}
            <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-1000 group-hover:duration-200 animate-gradient-xy" />
            
            <div className="relative bg-gray-900/80 backdrop-blur-xl border border-gray-700/50 rounded-2xl shadow-2xl p-8 md:p-10">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Identifier / CRN */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                    <FiUser className="text-cyan-400" />
                    CRN Number
                  </label>
                  <div className="relative group/input">
                    <input
                      type="text"
                      placeholder="Enter your CRN number"
                      {...register('identifier')}
                      className={`w-full rounded-xl border-2 bg-gray-800/50 py-4 px-5 text-black placeholder-gray-500 outline-none transition-all duration-300 ${
                        errors.identifier
                          ? 'border-red-500/50 focus:border-red-500 focus:ring-red-500/20'
                          : 'border-gray-600/50 focus:border-cyan-400 focus:ring-cyan-400/20'
                      } focus:ring-4 pr-12`}
                    />
                    <FiMail className={`absolute right-4 top-1/2 -translate-y-1/2 text-xl transition-colors duration-300 ${
                      errors.identifier ? 'text-red-400' : 'text-gray-500 group-hover/input:text-cyan-400'
                    }`} />
                  </div>
                  {errors.identifier && (
                    <p className="text-sm text-red-400 flex items-center gap-1 animate-shake">
                      <span>•</span> {errors.identifier.message}
                    </p>
                  )}
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                    <FiLock className="text-cyan-400" />
                    Password
                  </label>
                  <div className="relative group/input">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter your password"
                      {...register('password')}
                      className={`w-full rounded-xl border-2 bg-gray-800/50 py-4 px-5 text-black placeholder-gray-500 outline-none transition-all duration-300 ${
                        errors.password
                          ? 'border-red-500/50 focus:border-red-500 focus:ring-red-500/20'
                          : 'border-gray-600/50 focus:border-cyan-400 focus:ring-cyan-400/20'
                      } focus:ring-4 pr-12`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-cyan-400 transition-colors duration-300"
                    >
                      {showPassword ? <LuEyeOff size={20} /> : <FiEye size={20} />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-sm text-red-400 flex items-center gap-1 animate-shake">
                      <span>•</span> {errors.password.message}
                    </p>
                  )}
                </div>

                {/* Forgot Password Link */}
                <div className="flex justify-end">
                  <Link
                    to="/forget-password"
                    className="text-sm text-gray-400 hover:text-cyan-400 transition-colors duration-300 flex items-center gap-1 group/link"
                  >
                    Forgot password?
                    <FiArrowRight className="opacity-0 group-hover/link:opacity-100 transform translate-x-0 group-hover/link:translate-x-1 transition-all duration-300" />
                  </Link>
                </div>

                {/* Error Message */}
                {isError && (
                  <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 animate-slideIn">
                    <p className="text-center text-red-400 font-medium">
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
                  className="relative w-full rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 py-4 px-6 text-white font-semibold overflow-hidden group/btn disabled:opacity-60 disabled:cursor-not-allowed transform hover:scale-[1.02] transition-all duration-300 shadow-xl hover:shadow-cyan-500/25"
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    {isPending || isSubmitting ? (
                      <>
                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span>Signing in...</span>
                      </>
                    ) : (
                      <>
                        <span>Sign In</span>
                        <FiArrowRight className={`transform transition-transform duration-300 ${
                          isHovered ? 'translate-x-1' : ''
                        }`} />
                      </>
                    )}
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-500 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300" />
                </button>

                {/* Sign Up Link */}
                <p className="text-center text-gray-400 mt-6">
                  Don't have an account?{' '}
                  <Link
                    to="/registrationform"
                    className="text-cyan-400 hover:text-cyan-300 font-medium transition-colors duration-300 relative group/link inline-flex items-center gap-1"
                  >
                    Sign up
                    <FiArrowRight className="opacity-0 group-hover/link:opacity-100 transform -translate-x-2 group-hover/link:translate-x-0 transition-all duration-300" />
                  </Link>
                </p>
              </form>
            </div>
          </div>

          {/* Footer */}
          <p className="text-center mt-8 text-gray-500 text-sm">
            © 2024 Your Company. All rights reserved.
          </p>
        </div>
      </div>

      <style>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slideIn {
          animation: slideIn 0.3s ease-out;
        }
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.5; }
        }
        .animate-pulse-slow {
          animation: pulse-slow 4s ease-in-out infinite;
        }
        .animate-pulse-slower {
          animation: pulse-slow 6s ease-in-out infinite;
        }
        @keyframes gradient-xy {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient-xy {
          background-size: 400% 400%;
          animation: gradient-xy 15s ease infinite;
        }
      `}</style>
    </div>
  );
};

export default SignIn;