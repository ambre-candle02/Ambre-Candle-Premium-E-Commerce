'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ArrowLeft, Sparkles, Check } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const quizQuestions = [
    {
        id: 1,
        question: "What's your primary reason for buying a candle today?",
        options: [
            { text: "Everyday relaxation and calm ambiance", category: "Glass Jar Candle" },
            { text: "To give as a premium gift to a loved one", category: "Hampers | Combo" },
            { text: "For adding aesthetic beauty to my room", category: "Bouquet Candle" },
            { text: "For an upcoming festival or celebration", category: "Diwali" }
        ]
    },
    {
        id: 2,
        question: "Which of these aesthetics appeals to you the most?",
        options: [
            { text: "Classic, minimalist, and elegant", category: "Glass Jar Candle" },
            { text: "Floral, romantic, and artistic", category: "Bouquet Candle" },
            { text: "Luxurious, grand, and unboxing-focused", category: "Hampers | Combo" },
            { text: "Bright, traditional, and colorful", category: "Diwali" }
        ]
    },
    {
        id: 3,
        question: "How do you prefer your fragrance experience?",
        options: [
            { text: "A steady, long-lasting classic scent", category: "Glass Jar Candle" },
            { text: "A mix of different complementary aromas", category: "Hampers | Combo" },
            { text: "Sweet, blooming, and floral notes", category: "Bouquet Candle" },
            { text: "Warm, rich, and festive spices", category: "Diwali" }
        ]
    },
    {
        id: 4,
        question: "If you were to describe your current mood, it would be:",
        options: [
            { text: "Joyful and ready to celebrate", category: "Diwali" },
            { text: "Generous and wanting to share joy", category: "Hampers | Combo" },
            { text: "Appreciative of art and delicate beauty", category: "Bouquet Candle" },
            { text: "Seeking peace, focus, and simplicity", category: "Glass Jar Candle" }
        ]
    }
];

const categoryRecommendations = {
    "Glass Jar Candle": { 
        title: "The Classic Glass Jars", 
        description: "Perfect for everyday elegance and long-lasting, steady relaxation.",
        path: "/categories/Glass Jar Candle"
    },
    "Bouquet Candle": { 
        title: "The Floral Bouquet Series", 
        description: "Beautifully carved floral aesthetics tailored for romantic and artistic decor.",
        path: "/categories/Bouquet Candle"
    },
    "Hampers | Combo": { 
        title: "The Luxury Hampers", 
        description: "A premium unboxing experience with multiple curated scents, perfect for gifting.",
        path: "/categories/Hampers | Combo"
    },
    "Diwali": { 
        title: "The Festive Collection", 
        description: "Bright, rich, and joyful candles crafted specifically to illuminate your celebrations.",
        path: "/categories/Diwali"
    }
};

export default function QuizPage() {
    const router = useRouter();
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState([]);
    const [showResults, setShowResults] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);

    const handleAnswer = (option) => {
        const newAnswers = [...answers, option.category];
        setAnswers(newAnswers);

        if (currentQuestion < quizQuestions.length - 1) {
            setTimeout(() => {
                setCurrentQuestion(currentQuestion + 1);
            }, 300);
        } else {
            // Intelligent Category Scoring Logic
            const categoryScores = {};
            newAnswers.forEach(cat => {
                categoryScores[cat] = (categoryScores[cat] || 0) + 1;
            });
            
            // Find the category with maximum points
            let topCategory = "Glass Jar Candle"; // Smart Fallback Default
            let maxScore = 0;
            
            for (const [cat, score] of Object.entries(categoryScores)) {
                if (score > maxScore) {
                    maxScore = score;
                    topCategory = cat;
                }
            }

            setSelectedCategory(topCategory);
            setTimeout(() => {
                setShowResults(true);
            }, 300);
        }
    };

    const handlePrevious = () => {
        if (currentQuestion > 0) {
            setCurrentQuestion(currentQuestion - 1);
            setAnswers(answers.slice(0, -1));
        }
    };

    const handleRestart = () => {
        setCurrentQuestion(0);
        setAnswers([]);
        setShowResults(false);
        setSelectedCategory(null);
    };

    const progress = ((currentQuestion + 1) / quizQuestions.length) * 100;

    return (
        <div className="quiz-page" style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #fdfbf7 0%, #f6f0e6 100%)', paddingTop: 'var(--quiz-padding-top, 150px)', paddingBottom: 'var(--quiz-padding-bottom, 80px)' }}>
            <div className="container" style={{ maxWidth: '900px', margin: '0 auto', padding: '0 20px' }}>
                {!showResults ? (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        style={{
                            background: '#fff',
                            borderRadius: '30px',
                            padding: 'var(--quiz-card-padding, 60px)',
                            boxShadow: '0 30px 80px rgba(0,0,0,0.08)',
                            border: '2px solid #d4af37'
                        }}
                    >
                        {/* Header */}
                        <div style={{ textAlign: 'center', marginBottom: 'var(--quiz-item-gap, 50px)' }}>
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: 'spring', delay: 0.2 }}
                                style={{ display: 'inline-block', marginBottom: '20px' }}
                            >
                                <Sparkles size={48} color="var(--color-accent)" />
                            </motion.div>
                            <h1 style={{ fontSize: '2.5rem', marginBottom: '15px' }}>
                                Find Your <span style={{ color: 'var(--color-accent)' }}>Scent Soulmate</span>
                            </h1>
                            <p style={{ fontSize: '1.1rem', color: '#666' }}>
                                Answer a few questions to discover your perfect candle match
                            </p>
                        </div>

                        {/* Progress Bar */}
                        <div style={{ marginBottom: 'var(--quiz-item-gap, 50px)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                                <span style={{ fontSize: '0.9rem', fontWeight: '600', color: '#333' }}>
                                    Question {currentQuestion + 1} of {quizQuestions.length}
                                </span>
                                <span style={{ fontSize: '0.9rem', fontWeight: '600', color: 'var(--color-accent)' }}>
                                    {Math.round(progress)}%
                                </span>
                            </div>
                            <div style={{ height: '8px', background: '#f0f0f0', borderRadius: '10px', overflow: 'hidden' }}>
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${progress}%` }}
                                    transition={{ duration: 0.5 }}
                                    style={{ height: '100%', background: 'linear-gradient(90deg, var(--color-accent) 0%, #d4a574 100%)', borderRadius: '10px' }}
                                />
                            </div>
                        </div>

                        {/* Question */}
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentQuestion}
                                initial={{ opacity: 0, x: 50 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -50 }}
                                transition={{ duration: 0.3 }}
                            >
                                <h2 style={{ fontSize: '1.8rem', marginBottom: 'var(--quiz-item-gap-small, 40px)', textAlign: 'center', color: '#1a1a1a' }}>
                                    {quizQuestions[currentQuestion].question}
                                </h2>

                                <div style={{ display: 'grid', gap: '20px' }}>
                                    {quizQuestions[currentQuestion].options.map((option, index) => (
                                        <motion.button
                                            key={index}
                                            onClick={() => handleAnswer(option)}
                                            whileHover={{ scale: 1.02, x: 10 }}
                                            whileTap={{ scale: 0.98 }}
                                            style={{
                                                padding: '25px 30px',
                                                background: '#fafafa',
                                                border: '2px solid #eee',
                                                borderRadius: '15px',
                                                fontSize: '1.05rem',
                                                fontWeight: '500',
                                                textAlign: 'left',
                                                cursor: 'pointer',
                                                transition: 'all 0.3s ease',
                                                color: '#333'
                                            }}
                                            onMouseEnter={(e) => {
                                                e.target.style.background = '#fff';
                                                e.target.style.borderColor = 'var(--color-accent)';
                                            }}
                                            onMouseLeave={(e) => {
                                                e.target.style.background = '#fafafa';
                                                e.target.style.borderColor = '#eee';
                                            }}
                                        >
                                            {option.text}
                                        </motion.button>
                                    ))}
                                </div>
                            </motion.div>
                        </AnimatePresence>

                        {/* Navigation */}
                        <div style={{ marginTop: 'var(--quiz-item-gap, 50px)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <button
                                onClick={handlePrevious}
                                disabled={currentQuestion === 0}
                                style={{
                                    padding: '12px 25px',
                                    background: currentQuestion === 0 ? '#f0f0f0' : '#fff',
                                    border: '2px solid #eee',
                                    borderRadius: '12px',
                                    fontSize: '0.95rem',
                                    fontWeight: '600',
                                    cursor: currentQuestion === 0 ? 'not-allowed' : 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    color: currentQuestion === 0 ? '#999' : '#333',
                                    opacity: currentQuestion === 0 ? 0.5 : 1
                                }}
                            >
                                <ArrowLeft size={18} /> Previous
                            </button>
                            <Link href="/" style={{ color: '#666', fontSize: '0.9rem', textDecoration: 'underline' }}>
                                Exit Quiz
                            </Link>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        style={{
                            background: '#fff',
                            borderRadius: '30px',
                            padding: '60px',
                            boxShadow: '0 30px 80px rgba(0,0,0,0.08)',
                            textAlign: 'center',
                            border: '2px solid #d4af37' // Consistency: Gold border for results too
                        }}
                    >
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: 'spring', delay: 0.2 }}
                        >
                            <Check size={80} color="var(--color-accent)" style={{ marginBottom: '30px' }} />
                        </motion.div>
                        <h2 style={{ fontSize: '2.5rem', margin: '0 0 20px 0', lineHeight: '1.2' }}>
                            Your Perfect Match:<br/>
                            <span style={{ color: 'var(--color-accent)' }}>{categoryRecommendations[selectedCategory]?.title || selectedCategory}</span>
                        </h2>
                        <p style={{ fontSize: '1.2rem', color: '#666', marginBottom: '40px', lineHeight: '1.8' }}>
                            {categoryRecommendations[selectedCategory]?.description || "A unique fragrance crafted just for you"}
                        </p>

                        <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap' }}>
                            <Link href={categoryRecommendations[selectedCategory]?.path || "/shop"}>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="btn-primary"
                                    style={{
                                        padding: '18px 40px',
                                        borderRadius: '12px',
                                        fontSize: '1rem',
                                        fontWeight: '600',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '10px',
                                        background: 'var(--color-accent)',
                                        color: '#fff',
                                        border: 'none',
                                        cursor: 'pointer'
                                    }}
                                >
                                    Explore Collection <ArrowRight size={20} />
                                </motion.button>
                            </Link>
                            <motion.button
                                onClick={handleRestart}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                style={{
                                    padding: '18px 40px',
                                    background: '#fff',
                                    border: '2px solid var(--color-accent)',
                                    color: 'var(--color-accent)',
                                    borderRadius: '12px',
                                    fontSize: '1rem',
                                    fontWeight: '600',
                                    cursor: 'pointer'
                                }}
                            >
                                Retake Quiz
                            </motion.button>
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
}
