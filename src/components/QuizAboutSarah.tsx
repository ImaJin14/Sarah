import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, RotateCcw, User, Calendar, Clock, Trophy, TrendingUp } from 'lucide-react';
import { collection, addDoc, getDocs, orderBy, query, limit } from 'firebase/firestore';
import { db } from '../main'; // You'll need to configure this

interface Question {
  id: number;
  question: string;
  options: string[];
  correct: number;
  explanation: string;
}

interface QuizResult {
  id?: string;
  userName: string;
  score: number;
  totalQuestions: number;
  percentage: number;
  completedAt: Date;
  answers: { questionId: number; userAnswer: number; correct: boolean }[];
  timeSpent?: number; // in seconds
}

const QuizAboutSarah: React.FC = () => {
  const [userName, setUserName] = useState('');
  const [quizStarted, setQuizStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [userAnswers, setUserAnswers] = useState<number[]>([]);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [saving, setSaving] = useState(false);
  const [allResults, setAllResults] = useState<QuizResult[]>([]);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [loadingResults, setLoadingResults] = useState(false);

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
      question: "Sarah's favorite Colour is:",
      options: [
        "Red",
        "Blue",
        "Purple",
        "black"
      ],
      correct: 3,
      explanation: "Sarah loves black not because its dark, but because it's bold, refined, protective, empowering, versatile, and expressive - Just like her! 🖤"
    }
  ];

  // Load results on component mount
  useEffect(() => {
    loadResults();
  }, []);

  const loadResults = async () => {
    setLoadingResults(true);
    try {
      const q = query(
        collection(db, 'quizResults'), 
        orderBy('completedAt', 'desc'), 
        limit(20)
      );
      const querySnapshot = await getDocs(q);
      const results: QuizResult[] = [];
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        results.push({
          id: doc.id,
          ...data,
          completedAt: data.completedAt.toDate(), // Convert Firestore timestamp
        } as QuizResult);
      });
      
      setAllResults(results);
    } catch (error) {
      console.error('Error loading results:', error);
    }
    setLoadingResults(false);
  };

  const saveResultToFirestore = async (result: QuizResult) => {
    setSaving(true);
    try {
      const docRef = await addDoc(collection(db, 'quizResults'), {
        ...result,
        completedAt: result.completedAt, // Firestore will handle the timestamp
      });
      
      // Add the new result to local state
      const newResult = { ...result, id: docRef.id };
      setAllResults(prev => [newResult, ...prev.slice(0, 19)]); // Keep only top 20
      
      console.log('Result saved with ID: ', docRef.id);
    } catch (error) {
      console.error('Error saving result:', error);
    }
    setSaving(false);
  };

  const startQuiz = () => {
    if (userName.trim()) {
      setQuizStarted(true);
      setStartTime(new Date());
    }
  };

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
  };

  const handleNextQuestion = () => {
    if (selectedAnswer === null) return;

    const newAnswers = [...userAnswers, selectedAnswer];
    setUserAnswers(newAnswers);

    const isCorrect = selectedAnswer === questions[currentQuestion].correct;
    const newScore = isCorrect ? score + 1 : score;
    
    if (isCorrect) {
      setScore(newScore);
    }

    setShowResult(true);
    
    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer(null);
        setShowResult(false);
      } else {
        completeQuiz(newScore, newAnswers);
      }
    }, 3000);
  };

  const completeQuiz = async (finalScore: number, answers: number[]) => {
    const endTime = new Date();
    const timeSpent = startTime ? Math.round((endTime.getTime() - startTime.getTime()) / 1000) : 0;
    
    const result: QuizResult = {
      userName,
      score: finalScore,
      totalQuestions: questions.length,
      percentage: Math.round((finalScore / questions.length) * 100),
      completedAt: endTime,
      timeSpent,
      answers: answers.map((answer, index) => ({
        questionId: questions[index].id,
        userAnswer: answer,
        correct: answer === questions[index].correct
      }))
    };

    await saveResultToFirestore(result);
    setQuizCompleted(true);
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setScore(0);
    setQuizCompleted(false);
    setUserAnswers([]);
    setQuizStarted(false);
    setUserName('');
    setStartTime(null);
    setShowLeaderboard(false);
  };

  const getScoreMessage = () => {
    const percentage = (score / questions.length) * 100;
    if (percentage === 100) return `Perfect! ${userName}, you know Sarah so well! 🎉`;
    if (percentage >= 80) return `Excellent! ${userName}, you really pay attention! 😊`;
    if (percentage >= 60) return `Good job! ${userName}, you know Sarah pretty well! 👍`;
    return `Keep getting to know the wonderful Sarah, ${userName}! 💕`;
  };

  const formatDateTime = (date: Date) => {
    return {
      date: date.toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      }),
      time: date.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        second: '2-digit'
      })
    };
  };

  const formatTimeSpent = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return minutes > 0 ? `${minutes}m ${remainingSeconds}s` : `${remainingSeconds}s`;
  };

  const getTopScorers = () => {
    return allResults
      .sort((a, b) => b.percentage - a.percentage || a.timeSpent! - b.timeSpent!)
      .slice(0, 10);
  };

  return (
    <section className="py-8" id="quiz">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="max-w-4xl mx-auto"
      >
        <h2 className="text-3xl md:text-4xl font-serif font-bold text-purple-800 text-center mb-8">
          How Well Do You Know Sarah? 🤔
        </h2>

        {/* Name Input Screen */}
        {!quizStarted && (
          <div className="grid md:grid-cols-2 gap-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-xl shadow-lg p-6 md:p-8 text-center"
            >
              <User className="h-16 w-16 mx-auto mb-4 text-purple-600" />
              <h3 className="text-2xl font-bold text-gray-800 mb-4">
                Welcome to Sarah's Quiz! 👋
              </h3>
              <p className="text-gray-600 mb-6">
                Please enter your name to get started
              </p>
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="Enter your name"
                className="w-full p-4 border-2 border-gray-200 rounded-lg text-center text-lg focus:border-purple-500 focus:outline-none mb-4"
                onKeyPress={(e) => e.key === 'Enter' && startQuiz()}
              />
              <button
                onClick={startQuiz}
                disabled={!userName.trim()}
                className={`w-full py-3 rounded-lg font-semibold transition-all duration-200 mb-4 ${
                  userName.trim()
                    ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white hover:from-pink-600 hover:to-purple-600'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                Start Quiz
              </button>
              
              <button
                onClick={() => setShowLeaderboard(!showLeaderboard)}
                className="w-full py-2 text-purple-600 hover:text-purple-800 font-medium"
              >
                <TrendingUp className="h-4 w-4 inline mr-2" />
                {showLeaderboard ? 'Hide' : 'View'} Recent Results
              </button>
            </motion.div>

            {/* Recent Results Display */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white rounded-xl shadow-lg p-6"
            >
              <h4 className="text-xl font-bold text-purple-800 mb-4 flex items-center">
                <Trophy className="h-5 w-5 mr-2" />
                Top Performers
              </h4>
              
              {loadingResults ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500 mx-auto"></div>
                  <p className="text-gray-500 mt-2">Loading results...</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {getTopScorers().slice(0, 5).map((result, index) => (
                    <div key={result.id} className="flex items-center justify-between p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg">
                      <div className="flex items-center">
                        <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold mr-3 ${
                          index === 0 ? 'bg-yellow-400 text-yellow-800' :
                          index === 1 ? 'bg-gray-300 text-gray-700' :
                          index === 2 ? 'bg-amber-600 text-white' :
                          'bg-purple-200 text-purple-700'
                        }`}>
                          {index + 1}
                        </span>
                        <div>
                          <p className="font-semibold text-gray-800">{result.userName}</p>
                          <p className="text-xs text-gray-500">
                            {formatDateTime(result.completedAt).date}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-purple-600">{result.percentage}%</p>
                        <p className="text-xs text-gray-500">
                          {result.timeSpent ? formatTimeSpent(result.timeSpent) : 'N/A'}
                        </p>
                      </div>
                    </div>
                  ))}
                  
                  {allResults.length === 0 && (
                    <p className="text-center text-gray-500 py-4">
                      No results yet. Be the first to take the quiz! 🌟
                    </p>
                  )}
                </div>
              )}
              
              {showLeaderboard && allResults.length > 5 && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <h5 className="font-semibold text-gray-700 mb-3">All Recent Results</h5>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {allResults.slice(5).map((result) => (
                      <div key={result.id} className="flex justify-between items-center p-2 hover:bg-gray-50 rounded">
                        <div>
                          <span className="font-medium">{result.userName}</span>
                          <span className="text-sm text-gray-500 ml-2">
                            {formatDateTime(result.completedAt).time}
                          </span>
                        </div>
                        <span className="font-semibold text-purple-600">
                          {result.percentage}%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}

        {/* Quiz Content */}
        {quizStarted && !quizCompleted && (
          <div className="max-w-2xl mx-auto">
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
          </div>
        )}

        {/* Final Results */}
        {quizCompleted && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-6 md:p-8 text-center"
          >
            <h3 className="text-3xl font-bold text-purple-800 mb-4">
              Quiz Complete! 🎊
            </h3>
            
            <div className="text-6xl mb-4">
              {score === questions.length ? '🏆' : score >= questions.length * 0.8 ? '🌟' : '👍'}
            </div>
            
            {saving && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mx-auto mb-2"></div>
                <p className="text-blue-600">Saving your results...</p>
              </div>
            )}
            
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-6 mb-6">
              <h4 className="font-bold text-lg text-purple-800 mb-3 flex items-center justify-center">
                <User className="h-5 w-5 mr-2" />
                {userName}'s Results
              </h4>
              
              <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-600 mb-4">
                <div className="flex items-center justify-center">
                  <Calendar className="h-4 w-4 mr-2" />
                  {formatDateTime(new Date()).date}
                </div>
                <div className="flex items-center justify-center">
                  <Clock className="h-4 w-4 mr-2" />
                  {formatDateTime(new Date()).time}
                </div>
              </div>
              
              <p className="text-2xl font-semibold text-gray-800 mb-2">
                You scored {score} out of {questions.length} ({Math.round((score / questions.length) * 100)}%)
              </p>
              
              {startTime && (
                <p className="text-sm text-gray-600">
                  Time spent: {formatTimeSpent(Math.round((new Date().getTime() - startTime.getTime()) / 1000))}
                </p>
              )}
            </div>
            
            <p className="text-lg text-purple-600 mb-6">
              {getScoreMessage()}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={resetQuiz}
                className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-6 py-3 rounded-lg font-semibold hover:from-pink-600 hover:to-purple-600 transition-all duration-200 flex items-center justify-center"
              >
                <RotateCcw className="h-5 w-5 mr-2" />
                Take Quiz Again
              </button>
              
              <button
                onClick={loadResults}
                className="bg-white border-2 border-purple-500 text-purple-500 px-6 py-3 rounded-lg font-semibold hover:bg-purple-50 transition-all duration-200 flex items-center justify-center"
              >
                <TrendingUp className="h-5 w-5 mr-2" />
                Refresh Results
              </button>
            </div>
          </motion.div>
        )}
      </motion.div>
    </section>
  );
};

export default QuizAboutSarah;