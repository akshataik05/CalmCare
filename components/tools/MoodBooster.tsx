import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { ArrowLeft, Quote, Sparkles, Heart, CheckCircle2, MessageSquare } from 'lucide-react';
import type { StressDataHook } from '../../types';

interface MoodBoosterProps {
    onBack: () => void;
    stressDataHook?: StressDataHook;
}

const QUOTES = [
    { text: "Too often we underestimate the power of a touch, a smile, a kind word, a listening ear, an honest compliment, or the smallest act of caring, all of which have the potential to turn a life around.", author: "Leo Buscaglia" },
    { text: "Caring is the essence of nursing.", author: "Jean Watson" },
    { text: "The character of the nurse is as important as the knowledge he or she possesses.", author: "Carolyn Jarvis" },
    { text: "Save one life, you're a hero. Save a hundred lives, you're a nurse.", author: "Unknown" },
    { text: "To do what nobody else will do, in a way that nobody else can do, in spite of all we go through, is to be a nurse.", author: "Rawsi Williams" },
    { text: "Kindness is a passport that opens doors and fashions friends. It softens hearts and molds relationships that can last a lifetimes.", author: "Joseph B. Wirthlin" },
    { text: "In the middle of difficulty lies opportunity.", author: "Albert Einstein" },
    { text: "Quiet the mind and the soul will speak.", author: "Ma Jaya Sati Bhagavati" },
    { text: "Feelings come and go like clouds in a windy sky. Conscious breathing is my anchor.", author: "Thich Nhat Hanh" }
];

const GRATITUDE_PROMPTS = [
    "What is one small thing that went well during your shift today?",
    "Name a colleague who supported you or made you smile recently, and why.",
    "What is a simple comfort or treat you enjoyed today (e.g., a good cup of coffee, a warm shower)?",
    "Describe a patient or family interaction that reminded you why you entered healthcare.",
    "What is something about your physical workspace or environment that you are grateful for?",
    "Name a personal strength or skill you used today that you are proud of."
];

const MoodBooster: React.FC<MoodBoosterProps> = ({ onBack, stressDataHook }) => {
    const { t } = useLanguage();
    const [mode, setMode] = useState<'selection' | 'quote' | 'gratitude'>('selection');
    const [currentQuote, setCurrentQuote] = useState(QUOTES[0]);
    const [currentPrompt, setCurrentPrompt] = useState(GRATITUDE_PROMPTS[0]);
    const [gratitudeText, setGratitudeText] = useState('');
    const [showSuccess, setShowSuccess] = useState(false);
    const [error, setError] = useState('');

    const handleDrawQuote = () => {
        const randomIndex = Math.floor(Math.random() * QUOTES.length);
        setCurrentQuote(QUOTES[randomIndex]);
        setMode('quote');
    };

    const handleDrawPrompt = () => {
        const randomIndex = Math.floor(Math.random() * GRATITUDE_PROMPTS.length);
        setCurrentPrompt(GRATITUDE_PROMPTS[randomIndex]);
        setGratitudeText('');
        setShowSuccess(false);
        setError('');
        setMode('gratitude');
    };

    const handleSubmitGratitude = (e: React.FormEvent) => {
        e.preventDefault();
        if (!gratitudeText.trim()) {
            setError('Please share something you are grateful for.');
            return;
        }

        if (stressDataHook) {
            stressDataHook.addWellnessActivity(`Gratitude Journal: ${gratitudeText.trim().substring(0, 40)}...`);
        }

        setShowSuccess(true);
        setError('');
    };

    return (
        <div className="glass-card p-6 sm:p-8 rounded-2xl max-w-2xl mx-auto animate-fadeIn flex flex-col min-h-[500px]">
            {/* Header / Nav */}
            <div className="flex items-center justify-between mb-6 flex-shrink-0">
                <button
                    onClick={mode !== 'selection' ? () => setMode('selection') : onBack}
                    className="text-primary hover:text-violet-300 font-semibold transition-colors flex items-center gap-2"
                >
                    <ArrowLeft className="h-4 w-4" /> {mode !== 'selection' ? 'Back' : t('tool_back_to_tools')}
                </button>
            </div>

            {/* Title */}
            <div className="text-center mb-8 flex-shrink-0">
                <h2 className="text-3xl font-bold">{t('tool_booster_main_title')}</h2>
                <p className="text-muted-foreground text-sm mt-1">{t('tool_booster_main_desc')}</p>
            </div>

            {/* Content Area */}
            <div className="flex-1 flex flex-col justify-center">
                {mode === 'selection' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-lg mx-auto w-full animate-fadeIn">
                        <button
                            onClick={handleDrawQuote}
                            className="glass-card p-8 rounded-2xl border border-border bg-secondary/20 hover:border-primary/40 hover:scale-[1.02] transition-all duration-300 flex flex-col items-center justify-center text-center gap-4 group"
                        >
                            <div className="p-4 rounded-full bg-primary/10 text-primary group-hover:bg-primary/20 transition-all">
                                <Quote className="h-8 w-8" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-foreground">{t('tool_booster_new_quote')}</h3>
                                <p className="text-xs text-muted-foreground mt-1.5">Read an uplifting reflection tailored for caregivers.</p>
                            </div>
                        </button>

                        <button
                            onClick={handleDrawPrompt}
                            className="glass-card p-8 rounded-2xl border border-border bg-secondary/20 hover:border-primary/40 hover:scale-[1.02] transition-all duration-300 flex flex-col items-center justify-center text-center gap-4 group"
                        >
                            <div className="p-4 rounded-full bg-violet-500/10 text-violet-400 group-hover:bg-violet-500/20 transition-all">
                                <Heart className="h-8 w-8" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-foreground">{t('tool_booster_new_prompt') || 'Gratitude Prompt'}</h3>
                                <p className="text-xs text-muted-foreground mt-1.5">Write down a positive experience to boost wellness score.</p>
                            </div>
                        </button>
                    </div>
                )}

                {mode === 'quote' && (
                    <div className="space-y-6 text-center max-w-lg mx-auto animate-fadeIn">
                        <div className="relative glass-card border border-primary/30 bg-primary/5 p-8 rounded-2xl shadow-lg">
                            <Quote className="h-10 w-10 text-primary/30 absolute top-4 left-4" />
                            <p className="text-lg sm:text-xl font-medium text-foreground leading-relaxed italic pt-4">
                                "{currentQuote.text}"
                            </p>
                            <p className="text-sm font-bold text-primary mt-4 text-right">
                                — {currentQuote.author}
                            </p>
                        </div>

                        <div className="flex gap-3 pt-4 justify-center">
                            <button
                                onClick={handleDrawQuote}
                                className="py-2.5 px-6 rounded-xl font-semibold text-white bg-primary hover:bg-violet-700 transition-colors shadow-lg shadow-primary/20 text-sm flex items-center gap-2"
                            >
                                <Sparkles className="h-4 w-4" />
                                {t('tool_booster_new_quote')}
                            </button>
                            <button
                                onClick={() => setMode('selection')}
                                className="py-2.5 px-6 rounded-xl font-semibold text-white bg-secondary hover:bg-muted transition-colors text-sm"
                            >
                                Done
                            </button>
                        </div>
                    </div>
                )}

                {mode === 'gratitude' && !showSuccess && (
                    <form onSubmit={handleSubmitGratitude} className="space-y-6 max-w-lg mx-auto w-full animate-fadeIn">
                        <div className="glass-card border border-border bg-secondary/10 p-6 rounded-2xl text-center">
                            <span className="text-xs font-bold uppercase tracking-wider text-violet-400 flex items-center justify-center gap-1 mb-2">
                                <Heart className="h-3.5 w-3.5 fill-violet-400" />
                                Daily Reflection
                            </span>
                            <p className="text-base sm:text-lg font-semibold text-foreground leading-relaxed">
                                {currentPrompt}
                            </p>
                        </div>

                        <div className="space-y-2">
                            <textarea
                                value={gratitudeText}
                                onChange={(e) => setGratitudeText(e.target.value)}
                                placeholder="I am grateful for..."
                                className="w-full p-4 text-sm bg-secondary rounded-xl text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary border border-border min-h-[120px] resize-none"
                            />
                            {error && (
                                <p className="text-xs text-rose-400 flex items-center gap-1">
                                    <AlertCircle className="h-3 w-3" /> {error}
                                </p>
                            )}
                        </div>

                        <div className="flex gap-3">
                            <button
                                type="button"
                                onClick={handleDrawPrompt}
                                className="flex-1 py-3 px-4 rounded-xl font-semibold text-white bg-secondary hover:bg-muted transition-colors text-sm"
                            >
                                Draw Another Prompt
                            </button>
                            <button
                                type="submit"
                                className="flex-1 py-3 px-4 rounded-xl font-semibold text-white bg-primary hover:bg-violet-700 transition-colors shadow-lg shadow-primary/20 text-sm flex items-center justify-center gap-2"
                            >
                                Log Gratitude (+10 pts)
                            </button>
                        </div>
                    </form>
                )}

                {mode === 'gratitude' && showSuccess && (
                    <div className="text-center space-y-6 max-w-md mx-auto animate-fadeIn">
                        <div className="inline-flex items-center justify-center p-3 bg-emerald-500/20 border border-emerald-500/30 rounded-full text-emerald-400 mb-2">
                            <CheckCircle2 className="h-12 w-12" />
                        </div>
                        <h2 className="text-2xl font-bold text-foreground">Gratitude Logged!</h2>
                        <p className="text-muted-foreground text-sm">
                            Focusing on positive moments, no matter how small, has been scientifically proven to improve emotional resilience and lower stress.
                        </p>

                        <div className="bg-secondary/40 p-5 rounded-2xl border border-border text-left relative overflow-hidden">
                            <div className="absolute top-4 right-4 text-violet-500/10">
                                <Heart className="h-16 w-16 fill-violet-500/10" />
                            </div>
                            <span className="text-xs font-semibold text-violet-400 uppercase tracking-wide">Your Reflection:</span>
                            <p className="text-sm italic text-foreground mt-1 relative z-10">"{gratitudeText}"</p>
                        </div>

                        <div className="flex gap-3 pt-4">
                            <button
                                onClick={handleDrawPrompt}
                                className="flex-1 py-3 px-4 rounded-xl font-semibold text-white bg-primary hover:bg-violet-700 transition-colors shadow-lg shadow-primary/10 text-sm flex items-center justify-center gap-2"
                            >
                                <Heart className="h-4 w-4" />
                                Reflect Again
                            </button>
                            <button
                                onClick={() => setMode('selection')}
                                className="flex-1 py-3 px-4 rounded-xl font-semibold text-white bg-secondary hover:bg-muted transition-colors text-sm"
                            >
                                Done
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MoodBooster;
