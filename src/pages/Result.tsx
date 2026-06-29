import { useQuizStore } from '@/store/quizStore';
import { Trophy, Target, Clock, CheckCircle, XCircle, RotateCcw, Home, ChevronDown, ChevronUp, BookOpen } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Result() {
  const { getStats, getWrongQuestions, questions, resetQuiz, startQuiz } = useQuizStore();
  const navigate = useNavigate();
  const [expandedWrong, setExpandedWrong] = useState<number[]>([]);
  
  const stats = getStats();
  const wrongQuestions = getWrongQuestions();
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}分${secs}秒`;
  };
  
  const getGrade = () => {
    if (stats.accuracy >= 90) return { grade: '优秀', color: 'text-success-500', bg: 'bg-success-100' };
    if (stats.accuracy >= 80) return { grade: '良好', color: 'text-primary-600', bg: 'bg-primary-100' };
    if (stats.accuracy >= 60) return { grade: '及格', color: 'text-warning-500', bg: 'bg-warning-100' };
    return { grade: '需努力', color: 'text-error-500', bg: 'bg-error-100' };
  };
  
  const gradeInfo = getGrade();
  
  const toggleWrongQuestion = (id: number) => {
    setExpandedWrong((prev) => 
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };
  
  const handleRestart = () => {
    resetQuiz();
    navigate('/');
  };
  
  const handleRetryWrong = () => {
    if (wrongQuestions.length === 0) return;
    startQuiz();
    navigate('/quiz');
  };
  
  const progressCircle = {
    radius: 80,
    circumference: 2 * Math.PI * 80,
    offset: 2 * Math.PI * 80 - (stats.accuracy / 100) * 2 * Math.PI * 80,
  };
  
  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-8 animate-fade-in">
          <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full ${gradeInfo.bg} mb-4`}>
            <Trophy className={`w-10 h-10 ${gradeInfo.color}`} />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">答题完成</h1>
          <p className={`text-xl font-semibold ${gradeInfo.color}`}>评定等级：{gradeInfo.grade}</p>
        </header>
        
        <div className="bg-white rounded-2xl p-8 card-shadow mb-8 animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="relative">
              <svg width="200" height="200" className="transform -rotate-90">
                <circle
                  cx="100"
                  cy="100"
                  r={progressCircle.radius}
                  stroke="#e2e8f0"
                  strokeWidth="12"
                  fill="none"
                />
                <circle
                  cx="100"
                  cy="100"
                  r={progressCircle.radius}
                  stroke={stats.accuracy >= 80 ? '#16a34a' : stats.accuracy >= 60 ? '#d97706' : '#dc2626'}
                  strokeWidth="12"
                  fill="none"
                  strokeLinecap="round"
                  className="progress-ring-circle"
                  strokeDasharray={progressCircle.circumference}
                  strokeDashoffset={progressCircle.offset}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-5xl font-bold text-gray-800">{stats.accuracy}</span>
                <span className="text-gray-500">正确率</span>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-6 w-full md:w-auto">
              <div className="bg-success-50 rounded-xl p-6 text-center">
                <div className="w-12 h-12 rounded-full bg-success-100 flex items-center justify-center mx-auto mb-3">
                  <CheckCircle className="w-6 h-6 text-success-500" />
                </div>
                <p className="text-3xl font-bold text-success-600">{stats.correct}</p>
                <p className="text-gray-500 text-sm">正确题数</p>
              </div>
              
              <div className="bg-error-50 rounded-xl p-6 text-center">
                <div className="w-12 h-12 rounded-full bg-error-100 flex items-center justify-center mx-auto mb-3">
                  <XCircle className="w-6 h-6 text-error-500" />
                </div>
                <p className="text-3xl font-bold text-error-600">{stats.wrong}</p>
                <p className="text-gray-500 text-sm">错误题数</p>
              </div>
              
              <div className="bg-primary-50 rounded-xl p-6 text-center">
                <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center mx-auto mb-3">
                  <Target className="w-6 h-6 text-primary-600" />
                </div>
                <p className="text-3xl font-bold text-primary-600">{questions.length}</p>
                <p className="text-gray-500 text-sm">总题数</p>
              </div>
              
              <div className="bg-amber-50 rounded-xl p-6 text-center">
                <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-3">
                  <Clock className="w-6 h-6 text-amber-600" />
                </div>
                <p className="text-3xl font-bold text-amber-600">{formatTime(stats.totalTime)}</p>
                <p className="text-gray-500 text-sm">用时</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex justify-center gap-4 mb-8">
          <button
            onClick={handleRestart}
            className="flex items-center gap-2 px-8 py-3 bg-white border-2 border-primary-600 text-primary-600 rounded-xl font-medium hover:bg-primary-50 transition-all hover:scale-105"
          >
            <Home className="w-5 h-5" />
            返回首页
          </button>
          <button
            onClick={handleRetryWrong}
            disabled={wrongQuestions.length === 0}
            className={`flex items-center gap-2 px-8 py-3 rounded-xl font-medium transition-all hover:scale-105 ${
              wrongQuestions.length > 0
                ? 'gradient-primary text-white'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            <RotateCcw className="w-5 h-5" />
            重做错题 ({wrongQuestions.length})
          </button>
        </div>
        
        {wrongQuestions.length > 0 && (
          <div className="bg-white rounded-2xl p-6 card-shadow animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-3">
              <BookOpen className="w-6 h-6 text-primary-600" />
              错题回顾 ({wrongQuestions.length}道)
            </h2>
            
            <div className="space-y-4">
              {wrongQuestions.map((question, index) => {
                const isExpanded = expandedWrong.includes(question.id);
                return (
                  <div
                    key={question.id}
                    className="border-2 border-error-100 rounded-xl overflow-hidden"
                  >
                    <button
                      onClick={() => toggleWrongQuestion(question.id)}
                      className="w-full p-4 flex items-center justify-between bg-error-50 hover:bg-error-100 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <span className="w-8 h-8 rounded-full bg-error-100 flex items-center justify-center text-error-600 font-bold">
                          {index + 1}
                        </span>
                        <span className="text-gray-800 font-medium text-left flex-1">
                          {question.content.substring(0, 60)}
                          {question.content.length > 60 && '...'}
                        </span>
                      </div>
                      {isExpanded ? (
                        <ChevronUp className="w-5 h-5 text-gray-400" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-gray-400" />
                      )}
                    </button>
                    
                    {isExpanded && (
                      <div className="p-6 bg-white border-t border-error-100 animate-slide-up">
                        <p className="text-gray-800 mb-4">{question.content}</p>
                        
                        {question.type === 'choice' && question.options && (
                          <div className="space-y-2 mb-4">
                            {question.options.map((option) => {
                              const optionKey = option.substring(0, 1);
                              const isCorrect = optionKey === question.answer;
                              const isUserAnswer = optionKey === question.userAnswer;
                              
                              return (
                                <div
                                  key={option}
                                  className={`p-3 rounded-lg border-2 ${
                                    isCorrect
                                      ? 'bg-success-50 border-success-500'
                                      : isUserAnswer
                                      ? 'bg-error-50 border-error-500'
                                      : 'bg-gray-50 border-gray-200'
                                  }`}
                                >
                                  <span className="font-medium">{option}</span>
                                  {isCorrect && (
                                    <span className="ml-2 text-success-600 text-sm">✓ 正确答案</span>
                                  )}
                                  {isUserAnswer && !isCorrect && (
                                    <span className="ml-2 text-error-600 text-sm">✗ 你的答案</span>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        )}
                        
                        {question.type === 'fill' && (
                          <div className="space-y-3 mb-4">
                            <div className="p-3 rounded-lg bg-error-50 border-2 border-error-500">
                              <span className="text-gray-600">你的答案：</span>
                              <span className="text-error-600 font-semibold">{question.userAnswer}</span>
                            </div>
                            <div className="p-3 rounded-lg bg-success-50 border-2 border-success-500">
                              <span className="text-gray-600">正确答案：</span>
                              <span className="text-success-600 font-semibold">{question.answer}</span>
                            </div>
                          </div>
                        )}
                        
                        {question.analysis && (
                          <div className="p-4 bg-amber-50 rounded-xl border border-amber-200">
                            <div className="flex items-start gap-3">
                              <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center flex-shrink-0">
                                <BookOpen className="w-4 h-4 text-amber-600" />
                              </div>
                              <div>
                                <h4 className="font-medium text-amber-800 mb-1">知识点解析</h4>
                                <p className="text-amber-700 text-sm leading-relaxed">
                                  {question.analysis}
                                </p>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
        
        {wrongQuestions.length === 0 && (
          <div className="bg-white rounded-2xl p-8 card-shadow text-center animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <div className="w-16 h-16 rounded-full bg-success-100 flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-success-500" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">太棒了！</h3>
            <p className="text-gray-500">你已经全部答对了，继续保持！</p>
          </div>
        )}
        
        <footer className="text-center mt-12 text-gray-500 text-sm">
          <p>AI基础A在线答题系统 · 助力高效备考</p>
        </footer>
      </div>
    </div>
  );
}
