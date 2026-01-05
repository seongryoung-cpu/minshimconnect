import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

export interface User {
  id: string;
  email: string;
  nickname: string;
  cityId: string;
  districtName: string;
  hasVotedRegional: boolean;
  politicalType?: string;
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (email: string, password: string, nickname: string) => Promise<boolean>;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 앱 시작 시 저장된 사용자 정보 로드
    const loadUser = async () => {
      try {
        const savedToken = localStorage.getItem('auth_token');
        
        if (savedToken) {
          // API에서 사용자 정보 가져오기
          try {
            const userData = await api.auth.getMe();
            setUser({
              id: userData.id,
              email: userData.email,
              nickname: userData.nickname,
              cityId: userData.cityId || '',
              districtName: userData.districtName || '',
              hasVotedRegional: userData.hasVotedRegional || false,
              politicalType: userData.politicalType,
              createdAt: userData.createdAt,
            });
          } catch (error) {
            // 토큰이 유효하지 않으면 제거
            localStorage.removeItem('auth_token');
            localStorage.removeItem('auth_user');
          }
        } else {
          // 기존 localStorage 데이터 마이그레이션
          const oldNickname = localStorage.getItem('user_nickname') || '깨어있는시민';
          const oldCityId = localStorage.getItem('user_city_id') || '';
          const oldDistrictName = localStorage.getItem('user_district_name') || '';
          const oldHasVoted = localStorage.getItem('has_voted_regional') === 'true';
          const oldPoliticalType = localStorage.getItem('political_type') || '미분석 (테스트 필요)';
          
          if (oldCityId || oldNickname !== '깨어있는시민') {
            // 기존 사용자 데이터가 있으면 임시 사용자 생성
            const tempUser: User = {
              id: 'temp_' + Date.now(),
              email: '',
              nickname: oldNickname,
              cityId: oldCityId,
              districtName: oldDistrictName,
              hasVotedRegional: oldHasVoted,
              politicalType: oldPoliticalType,
              createdAt: new Date().toISOString(),
            };
            setUser(tempUser);
          }
        }
      } catch (error) {
        console.error('Failed to load user:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      const response = await api.auth.login(email, password);
      
      localStorage.setItem('auth_token', response.token);
      
      const user: User = {
        id: response.user.id,
        email: response.user.email,
        nickname: response.user.nickname,
        cityId: response.user.cityId || '',
        districtName: response.user.districtName || '',
        hasVotedRegional: response.user.hasVotedRegional || false,
        politicalType: response.user.politicalType,
        createdAt: response.user.createdAt,
      };

      localStorage.setItem('auth_user', JSON.stringify(user));
      
      // 기존 localStorage 데이터 동기화
      if (user.cityId) {
        localStorage.setItem('user_city_id', user.cityId);
        localStorage.setItem('user_district_name', user.districtName);
      }
      if (user.hasVotedRegional) {
        localStorage.setItem('has_voted_regional', 'true');
      }
      if (user.politicalType) {
        localStorage.setItem('political_type', user.politicalType);
      }

      setUser(user);
      setIsLoading(false);
      return true;
    } catch (error: any) {
      setIsLoading(false);
      console.error('Login error:', error);
      throw error;
    }
  };

  const signup = async (email: string, password: string, nickname: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      const response = await api.auth.signup(email, password, nickname);
      
      localStorage.setItem('auth_token', response.token);
      
      const user: User = {
        id: response.user.id,
        email: response.user.email,
        nickname: response.user.nickname,
        cityId: response.user.cityId || '',
        districtName: response.user.districtName || '',
        hasVotedRegional: response.user.hasVotedRegional || false,
        politicalType: response.user.politicalType,
        createdAt: response.user.createdAt,
      };

      localStorage.setItem('auth_user', JSON.stringify(user));
      setUser(user);
      setIsLoading(false);
      return true;
    } catch (error: any) {
      setIsLoading(false);
      console.error('Signup error:', error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
    setUser(null);
  };

  const updateUser = async (updates: Partial<User>) => {
    if (!user) return;
    
    try {
      const updateData: any = {};
      if (updates.nickname !== undefined) updateData.nickname = updates.nickname;
      if (updates.cityId !== undefined) updateData.cityId = updates.cityId;
      if (updates.districtName !== undefined) updateData.districtName = updates.districtName;
      if (updates.politicalType !== undefined) updateData.politicalType = updates.politicalType;
      
      const updatedUserData = await api.auth.updateMe(updateData);
      
      const updatedUser: User = {
        id: updatedUserData.id,
        email: updatedUserData.email,
        nickname: updatedUserData.nickname,
        cityId: updatedUserData.cityId || '',
        districtName: updatedUserData.districtName || '',
        hasVotedRegional: updatedUserData.hasVotedRegional || false,
        politicalType: updatedUserData.politicalType,
        createdAt: user.createdAt,
      };
      
      setUser(updatedUser);
      localStorage.setItem('auth_user', JSON.stringify(updatedUser));
      
      // 기존 localStorage 동기화
      if (updates.cityId !== undefined) {
        localStorage.setItem('user_city_id', updates.cityId);
      }
      if (updates.districtName !== undefined) {
        localStorage.setItem('user_district_name', updates.districtName);
      }
      if (updates.hasVotedRegional !== undefined) {
        localStorage.setItem('has_voted_regional', updates.hasVotedRegional.toString());
      }
      if (updates.politicalType !== undefined) {
        localStorage.setItem('political_type', updates.politicalType);
      }
    } catch (error) {
      console.error('Failed to update user:', error);
      // Fallback to local update
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
      localStorage.setItem('auth_user', JSON.stringify(updatedUser));
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        signup,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
