import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, RotateCcw } from 'lucide-react';

interface Question {
  id: number;
  question: string;
  options: string[];
  correct: number;
  explanation: string;
}

const QuizAboutSarah: React.FC = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [userAnswers, setUserAnswers] = useState<number[]>([]);

  const questions: Question[] = [
    {
      id: 1,
      question: "What's Sarah's favorite Bible verse?",
      options: [
        "Jeremiah 29:11",
        "Philippians 4:13", 
        "Psalm 23:1",
        "Proverbs 31:25"
      ],
      correct: 0,
      explanation: "Sarah loves Jeremiah 29:11 - 'For I know the plans I have for you...'"
    },
    {
      id: 2,
      question: "What makes Sarah happiest?",
      options: [
        "Shopping trips",
        "Quiet moments in prayer",
        "Adventure and new experiences",
        "Cozy nights at home"
      ],
      correct: 1,
      explanation: "Sarah finds her greatest joy in quiet moments with God 🙏"
    },
    {
      id: 3,
      question: "Sarah's biggest strength is her:",
      options: [
        "Sense of humor",
        "Kindness and compassion",
        "Intelligence",
        "Creativity"
      ],
      correct: 1,
      explanation: "Sarah's heart overflows with kindness for everyone she meets 💖"
    },
    {
      id: 4,
      question: "What's Sarah's dream for the future?",
      options: [
        "Travel the world",
        "Build a loving family rooted in faith",
        "Start her own business",
        "Write a book"
      ],
      correct: 1,
      explanation: "Sarah dreams of a beautiful family built on God's foundation 👨‍👩‍👧‍👦"
    },
    {
      id: 5,
      question: "Sarah's favorite way to spend a Sunday is:",
      options: [
        "Sleeping in",
        "Going to church and fellowship",
        "Watching movies",
        "Going out with friends"
      ],
      correct: 1,
      explanation: "Sunday worship and fellowship fill Sarah's heart with joy ⛪"
    }
  ];

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
  };

  const handleNextQuestion = () => {
    if (selectedAnswer === null) return;

    const newAnswers = [...userAnswers, selectedAnswer];
    setUserAnswers(newAnswers);

    if (selectedAnswer === questions[currentQuestion].correct) {
      setScore(score + 1);
    }

    setShowResult(true);
    
    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer(null);
        setShowResult(false);
      } else {
        setQuizCompleted(true);
      }
    }, 3000);
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setScore(0);
    setQuizCompleted(false);
    setUserAnswers([]);
  };

  const getScoreMessage = () => {
    const percentage = (score / questions.length) * 100;
    if (percentage === 100) return "Perfect! You know Sarah so well! 🎉";
    if (percentage >= 80) return "Excellent! You really pay attention! 😊";
    if (percentage >= 60) return "Good job! You know Sarah pretty well! 👍";
    return "Keep getting to know the wonderful Sarah! 💕";
  };

  return (
    <section className="py-8" id="quiz">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="max-w-2xl mx-auto"
      >
        <h2 className="text-3xl md:text-4xl font-serif font-bold text-purple-800 text-center mb-8">
          How Well Do You Know Sarah? 🤔
        </h2>

        {!quizCompleted ? (
          <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
            <div className="mb-6">
              <div className="flex justify-between items-center mb-4">
                <span className="text-sm text-purple-600">
                  Question {currentQuestion + 1} of {questions.length}
                </span>
                <span className="text-sm text-purple-600">
                  Score: {score}/{currentQuestion + (showResult ? 1 : 0)}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-pink-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${((currentQuestion + (showResult ? 1 : 0)) / questions.length) * 100}%` }}
                />
              </div>
            </div>

            <AnimatePresence mode="wait">
              {!showResult ? (
                <motion.div
                  key={`question-${currentQuestion}`}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <h3 className="text-xl font-semibold text-gray-800 mb-6">
                    {questions[currentQuestion].question}
                  </h3>
                  
                  <div className="space-y-3">
                    {questions[currentQuestion].options.map((option, index) => (
                      <button
                        key={index}
                        onClick={() => handleAnswerSelect(index)}
                        className={`w-full p-4 text-left rounded-lg border-2 transition-all duration-200 ${
                          selectedAnswer === index
                            ? 'border-purple-500 bg-purple-50 text-purple-800'
                            : 'border-gray-200 hover:border-purple-300 hover:bg-gray-50'
                        }`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={handleNextQuestion}
                    disabled={selectedAnswer === null}
                    className={`w-full mt-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
                      selectedAnswer !== null
                        ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white hover:from-pink-600 hover:to-purple-600'
                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    {currentQuestion === questions.length - 1 ? 'Finish Quiz' : 'Next Question'}
                  </button>
                </motion.div>
              ) : (
                <motion.div
                  key={`result-${currentQuestion}`}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  className="text-center"
                >
                  {selectedAnswer === questions[currentQuestion].correct ? (
                    <div className="text-green-600">
                      <CheckCircle className="h-16 w-16 mx-auto mb-4" />
                      <h3 className="text-2xl font-bold mb-2">Correct! 🎉</h3>
                    </div>
                  ) : (
                    <div className="text-red-500">
                      <XCircle className="h-16 w-16 mx-auto mb-4" />
                      <h3 className="text-2xl font-bold mb-2">Not quite 😊</h3>
                    </div>
                  )}
                  
                  <p className="text-gray-700 text-lg">
                    {questions[currentQuestion].explanation}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-xl shadow-lg p-6 md:p-8 text-center"
          >
            <h3 className="text-3xl font-bold text-purple-800 mb-4">
              Quiz Complete! 🎊
            </h3>
            
            <div className="text-6xl mb-4">
              {score === questions.length ? '🏆' : score >= questions.length * 0.8 ? '🌟' : '👍'}
            </div>
            
            <p className="text-2xl font-semibold text-gray-800 mb-2">
              You scored {score} out of {questions.length}
            </p>
            
            <p className="text-lg text-purple-600 mb-6">
              {getScoreMessage()}
            </p>
            
            <button
              onClick={resetQuiz}
              className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-6 py-3 rounded-lg font-semibold hover:from-pink-600 hover:to-purple-600 transition-all duration-200 flex items-center justify-center mx-auto"
            >
              <RotateCcw className="h-5 w-5 mr-2" />
              Take Quiz Again
            </button>
          </motion.div>
        )}
      </motion.div>
    </section>
  );
};

export default QuizAboutSarah;