import { useQuizStore } from '@/store/quizStore';
import { BookOpen, Play, Shuffle, BarChart3, Target, Clock, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Home() {
  const { questions, getStats, getProgress, setMode, startQuiz } = useQuizStore();
  const navigate = useNavigate();
  
  const stats = getStats();
  const progress = getProgress();
  
  const choiceCount = questions.filter((q) => q.type === 'choice').length;
  const fillCount = questions.filter((q) => q.type === 'fill').length;
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}分${secs}秒`;
  };
  
  const handleStartQuiz = (mode: 'sequential' | 'random') => {
    setMode(mode);
    startQuiz();
    navigate('/quiz');
  };

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-12 animate-fade-in">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl gradient-primary mb-4 shadow-lg">
            <BookOpen className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
            AI基础A复习题库
          </h1>
          <p className="text-gray-600 text-lg">
            共205道精选题目，助力高效备考
          </p>
        </header>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 card-shadow hover:card-shadow-hover transition-shadow duration-300 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm mb-1">题目总数</p>
                <p className="text-3xl font-bold text-primary-600">{questions.length}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-primary-100 flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-primary-600" />
              </div>
            </div>
            <div className="mt-4 flex gap-4 text-sm">
              <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full">选择题 {choiceCount}</span>
              <span className="px-3 py-1 bg-purple-50 text-purple-600 rounded-full">填空题 {fillCount}</span>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl p-6 card-shadow hover:card-shadow-hover transition-shadow duration-300 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm mb-1">答题进度</p>
                <p className="text-3xl font-bold text-success-500">{progress.current}/{progress.total}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-success-100 flex items-center justify-center">
                <Target className="w-6 h-6 text-success-500" />
              </div>
            </div>
            <div className="mt-4">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-success-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${progress.percentage}%` }}
                />
              </div>
              <p className="text-gray-500 text-xs mt-2 text-right">{progress.percentage}%</p>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl p-6 card-shadow hover:card-shadow-hover transition-shadow duration-300 animate-slide-up" style={{ animationDelay: '0.3s' }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm mb-1">正确率</p>
                <p className="text-3xl font-bold text-primary-600">{stats.accuracy}%</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-primary-100 flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-primary-600" />
              </div>
            </div>
            <div className="mt-4 flex gap-4 text-sm">
              <span className="text-success-600">✓ 正确 {stats.correct}</span>
              <span className="text-error-600">✗ 错误 {stats.wrong}</span>
            </div>
            {stats.totalTime > 0 && (
              <p className="text-gray-500 text-xs mt-2 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                累计用时 {formatTime(stats.totalTime)}
              </p>
            )}
          </div>
        </div>
        
        <div className="bg-white rounded-2xl p-8 card-shadow mb-8 animate-slide-up" style={{ animationDelay: '0.4s' }}>
          <h2 className="text-xl font-semibold text-gray-800 mb-6">选择答题模式</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <button
              onClick={() => handleStartQuiz('sequential')}
              className="group relative overflow-hidden rounded-xl p-6 border-2 border-primary-100 hover:border-primary-500 transition-all duration-300 hover:card-shadow-hover"
            >
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-xl gradient-primary flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Play className="w-7 h-7 text-white" />
                </div>
                <div className="text-left flex-1">
                  <h3 className="text-lg font-semibold text-gray-800 mb-1">顺序答题</h3>
                  <p className="text-gray-500 text-sm mb-3">按照题目编号顺序依次作答，适合系统复习</p>
                  <div className="flex items-center text-primary-600 text-sm font-medium">
                    开始答题 <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            </button>
            
            <button
              onClick={() => handleStartQuiz('random')}
              className="group relative overflow-hidden rounded-xl p-6 border-2 border-primary-100 hover:border-primary-500 transition-all duration-300 hover:card-shadow-hover"
            >
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-xl gradient-primary flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Shuffle className="w-7 h-7 text-white" />
                </div>
                <div className="text-left flex-1">
                  <h3 className="text-lg font-semibold text-gray-800 mb-1">随机答题</h3>
                  <p className="text-gray-500 text-sm mb-3">随机打乱题目顺序，模拟真实考试环境</p>
                  <div className="flex items-center text-primary-600 text-sm font-medium">
                    开始答题 <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            </button>
          </div>
        </div>
        
        <div className="bg-white/60 rounded-2xl p-6 animate-slide-up" style={{ animationDelay: '0.5s' }}>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">使用说明</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary-100 flex items-center justify-center flex-shrink-0">
                <span className="text-primary-600 font-bold">1</span>
              </div>
              <p className="text-gray-600">选择答题模式，开始答题之旅</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary-100 flex items-center justify-center flex-shrink-0">
                <span className="text-primary-600 font-bold">2</span>
              </div>
              <p className="text-gray-600">阅读题目，选择或输入答案</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary-100 flex items-center justify-center flex-shrink-0">
                <span className="text-primary-600 font-bold">3</span>
              </div>
              <p className="text-gray-600">提交后即时查看正误和解析</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary-100 flex items-center justify-center flex-shrink-0">
                <span className="text-primary-600 font-bold">4</span>
              </div>
              <p className="text-gray-600">完成后查看统计和错题回顾</p>
            </div>
          </div>
        </div>
        
        <footer className="text-center mt-12 text-gray-500 text-sm">
          <p>AI基础A在线答题系统 · 助力高效备考</p>
        </footer>
      </div>
    </div>
  );
}
