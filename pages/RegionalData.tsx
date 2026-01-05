import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { MapPin, Info, Activity, TrendingUp, ArrowLeft, Map as MapIcon, Vote, User, Grid, X, Briefcase, FileText, Quote, Home, BookOpen, AlertTriangle, Lock, Sparkles, CheckCircle2, ChevronDown } from 'lucide-react';
import Button from '../components/Button';
import { MOCK_REGIONAL_DATA } from '../constants';
import { CityData, RegionStats, Candidate, ParticipationHistory } from '../types';

const LockedState = ({ message, onAction }: { message: string, onAction?: () => void }) => (
  <div className="relative group overflow-hidden rounded-3xl border border-dashed border-slate-300 bg-slate-50/50 p-10 flex flex-col items-center justify-center text-center animate-fade-in my-4">
    <div className="mb-4 p-4 bg-white rounded-full shadow-md text-slate-400 group-hover:text-primary transition-colors">
      <Lock size={32} />
    </div>
    <p className="text-base font-bold text-slate-500 mb-6 whitespace-pre-line leading-relaxed">
      {message}
    </p>
    {onAction && (
      <Button size="lg" onClick={onAction} className="shadow-xl">
        투표하러 가기
      </Button>
    )}
  </div>
);

const getRegionImage = (province: string, district: string) => {
  if (province.includes('서울')) return "https://images.unsplash.com/photo-1625700762332-959c55b68bf1?auto=format&fit=crop&q=80&w=800";
  if (province.includes('부산')) return "https://images.unsplash.com/photo-1598967919867-b52b349d564e?auto=format&fit=crop&q=80&w=800";
  if (province.includes('제주')) return "https://images.unsplash.com/photo-1533261689257-226e4730628e?auto=format&fit=crop&q=80&w=800";
  if (province.includes('강원')) return "https://images.unsplash.com/photo-1629110777583-93d39366df21?auto=format&fit=crop&q=80&w=800";
  return "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&q=80&w=800";
};

const ElectionStamp = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 100 100" className={`drop-shadow-md ${className}`} style={{ filter: "drop-shadow(2px 2px 2px rgba(180, 0, 0, 0.3))" }}>
    <path d="M50 5 A45 45 0 1 1 50 95 A45 45 0 1 1 50 5" stroke="#cc0000" strokeWidth="6" fill="none" strokeLinecap="round" />
    <line x1="50" y1="18" x2="50" y2="75" stroke="#cc0000" strokeWidth="9" strokeLinecap="round" />
    <line x1="50" y1="48" x2="80" y2="30" stroke="#cc0000" strokeWidth="9" strokeLinecap="round" />
    <circle cx="25" cy="40" r="1.5" fill="#cc0000" opacity="0.5" />
    <circle cx="75" cy="70" r="2" fill="#cc0000" opacity="0.4" />
  </svg>
);

const CollapsibleSection = ({ title, icon, children, defaultOpen = false }: { title: string, icon: React.ReactNode, children?: React.ReactNode, defaultOpen?: boolean }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden transition-all duration-300">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 bg-white hover:bg-slate-50 transition-colors text-left"
      >
        <div className="flex items-center gap-3 font-bold text-slate-800 text-base">
          <div className="p-2 bg-slate-100 rounded-lg text-slate-500">
             {icon}
          </div>
          {title}
        </div>
        <div className={`p-1 rounded-full bg-slate-50 text-slate-400 transition-transform duration-300 ${isOpen ? 'rotate-180 bg-slate-100 text-slate-600' : ''}`}>
           <ChevronDown size={20} />
        </div>
      </button>
      {isOpen && (
        <div className="px-5 pb-6 pt-0 animate-fade-in">
           <div className="h-px w-full bg-slate-100 mb-4"></div>
           {children}
        </div>
      )}
    </div>
  );
};

const RegionalData: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [viewState, setViewState] = useState<'province_selection' | 'district_selection' | 'info_review' | 'voting_booth' | 'dashboard'>('province_selection');
  const [data, setData] = useState<CityData[]>(JSON.parse(JSON.stringify(MOCK_REGIONAL_DATA)));
  const [selectedCityId, setSelectedCityId] = useState<string>("");
  const [selectedDistrictIdx, setSelectedDistrictIdx] = useState<number>(0);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const [viewingCandidate, setViewingCandidate] = useState<Candidate | null>(null);
  const [stampedCandidateId, setStampedCandidateId] = useState<number | 'ETC' | null>(null);

  // User Auth State
  const userCityId = localStorage.getItem('user_city_id');
  const userDistrictName = localStorage.getItem('user_district_name');
  const hasVotedRegional = localStorage.getItem('has_voted_regional') === 'true';

  useEffect(() => {
    if (location.state && location.state.targetCityId && location.state.targetDistrictName) {
      const { targetCityId, targetDistrictName } = location.state;
      const cIdx = data.findIndex(c => c.id === targetCityId);
      if (cIdx !== -1) {
        const dIdx = data[cIdx].districts.findIndex(d => d.regionName === targetDistrictName);
        if (dIdx !== -1) {
          setSelectedCityId(targetCityId);
          setSelectedDistrictIdx(dIdx);
          setViewState('dashboard');
        }
      }
    } else if (userCityId && userDistrictName && viewState === 'province_selection') {
      const cIdx = data.findIndex(c => c.id === userCityId);
      const dIdx = data[cIdx]?.districts.findIndex(d => d.regionName === userDistrictName);
      if (cIdx > -1 && dIdx > -1) {
        setSelectedCityId(userCityId);
        setSelectedDistrictIdx(dIdx);
        setViewState('dashboard');
      }
    }
  }, [location.state, data]);

  const cityIndex = data.findIndex(c => c.id === selectedCityId);
  const currentCity = data[cityIndex > -1 ? cityIndex : 0];
  const currentRegion = currentCity.districts[selectedDistrictIdx] || currentCity.districts[0];

  const isUserDistrict = selectedCityId === userCityId && currentRegion.regionName === userDistrictName;

  const handleProvinceSelect = (cityId: string) => {
    setSelectedCityId(cityId);
    setViewState('district_selection');
  };

  const handleDistrictSelect = (districtIdx: number) => {
    setSelectedDistrictIdx(districtIdx);
    setViewState('info_review');
  };

  const handleEnterVotingBooth = () => {
    if (!userCityId || !userDistrictName) {
      alert("먼저 마이페이지에서 거주 지역구를 등록해주세요.");
      navigate('/profile');
      return;
    }
    if (!isUserDistrict) {
      alert("투표는 본인의 거주 지역구에서만 가능합니다.");
      return;
    }
    if (hasVotedRegional) {
      alert("이미 투표를 완료하셨습니다.");
      return;
    }
    setViewState('voting_booth');
    setStampedCandidateId(null);
  };

  const handleStampBallot = (id: number | 'ETC') => {
    setStampedCandidateId(id);
  };

  const handleVoteSubmit = () => {
    if (!stampedCandidateId) return;
    setIsProcessing(true);
    
    const candidate = stampedCandidateId === 'ETC' ? { name: '기타' } : currentRegion.candidates.find(c => c.number === stampedCandidateId)!;

    setTimeout(() => {
      const newData = [...data];
      const targetDistrict = newData[cityIndex].districts[selectedDistrictIdx];
      targetDistrict.partySupportData = targetDistrict.partySupportData.map(p => {
        if (p.name.includes(candidate.name)) {
          return { ...p, value: Math.min(p.value + 2.5, 100) };
        } else {
          return { ...p, value: Math.max(p.value - 0.8, 0) };
        }
      });
      const total = targetDistrict.partySupportData.reduce((acc, curr) => acc + curr.value, 0);
      targetDistrict.partySupportData = targetDistrict.partySupportData.map(p => ({
        ...p,
        value: parseFloat(((p.value / total) * 100).toFixed(1))
      }));
      targetDistrict.turnout = parseFloat((targetDistrict.turnout + 0.1).toFixed(2));
      
      setData(newData);
      
      // Update User State
      localStorage.setItem('has_voted_regional', 'true');
      const history: ParticipationHistory[] = JSON.parse(localStorage.getItem('user_history') || '[]');
      history.unshift({
        id: Date.now().toString(),
        type: 'vote_region',
        title: `${currentCity.name} ${currentRegion.regionName} 투표 완료`,
        detail: `기호 ${stampedCandidateId}번 ${candidate.name} 후보에게 투표하셨습니다.`,
        date: new Date().toLocaleDateString()
      });
      localStorage.setItem('user_history', JSON.stringify(history));

      setIsProcessing(false);
      setViewState('dashboard');
    }, 1500);
  };

  const handleBackToProvince = () => setViewState('province_selection');
  const handleBackToDistrict = () => setViewState('district_selection');

  // PROVINCE SELECT
  if (viewState === 'province_selection') {
    return (
      <div className="w-full px-4 sm:px-6 py-10 animate-fade-in">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-extrabold text-secondary mb-3">
            우리 동네 민심, <span className="text-primary">실시간 확인</span>
          </h1>
          <p className="text-slate-500 max-w-sm mx-auto text-sm leading-relaxed">
            전국 254개 선거구의 투표율과 후보 지지율을 실시간으로 분석합니다.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {data.map(city => (
            <button key={city.id} onClick={() => handleProvinceSelect(city.id)} className={`p-5 rounded-2xl border-2 shadow-sm transition-all text-left group ${city.id === userCityId ? 'bg-primary/5 border-primary/20' : 'bg-white border-white hover:border-primary/50'}`}>
              <div className="flex items-center justify-between mb-1">
                <h3 className="text-base font-bold text-slate-800">{city.name}</h3>
                {city.id === userCityId && <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>}
              </div>
              <div className="flex items-center text-[10px] text-slate-400 font-medium">
                 <Grid size={12} className="mr-1" />
                 {city.districts.length}개 선거구
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // DISTRICT SELECT
  if (viewState === 'district_selection') {
    return (
      <div className="w-full px-4 sm:px-6 py-8 animate-fade-in">
        <button onClick={handleBackToProvince} className="flex items-center text-slate-500 hover:text-primary text-sm font-bold mb-6 transition-colors">
          <ArrowLeft size={18} className="mr-1" /> 전체 지역
        </button>

        <h2 className="text-2xl font-bold text-secondary mb-6">
          <span className="text-primary">{currentCity.name}</span>의<br/>어느 곳에 사시나요?
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {currentCity.districts.map((district, idx) => (
            <div key={idx} onClick={() => handleDistrictSelect(idx)} className="group cursor-pointer">
              <div className="relative h-56 rounded-3xl overflow-hidden shadow-lg group-hover:shadow-xl transition-all duration-300 transform group-hover:-translate-y-1">
                <img src={getRegionImage(currentCity.name, district.regionName)} alt={district.regionName} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent"></div>
                <div className="absolute top-4 right-4 z-10">
                   {userCityId === selectedCityId && district.regionName === userDistrictName && (
                     <span className="bg-primary text-secondary px-3 py-1 rounded-full text-[10px] font-bold shadow-lg">내 지역구</span>
                   )}
                </div>
                <div className="absolute bottom-0 left-0 p-5 w-full flex justify-between items-end">
                  <h3 className="text-xl font-bold text-white flex items-center gap-1.5"><MapPin size={18} />{district.regionName}</h3>
                  <div className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-white text-[10px] font-bold border border-white/20">데이터 보기</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // INFO REVIEW
  if (viewState === 'info_review') {
    return (
      <div className="relative min-h-[calc(100vh-64px)] pb-32 bg-slate-50 animate-fade-in">
        <div className="bg-secondary text-white pt-8 pb-20 px-4 rounded-b-[2.5rem] relative overflow-hidden shadow-xl">
           <div className="max-w-2xl mx-auto relative z-10 text-center">
             <div className="flex justify-center mb-4">
               <div className="bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-bold text-primary-light border border-white/20 flex items-center gap-2">
                  <BookOpen size={14} /> 후보자 정보 확인
               </div>
             </div>
             <h2 className="text-2xl font-bold mb-2">{currentCity.name} {currentRegion.regionName}</h2>
             <p className="text-slate-300 text-sm">{isUserDistrict ? '당신의 지역구 후보입니다.' : '다른 지역구의 정보를 조회 중입니다.'}</p>
           </div>
        </div>

        <div className="w-full max-w-2xl mx-auto px-4 -mt-10 relative z-20 space-y-4">
           {currentRegion.candidates.map((candidate) => (
              <div key={candidate.number} onClick={() => setViewingCandidate(candidate)} className="bg-white rounded-2xl p-4 shadow-lg border border-slate-100 hover:border-primary/50 transition-all cursor-pointer group flex items-center">
                <div className="relative mr-4">
                   <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-slate-100 group-hover:border-primary transition-colors">
                      {candidate.imageUrl ? <img src={candidate.imageUrl} className="w-full h-full object-cover" /> : <div className="w-full h-full bg-slate-100 flex items-center justify-center"><User /></div>}
                   </div>
                   <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full text-white text-xs font-bold flex items-center justify-center border-2 border-white shadow-sm" style={{ backgroundColor: candidate.color }}>{candidate.number}</div>
                </div>
                <div className="flex-grow">
                   <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">{candidate.party}</span>
                      <span className="text-[10px] text-slate-400">{candidate.job}</span>
                   </div>
                   <h3 className="text-base font-bold text-slate-900 group-hover:text-primary transition-colors">{candidate.name}</h3>
                </div>
                <div className="text-slate-300 group-hover:text-primary transition-colors p-2"><Info size={20} /></div>
              </div>
           ))}
        </div>

        {/* Floating Action Button */}
        <div className="fixed bottom-20 left-0 right-0 p-4 z-50 w-full max-w-[600px] mx-auto pointer-events-none">
           <div className="flex gap-3 pointer-events-auto">
              <Button variant="secondary" onClick={handleBackToDistrict} className="flex-shrink-0 bg-white shadow-lg"><ArrowLeft size={20} /></Button>
              <Button 
                fullWidth 
                size="lg" 
                disabled={!isUserDistrict || hasVotedRegional}
                onClick={handleEnterVotingBooth} 
                className={`!text-white border-none flex items-center justify-center shadow-xl font-bold ${!isUserDistrict || hasVotedRegional ? '!bg-slate-400' : '!bg-slate-900 shadow-slate-900/30'}`}
              >
                {!isUserDistrict ? '거주지 투표만 가능' : hasVotedRegional ? '투표 완료' : <><Vote className="mr-2" size={20} /> 투표소 입장하기</>}
              </Button>
           </div>
        </div>

        {/* Candidate Detail Modal */}
        {viewingCandidate && (
          <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center bg-slate-900/60 backdrop-blur-sm animate-fade-in p-0 md:p-4">
             <div className="bg-white w-full max-w-lg md:rounded-3xl rounded-t-[2rem] shadow-2xl relative animate-slide-up flex flex-col max-h-[90vh] md:max-h-[85vh] overflow-hidden">
                <div className="relative p-6 pt-8 pb-6 text-white flex-shrink-0" style={{ backgroundColor: viewingCandidate.color }}>
                   <button onClick={() => setViewingCandidate(null)} className="absolute top-4 right-4 p-2 bg-black/10 hover:bg-black/20 rounded-full transition-colors z-20"><X size={20} /></button>
                   <div className="relative z-10 flex items-end gap-5">
                      <div className="w-24 h-24 rounded-2xl bg-white shadow-xl overflow-hidden flex-shrink-0 border-4 border-white">
                         <img src={viewingCandidate.imageUrl} className="w-full h-full object-cover" />
                      </div>
                      <div className="mb-0.5">
                         <h2 className="text-3xl font-extrabold mb-1">{viewingCandidate.name}</h2>
                         <p className="text-white/80 font-medium text-sm">{viewingCandidate.party} · {viewingCandidate.job}</p>
                      </div>
                   </div>
                </div>
                <div className="flex-1 overflow-y-auto bg-slate-50/50 p-5 space-y-5">
                   <div className="bg-white p-6 rounded-2xl border border-slate-100 text-center shadow-sm">
                      <Quote size={20} className="text-slate-300 mx-auto mb-3" />
                      <p className="text-xl font-bold text-slate-800 italic leading-relaxed break-keep">"{viewingCandidate.slogan}"</p>
                   </div>
                   <CollapsibleSection title="핵심 공약" icon={<FileText size={16} />} defaultOpen={true}>
                      <ul className="space-y-3">
                         {viewingCandidate.promises?.map((promise, idx) => (
                            <li key={idx} className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                               <span className="w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold text-white flex-shrink-0 mt-0.5 shadow-sm" style={{ backgroundColor: viewingCandidate.color }}>{idx + 1}</span>
                               <span className="text-slate-700 font-bold text-sm leading-snug pt-0.5">{promise}</span>
                            </li>
                         ))}
                      </ul>
                   </CollapsibleSection>
                </div>
                <div className="p-4 border-t border-slate-100 bg-white flex-shrink-0 pb-safe md:pb-4 rounded-b-none md:rounded-b-3xl z-10">
                   <Button fullWidth size="lg" onClick={() => setViewingCandidate(null)}>확인했습니다</Button>
                </div>
             </div>
          </div>
        )}
      </div>
    );
  }

  // VOTING BOOTH
  if (viewState === 'voting_booth') {
    return (
      <div className="fixed inset-0 z-[200] bg-slate-900/95 backdrop-blur-md flex flex-col items-center justify-center p-4 animate-fade-in">
        <div className="w-full max-w-md animate-scale-in">
          <div className="text-center mb-6">
             <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-red-600 text-white mb-3 shadow-lg shadow-red-600/30">
                <Vote size={24} />
             </div>
             <h2 className="text-2xl font-bold text-white">기표소</h2>
             <p className="text-slate-400 text-sm mt-1">지지하는 후보의 기표란을 터치하세요.</p>
          </div>

          <div className="bg-white rounded-sm shadow-2xl overflow-hidden relative border-[1px] border-slate-300 transform rotate-1 max-h-[60vh] overflow-y-auto">
             <div className="border-b-2 border-slate-800 p-4 text-center bg-slate-50 sticky top-0 z-10">
                <h3 className="text-xl font-extrabold text-slate-900 border-2 border-slate-900 inline-block px-6 py-1 rounded-sm">투 표 용 지</h3>
                <p className="text-[10px] text-slate-500 mt-2 font-bold tracking-widest">{currentCity.name} {currentRegion.regionName} 선거구</p>
             </div>
             <div className="divide-y-2 divide-slate-800 border-b-2 border-slate-800">
                {currentRegion.candidates.map((candidate) => (
                   <div key={candidate.number} onClick={() => handleStampBallot(candidate.number)} className="flex h-20 cursor-pointer hover:bg-slate-50 transition-colors relative select-none">
                      <div className="w-14 flex items-center justify-center border-r-2 border-slate-800 font-extrabold text-2xl text-slate-900 bg-slate-100">{candidate.number}</div>
                      <div className="w-20 flex items-center justify-center border-r-2 border-slate-800 text-xs font-bold text-slate-700 text-center px-1 leading-tight">{candidate.party}</div>
                      <div className="flex-grow flex items-center pl-4 border-r-2 border-slate-800"><span className="text-lg font-bold text-slate-900 tracking-wide">{candidate.name}</span></div>
                      <div className="w-16 flex items-center justify-center relative bg-white overflow-visible">
                         <div className="w-10 h-10 rounded-full border-2 border-red-100 opacity-30"></div>
                         {stampedCandidateId === candidate.number && (
                            <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
                               <div className="animate-stamp-in origin-center"><ElectionStamp className="w-14 h-14" /></div>
                            </div>
                         )}
                      </div>
                   </div>
                ))}
                <div onClick={() => handleStampBallot('ETC')} className="flex h-20 cursor-pointer hover:bg-slate-50 transition-colors relative select-none">
                   <div className="w-14 flex items-center justify-center border-r-2 border-slate-800 font-bold text-lg text-slate-400 bg-slate-100">-</div>
                   <div className="w-20 flex items-center justify-center border-r-2 border-slate-800 text-xs font-bold text-slate-400 text-center">기타</div>
                   <div className="flex-grow flex items-center pl-4 border-r-2 border-slate-800"><span className="text-base font-bold text-slate-400 tracking-wide">지지 후보 없음</span></div>
                   <div className="w-16 flex items-center justify-center relative bg-white overflow-visible">
                      <div className="w-10 h-10 rounded-full border-2 border-red-100 opacity-30"></div>
                      {stampedCandidateId === 'ETC' && (
                         <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
                             <div className="animate-stamp-in origin-center"><ElectionStamp className="w-14 h-14" /></div>
                         </div>
                      )}
                   </div>
                </div>
             </div>
             <div className="p-3 bg-slate-50 text-center"><p className="text-[10px] text-slate-400 font-serif">민심잇다 선거관리위원회</p></div>
          </div>

          <div className="mt-8 flex gap-4">
             <button onClick={() => setViewState('info_review')} className="flex-1 py-3.5 rounded-xl font-bold text-slate-400 hover:text-white hover:bg-slate-800 transition-colors">나가기</button>
             <button onClick={handleVoteSubmit} disabled={!stampedCandidateId} className={`flex-[2] py-3.5 rounded-xl font-bold text-white shadow-xl transition-all ${stampedCandidateId ? 'bg-red-600 hover:bg-red-500 scale-105' : 'bg-slate-700 opacity-50 cursor-not-allowed'}`}>
               {isProcessing ? '투표함에 넣는 중...' : '투표함에 넣기'}
             </button>
          </div>
        </div>
      </div>
    );
  }

  // DASHBOARD
  if (viewState === 'dashboard') {
    return (
      <div className="w-full px-4 sm:px-6 py-8 animate-fade-in-up">
        <div className="flex items-center justify-between mb-6">
           <button onClick={handleBackToProvince} className="flex items-center text-slate-500 hover:text-primary font-bold text-sm bg-white border border-slate-200 px-3 py-1.5 rounded-lg shadow-sm">
              <MapIcon size={16} className="mr-1.5" /> 다른 지역 보기
           </button>
           {isUserDistrict && (
              <span className="text-[10px] text-primary bg-primary/10 px-2 py-1 rounded-md font-bold">내 지역구</span>
           )}
        </div>

        <div className="bg-white rounded-[2rem] p-6 shadow-xl border border-slate-100 mb-6 relative overflow-hidden">
           <div className="relative z-10 text-center mb-8">
              <span className="bg-primary/10 text-primary-dark font-bold px-3 py-1 rounded-full text-[10px] mb-3 inline-block">
                 {currentCity.name}
              </span>
              <h1 className="text-2xl font-extrabold text-secondary flex items-center justify-center gap-2">
                 {currentRegion.regionName} <span className="text-xl font-light text-slate-300">|</span> 개표 현황
              </h1>
           </div>

           {!hasVotedRegional ? (
             <LockedState 
               message="내 지역구 투표를 완료해야\n모든 선거구의 개표 통계 확인이 가능합니다." 
               onAction={() => {
                 const userCity = localStorage.getItem('user_city_id');
                 const userDistrict = localStorage.getItem('user_district_name');
                 if (userCity && userDistrict) {
                    const cIdx = data.findIndex(c => c.id === userCity);
                    const dIdx = data[cIdx]?.districts.findIndex(d => d.regionName === userDistrict);
                    if (cIdx > -1 && dIdx > -1) {
                        setSelectedCityId(userCity);
                        setSelectedDistrictIdx(dIdx);
                        setViewState('info_review');
                    } else {
                        navigate('/profile');
                    }
                 } else {
                    navigate('/profile');
                 }
               }} 
             />
           ) : (
             <div className="space-y-8 animate-fade-in">
                <div>
                   <h3 className="text-sm font-bold text-slate-500 mb-4 flex items-center gap-2 uppercase tracking-wide">
                      <TrendingUp size={16} className="text-primary" /> 실시간 지지율
                   </h3>
                   <div className="h-[250px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                         <BarChart data={currentRegion.partySupportData} layout="vertical" margin={{ top: 0, right: 30, left: 30, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" horizontal={false} opacity={0.2} />
                            <XAxis type="number" hide />
                            <YAxis dataKey="name" type="category" width={70} tick={{fontSize: 10, fontWeight: 600, fill: '#64748b'}} />
                            <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={24} animationDuration={1000}>
                              {currentRegion.partySupportData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.name.includes('A당') ? '#3b82f6' : entry.name.includes('B당') ? '#ef4444' : entry.name.includes('C당') ? '#eab308' : '#94a3b8'} />
                              ))}
                            </Bar>
                         </BarChart>
                      </ResponsiveContainer>
                   </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                   <div className="bg-slate-50 p-4 rounded-2xl text-center border border-slate-100">
                      <div className="text-[10px] text-slate-400 font-bold mb-1">투표율</div>
                      <div className="text-xl font-extrabold text-primary">{currentRegion.turnout}%</div>
                   </div>
                   <div className="bg-slate-50 p-4 rounded-2xl text-center border border-slate-100">
                      <div className="text-[10px] text-slate-400 font-bold mb-1">참여자</div>
                      <div className="text-xl font-extrabold text-secondary">5,102<span className="text-xs font-normal">명</span></div>
                   </div>
                </div>
             </div>
           )}
        </div>

        <div className="flex flex-col gap-3 pb-8">
           {isUserDistrict && !hasVotedRegional && (
             <Button fullWidth onClick={() => setViewState('info_review')} className="!bg-secondary text-white py-4 shadow-xl">
                투표하고 잠금 데이터 해제하기
             </Button>
           )}
           <Button onClick={() => navigate('/')} variant="secondary" className="py-4 rounded-2xl border-slate-200">
              <Home className="mr-2" size={18} /> 홈으로 돌아가기
           </Button>
        </div>
      </div>
    );
  }

  return <div>Loading...</div>;
};

export default RegionalData;