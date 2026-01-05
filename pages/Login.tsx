import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, LogIn, UserPlus } from 'lucide-react';
import Button from '../components/Button';
import Card from '../components/Card';
import { useAuth } from '../contexts/AuthContext';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const success = await login(email, password);
      if (success) {
        navigate('/');
      }
    } catch (err: any) {
      setError(err.message || '로그인에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 py-8 sm:py-12 bg-gradient-to-br from-slate-50 via-white to-primary-light/10">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8 sm:mb-10">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-secondary text-white rounded-2xl sm:rounded-3xl flex items-center justify-center font-extrabold text-2xl sm:text-3xl shadow-lg shadow-secondary/20 mx-auto mb-4">
            M
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-secondary mb-2">민심잇다</h1>
          <p className="text-sm sm:text-base text-slate-500">당신의 의견이 정책이 됩니다</p>
        </div>

        <Card className="p-6 sm:p-8 shadow-xl">
          <h2 className="text-xl sm:text-2xl font-bold text-secondary mb-6 sm:mb-8 text-center">로그인</h2>

          {error && (
            <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600 animate-fade-in">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
            {/* Email Input */}
            <div>
              <label htmlFor="email" className="block text-sm font-bold text-slate-700 mb-2">
                이메일
              </label>
              <div className="relative">
                <div className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-slate-400">
                  <Mail size={18} className="sm:w-5 sm:h-5" />
                </div>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="이메일을 입력하세요"
                  className="w-full pl-10 sm:pl-12 pr-4 py-3 sm:py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-sm sm:text-base"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label htmlFor="password" className="block text-sm font-bold text-slate-700 mb-2">
                비밀번호
              </label>
              <div className="relative">
                <div className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-slate-400">
                  <Lock size={18} className="sm:w-5 sm:h-5" />
                </div>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="비밀번호를 입력하세요"
                  className="w-full pl-10 sm:pl-12 pr-12 sm:pr-14 py-3 sm:py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-sm sm:text-base"
                  required
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors touch-target"
                  aria-label={showPassword ? '비밀번호 숨기기' : '비밀번호 보기'}
                >
                  {showPassword ? <EyeOff size={18} className="sm:w-5 sm:h-5" /> : <Eye size={18} className="sm:w-5 sm:h-5" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full mt-6 sm:mt-8"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  로그인 중...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <LogIn size={18} />
                  로그인
                </span>
              )}
            </Button>
          </form>

          {/* Signup Link */}
          <div className="mt-6 sm:mt-8 text-center">
            <p className="text-sm text-slate-500 mb-3">
              아직 계정이 없으신가요?
            </p>
            <Link
              to="/signup"
              className="inline-flex items-center gap-2 text-sm font-bold text-primary hover:text-primary-dark transition-colors"
            >
              <UserPlus size={16} />
              회원가입
            </Link>
          </div>

          {/* Demo Account Info */}
          <div className="mt-6 sm:mt-8 pt-6 sm:pt-8 border-t border-slate-100">
            <p className="text-xs text-slate-400 text-center mb-2">데모 계정</p>
            <div className="text-xs text-slate-500 space-y-1 bg-slate-50 p-3 rounded-lg">
              <p>이메일: demo@minshim.com</p>
              <p>비밀번호: demo123</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Login;
