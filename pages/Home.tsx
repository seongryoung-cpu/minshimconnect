import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, Users, TrendingUp, MapPin, Activity, BarChart2, ThumbsUp, ThumbsDown, Check, MessageCircle, Flame, Lock, Award, ArrowRight, CheckCircle2 } from 'lucide-react';
import Card from '../components/Card';
import Button from '../components/Button';
import { MOCK_AGENDAS, MOCK_REGIONAL_DATA } from '../constants';

const LockedState = ({ message, onAction }: { message: string, onAction?: () => void }) => (
  <div className="relative group overflow-hidden rounded-xl sm:rounded-2xl border border-slate-100 bg-slate-50/50 p-4 sm:p-6 flex flex-col items-center justify-center text-center animate-fade-in">
    <div className="mb-3 sm:mb-4 p-2.5 sm:p-3 bg-white rounded-full shadow-sm text-slate-400 group-active:text-primary transition-colors">
      <Lock size={20} className="sm:w-6 sm:h-6" />
    </div>
    <p className="text-xs sm:text-sm font-bold text-slate-500 mb-3 sm:mb-4 whitespace-pre-line leading-relaxed px-2">
      {message}
    </p>
    {onAction && (
      <Button size="sm" onClick={onAction} className="shadow-md">
        내 지역구 투표하기
      </Button>
    )}
  </div>
);

const Home: React.FC = () => {
  const navigate = useNavigate();

  const todayStr = new Date().toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit' });
  const displayDate = new Date().toLocaleDateString('ko-KR', { month: 'long', day: 'numeric', weekday: 'short' });

  // User State from LocalStorage
  const userCityId = localStorage.getItem('user_city_id');
  const userDistrictName = localStorage.getItem('user_district_name');
  const hasVotedRegional = localStorage.getItem('has_voted_regional') === 'true';

  const [hasVotedPresident, setHasVotedPresident] = useState(false);
  const [hasVotedParty, setHasVotedParty] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [activeDistrictTab, setActiveDistrictTab] = useState<'close' | 'hot'>('close');

  useEffect(() => {
    const lastPresVote = localStorage.getItem('last_vote_president');
    const lastPartyVote = localStorage.getItem('last_vote_party');
    if (lastPresVote === todayStr) setHasVotedPresident(true);
    if (lastPartyVote === todayStr) setHasVotedParty(true);
  }, [todayStr]);

  const handlePresidentVote = (type: 'pos' | 'neg') => {
    setIsAnimating(true);
    setTimeout(() => {
      localStorage.setItem('last_vote_president', todayStr);
      setHasVotedPresident(true);
      setIsAnimating(false);
    }, 800);
  };

  const handlePartyVote = (partyName: string) => {
    setIsAnimating(true);
    setTimeout(() => {
      localStorage.setItem('last_vote_party', todayStr);
      setHasVotedParty(true);
      setIsAnimating(false);
    }, 800);
  };

  const dailyPolls = {
    president: { positive: 34.2, negative: 58.5, diff: 0.3 },
    parties: [
      { name: "A당", value: 36.5, color: "#3b82f6" }, 
      { name: "B당", value: 32.1, color: "#ef4444" }, 
      { name: "C당", value: 6.8, color: "#eab308" },  
      { name: "무당층", value: 24.6, color: "#94a3b8" } 
    ]
  };

  const closeRaceDistricts = [
     { cityId: 'chungnam', district: '공주시·부여군·청양군', cityName: '충남', tag: '1%p차 초접전', tagColor: 'bg-red-50 text-red-600 border-red-100' },
     { cityId: 'busan', district: '사상구', cityName: '부산', tag: '낙동강 벨트', tagColor: 'bg-orange-50 text-orange-600 border-orange-100' },
     { cityId: 'seoul', district: '마포구 을', cityName: '서울', tag: '1%p차 승부처', tagColor: 'bg-blue-50 text-blue-600 border-blue-100' },
  ];

  const highInterestDistricts = [
     { cityId: 'incheon', district: '계양구 을', cityName: '인천', tag: '전국 관심 1위', tagColor: 'bg-indigo-50 text-indigo-600 border-indigo-100' },
     { cityId: 'gyeonggi', district: '성남시 분당구', cityName: '경기', tag: '부동산/재건축', tagColor: 'bg-purple-50 text-purple-600 border-purple-100' },
     { cityId: 'daegu', district: '수성구 갑', cityName: '대구', tag: '보수의 심장', tagColor: 'bg-slate-100 text-slate-600 border-slate-200' },
  ];

  const targetDistricts = activeDistrictTab === 'close' ? closeRaceDistricts : highInterestDistricts;
  
  const getPartyColor = (name: string) => {
    if(name.includes('A당')) return '#3b82f6';
    if(name.includes('B당')) return '#ef4444';
    if(name.includes('C당')) return '#eab308';
    return '#94a3b8';
  };

  const renderDistrictCTA = () => {
    if (!userCityId || !userDistrictName) {
      return (
        <div className="px-4 sm:px-5 pt-6 sm:pt-8">
          <div onClick={() => navigate('/profile')} className="bg-gradient-to-r from-secondary to-slate-800 rounded-2xl sm:rounded-3xl p-4 sm:p-6 text-white shadow-xl shadow-secondary/20 relative overflow-hidden group cursor-pointer active:scale-[0.98] transition-all touch-target">
            <div className="absolute -right-6 -bottom-6 opacity-10 group-active:scale-110 transition-transform duration-500 hidden sm:block">
              <MapPin size={120} />
            </div>
            <div className="relative z-10">
              <span className="inline-flex items-center gap-1.5 bg-white/10 backdrop-blur-md px-2 sm:px-2.5 py-1 rounded-lg text-[9px] sm:text-[10px] font-bold mb-2 sm:mb-3 border border-white/10">
                <Award size={11} className="sm:w-3 sm:h-3 text-primary" /> 지역구 미설정
              </span>
              <h2 className="text-lg sm:text-xl font-extrabold mb-1">우리 동네는 지금 어떤가요?</h2>
              <p className="text-slate-300 text-[11px] sm:text-xs mb-3 sm:mb-4">내 거주 지역을 등록하고 민심 데이터를 확인하세요.</p>
              <div className="flex items-center text-xs sm:text-sm font-bold text-primary group-active:translate-x-1 transition-transform">
                지역구 등록하러 가기 <ChevronRight size={16} className="sm:w-5 sm:h-5" />
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (!hasVotedRegional) {
      return (
        <div className="px-4 sm:px-5 pt-6 sm:pt-8">
          <div onClick={() => navigate('/regional-data')} className="bg-gradient-to-r from-primary to-primary-dark rounded-2xl sm:rounded-3xl p-4 sm:p-6 text-secondary shadow-xl shadow-primary/20 relative overflow-hidden group cursor-pointer active:scale-[0.98] transition-all touch-target">
            <div className="absolute -right-6 -bottom-6 opacity-10 group-active:rotate-12 transition-transform duration-500 hidden sm:block">
              <Activity size={120} />
            </div>
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-3 sm:mb-4 flex-wrap gap-2">
                <span className="inline-flex items-center gap-1.5 bg-secondary/10 px-2 sm:px-2.5 py-1 rounded-lg text-[9px] sm:text-[10px] font-bold border border-secondary/10">
                  <Flame size={11} className="sm:w-3 sm:h-3 text-red-500 animate-pulse" /> 투표 진행 중
                </span>
                <span className="text-[9px] sm:text-[10px] font-extrabold text-secondary/60">{MOCK_REGIONAL_DATA.find(c => c.id === userCityId)?.name} {userDistrictName}</span>
              </div>
              <h2 className="text-lg sm:text-xl font-extrabold mb-1">지금 투표에 참여해주세요!</h2>
              <p className="text-secondary/70 text-[11px] sm:text-xs mb-4 sm:mb-5">투표 완료 후 모든 실시간 통계를 확인할 수 있습니다.</p>
              <button className="bg-secondary text-white px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold shadow-lg shadow-secondary/20 flex items-center gap-2 group-active:scale-105 transition-transform touch-target min-h-[44px]">
                내 지역구 투표하기 <ArrowRight size={14} className="sm:w-4 sm:h-4" />
              </button>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="px-4 sm:px-5 pt-6 sm:pt-8">
        <div onClick={() => navigate('/regional-data')} className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-slate-100 shadow-xl shadow-slate-200/40 relative overflow-hidden group cursor-pointer active:scale-[0.98] transition-all touch-target">
          <div className="absolute -right-6 -bottom-6 opacity-[0.03] group-active:scale-110 transition-transform duration-500 hidden sm:block">
            <CheckCircle2 size={120} />
          </div>
          <div className="relative z-10">
             <div className="flex items-center gap-2 mb-2 sm:mb-3 flex-wrap">
               <span className="bg-green-100 text-green-700 px-2 sm:px-2.5 py-1 rounded-lg text-[9px] sm:text-[10px] font-bold">투표 참여 완료</span>
               <span className="text-[9px] sm:text-[10px] font-bold text-slate-400">{MOCK_REGIONAL_DATA.find(c => c.id === userCityId)?.name} {userDistrictName}</span>
             </div>
             <h2 className="text-lg sm:text-xl font-extrabold text-secondary mb-1">참여해주셔서 감사합니다!</h2>
             <p className="text-slate-500 text-[11px] sm:text-xs mb-3 sm:mb-4">모든 실시간 민심 데이터의 잠금이 해제되었습니다.</p>
             <div className="flex items-center text-xs sm:text-sm font-bold text-primary group-active:translate-x-1 transition-transform">
               실시간 결과 분석 보기 <ChevronRight size={16} className="sm:w-5 sm:h-5" />
             </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="pb-8 sm:pb-12 space-y-4 sm:space-y-6 animate-fade-in">
      
      {/* Personalized District CTA */}
      {renderDistrictCTA()}

      {/* Main Hero Summary */}
      <section className="px-4 sm:px-5">
        <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-primary/20 rounded-full px-3 py-1.5 mb-3 sm:mb-4 shadow-sm">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
          </span>
          <span className="text-[10px] sm:text-[11px] font-bold text-slate-600 tracking-wide">실시간 데이터 {new Date().getHours()}시 기준</span>
        </div>
        
        <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold leading-tight text-secondary">
          오늘 대한민국은<br/>
          <span className="text-primary">어떤 생각</span>을 하고 있을까요?
        </h1>
      </section>

      {/* Daily Poll Section */}
      <section className="px-4 sm:px-5">
        <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-slate-100 shadow-xl shadow-slate-200/40 relative overflow-hidden">
          <div className="flex items-center justify-between mb-4 sm:mb-6 flex-wrap gap-2">
            <h2 className="text-sm sm:text-base font-bold text-secondary flex items-center gap-2">
              <BarChart2 className="text-primary sm:w-5 sm:h-5" size={18} />
              오늘의 민심 <span className="text-[10px] sm:text-xs font-normal text-slate-400">({displayDate})</span>
            </h2>
            <div className="text-[9px] sm:text-[10px] bg-slate-100 px-2 sm:px-2.5 py-1 rounded-full text-slate-500 font-bold">참여 15,203명</div>
          </div>

          <div className="space-y-8">
            {/* President */}
            <div>
              <p className="text-xs sm:text-sm font-bold text-slate-700 mb-3">Q. 대통령 국정 수행 평가</p>
              {!hasVotedPresident ? (
                <div className="grid grid-cols-2 gap-2 sm:gap-3 animate-fade-in">
                  <button 
                    onClick={() => handlePresidentVote('pos')} 
                    className="group flex flex-col items-center justify-center gap-2 py-4 sm:py-5 rounded-xl sm:rounded-2xl border border-slate-200 bg-slate-50 active:bg-white active:border-primary/50 active:shadow-md transition-all active:scale-[0.97] min-h-[100px] sm:min-h-[120px] touch-target"
                  >
                    <div className="p-2 bg-white rounded-full shadow-sm group-active:bg-primary/10 transition-colors">
                      <ThumbsUp size={20} className="sm:w-6 sm:h-6 text-slate-400 group-active:text-primary transition-colors" />
                    </div>
                    <span className="text-xs sm:text-sm font-bold text-slate-600 group-active:text-primary">잘하고 있다</span>
                  </button>
                  <button 
                    onClick={() => handlePresidentVote('neg')} 
                    className="group flex flex-col items-center justify-center gap-2 py-4 sm:py-5 rounded-xl sm:rounded-2xl border border-slate-200 bg-slate-50 active:bg-white active:border-red-400/50 active:shadow-md transition-all active:scale-[0.97] min-h-[100px] sm:min-h-[120px] touch-target"
                  >
                    <div className="p-2 bg-white rounded-full shadow-sm group-active:bg-red-50 transition-colors">
                      <ThumbsDown size={20} className="sm:w-6 sm:h-6 text-slate-400 group-active:text-red-500 transition-colors" />
                    </div>
                    <span className="text-xs sm:text-sm font-bold text-slate-600 group-active:text-red-500">잘못하고 있다</span>
                  </button>
                </div>
              ) : !hasVotedRegional ? (
                <LockedState message="내 지역구 투표 완료 후\n상세 지지율 데이터를 공개합니다." onAction={() => navigate('/regional-data')} />
              ) : (
                <div className="animate-fade-in-up bg-slate-50/80 rounded-xl p-4 border border-slate-100">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-full h-8 bg-slate-200 rounded-lg overflow-hidden flex relative shadow-inner">
                      <div style={{ width: `${dailyPolls.president.positive}%` }} className="h-full bg-primary flex items-center justify-start pl-3 text-xs text-white font-bold transition-all duration-1000 ease-out">
                        {dailyPolls.president.positive}%
                      </div>
                      <div style={{ width: `${dailyPolls.president.negative}%` }} className="h-full bg-red-400 flex items-center justify-end pr-3 text-xs text-white font-bold absolute right-0 transition-all duration-1000 ease-out">
                        {dailyPolls.president.negative}%
                      </div>
                    </div>
                  </div>
                  <p className="text-center text-xs text-slate-500 font-medium">
                    <Check size={12} className="inline mr-1 text-primary" />
                    참여 완료 · 전일 대비 부정 평가 <span className="text-red-500 font-bold">0.3%p 상승</span>
                  </p>
                </div>
              )}
            </div>

            {/* Party */}
            <div>
              <p className="text-xs sm:text-sm font-bold text-slate-700 mb-3">Q. 어느 정당을 지지하시나요?</p>
              {!hasVotedParty ? (
                <div className="grid grid-cols-2 gap-2 animate-fade-in">
                  {dailyPolls.parties.map((party, idx) => (
                    <button 
                      key={idx} 
                      onClick={() => handlePartyVote(party.name)} 
                      className="py-3 sm:py-3.5 px-2 sm:px-3 rounded-xl border border-slate-200 bg-white active:bg-slate-50 active:border-slate-300 transition-all active:scale-[0.97] flex items-center justify-center gap-2 min-h-[48px] touch-target"
                    >
                      <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full ring-2 ring-white shadow-sm" style={{ backgroundColor: party.color }}></span>
                      <span className="text-[10px] sm:text-xs font-bold text-slate-600">{party.name}</span>
                    </button>
                  ))}
                </div>
              ) : !hasVotedRegional ? (
                <LockedState message="내 지역구 투표 완료 후\n정당 지지율 통계를 공개합니다." onAction={() => navigate('/regional-data')} />
              ) : (
                <div className="space-y-3 animate-fade-in-up bg-slate-50/80 p-4 rounded-xl border border-slate-100">
                  <div className="w-full h-4 bg-slate-200 rounded-full overflow-hidden flex shadow-inner">
                    {dailyPolls.parties.map((party, idx) => (
                      <div key={idx} style={{ width: `${party.value}%`, backgroundColor: party.color }} className="h-full transition-all duration-1000 ease-out border-r border-white/20 last:border-0"></div>
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-x-4 gap-y-2 justify-center">
                    {dailyPolls.parties.map((party, idx) => (
                      <div key={idx} className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: party.color }}></span>
                        <span className="text-[10px] font-bold text-slate-600">{party.name} {party.value}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Agendas Section */}
      <section className="space-y-4 sm:space-y-6">
        <div>
          <div className="px-4 sm:px-5 mb-3 flex items-end justify-between">
            <div>
                <h2 className="text-base sm:text-lg font-bold text-secondary flex items-center gap-2">
                  <MessageCircle className="text-primary sm:w-5 sm:h-5" size={18} />
                  핫이슈 토론장
                </h2>
            </div>
            <button 
              onClick={() => navigate('/participate')} 
              className="text-[10px] sm:text-xs font-bold text-slate-400 active:text-primary transition-colors flex items-center touch-target min-h-[32px] px-2"
            >
              더보기 <ChevronRight size={12} className="sm:w-3.5 sm:h-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto flex gap-3 sm:gap-4 px-4 sm:px-5 pb-4 sm:pb-6 snap-x snap-mandatory scrollbar-hide -mx-4 sm:-mx-5">
            {MOCK_AGENDAS.map((agenda) => {
               const total = agenda.agreeCount + agenda.disagreeCount;
               const agreeRate = Math.round((agenda.agreeCount / total) * 100);
               return (
                <div key={agenda.id} className="snap-center shrink-0 w-[280px] sm:w-[300px]">
                  <Card onClick={() => navigate(`/participate/${agenda.id}`)} className="h-full border-0 shadow-lg shadow-slate-200/50 active:shadow-xl active:-translate-y-1 transition-all duration-300 touch-target">
                    <div className="flex justify-between items-start mb-2 sm:mb-3">
                      <span className="text-primary-dark font-bold text-[9px] sm:text-[10px] bg-primary/10 px-2 py-0.5 rounded-md">#{agenda.category}</span>
                      <span className="flex items-center text-slate-400 text-[9px] sm:text-[10px] font-medium"><Users size={11} className="sm:w-3 sm:h-3 mr-1" /> {total.toLocaleString()}</span>
                    </div>
                    <h3 className="text-sm sm:text-base font-bold text-slate-800 mb-2 sm:mb-3 leading-snug line-clamp-2 min-h-[40px] sm:min-h-[44px]">{agenda.title}</h3>
                    <div className="mt-auto">
                      <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden flex">
                         <div className="h-full bg-primary" style={{ width: `${agreeRate}%` }}></div>
                         <div className="h-full bg-red-400" style={{ width: `${100 - agreeRate}%` }}></div>
                      </div>
                      <div className="flex justify-between text-[9px] sm:text-[10px] font-bold mt-1.5">
                        <span className="text-primary">찬성 {agreeRate}%</span>
                        <span className="text-red-400">반대 {100 - agreeRate}%</span>
                      </div>
                    </div>
                  </Card>
                </div>
              );
            })}
          </div>
        </div>

        {/* Hot Districts - Gated by regional vote */}
        <div className="px-4 sm:px-5">
           <div className="flex items-center justify-between mb-3 sm:mb-4 flex-wrap gap-2">
               <h2 className="text-base sm:text-lg font-bold text-secondary flex items-center gap-2">
                 <Activity className="text-primary sm:w-5 sm:h-5" size={18} />
                 실시간 격전지
               </h2>
             <div className="flex p-0.5 bg-slate-200 rounded-lg">
               <button 
                 onClick={() => setActiveDistrictTab('close')} 
                 className={`px-2.5 sm:px-3 py-1 text-[9px] sm:text-[10px] font-bold rounded-md transition-all touch-target min-h-[32px] ${activeDistrictTab === 'close' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'}`}
               >
                 초접전
               </button>
               <button 
                 onClick={() => setActiveDistrictTab('hot')} 
                 className={`px-2.5 sm:px-3 py-1 text-[9px] sm:text-[10px] font-bold rounded-md transition-all touch-target min-h-[32px] ${activeDistrictTab === 'hot' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'}`}
               >
                 관심집중
               </button>
             </div>
           </div>
           
           <div className="space-y-2 sm:space-y-3 relative">
             {targetDistricts.map((item, idx) => {
                const regionalData = MOCK_REGIONAL_DATA.find(c => c.id === item.cityId)?.districts.find(d => d.regionName === item.district);
                if (!regionalData) return null;
                const sorted = [...regionalData.partySupportData].sort((a, b) => b.value - a.value);
                const [top1, top2] = sorted;
                const r1 = (top1.value / (top1.value + top2.value)) * 100;

                return (
                  <div 
                    key={idx} 
                    onClick={() => navigate('/regional-data', { state: { targetCityId: item.cityId, targetDistrictName: item.district } })} 
                    className="bg-white rounded-xl sm:rounded-2xl p-3 sm:p-4 shadow-sm border border-slate-100 active:scale-[0.98] transition-all cursor-pointer group active:border-primary/40 relative overflow-hidden touch-target"
                  >
                    <div className="flex justify-between items-start mb-2 sm:mb-3 relative z-10">
                       <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                          <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center text-[10px] sm:text-xs font-extrabold border bg-slate-50 text-slate-600 shrink-0`}>{item.cityName}</div>
                          <div className="min-w-0 flex-1">
                             <span className="text-xs sm:text-sm font-bold text-slate-900 block leading-tight mb-1 truncate">{item.district}</span>
                             <span className={`text-[8px] sm:text-[9px] font-bold px-1.5 py-0.5 rounded border inline-block ${item.tagColor}`}>{item.tag}</span>
                          </div>
                       </div>
                       <ChevronRight size={16} className="sm:w-5 sm:h-5 text-slate-300 group-active:text-primary transition-colors shrink-0 ml-2" />
                    </div>
                    
                    {/* Locked View if not voted */}
                    {!hasVotedRegional ? (
                      <LockedState message="내 지역구 투표 시 데이터 잠금 해제" onAction={() => navigate('/regional-data')} />
                    ) : (
                      <div className="relative z-10 animate-fade-in">
                        <div className="flex justify-between text-[10px] sm:text-xs font-bold mb-1.5">
                            <span style={{ color: getPartyColor(top1.name) }} className="truncate">{top1.name} {top1.value}%</span>
                            <span style={{ color: getPartyColor(top2.name) }} className="truncate ml-2">{top2.name} {top2.value}%</span>
                        </div>
                        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden flex">
                            <div style={{ width: `${r1}%`, backgroundColor: getPartyColor(top1.name) }} className="h-full"></div>
                            <div style={{ width: `${100 - r1}%`, backgroundColor: getPartyColor(top2.name) }} className="h-full"></div>
                        </div>
                      </div>
                    )}
                  </div>
                );
             })}
           </div>
        </div>
      </section>
    </div>
  );
};

export default Home;