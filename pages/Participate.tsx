import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, Users, ChevronRight, MessageSquare, ThumbsUp } from 'lucide-react';
import Card from '../components/Card';
import api from '../services/api';
import { AgendaItem } from '../types';

const Participate: React.FC = () => {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [agendas, setAgendas] = useState<AgendaItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const loadAgendas = async () => {
      try {
        setIsLoading(true);
        const data = await api.agendas.getAll({ status: 'active' });
        setAgendas(data);
      } catch (err: any) {
        console.error('Failed to load agendas:', err);
        setError('안건을 불러오는데 실패했습니다.');
        // Fallback to mock data
        const { MOCK_AGENDAS } = await import('../constants');
        setAgendas(MOCK_AGENDAS.filter(a => a.status === 'active'));
      } finally {
        setIsLoading(false);
      }
    };

    loadAgendas();
  }, []);

  const categories = ['all', ...Array.from(new Set(agendas.map(item => item.category)))];

  const filteredAgendas = activeCategory === 'all' 
    ? agendas 
    : agendas.filter(item => item.category === activeCategory);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
      {/* [HOOK] */}
      <div className="mb-6 sm:mb-10 text-center">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-secondary mb-2 sm:mb-3 px-2">
          당신의 의견이 <span className="text-primary">정책이 됩니다</span>
        </h1>
        {/* [STORY] 사회적 증거 제시 */}
        <p className="text-slate-600 text-xs sm:text-sm px-2">
          현재 <span className="font-bold text-secondary">12,405명</span>의 시민이 우리 사회의 미래를 위해<br className="hidden sm:block"/>
          치열하게 토론하고 있습니다.
        </p>
      </div>

      {/* Filter */}
      <div className="flex justify-start sm:justify-center gap-2 mb-6 sm:mb-8 overflow-x-auto pb-2 scrollbar-hide -mx-4 sm:mx-0 px-4 sm:px-0">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`
              px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all whitespace-nowrap shadow-sm touch-target min-h-[40px] sm:min-h-[44px]
              ${activeCategory === cat 
                ? 'bg-secondary text-white shadow-md active:scale-105' 
                : 'bg-white text-slate-500 border border-slate-200 active:bg-slate-50'}
            `}
          >
            {cat === 'all' ? '전체 보기' : `#${cat}`}
          </button>
        ))}
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="text-center py-12">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-500 text-sm">안건을 불러오는 중...</p>
        </div>
      )}

      {/* Error State */}
      {error && !isLoading && (
        <div className="text-center py-12 bg-red-50 rounded-xl border border-red-200">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !error && filteredAgendas.length === 0 && (
        <div className="text-center py-12">
          <p className="text-slate-500 text-sm">표시할 안건이 없습니다.</p>
        </div>
      )}

      {/* [OFFER] Agenda List */}
      {!isLoading && !error && filteredAgendas.length > 0 && (
      <div className="grid gap-3 sm:gap-5">
        {filteredAgendas.map((agenda) => {
           const totalVotes = agenda.agreeCount + agenda.disagreeCount;
           const agreePercent = Math.round((agenda.agreeCount / totalVotes) * 100);

           return (
            <Card 
              key={agenda.id} 
              onClick={() => navigate(`/participate/${agenda.id}`)}
              className="group cursor-pointer active:border-primary/50 transition-all active:scale-[0.99] relative overflow-hidden touch-target"
            >
              <div className="absolute top-0 left-0 w-1 h-full bg-slate-200 group-active:bg-primary transition-colors"></div>
              
              <div className="pl-2 sm:pl-3">
                <div className="flex justify-between items-start mb-2 sm:mb-3">
                  <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                    <span className={`px-2 py-0.5 text-[9px] sm:text-[10px] font-bold rounded-md ${
                      agenda.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {agenda.status === 'active' ? '진행중' : '종료됨'}
                    </span>
                    <span className="text-slate-400 text-[10px] sm:text-xs font-bold">#{agenda.category}</span>
                  </div>
                  <ChevronRight size={18} className="sm:w-5 sm:h-5 text-slate-300 group-active:text-primary transition-colors group-active:translate-x-1 duration-300 shrink-0" />
                </div>
                
                <h3 className="text-base sm:text-lg md:text-xl font-bold text-secondary mb-2 group-active:text-primary transition-colors">
                  {agenda.title}
                </h3>
                
                <p className="text-slate-500 text-xs sm:text-sm line-clamp-2 mb-4 sm:mb-5 min-h-[36px] sm:min-h-[40px] leading-relaxed">
                  {agenda.description}
                </p>
                
                {/* Visual Data Story */}
                <div className="bg-slate-50 rounded-lg sm:rounded-xl p-3 sm:p-4 mb-3 sm:mb-4 border border-slate-100">
                   <div className="flex justify-between text-[10px] sm:text-xs font-bold mb-2 uppercase tracking-wide">
                      <span className="text-primary-dark flex items-center gap-1"><ThumbsUp size={11} className="sm:w-3 sm:h-3"/> 찬성 {agreePercent}%</span>
                      <span className="text-red-400">반대 {100 - agreePercent}%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden flex">
                       <div className="h-full bg-primary" style={{ width: `${agreePercent}%` }}></div>
                       <div className="h-full bg-red-400" style={{ width: `${100 - agreePercent}%` }}></div>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0 text-[10px] sm:text-xs text-slate-400 border-t border-slate-50 pt-3">
                  <div className="flex gap-3 sm:gap-4 flex-wrap">
                    <span className="flex items-center gap-1.5 font-medium"><Users size={12} className="sm:w-3.5 sm:h-3.5" /> {agenda.participants.toLocaleString()}명 참여</span>
                    <span className="flex items-center gap-1.5 font-medium text-slate-500"><MessageSquare size={12} className="sm:w-3.5 sm:h-3.5" /> 의견 {agenda.comments?.length || 0}개</span>
                  </div>
                  <span className="flex items-center gap-1.5 text-red-400 font-medium"><Clock size={12} className="sm:w-3.5 sm:h-3.5" /> {agenda.endDate} 마감</span>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
      )}
    </div>
  );
};

export default Participate;