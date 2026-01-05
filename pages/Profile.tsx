import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, MapPin, History, Settings, ChevronRight, Award, MessageSquare, Vote, CheckCircle2, UserCircle, LogOut, Mail } from 'lucide-react';
import Button from '../components/Button';
import Card from '../components/Card';
import { MOCK_REGIONAL_DATA } from '../constants';
import { ParticipationHistory } from '../types';
import { useAuth } from '../contexts/AuthContext';

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout, updateUser } = useAuth();
  
  const [history, setHistory] = useState<ParticipationHistory[]>(
    JSON.parse(localStorage.getItem('user_history') || '[]')
  );
  const [isEditingDistrict, setIsEditingDistrict] = useState(!user?.cityId);

  useEffect(() => {
    // 히스토리 로드
    const savedHistory = localStorage.getItem('user_history');
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
    }
  }, []);

  const saveDistrict = (cityId: string, districtName: string) => {
    if (user) {
      updateUser({
        cityId,
        districtName,
      });
    }
    setIsEditingDistrict(false);
  };

  const handleLogout = () => {
    if (window.confirm('로그아웃 하시겠습니까?')) {
      logout();
      navigate('/');
    }
  };

  const selectedCity = MOCK_REGIONAL_DATA.find(c => c.id === user?.cityId);
  
  if (!user) {
    return null;
  }

  return (
    <div className="pb-10 animate-fade-in">
      {/* Profile Header */}
      <section className="bg-secondary text-white pt-12 pb-16 px-6 relative overflow-hidden">
        <div className="absolute top-[-20%] right-[-10%] w-64 h-64 bg-primary/10 rounded-full blur-3xl"></div>
        <div className="relative z-10 flex items-center gap-5 mb-6">
          <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-3xl flex items-center justify-center border border-white/30 shadow-xl">
            <UserCircle size={48} className="text-primary-light" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-2xl font-bold">{user.nickname}</h2>
              <button className="p-1 bg-white/10 rounded-lg hover:bg-white/20"><Settings size={14} /></button>
            </div>
            {user.email && (
              <p className="text-slate-300 text-xs mb-1.5 flex items-center gap-1.5">
                <Mail size={12} /> {user.email}
              </p>
            )}
            <p className="text-slate-300 text-sm font-medium flex items-center gap-1.5">
              <Award size={14} className="text-primary" /> {user.politicalType || '미분석 (테스트 필요)'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 relative z-10">
           <div className="bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/10 text-center">
              <div className="text-[10px] text-slate-300 mb-1">참여 안건</div>
              <div className="font-bold text-lg">12</div>
           </div>
           <div className="bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/10 text-center">
              <div className="text-[10px] text-slate-300 mb-1">작성 의견</div>
              <div className="font-bold text-lg">5</div>
           </div>
           <div className="bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/10 text-center">
              <div className="text-[10px] text-slate-300 mb-1">투표 완료</div>
              <div className="font-bold text-lg">{user.hasVotedRegional ? '1' : '0'}</div>
           </div>
        </div>
      </section>

      {/* District Setting */}
      <section className="px-5 -mt-8 relative z-20">
        <Card className="shadow-xl shadow-slate-200/50 border-none">
          <div className="flex items-center justify-between mb-4">
             <h3 className="text-sm font-bold text-slate-400 flex items-center gap-2 uppercase tracking-wide">
               <MapPin size={16} className="text-primary" /> 내 지역구
             </h3>
             <button onClick={() => setIsEditingDistrict(true)} className="text-[11px] font-bold text-primary hover:underline">변경하기</button>
          </div>
          
          {isEditingDistrict ? (
            <div className="space-y-4 animate-fade-in">
              <div className="grid grid-cols-2 gap-2">
                <select 
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold outline-none focus:border-primary"
                  value={user.cityId || ''}
                  onChange={(e) => saveDistrict(e.target.value, "")}
                >
                  <option value="">시/도 선택</option>
                  {MOCK_REGIONAL_DATA.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
                <select 
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold outline-none focus:border-primary"
                  value={user.districtName || ''}
                  onChange={(e) => saveDistrict(user.cityId || '', e.target.value)}
                  disabled={!user.cityId}
                >
                  <option value="">구/군 선택</option>
                  {selectedCity?.districts.map(d => <option key={d.regionName} value={d.regionName}>{d.regionName}</option>)}
                </select>
              </div>
              <p className="text-[10px] text-slate-400 leading-relaxed">* 정확한 지역구 정보를 입력해야 해당 지역 투표가 가능합니다.</p>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xl font-extrabold text-secondary">
                  {selectedCity?.name || ''} {user.districtName || '미설정'}
                </span>
                <div className="flex items-center gap-2 mt-1">
                  {user.hasVotedRegional ? (
                    <span className="flex items-center gap-1 text-[10px] font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                      <CheckCircle2 size={10} /> 지역구 투표 완료
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
                      <Award size={10} /> 투표 대기 중
                    </span>
                  )}
                </div>
              </div>
              <div className="p-3 bg-primary/10 rounded-2xl text-primary">
                <MapPin size={24} />
              </div>
            </div>
          )}
        </Card>
      </section>

      {/* History Timeline */}
      <section className="px-5 mt-8">
        <h3 className="text-lg font-bold text-secondary mb-4 flex items-center gap-2">
          <History size={20} className="text-primary" /> 참여 히스토리
        </h3>
        
        {history.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-3xl border border-dashed border-slate-200">
             <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-3">
                <History size={24} className="text-slate-300" />
             </div>
             <p className="text-sm text-slate-400 font-medium">아직 참여한 내역이 없습니다.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {history.map((item, idx) => (
              <div key={idx} className="flex gap-4 group">
                 <div className="flex flex-col items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 z-10 shadow-sm ${
                      item.type === 'vote_region' ? 'bg-primary text-white' : 
                      item.type === 'vote_agenda' ? 'bg-secondary text-white' : 
                      'bg-slate-100 text-slate-400'
                    }`}>
                      {item.type === 'vote_region' ? <Vote size={14} /> : 
                       item.type === 'vote_agenda' ? <CheckCircle2 size={14} /> : 
                       <MessageSquare size={14} />}
                    </div>
                    {idx !== history.length - 1 && <div className="w-0.5 h-full bg-slate-100 -my-1"></div>}
                 </div>
                 <div className="pb-6 w-full">
                    <Card className="hover:border-primary/30 transition-all p-4">
                       <div className="flex justify-between items-start mb-1">
                          <span className="text-[10px] font-bold text-slate-400">{item.date}</span>
                          <ChevronRight size={14} className="text-slate-300" />
                       </div>
                       <h4 className="text-sm font-bold text-secondary mb-1">{item.title}</h4>
                       <p className="text-xs text-slate-500 leading-relaxed">{item.detail}</p>
                    </Card>
                 </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Logout etc */}
      <section className="px-5 mt-6 space-y-3">
         <button 
           onClick={handleLogout}
           className="w-full flex items-center justify-between p-4 bg-white rounded-2xl text-red-500 font-bold text-sm border border-slate-100 hover:bg-red-50 transition-colors active:scale-95 touch-target"
         >
            <div className="flex items-center gap-3"><LogOut size={18} /> 로그아웃</div>
            <ChevronRight size={18} />
         </button>
      </section>
    </div>
  );
};

export default Profile;