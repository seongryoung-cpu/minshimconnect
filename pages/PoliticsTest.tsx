import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, RefreshCw, Share2, Compass, ArrowRight } from 'lucide-react';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer } from 'recharts';
import Button from '../components/Button';
import Card from '../components/Card';
import { QUESTIONS } from '../constants';

const PoliticsTest: React.FC = () => {
  const [status, setStatus] = useState<'intro' | 'test' | 'result'>('intro');
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({}); // -2 (Strongly Disagree) to 2 (Strongly Agree)
  const navigate = useNavigate();

  const handleStart = () => {
    setStatus('test');
    setCurrentQIndex(0);
    setAnswers({});
  };

  const handleAnswer = (score: number) => {
    const nextAnswers = { ...answers, [QUESTIONS[currentQIndex].id]: score };
    setAnswers(nextAnswers);

    if (currentQIndex < QUESTIONS.length - 1) {
      setCurrentQIndex(currentQIndex + 1);
    } else {
      setStatus('result');
    }
  };

  const calculateScore = () => {
    const scores = { economic: 0, social: 0, national: 0 };
    QUESTIONS.forEach((q) => {
      const answer = answers[q.id] || 0;
      scores[q.category] += answer;
    });
    // Normalize to 0-100 for radar chart display
    return [
      { subject: '경제 (시장친화)', A: 50 + (scores.economic * 2.5), fullMark: 100 }, 
      { subject: '사회 (진보성)', A: 50 + (scores.social * 2.5), fullMark: 100 },
      { subject: '국가관 (안보)', A: 50 + (scores.national * 2.5), fullMark: 100 },
    ];
  };

  if (status === 'intro') {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        {/* [HOOK] */}
        <div className="mb-8">
           <div className="w-20 h-20 bg-primary-light text-primary rounded-full flex items-center justify-center mx-auto mb-6">
             <Compass size={40} />
           </div>
           <h1 className="text-4xl font-extrabold text-secondary mb-4">나는 보수일까, 진보일까?</h1>
           <p className="text-lg text-slate-600 leading-relaxed max-w-md mx-auto">
             20개의 질문으로 당신의 <span className="text-primary font-bold">정치 좌표</span>를 찾아드립니다.<br/>
             막연했던 나의 성향을 데이터로 확인해보세요.
           </p>
        </div>

        {/* [OFFER] */}
        <div className="flex flex-col items-center gap-4">
          <Button size="lg" onClick={handleStart} className="px-12 py-4 text-lg rounded-full shadow-xl shadow-primary/30 hover:scale-105 transition-transform">
            테스트 시작하기
          </Button>
          <p className="text-sm text-slate-400 font-medium">소요 시간: 약 3분 · 12,402명 참여중</p>
        </div>
      </div>
    );
  }

  if (status === 'test') {
    const currentQ = QUESTIONS[currentQIndex];
    const progress = ((currentQIndex + 1) / QUESTIONS.length) * 100;

    return (
      <div className="max-w-xl mx-auto px-4 py-12 h-screen flex flex-col justify-center">
        {/* Progress */}
        <div className="mb-10">
           <div className="flex justify-between text-xs font-bold text-slate-400 mb-2">
              <span>질문 {currentQIndex + 1}</span>
              <span>{QUESTIONS.length}</span>
           </div>
           <div className="w-full bg-slate-100 rounded-full h-2">
            <div 
              className="bg-primary h-2 rounded-full transition-all duration-300" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* Question Card */}
        <div className="text-center mb-10">
          <span className="inline-block px-3 py-1 bg-slate-100 text-slate-500 rounded-full text-xs font-bold mb-4">
            #{currentQ.category === 'economic' ? '경제' : currentQ.category === 'social' ? '사회' : '국가관'}
          </span>
          <h2 className="text-2xl font-bold text-secondary leading-snug">
            "{currentQ.text}"
          </h2>
        </div>

        {/* Answer Buttons */}
        <div className="flex flex-col gap-3">
          <button 
            className="w-full py-4 rounded-xl border-2 border-primary bg-primary text-white font-bold hover:bg-primary-hover transition-colors active:scale-[0.98]"
            onClick={() => handleAnswer(2)}
          >
            매우 동의한다
          </button>
          <button 
            className="w-full py-4 rounded-xl border-2 border-primary/30 bg-white text-primary font-bold hover:bg-primary/5 transition-colors active:scale-[0.98]"
            onClick={() => handleAnswer(1)}
          >
            동의하는 편이다
          </button>
          <button 
            className="w-full py-4 rounded-xl border-2 border-slate-100 bg-slate-50 text-slate-500 font-bold hover:bg-slate-100 transition-colors active:scale-[0.98]"
            onClick={() => handleAnswer(0)}
          >
            잘 모르겠다
          </button>
          <button 
            className="w-full py-4 rounded-xl border-2 border-red-100 bg-white text-red-500 font-bold hover:bg-red-50 transition-colors active:scale-[0.98]"
            onClick={() => handleAnswer(-1)}
          >
            동의하지 않는 편이다
          </button>
          <button 
             className="w-full py-4 rounded-xl border-2 border-red-500 bg-red-500 text-white font-bold hover:bg-red-600 transition-colors active:scale-[0.98]"
             onClick={() => handleAnswer(-2)}
          >
            전혀 동의하지 않는다
          </button>
        </div>
      </div>
    );
  }

  // Result View
  const chartData = calculateScore();

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="text-center mb-10">
         <p className="text-primary font-bold mb-2">분석 완료</p>
         <h1 className="text-3xl font-extrabold text-secondary">당신은 "실용적 중도개혁가" 입니다.</h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <Card className="flex flex-col items-center justify-center min-h-[300px] bg-slate-50 border-0">
          <ResponsiveContainer width="100%" height={280}>
            <RadarChart cx="50%" cy="50%" outerRadius="70%" data={chartData}>
              <PolarGrid stroke="#cbd5e1" />
              <PolarAngleAxis dataKey="subject" tick={{ fill: '#475569', fontSize: 12, fontWeight: 700 }} />
              <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
              <Radar
                name="나의 성향"
                dataKey="A"
                stroke="#2ed5c4"
                strokeWidth={3}
                fill="#2ed5c4"
                fillOpacity={0.5}
              />
            </RadarChart>
          </ResponsiveContainer>
        </Card>

        <Card className="flex flex-col justify-center border-l-4 border-l-secondary shadow-lg">
          <h3 className="text-lg font-bold text-secondary mb-4">상세 분석</h3>
          <p className="text-slate-600 leading-relaxed mb-6 text-sm">
            경제적으로는 시장의 자유를 중요시하지만, 사회적 문제에 있어서는 공동체의 역할과 복지를 지지하는 균형 잡힌 시각을 가지고 계시군요.<br/><br/>
            급진적인 변화보다는 점진적이고 합리적인 개혁을 선호하며, 안보에 있어서는 신중한 입장을 취하고 있습니다.
          </p>
          <div className="flex gap-3 mt-auto">
            <Button variant="outline" size="sm" onClick={handleStart} fullWidth className="py-3">
              <RefreshCw size={16} className="mr-2" /> 다시하기
            </Button>
            <Button size="sm" fullWidth className="py-3 shadow-lg shadow-primary/20">
              <Share2 size={16} className="mr-2" /> 결과 공유하기
            </Button>
          </div>
        </Card>
      </div>

      <div className="mb-12">
        <h3 className="text-xl font-bold text-secondary mb-6 flex items-center gap-2">
           <ArrowRight className="text-primary" />
           나와 비슷한 시민들의 관심사
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card hoverable className="border border-slate-200 cursor-pointer group" onClick={() => navigate('/participate')}>
            <span className="text-[10px] font-bold bg-blue-100 text-blue-700 px-2 py-0.5 rounded mb-2 inline-block">경제</span>
            <h4 className="font-bold text-slate-800 text-lg group-hover:text-primary transition-colors">스타트업 규제 샌드박스 확대</h4>
            <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
               <span>참여 5,230명</span>
               <span className="text-primary font-bold">참여하기 →</span>
            </div>
          </Card>
          <Card hoverable className="border border-slate-200 cursor-pointer group" onClick={() => navigate('/participate')}>
            <span className="text-[10px] font-bold bg-green-100 text-green-700 px-2 py-0.5 rounded mb-2 inline-block">환경</span>
            <h4 className="font-bold text-slate-800 text-lg group-hover:text-primary transition-colors">도심 녹지 비율 의무화 법안</h4>
            <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
               <span>참여 3,120명</span>
               <span className="text-primary font-bold">참여하기 →</span>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PoliticsTest;