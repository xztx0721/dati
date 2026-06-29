import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import questionsData from '../../questions.json';

export interface Question {
  id: number;
  content: string;
  options: string[];
  answer: string;
  analysis: string;
  type: 'choice' | 'fill';
}

export interface AnswerRecord {
  questionId: number;
  userAnswer: string;
  isCorrect: boolean;
}

export interface QuizState {
  questions: Question[];
  originalQuestions: Question[];
  currentIndex: number;
  mode: 'sequential' | 'random';
  userAnswers: AnswerRecord[];
  selectedAnswer: string;
  showResult: boolean;
  startTime: number;
  endTime: number;
  isRetryWrong: boolean;
  
  setMode: (mode: 'sequential' | 'random') => void;
  startQuiz: () => void;
  retryWrongQuestions: () => void;
  setSelectedAnswer: (answer: string) => void;
  submitAnswer: () => void;
  goToQuestion: (index: number) => void;
  nextQuestion: () => void;
  prevQuestion: () => void;
  skipQuestion: () => void;
  finishQuiz: () => void;
  resetQuiz: () => void;
  getCurrentQuestion: () => Question | null;
  getProgress: () => { current: number; total: number; percentage: number };
  getStats: () => { correct: number; wrong: number; accuracy: number; totalTime: number };
  getWrongQuestions: () => (Question & { userAnswer: string })[];
}

const shuffleArray = <T>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

export const useQuizStore = create<QuizState>()(
  persist(
    (set, get) => ({
      questions: questionsData as Question[],
      originalQuestions: questionsData as Question[],
      currentIndex: 0,
      mode: 'sequential',
      userAnswers: [],
      selectedAnswer: '',
      showResult: false,
      startTime: 0,
      endTime: 0,
      isRetryWrong: false,

      setMode: (mode) => {
        set({ mode });
      },

      startQuiz: () => {
        const { mode, originalQuestions } = get();
        let shuffledQuestions = [...originalQuestions];
        if (mode === 'random') {
          shuffledQuestions = shuffleArray(originalQuestions);
        }
        set({
          questions: shuffledQuestions,
          currentIndex: 0,
          userAnswers: [],
          selectedAnswer: '',
          showResult: false,
          startTime: Date.now(),
          isRetryWrong: false,
        });
      },

      retryWrongQuestions: () => {
        const { originalQuestions, userAnswers } = get();
        const wrongIds = userAnswers.filter(a => !a.isCorrect).map(a => a.questionId);
        const wrongQuestions = originalQuestions.filter(q => wrongIds.includes(q.id));
        
        set({
          questions: wrongQuestions,
          currentIndex: 0,
          userAnswers: [],
          selectedAnswer: '',
          showResult: false,
          startTime: Date.now(),
          isRetryWrong: true,
        });
      },

      setSelectedAnswer: (answer) => {
        set({ selectedAnswer: answer });
      },

      submitAnswer: () => {
        const { questions, currentIndex, selectedAnswer, userAnswers } = get();
        const currentQuestion = questions[currentIndex];
        
        if (!selectedAnswer.trim()) return;

        const isCorrect = selectedAnswer.trim().toLowerCase() === currentQuestion.answer.toLowerCase();
        
        const newAnswer: AnswerRecord = {
          questionId: currentQuestion.id,
          userAnswer: selectedAnswer.trim(),
          isCorrect,
        };

        set({
          userAnswers: [...userAnswers, newAnswer],
          showResult: true,
        });
      },

      goToQuestion: (index) => {
        const { questions } = get();
        if (index >= 0 && index < questions.length) {
          const existingAnswer = get().userAnswers.find(
            (a) => a.questionId === questions[index].id
          );
          set({
            currentIndex: index,
            selectedAnswer: existingAnswer?.userAnswer || '',
            showResult: !!existingAnswer,
          });
        }
      },

      nextQuestion: () => {
        const { questions, currentIndex, userAnswers } = get();
        if (currentIndex < questions.length - 1) {
          const nextQuestion = questions[currentIndex + 1];
          const existingAnswer = userAnswers.find((a) => a.questionId === nextQuestion.id);
          set({
            currentIndex: currentIndex + 1,
            selectedAnswer: existingAnswer?.userAnswer || '',
            showResult: !!existingAnswer,
          });
        }
      },

      prevQuestion: () => {
        const { questions, currentIndex, userAnswers } = get();
        if (currentIndex > 0) {
          const prevQuestion = questions[currentIndex - 1];
          const existingAnswer = userAnswers.find((a) => a.questionId === prevQuestion.id);
          set({
            currentIndex: currentIndex - 1,
            selectedAnswer: existingAnswer?.userAnswer || '',
            showResult: !!existingAnswer,
          });
        }
      },

      skipQuestion: () => {
        const { questions, currentIndex, userAnswers } = get();
        if (currentIndex < questions.length - 1) {
          const nextQuestion = questions[currentIndex + 1];
          const existingAnswer = userAnswers.find((a) => a.questionId === nextQuestion.id);
          set({
            currentIndex: currentIndex + 1,
            selectedAnswer: existingAnswer?.userAnswer || '',
            showResult: !!existingAnswer,
          });
        }
      },

      finishQuiz: () => {
        set({
          endTime: Date.now(),
          showResult: true,
        });
      },

      resetQuiz: () => {
        set({
          questions: questionsData as Question[],
          currentIndex: 0,
          userAnswers: [],
          selectedAnswer: '',
          showResult: false,
          startTime: 0,
          endTime: 0,
        });
      },

      getCurrentQuestion: () => {
        const { questions, currentIndex } = get();
        return questions[currentIndex] || null;
      },

      getProgress: () => {
        const { questions, currentIndex, userAnswers } = get();
        return {
          current: userAnswers.length,
          total: questions.length,
          percentage: Math.round((userAnswers.length / questions.length) * 100),
        };
      },

      getStats: () => {
        const { userAnswers, startTime, endTime } = get();
        const correct = userAnswers.filter((a) => a.isCorrect).length;
        const wrong = userAnswers.filter((a) => !a.isCorrect).length;
        const totalTime = endTime > startTime ? (endTime - startTime) / 1000 : 0;
        
        return {
          correct,
          wrong,
          accuracy: userAnswers.length > 0 ? Math.round((correct / userAnswers.length) * 100) : 0,
          totalTime,
        };
      },

      getWrongQuestions: () => {
        const { questions, userAnswers } = get();
        const wrongAnswers = userAnswers.filter((a) => !a.isCorrect);
        
        return wrongAnswers.map((answer) => {
          const question = questions.find((q) => q.id === answer.questionId);
          return question ? { ...question, userAnswer: answer.userAnswer } : null;
        }).filter((q): q is Question & { userAnswer: string } => q !== null);
      },
    }),
    {
      name: 'quiz-storage',
      partialize: (state) => ({
        mode: state.mode,
        userAnswers: state.userAnswers,
      }),
    }
  )
);
