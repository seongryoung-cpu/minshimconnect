import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, UserPlus, User, CheckCircle2 } from 'lucide-react';
import Button from '../components/Button';
import Card from '../components/Card';
import { useAuth } from '../contexts/AuthContext';

const Signup: React.FC = () => {
  const navigate = useNavigate();
  const { signup } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [nickname, setNickname] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const validatePassword = (pwd: string) => {
    if (pwd.length < 6) return '비밀번호는 최소 6자 이상이어야 합니다.';
    if (!/(?=.*[a-zA-Z])(?=.*[0-9])/.test(pwd)) {
      return '비밀번호는 영문과 숫자를 포함해야 합니다.';
    }
    return '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // 유효성 검사
    const passwordError = validatePassword(password);
    if (passwordError) {
      setError(passwordError);
      return;
    }

    if (password !== confirmPassword) {
      setError('비밀번호가 일치하지 않습니다.');
      return;
    }

    if (!nickname.trim()) {
      setError('닉네임을 입력해주세요.');
      return;
    }

    setIsLoading(true);

    try {
      const success = await signup(email, password, nickname.trim());
      if (success) {
        navigate('/');
      }
    } catch (err: any) {
      setError(err.message || '회원가입에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const passwordStrength = password.length > 0 ? (
    password.length < 6 ? 'weak' :
    /(?=.*[a-zA-Z])(?=.*[0-9])/.test(password) ? 'strong' : 'medium'
  ) : null;

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
          <h2 className="text-xl sm:text-2xl font-bold text-secondary mb-6 sm:mb-8 text-center">회원가입</h2>

          {error && (
            <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600 animate-fade-in">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
            {/* Nickname Input */}
            <div>
              <label htmlFor="nickname" className="block text-sm font-bold text-slate-700 mb-2">
                닉네임
              </label>
              <div className="relative">
                <div className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-slate-400">
                  <User size={18} className="sm:w-5 sm:h-5" />
                </div>
                <input
                  id="nickname"
                  type="text"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  placeholder="닉네임을 입력하세요"
                  className="w-full pl-10 sm:pl-12 pr-4 py-3 sm:py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-sm sm:text-base"
                  required
                  disabled={isLoading}
                  maxLength={20}
                />
              </div>
            </div>

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
              {passwordStrength && (
                <div className="mt-2">
                  <div className="flex gap-1">
                    <div className={`h-1 flex-1 rounded-full ${
                      passwordStrength === 'weak' ? 'bg-red-400' :
                      passwordStrength === 'medium' ? 'bg-yellow-400' :
                      'bg-green-400'
                    }`}></div>
                    <div className={`h-1 flex-1 rounded-full ${
                      passwordStrength === 'medium' || passwordStrength === 'strong' ? 
                      (passwordStrength === 'strong' ? 'bg-green-400' : 'bg-yellow-400') :
                      'bg-slate-200'
                    }`}></div>
                    <div className={`h-1 flex-1 rounded-full ${
                      passwordStrength === 'strong' ? 'bg-green-400' : 'bg-slate-200'
                    }`}></div>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    {passwordStrength === 'weak' && '약함 - 영문과 숫자를 포함해주세요'}
                    {passwordStrength === 'medium' && '보통 - 더 강력한 비밀번호를 권장합니다'}
                    {passwordStrength === 'strong' && '강함'}
                  </p>
                </div>
              )}
            </div>

            {/* Confirm Password Input */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-bold text-slate-700 mb-2">
                비밀번호 확인
              </label>
              <div className="relative">
                <div className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-slate-400">
                  <Lock size={18} className="sm:w-5 sm:h-5" />
                </div>
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="비밀번호를 다시 입력하세요"
                  className="w-full pl-10 sm:pl-12 pr-12 sm:pr-14 py-3 sm:py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-sm sm:text-base"
                  required
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors touch-target"
                  aria-label={showConfirmPassword ? '비밀번호 숨기기' : '비밀번호 보기'}
                >
                  {showConfirmPassword ? <EyeOff size={18} className="sm:w-5 sm:h-5" /> : <Eye size={18} className="sm:w-5 sm:h-5" />}
                </button>
              </div>
              {confirmPassword && password && (
                <div className="mt-2 flex items-center gap-2">
                  {password === confirmPassword ? (
                    <span className="text-xs text-green-600 flex items-center gap-1">
                      <CheckCircle2 size={12} />
                      비밀번호가 일치합니다
                    </span>
                  ) : (
                    <span className="text-xs text-red-600">비밀번호가 일치하지 않습니다</span>
                  )}
                </div>
              )}
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
                  가입 중...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <UserPlus size={18} />
                  회원가입
                </span>
              )}
            </Button>
          </form>

          {/* Login Link */}
          <div className="mt-6 sm:mt-8 text-center">
            <p className="text-sm text-slate-500">
              이미 계정이 있으신가요?{' '}
              <Link
                to="/login"
                className="font-bold text-primary hover:text-primary-dark transition-colors"
              >
                로그인
              </Link>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Signup;
