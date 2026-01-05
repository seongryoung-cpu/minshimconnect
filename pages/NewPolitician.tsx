import React, { useState } from 'react';
import { X, Briefcase, CheckCircle, Heart, Share2, MapPin, ChevronRight } from 'lucide-react';
import Card from '../components/Card';
import Button from '../components/Button';
import { MOCK_POLITICIANS } from '../constants';
import { PoliticianProfile } from '../types';

const NewPolitician: React.FC = () => {
  const [selectedPolitician, setSelectedPolitician] = useState<PoliticianProfile | null>(null);

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* [HOOK] Hero Section */}
      <div className="bg-secondary text-white py-14 px-4 relative overflow-hidden">
        {/* Abstract Background */}
        <div className="absolute top-[-50%] right-[-10%] w-[300px] h-[300px] bg-white/5 rounded-full blur-3xl"></div>
        
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <h1 className="text-3xl md:text-4xl font-extrabold mb-4">우리 동네 일꾼,<br/>누구를 뽑아야 할까요?</h1>
          <p className="text-slate-300 text-sm md:text-base max-w-xl mx-auto mb-8 leading-relaxed">
            이미지가 아닌 <strong>공약</strong>을 보세요.<br/>
            우리 지역 발전을 위한 구체적인 약속을 비교하고 응원해주세요.
          </p>
          
          {/* Mock District Selector */}
          <div className="inline-flex items-center bg-white/10 backdrop-blur-md rounded-full px-5 py-3 border border-white/20 shadow-lg hover:bg-white/20 transition-colors cursor-pointer group">
            <MapPin size={18} className="text-primary mr-2" />
            <select className="bg-transparent text-white text-sm font-bold border-none outline-none cursor-pointer appearance-none pr-6">
              <option className="text-slate-900">서울특별시 종로구</option>
              <option className="text-slate-900">서울특별시 강남구 갑</option>
              <option className="text-slate-900">경기도 수원시 갑</option>
            </select>
            <ChevronRight size={16} className="text-white/50 group-hover:text-white transition-colors" />
          </div>
        </div>
      </div>

      {/* [STORY] Candidate Grid */}
      <div className="max-w-6xl mx-auto px-4 -mt-10 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {MOCK_POLITICIANS.map((politician) => (
            <div 
              key={politician.id} 
              onClick={() => setSelectedPolitician(politician)}
              className="group cursor-pointer perspective"
            >
              <Card className="h-full border-0 shadow-lg hover:shadow-2xl transition-all duration-300 transform group-hover:-translate-y-2 overflow-hidden relative bg-white rounded-3xl">
                <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-br from-slate-100 to-white"></div>
                <div className="pt-8 text-center relative">
                  <div className="relative inline-block mb-4">
                    <img 
                      src={politician.imageUrl} 
                      alt={politician.name} 
                      className="w-28 h-28 rounded-full object-cover border-4 border-white shadow-lg mx-auto"
                    />
                    <div className="absolute bottom-2 -right-2 bg-secondary text-white text-[10px] font-bold px-3 py-1 rounded-full border-2 border-white shadow-sm">
                      기호 {politician.id}번
                    </div>
                  </div>
                  
                  <div className="px-4">
                    <h3 className="text-xl font-bold text-slate-900 mb-1">{politician.name}</h3>
                    <p className="text-xs text-slate-500 font-bold uppercase tracking-wide mb-3">{politician.job}</p>
                    <div className="bg-slate-50 rounded-xl p-3 mb-4">
                       <p className="text-sm text-secondary font-bold italic leading-snug">
                        "{politician.slogan}"
                       </p>
                    </div>
                  </div>
                </div>
                
                <div className="px-6 pb-6 mt-auto">
                  <button className="w-full py-3 rounded-xl bg-primary-light text-primary font-bold text-sm hover:bg-primary hover:text-white transition-colors">
                    공약 자세히 보기
                  </button>
                </div>
              </Card>
            </div>
          ))}
        </div>
      </div>

      {/* [OFFER] Action */}
      <div className="max-w-3xl mx-auto mt-20 px-4 text-center">
        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
           <h3 className="text-xl font-bold text-secondary mb-2">원하는 후보가 없으신가요?</h3>
           <p className="text-slate-500 mb-6 text-sm">
             우리 지역에 필요한 정책을 직접 제안해주세요.<br/>
             후보자들에게 전달하여 공약에 반영하도록 돕겠습니다.
           </p>
           <Button variant="outline" className="px-8">정책 제안하기</Button>
        </div>
      </div>

      {/* Modal - Improved Layout */}
      {selectedPolitician && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-secondary/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl w-full max-w-2xl flex flex-col max-h-[90vh] shadow-2xl relative overflow-hidden">
            
            {/* Fixed Header */}
            <div className="bg-slate-50 p-6 md:p-8 flex flex-col md:flex-row gap-6 items-center border-b border-slate-100 flex-shrink-0 relative">
               <button 
                onClick={() => setSelectedPolitician(null)}
                className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-full transition-colors z-10"
              >
                <X size={24} />
              </button>
              <img 
                src={selectedPolitician.imageUrl} 
                alt={selectedPolitician.name} 
                className="w-24 h-24 rounded-full object-cover shadow-lg border-4 border-white"
              />
              <div className="text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                  <span className="bg-secondary text-white px-2 py-0.5 rounded text-xs font-bold">기호 {selectedPolitician.id}번</span>
                  <span className="text-slate-500 text-sm font-medium">{selectedPolitician.age}세</span>
                </div>
                <h2 className="text-2xl font-bold text-secondary mb-1">{selectedPolitician.name}</h2>
                <p className="text-lg text-primary font-bold italic">"{selectedPolitician.slogan}"</p>
              </div>
            </div>

            {/* Scrollable Body */}
            <div className="p-6 md:p-8 space-y-8 overflow-y-auto flex-1">
              <div>
                <h3 className="flex items-center gap-2 text-base font-bold text-slate-400 uppercase tracking-wider mb-4">
                  <Briefcase size={18} />
                  살아온 길
                </h3>
                <div className="bg-slate-50 rounded-xl p-5">
                  <ul className="space-y-3">
                    {selectedPolitician.career.map((item, idx) => (
                      <li key={idx} className="text-slate-700 font-medium flex items-start gap-3 text-sm">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0"></span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div>
                <h3 className="flex items-center gap-2 text-base font-bold text-slate-400 uppercase tracking-wider mb-4">
                  <CheckCircle size={18} />
                  주요 약속
                </h3>
                <div className="grid gap-3">
                  {selectedPolitician.promises.map((promise, idx) => (
                    <div key={idx} className="flex items-start gap-3 p-4 rounded-xl border border-slate-100 hover:border-primary/30 hover:bg-primary-light/30 transition-colors">
                      <div className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                        {idx + 1}
                      </div>
                      <span className="text-slate-800 font-bold">{promise}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Fixed Footer */}
            <div className="p-6 border-t border-slate-100 flex gap-4 bg-white flex-shrink-0">
              <Button fullWidth className="gap-2 py-4 shadow-lg shadow-primary/20">
                <Heart size={18} /> 응원 메시지 보내기
              </Button>
              <Button variant="outline" fullWidth className="gap-2 py-4">
                <Share2 size={18} /> 친구에게 공유
              </Button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default NewPolitician;