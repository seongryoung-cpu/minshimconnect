import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, ArrowLeft } from 'lucide-react';
import Button from '../components/Button';
import Card from '../components/Card';

const ComingSoon: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="max-w-3xl mx-auto px-4 py-20 text-center">
      <Card className="py-20 flex flex-col items-center justify-center gap-6">
        <div className="bg-blue-50 p-6 rounded-full text-blue-600 mb-4">
          <Clock size={48} />
        </div>
        
        <h1 className="text-3xl font-bold text-slate-900">준비 중인 기능입니다</h1>
        
        <p className="text-lg text-slate-600 max-w-md mx-auto leading-relaxed">
          해당 기능은 현재 비공개 베타 테스트를 위해 준비 중입니다.<br/>
          정식 오픈 시 가장 먼저 알림을 드릴게요!
        </p>
        
        <div className="mt-8 flex gap-4">
          <Button variant="outline" onClick={() => navigate(-1)}>
            <ArrowLeft size={18} className="mr-2" />
            이전 페이지로
          </Button>
          <Button onClick={() => navigate('/')}>
            홈으로 이동
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default ComingSoon;