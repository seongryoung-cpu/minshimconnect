import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ThumbsUp, ThumbsDown, MessageSquare, Clock, Users, Send, ArrowLeft, Share2, Info, Lock, BarChart2 } from 'lucide-react';
import Button from '../components/Button';
import Card from '../components/Card';
import api from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { AgendaItem, Comment } from '../types';

const AgendaDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [agenda, setAgenda] = useState<AgendaItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Track user stance: 'agree' | 'disagree' | null
  const [userStance, setUserStance] = useState<'agree' | 'disagree' | null>(null);
  
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);

  // Load agenda data
  useEffect(() => {
    const loadAgenda = async () => {
      try {
        setIsLoading(true);
        const data = await api.agendas.getById(Number(id));
        setAgenda(data);
        setComments(data.comments || []);
      } catch (error) {
        console.error('Failed to load agenda:', error);
        // Fallback to mock data
        const { MOCK_AGENDAS } = await import('../constants');
        const found = MOCK_AGENDAS.find(a => a.id === Number(id));
        if (found) {
          setAgenda(found);
          setComments(found.comments || []);
        }
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      loadAgenda();
    }
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!agenda) {
    return (
      <div className="p-10 text-center">
        <p className="text-slate-500">안건을 찾을 수 없습니다.</p>
      </div>
    );
  }

  const totalVotes = agenda.agreeCount + agenda.disagreeCount;
  const agreePercent = totalVotes > 0 ? Math.round((agenda.agreeCount / totalVotes) * 100) : 0;
  const disagreePercent = totalVotes > 0 ? 100 - agreePercent : 0;

  const handleVote = async (stance: 'agree' | 'disagree') => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    try {
      await api.votes.voteAgenda(Number(id), stance);
      setUserStance(stance);
      
      // Update agenda counts locally
      if (agenda) {
        setAgenda({
          ...agenda,
          agreeCount: stance === 'agree' ? agenda.agreeCount + 1 : agenda.agreeCount,
          disagreeCount: stance === 'disagree' ? agenda.disagreeCount + 1 : agenda.disagreeCount,
          participants: agenda.participants + 1,
        });
      }
    } catch (error: any) {
      console.error('Failed to vote:', error);
      alert(error.message || '투표에 실패했습니다.');
    }
  };

  const handlePostComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !userStance || !isAuthenticated) {
      if (!isAuthenticated) {
        navigate('/login');
      }
      return;
    }

    try {
      setIsSubmittingComment(true);
      const comment = await api.comments.create(Number(id), newComment, userStance);
      setComments(prev => [comment, ...prev]);
      setNewComment("");
      
      // Update agenda comment count
      if (agenda) {
        setAgenda({
          ...agenda,
          comments: [...(agenda.comments || []), comment],
        });
      }
    } catch (error: any) {
      console.error('Failed to post comment:', error);
      alert(error.message || '댓글 작성에 실패했습니다.');
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const handleLikeComment = async (commentId: number) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    try {
      const result = await api.comments.like(commentId);
      setComments(prev => prev.map(c => 
        c.id === commentId 
          ? { ...c, likes: result.liked ? c.likes + 1 : c.likes - 1, isLiked: result.liked }
          : c
      ));
    } catch (error) {
      console.error('Failed to like comment:', error);
    }
  };
    setComments(comments.map(c => 
      c.id === commentId ? { ...c, likes: c.likes + (c.isLiked ? -1 : 1), isLiked: !c.isLiked } : c
    ));
  };

  return (
    <div className="bg-slate-50 min-h-screen pb-20 sm:pb-24">
      {/* Header / Nav */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-30 px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between">
        <button 
          onClick={() => navigate(-1)} 
          className="text-slate-600 active:text-secondary touch-target min-h-[44px] min-w-[44px] flex items-center justify-center -ml-2"
          aria-label="뒤로가기"
        >
          <ArrowLeft size={22} className="sm:w-6 sm:h-6" />
        </button>
        <span className="font-bold text-secondary text-xs sm:text-sm truncate max-w-[200px] sm:max-w-[300px] px-2">{agenda.title}</span>
        <button 
          className="text-slate-400 active:text-primary touch-target min-h-[44px] min-w-[44px] flex items-center justify-center -mr-2"
          aria-label="공유"
        >
          <Share2 size={18} className="sm:w-5 sm:h-5" />
        </button>
      </div>

      <div className="max-w-2xl mx-auto p-4 sm:p-6 space-y-4 sm:space-y-6">
        {/* [HOOK] 핵심 질문과 현황 */}
        <div>
          <div className="flex items-center gap-2 mb-3 mt-2">
            <span className={`px-2 sm:px-2.5 py-1 text-[10px] sm:text-xs font-bold rounded-lg ${
              agenda.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'
            }`}>
              {agenda.status === 'active' ? '진행중' : '종료됨'}
            </span>
            <span className="text-primary font-bold text-xs sm:text-sm">#{agenda.category}</span>
          </div>
          
          <h1 className="text-xl sm:text-2xl font-extrabold text-secondary mb-3 sm:mb-4 leading-snug">{agenda.title}</h1>
          
          <div className="flex items-center justify-between bg-white p-3 sm:p-4 rounded-xl shadow-sm border border-slate-100">
             <div className="flex flex-col items-center flex-1">
                <span className="text-[10px] sm:text-xs text-slate-400 font-bold mb-1">참여자</span>
                <span className="text-base sm:text-lg font-bold text-slate-800 flex items-center gap-1"><Users size={14} className="sm:w-4 sm:h-4" />{agenda.participants.toLocaleString()}</span>
             </div>
             <div className="w-px h-6 sm:h-8 bg-slate-100"></div>
             <div className="flex flex-col items-center flex-1">
                <span className="text-[10px] sm:text-xs text-slate-400 font-bold mb-1">남은 시간</span>
                <span className="text-base sm:text-lg font-bold text-red-500 flex items-center gap-1"><Clock size={14} className="sm:w-4 sm:h-4" />5일</span>
             </div>
             <div className="w-px h-6 sm:h-8 bg-slate-100"></div>
             <div className="flex flex-col items-center flex-1">
                <span className="text-[10px] sm:text-xs text-slate-400 font-bold mb-1">토론</span>
                <span className="text-base sm:text-lg font-bold text-slate-800 flex items-center gap-1"><MessageSquare size={14} className="sm:w-4 sm:h-4" />{comments.length}</span>
             </div>
          </div>
        </div>

        {/* [STORY] 왜 중요한가? */}
        <div className="bg-white p-4 sm:p-6 rounded-xl sm:rounded-2xl border border-slate-100 shadow-sm">
           <h3 className="text-xs sm:text-sm font-bold text-slate-400 mb-2 sm:mb-3 uppercase tracking-wider">안건 내용</h3>
           <p className="text-slate-700 leading-relaxed text-sm sm:text-base whitespace-pre-line mb-4 sm:mb-6 font-medium">
            {agenda.description}
           </p>

           <div className="bg-blue-50 p-3 sm:p-4 rounded-lg sm:rounded-xl border border-blue-100 flex gap-2 sm:gap-3 items-start">
             <Info size={18} className="sm:w-5 sm:h-5 text-blue-500 flex-shrink-0 mt-0.5" />
             <div>
               <h4 className="font-bold text-blue-700 text-xs sm:text-sm mb-1">투표 전 꼭 알아두세요</h4>
               <p className="text-blue-600/80 text-[11px] sm:text-xs leading-snug">
                 이 안건은 찬성 시 세금 인상이 불가피하지만, 복지 사각지대를 해소할 수 있다는 장점이 있습니다. 반대 시 재정 건전성을 유지할 수 있습니다.
               </p>
             </div>
          </div>
        </div>

        {/* [OFFER] 투표 액션 */}
        <section className="bg-white p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow-lg shadow-slate-200/50 border border-slate-100 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-5 hidden sm:block">
             <BarChart2 size={100} />
          </div>
          
          <h2 className="text-base sm:text-lg font-bold text-secondary mb-3 sm:mb-4 relative z-10">당신의 입장을 선택해주세요</h2>
          
          {!userStance && agenda.status === 'active' ? (
            <div className="flex flex-col gap-2 sm:gap-3 relative z-10">
              <button 
                onClick={() => handleVote('agree')}
                className="w-full py-3 sm:py-4 px-4 sm:px-6 rounded-xl border-2 border-slate-100 flex items-center justify-between active:border-primary active:bg-primary/5 transition-all group bg-white touch-target min-h-[64px] sm:min-h-[72px]"
              >
                <div className="flex items-center gap-2 sm:gap-3">
                   <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-slate-100 flex items-center justify-center group-active:bg-primary group-active:text-white transition-colors">
                      <ThumbsUp size={18} className="sm:w-5 sm:h-5" />
                   </div>
                   <div className="text-left">
                      <span className="block font-bold text-sm sm:text-base text-slate-700 group-active:text-primary">찬성합니다</span>
                      <span className="text-[10px] sm:text-xs text-slate-400">긍정적인 변화를 기대합니다</span>
                   </div>
                </div>
              </button>
              <button 
                onClick={() => handleVote('disagree')}
                className="w-full py-3 sm:py-4 px-4 sm:px-6 rounded-xl border-2 border-slate-100 flex items-center justify-between active:border-red-400 active:bg-red-50 transition-all group bg-white touch-target min-h-[64px] sm:min-h-[72px]"
              >
                <div className="flex items-center gap-2 sm:gap-3">
                   <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-slate-100 flex items-center justify-center group-active:bg-red-500 group-active:text-white transition-colors">
                      <ThumbsDown size={18} className="sm:w-5 sm:h-5" />
                   </div>
                   <div className="text-left">
                      <span className="block font-bold text-sm sm:text-base text-slate-700 group-active:text-red-500">반대합니다</span>
                      <span className="text-[10px] sm:text-xs text-slate-400">우려되는 점이 있습니다</span>
                   </div>
                </div>
              </button>
            </div>
          ) : (
            <div className="animate-fade-in relative z-10">
              <div className="mb-4 sm:mb-6">
                <div className="flex justify-between text-xs sm:text-sm font-bold mb-2">
                  <span className="text-primary-dark">찬성 {agreePercent}%</span>
                  <span className="text-red-500">반대 {disagreePercent}%</span>
                </div>
                <div className="w-full h-3 sm:h-4 bg-slate-100 rounded-full overflow-hidden flex relative">
                  <div style={{ width: `${agreePercent}%` }} className="h-full bg-primary flex items-center justify-center text-[9px] sm:text-[10px] text-white font-bold"></div>
                  <div style={{ width: `${disagreePercent}%` }} className="h-full bg-red-500 flex items-center justify-center text-[9px] sm:text-[10px] text-white font-bold"></div>
                </div>
                <div className="flex justify-center items-center gap-2 mt-3 sm:mt-4">
                   <span className={`px-3 sm:px-4 py-1 sm:py-1.5 rounded-full text-xs sm:text-sm font-bold border shadow-sm ${userStance === 'agree' ? 'bg-white text-primary border-primary' : 'bg-white text-red-500 border-red-200'}`}>
                     나의 선택: {userStance === 'agree' ? '찬성' : '반대'}
                   </span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-2 sm:gap-3">
                <div className="bg-slate-50 p-2.5 sm:p-3 rounded-lg sm:rounded-xl text-center border border-slate-100">
                   <div className="text-[10px] sm:text-xs text-slate-500 mb-1 font-bold">찬성 의견</div>
                   <div className="font-bold text-primary text-base sm:text-lg">{agenda.agreeCount.toLocaleString()}</div>
                </div>
                <div className="bg-slate-50 p-2.5 sm:p-3 rounded-lg sm:rounded-xl text-center border border-slate-100">
                   <div className="text-[10px] sm:text-xs text-slate-500 mb-1 font-bold">반대 의견</div>
                   <div className="font-bold text-red-500 text-base sm:text-lg">{agenda.disagreeCount.toLocaleString()}</div>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* [Secondary OFFER] 토론 참여 */}
        <section>
          <div className="flex items-center justify-between mb-3 sm:mb-4">
             <h2 className="text-base sm:text-lg font-bold text-secondary flex items-center gap-2">
               실시간 토론장 <span className="text-primary text-xs sm:text-sm bg-primary-light px-2 py-0.5 rounded-full">{comments.length}</span>
             </h2>
          </div>

          {/* Comment Input (Locked if not voted) */}
          <div className="bg-white p-1 rounded-xl sm:rounded-2xl shadow-sm border border-slate-100 mb-4 sm:mb-6 sticky top-14 sm:top-16 z-20">
             {userStance ? (
               <form onSubmit={handlePostComment} className="relative animate-fade-in p-1">
                <input
                  type="text"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder={`'${userStance === 'agree' ? '찬성' : '반대'}' 입장에서 의견을 남겨주세요...`}
                  className={`w-full pl-3 sm:pl-4 pr-10 sm:pr-12 py-2.5 sm:py-3 bg-slate-50 border rounded-lg sm:rounded-xl focus:outline-none focus:bg-white transition-all text-xs sm:text-sm ${
                    userStance === 'agree' ? 'focus:border-primary focus:ring-1 focus:ring-primary' : 'focus:border-red-400 focus:ring-1 focus:ring-red-400'
                  }`}
                />
                <button 
                  type="submit"
                  disabled={!newComment.trim() || isSubmittingComment}
                  className={`absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 p-1.5 sm:p-2 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm touch-target min-h-[36px] min-w-[36px] flex items-center justify-center ${
                    userStance === 'agree' ? 'bg-primary active:bg-primary-hover' : 'bg-red-500 active:bg-red-600'
                  }`}
                  aria-label="댓글 작성"
                >
                  {isSubmittingComment ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <Send size={14} className="sm:w-4 sm:h-4" />
                  )}
                </button>
              </form>
             ) : (
               <div className="flex flex-col items-center justify-center py-6 sm:py-8 text-center bg-slate-50 rounded-lg sm:rounded-xl border border-dashed border-slate-200 px-4">
                 <div className="bg-white p-2.5 sm:p-3 rounded-full mb-2 sm:mb-3 shadow-sm">
                   <Lock size={18} className="sm:w-5 sm:h-5 text-slate-400" />
                 </div>
                 <p className="text-xs sm:text-sm text-slate-700 font-bold mb-1">토론장은 투표 후에 열립니다</p>
                 <p className="text-[10px] sm:text-xs text-slate-400">먼저 당신의 입장을 선택해주세요.</p>
               </div>
             )}
          </div>

          {/* Comment List - Split View */}
          <div className="space-y-3 sm:space-y-4">
            {comments.map((comment) => (
              <div 
                key={comment.id} 
                className={`flex w-full ${comment.stance === 'agree' ? 'justify-start' : 'justify-end'}`}
              >
                <div 
                  className={`max-w-[85%] sm:max-w-[75%] rounded-xl sm:rounded-2xl p-3 sm:p-4 shadow-sm border relative ${
                    comment.stance === 'agree' 
                      ? 'bg-white border-blue-100 rounded-tl-none ml-1 sm:ml-2' 
                      : 'bg-white border-red-100 rounded-tr-none mr-1 sm:mr-2'
                  }`}
                >
                   {/* Author Badge */}
                   <div className={`flex items-center gap-1.5 sm:gap-2 mb-2 flex-wrap ${comment.stance === 'agree' ? 'flex-row' : 'flex-row-reverse'}`}>
                      <div className={`text-[9px] sm:text-[10px] font-bold px-1.5 py-0.5 rounded ${
                         comment.stance === 'agree' ? 'bg-blue-50 text-blue-600' : 'bg-red-50 text-red-600'
                      }`}>
                         {comment.stance === 'agree' ? '찬성' : '반대'}
                      </div>
                      <span className="text-[11px] sm:text-xs font-bold text-slate-700">{comment.author}</span>
                      <span className="text-[9px] sm:text-[10px] text-slate-400">{comment.date}</span>
                   </div>
                   
                   <p className={`text-xs sm:text-sm text-slate-800 leading-relaxed mb-2 sm:mb-3 ${comment.stance === 'agree' ? 'text-left' : 'text-right'}`}>
                     {comment.content}
                   </p>
                   
                   <div className={`flex items-center gap-2 sm:gap-3 ${comment.stance === 'agree' ? 'justify-start' : 'justify-end'}`}>
                      <button 
                        onClick={() => handleLikeComment(comment.id)}
                        className={`text-[10px] sm:text-xs flex items-center gap-1 transition-colors px-2 py-1 rounded-full bg-slate-50 active:bg-slate-100 touch-target min-h-[32px] ${comment.isLiked ? 'text-slate-900 font-bold' : 'text-slate-500'}`}
                      >
                        <ThumbsUp size={11} className="sm:w-3 sm:h-3" /> 공감 {comment.likes}
                      </button>
                   </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default AgendaDetail;