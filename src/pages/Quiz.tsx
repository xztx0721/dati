import { useQuizStore } from '@/store/quizStore';
import { ArrowLeft, ArrowRight, CheckCircle, XCircle, Lightbulb, Home, ChevronLeft, ChevronRight, SkipForward } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Quiz() {
  const {
    questions,
    currentIndex,
    selectedAnswer,
    showResult,
    userAnswers,
    getCurrentQuestion,
    getProgress,
    setSelectedAnswer,
    submitAnswer,
    nextQuestion,
    prevQuestion,
    skipQuestion,
    goToQuestion,
    finishQuiz,
  } = useQuizStore();
  
  const navigate = useNavigate();
  const [timeElapsed, setTimeElapsed] = useState(0);
  
  const currentQuestion = getCurrentQuestion();
  const progress = getProgress();
  
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeElapsed((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  const getQuestionResult = () => {
    if (!currentQuestion || !showResult) return null;
    const answer = userAnswers.find((a) => a.questionId === currentQuestion.id);
    return answer;
  };
  
  const questionResult = getQuestionResult();
  
  const handleSubmit = () => {
    if (selectedAnswer.trim()) {
      submitAnswer();
    }
  };
  
  const handleFinish = () => {
    finishQuiz();
    navigate('/result');
  };
  
  const isLastQuestion = currentIndex === questions.length - 1;
  const isFirstQuestion = currentIndex === 0;
  
  if (!currentQuestion) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
            <Home className="w-8 h-8 text-gray-400" />
          </div>
          <p className="text-gray-500">暂无题目，请返回首页开始答题</p>
          <button
            onClick={() => navigate('/')}
            className="mt-4 px-6 py-2 gradient-primary text-white rounded-lg hover:opacity-90 transition-opacity"
          >
            返回首页
          </button>
        </div>
      </div>
    );
  }
  
  const handleOptionClick = (option: string) => {
    if (!showResult) {
      setSelectedAnswer(option.substring(0, 1));
    }
  };
  
  const getOptionClass = (option: string) => {
    const optionKey = option.substring(0, 1);
    if (!showResult) {
      return selectedAnswer === optionKey
        ? 'option-selected option-hover'
        : 'option-hover';
    }
    
    const isCorrectOption = optionKey === currentQuestion.answer;
    const isSelectedOption = selectedAnswer === optionKey;
    
    if (isCorrectOption) return 'option-correct';
    if (isSelectedOption && !isCorrectOption) return 'option-wrong';
    return 'option-hover opacity-60';
  };
  
  const handleFillInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!showResult) {
      setSelectedAnswer(e.target.value);
    }
  };
  
  return (
    <div className="min-h-screen py-6 px-4">
      <div className="max-w-3xl mx-auto">
        <header className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-gray-600 hover:text-primary-600 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="hidden sm:inline">返回首页</span>
          </button>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full card-shadow">
              <div className="w-2 h-2 rounded-full bg-success-500" />
              <span className="text-sm font-medium text-gray-700">{formatTime(timeElapsed)}</span>
            </div>
          </div>
        </header>
        
        <div className="bg-white rounded-2xl p-6 card-shadow mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 bg-primary-100 text-primary-600 rounded-full text-sm font-medium">
                第 {currentIndex + 1}/{questions.length} 题
              </span>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                currentQuestion.type === 'choice' 
                  ? 'bg-blue-50 text-blue-600' 
                  : 'bg-purple-50 text-purple-600'
              }`}>
                {currentQuestion.type === 'choice' ? '选择题' : '填空题'}
              </span>
            </div>
            <span className="text-gray-400 text-sm">题目编号: {currentQuestion.id}</span>
          </div>
          
          <div className="w-full bg-gray-100 rounded-full h-2 mb-6">
            <div
              className="bg-primary-600 h-2 rounded-full transition-all duration-500"
              style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
            />
          </div>
          
          <h2 className="text-xl font-semibold text-gray-800 mb-6 leading-relaxed">
            {currentQuestion.content}
          </h2>
          
          {currentQuestion.type === 'choice' ? (
            <div className="space-y-3">
              {currentQuestion.options.map((option) => (
                <button
                  key={option}
                  onClick={() => handleOptionClick(option)}
                  disabled={showResult}
                  className={`w-full p-4 rounded-xl border-2 text-left transition-all duration-200 flex items-center gap-4 ${getOptionClass(option)} ${
                    showResult ? 'cursor-default' : 'cursor-pointer'
                  }`}
                >
                  <span className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold ${
                    selectedAnswer === option.substring(0, 1) && !showResult
                      ? 'bg-primary-600 text-white'
                      : questionResult?.isCorrect && option.substring(0, 1) === currentQuestion.answer
                      ? 'bg-success-500 text-white'
                      : questionResult && !questionResult.isCorrect && selectedAnswer === option.substring(0, 1)
                      ? 'bg-error-500 text-white'
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {option.substring(0, 1)}
                  </span>
                  <span className="flex-1">{option.substring(3)}</span>
                  {showResult && option.substring(0, 1) === currentQuestion.answer && (
                    <CheckCircle className="w-6 h-6 text-success-500" />
                  )}
                  {showResult && questionResult && !questionResult.isCorrect && selectedAnswer === option.substring(0, 1) && (
                    <XCircle className="w-6 h-6 text-error-500" />
                  )}
                </button>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="relative">
                <input
                  type="text"
                  value={selectedAnswer}
                  onChange={handleFillInput}
                  disabled={showResult}
                  placeholder="请输入答案..."
                  className={`w-full p-4 rounded-xl border-2 text-lg transition-all duration-200 ${
                    showResult
                      ? questionResult?.isCorrect
                        ? 'border-success-500 bg-success-50'
                        : 'border-error-500 bg-error-50'
                      : selectedAnswer
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100'
                  }`}
                />
              </div>
              
              {showResult && (
                <div className={`p-4 rounded-xl ${
                  questionResult?.isCorrect ? 'bg-success-50' : 'bg-error-50'
                }`}>
                  <div className="flex items-center gap-2 mb-2">
                    {questionResult?.isCorrect ? (
                      <CheckCircle className="w-5 h-5 text-success-500" />
                    ) : (
                      <XCircle className="w-5 h-5 text-error-500" />
                    )}
                    <span className={`font-medium ${
                      questionResult?.isCorrect ? 'text-success-600' : 'text-error-600'
                    }`}>
                      {questionResult?.isCorrect ? '回答正确！' : '回答错误'}
                    </span>
                  </div>
                  {!questionResult?.isCorrect && (
                    <p className="text-gray-600">
                      <span className="font-medium">正确答案：</span>
                      <span className="text-success-600 font-semibold">{currentQuestion.answer}</span>
                    </p>
                  )}
                </div>
              )}
            </div>
          )}
          
          {showResult && currentQuestion.analysis && (
            <div className="mt-6 p-4 bg-amber-50 rounded-xl animate-slide-up border border-amber-200">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center flex-shrink-0">
                  <Lightbulb className="w-4 h-4 text-amber-600" />
                </div>
                <div>
                  <h4 className="font-medium text-amber-800 mb-1">知识点解析</h4>
                  <p className="text-amber-700 text-sm leading-relaxed">
                    {currentQuestion.analysis}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
        
        <div className="bg-white rounded-2xl p-4 card-shadow mb-6">
          <div className="flex items-center justify-between">
            <button
              onClick={prevQuestion}
              disabled={isFirstQuestion}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                isFirstQuestion
                  ? 'text-gray-300 cursor-not-allowed'
                  : 'text-gray-600 hover:text-primary-600 hover:bg-gray-100'
              }`}
            >
              <ChevronLeft className="w-5 h-5" />
              <span>上一题</span>
            </button>
            
            <div className="flex items-center gap-3">
              {!showResult ? (
                <>
                  <button
                    onClick={handleSubmit}
                    disabled={!selectedAnswer.trim()}
                    className={`px-8 py-3 rounded-xl font-medium transition-all ${
                      selectedAnswer.trim()
                        ? 'gradient-primary text-white hover:opacity-90 hover:scale-105'
                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    提交答案
                  </button>
                  <button
                    onClick={skipQuestion}
                    disabled={isLastQuestion}
                    className={`flex items-center gap-2 px-4 py-3 rounded-xl font-medium transition-all ${
                      isLastQuestion
                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    <SkipForward className="w-5 h-5" />
                    跳过
                  </button>
                </>
              ) : isLastQuestion ? (
                <button
                  onClick={handleFinish}
                  className="px-8 py-3 rounded-xl font-medium gradient-primary text-white hover:opacity-90 hover:scale-105 transition-all"
                >
                  查看结果
                </button>
              ) : (
                <button
                  onClick={nextQuestion}
                  className="px-8 py-3 rounded-xl font-medium gradient-primary text-white hover:opacity-90 hover:scale-105 transition-all"
                >
                  下一题
                </button>
              )}
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-2xl p-4 card-shadow">
          <p className="text-sm text-gray-500 mb-3">题目导航</p>
          <div className="flex flex-wrap gap-2">
            {questions.map((_, index) => {
              const answer = userAnswers.find((a) => a.questionId === questions[index].id);
              return (
                <button
                  key={index}
                  onClick={() => goToQuestion(index)}
                  className={`w-8 h-8 rounded-lg text-sm font-medium transition-all ${
                    index === currentIndex
                      ? 'gradient-primary text-white'
                      : answer
                        ? answer.isCorrect
                          ? 'bg-success-100 text-success-600'
                          : 'bg-error-100 text-error-600'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {index + 1}
                </button>
              );
            })}
          </div>
        </div>
        
        <div className="mt-6 flex justify-center gap-4 text-sm">
          <span className="flex items-center gap-2">
            <span className="w-3 h-3 rounded bg-gray-100" />
            未答
          </span>
          <span className="flex items-center gap-2">
            <span className="w-3 h-3 rounded bg-success-100" />
            正确
          </span>
          <span className="flex items-center gap-2">
            <span className="w-3 h-3 rounded bg-error-100" />
            错误
          </span>
          <span className="flex items-center gap-2">
            <span className="w-3 h-3 rounded gradient-primary" />
            当前
          </span>
        </div>
      </div>
    </div>
  );
}
