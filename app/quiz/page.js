'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ArrowLeft, Sparkles, Check } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const quizQuestions = [
    {
        id: 1,
        question: "What's your ideal way to unwind after a long day?",
        options: [
            { text: "Reading a book with a warm beverage", scent: "Vanilla & Amber" },
            { text: "Taking a relaxing bath", scent: "Lavender & Eucalyptus" },
            { text: "Meditation or yoga", scent: "Sandalwood & Jasmine" },
            { text: "Watching movies or shows", scent: "Cinnamon & Orange" }
        ]
    },
    {
        id: 2,
        question: "Which season resonates with you the most?",
        options: [
            { text: "Spring - Fresh & Blooming", scent: "Rose & Peony" },
            { text: "Summer - Bright & Energetic", scent: "Citrus & Mint" },
            { text: "Autumn - Warm & Cozy", scent: "Pumpkin Spice" },
            { text: "Winter - Calm & Serene", scent: "Pine & Cedar" }
        ]
    },
    {
        id: 3,
        question: "What type of fragrance do you prefer?",
        options: [
            { text: "Floral & Sweet", scent: "Jasmine & Honey" },
            { text: "Fresh & Clean", scent: "Ocean Breeze" },
            { text: "Woody & Earthy", scent: "Sandalwood & Musk" },
            { text: "Spicy & Warm", scent: "Cinnamon & Clove" }
        ]
    },
    {
        id: 4,
        question: "When do you usually light candles?",
        options: [
            { text: "Morning - To start the day fresh", scent: "Lemon & Ginger" },
            { text: "Afternoon - During work or study", scent: "Peppermint & Rosemary" },
            { text: "Evening - To relax and unwind", scent: "Lavender & Chamomile" },
            { text: "Night - Before bedtime", scent: "Vanilla & Tonka Bean" }
        ]
    },
    {
        id: 5,
        question: "What's your ideal home ambiance?",
        options: [
            { text: "Minimalist & Modern", scent: "White Tea & Sage" },
            { text: "Cozy & Traditional", scent: "Apple Cider & Cinnamon" },
            { text: "Bohemian & Artistic", scent: "Patchouli & Amber" },
            { text: "Luxurious & Elegant", scent: "Oud & Rose" }
        ]
    }
];

const scentRecommendations = {
    "Vanilla & Amber": { product: "First Light", id: 901, description: "Warm and comforting, perfect for cozy evenings" },
    "Lavender & Eucalyptus": { product: "Rich Lavender", id: 902, description: "Calming and soothing for ultimate relaxation" },
    "Sandalwood & Jasmine": { product: "Sacred Garden", id: 903, description: "Meditative and grounding for peaceful moments" },
    "Cinnamon & Orange": { product: "Spiced Citrus", id: 904, description: "Energizing and uplifting for vibrant spaces" },
    "Rose & Peony": { product: "Floral Bouquet", id: 801, description: "Fresh and romantic for spring vibes" },
    "Citrus & Mint": { product: "Summer Breeze", id: 905, description: "Refreshing and invigorating" },
    "Pumpkin Spice": { product: "Autumn Glow", id: 906, description: "Warm and nostalgic for fall lovers" },
    "Pine & Cedar": { product: "Winter Woods", id: 907, description: "Crisp and serene for winter nights" }
};

export default function QuizPage() {
    const router = useRouter();
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState([]);
    const [showResults, setShowResults] = useState(false);
    const [selectedScent, setSelectedScent] = useState(null);

    const handleAnswer = (option) => {
        const newAnswers = [...answers, option.scent];
        setAnswers(newAnswers);

        if (currentQuestion < quizQuestions.length - 1) {
            setTimeout(() => {
                setCurrentQuestion(currentQuestion + 1);
            }, 300);
        } else {
            // Calculate most common scent preference
            const scentCounts = {};
            newAnswers.forEach(scent => {
                scentCounts[scent] = (scentCounts[scent] || 0) + 1;
            });
            const topScent = Object.keys(scentCounts).reduce((a, b) =>
                scentCounts[a] > scentCounts[b] ? a : b
            );
            setSelectedScent(topScent);
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
        setSelectedScent(null);
    };

    const progress = ((currentQuestion + 1) / quizQuestions.length) * 100;

    return (
        <div className="quiz-page" style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #fdfbf7 0%, #f6f0e6 100%)', paddingTop: '120px', paddingBottom: '80px' }}>
            <div className="container" style={{ maxWidth: '900px', margin: '0 auto', padding: '0 20px' }}>
                {!showResults ? (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        style={{ background: '#fff', borderRadius: '30px', padding: '60px', boxShadow: '0 30px 80px rgba(0,0,0,0.08)' }}
                    >
                        {/* Header */}
                        <div style={{ textAlign: 'center', marginBottom: '50px' }}>
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
                        <div style={{ marginBottom: '50px' }}>
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
                                <h2 style={{ fontSize: '1.8rem', marginBottom: '40px', textAlign: 'center', color: '#1a1a1a' }}>
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
                        <div style={{ marginTop: '50px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
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
                        style={{ background: '#fff', borderRadius: '30px', padding: '60px', boxShadow: '0 30px 80px rgba(0,0,0,0.08)', textAlign: 'center' }}
                    >
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: 'spring', delay: 0.2 }}
                        >
                            <Check size={80} color="var(--color-accent)" style={{ marginBottom: '30px' }} />
                        </motion.div>
                        <h2 style={{ fontSize: '2.5rem', marginBottom: '20px' }}>
                            Your Perfect Match: <span style={{ color: 'var(--color-accent)' }}>{selectedScent}</span>
                        </h2>
                        <p style={{ fontSize: '1.2rem', color: '#666', marginBottom: '40px', lineHeight: '1.8' }}>
                            {scentRecommendations[selectedScent]?.description || "A unique fragrance crafted just for you"}
                        </p>

                        <div style={{ background: '#fafafa', padding: '40px', borderRadius: '20px', marginBottom: '40px' }}>
                            <h3 style={{ fontSize: '1.5rem', marginBottom: '15px', color: '#333' }}>
                                Recommended Product
                            </h3>
                            <p style={{ fontSize: '1.8rem', fontWeight: '700', color: 'var(--color-accent)', marginBottom: '10px' }}>
                                {scentRecommendations[selectedScent]?.product || "Signature Candle"}
                            </p>
                            <p style={{ fontSize: '1rem', color: '#666' }}>
                                Handcrafted with premium ingredients
                            </p>
                        </div>

                        <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap' }}>
                            <Link href="/shop">
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
                                        gap: '10px'
                                    }}
                                >
                                    Shop Now <ArrowRight size={20} />
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
