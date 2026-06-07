import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { ArrowLeft, CheckCircle2, RefreshCw, Sparkles, BookOpen, AlertCircle } from 'lucide-react';
import type { StressDataHook, TranslationKey } from '../../types';

interface CognitiveReframingProps {
    onBack: () => void;
    stressDataHook?: StressDataHook;
}

interface ReframeCard {
    id: number;
    thoughtKey: TranslationKey;
    promptKey: TranslationKey;
}

const CARDS: ReframeCard[] = [
    { id: 1, thoughtKey: 'reframing_1_thought', promptKey: 'reframing_1_prompt' },
    { id: 2, thoughtKey: 'reframing_2_thought', promptKey: 'reframing_2_prompt' },
    { id: 3, thoughtKey: 'reframing_3_thought', promptKey: 'reframing_3_prompt' },
    { id: 4, thoughtKey: 'reframing_4_thought', promptKey: 'reframing_4_prompt' },
    { id: 5, thoughtKey: 'reframing_5_thought', promptKey: 'reframing_5_prompt' }
];

const CognitiveReframing: React.FC<CognitiveReframingProps> = ({ onBack, stressDataHook }) => {
    const { t } = useLanguage();
    const [cardIndex, setCardIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);
    const [userReframe, setUserReframe] = useState('');
    const [completedCount, setCompletedCount] = useState(0);
    const [showSuccess, setShowSuccess] = useState(false);
    const [error, setError] = useState('');

    const currentCard = CARDS[cardIndex];

    const handleFlip = () => {
        setIsFlipped(true);
        setError('');
    };

    const handleNextCard = () => {
        let nextIndex = cardIndex;
        // Draw a random card that is different from current if possible
        if (CARDS.length > 1) {
            do {
                nextIndex = Math.floor(Math.random() * CARDS.length);
            } while (nextIndex === cardIndex);
        }
        setCardIndex(nextIndex);
        setIsFlipped(false);
        setUserReframe('');
        setShowSuccess(false);
        setError('');
    };

    const handleSubmitReframe = (e: React.FormEvent) => {
        e.preventDefault();
        if (!userReframe.trim()) {
            setError(t('auth_login_error') || 'Please write your reframe.');
            return;
        }

        if (userReframe.trim().length < 10) {
            setError('Please try to write a slightly more detailed, balanced thought (at least 10 characters).');
            return;
        }

        // Add to wellness activities
        if (stressDataHook) {
            stressDataHook.addWellnessActivity(`Completed Reframing Exercise #${currentCard.id}`);
        }

        setCompletedCount(prev => prev + 1);
        setShowSuccess(true);
        setError('');
    };

    return (
        <div className="glass-card p-6 sm:p-8 rounded-2xl max-w-2xl mx-auto animate-fadeIn flex flex-col min-h-[500px]">
            {/* Header / Nav */}
            <div className="flex items-center justify-between mb-6 flex-shrink-0">
                <button
                    onClick={onBack}
                    className="text-primary hover:text-violet-300 font-semibold transition-colors flex items-center gap-2"
                >
                    <ArrowLeft className="h-4 w-4" /> {t('tool_back_to_tools')}
                </button>
                <div className="text-xs text-muted-foreground bg-secondary px-3 py-1.5 rounded-full border border-border flex items-center gap-1.5">
                    <Sparkles className="h-3.5 w-3.5 text-primary" />
                    <span>Completed today: {completedCount}</span>
                </div>
            </div>

            {/* Title */}
            <div className="text-center mb-6 flex-shrink-0">
                <h2 className="text-3xl font-bold">{t('tool_reframing_main_title')}</h2>
                <p className="text-muted-foreground text-sm mt-1">{t('tool_reframing_main_desc')}</p>
            </div>

            {/* Flashcard Area */}
            <div className="flex-1 flex flex-col justify-center">
                {!showSuccess ? (
                    <div className="space-y-6">
                        {/* Interactive Card */}
                        <div 
                            className={`relative w-full rounded-2xl border border-border bg-secondary/30 p-6 sm:p-8 min-h-[180px] flex flex-col justify-between transition-all duration-500 shadow-md ${
                                isFlipped ? 'border-primary/40 bg-primary/5' : 'hover:border-primary/20'
                            }`}
                        >
                            {!isFlipped ? (
                                <div className="space-y-4 flex flex-col justify-between h-full flex-1">
                                    <div className="space-y-2">
                                        <span className="text-xs font-bold uppercase tracking-wider text-rose-400 flex items-center gap-1">
                                            <AlertCircle className="h-3.5 w-3.5" />
                                            {t('tool_reframing_card_thought')}
                                        </span>
                                        <p className="text-lg sm:text-xl font-medium text-foreground leading-relaxed italic">
                                            "{t(currentCard.thoughtKey)}"
                                        </p>
                                    </div>
                                    <button
                                        onClick={handleFlip}
                                        className="mt-6 self-center sm:self-end py-2 px-5 rounded-lg bg-primary hover:bg-violet-700 text-white font-semibold transition-colors shadow-lg shadow-primary/15 flex items-center gap-2 text-sm"
                                    >
                                        {t('tool_reframing_card_button')}
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-4 animate-fadeIn">
                                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1">
                                        <BookOpen className="h-3.5 w-3.5" />
                                        {t('tool_reframing_card_prompt')}
                                    </span>
                                    <p className="text-base sm:text-lg font-medium text-foreground leading-relaxed">
                                        {t(currentCard.promptKey)}
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Reframing Form (Visible only after flipping) */}
                        {isFlipped && (
                            <form onSubmit={handleSubmitReframe} className="space-y-4 animate-fadeIn">
                                <div className="space-y-2">
                                    <label htmlFor="reframe-input" className="text-sm font-semibold text-muted-foreground">
                                        {t('tool_reframing_card_placeholder').replace('...', '') || 'Your Balanced Perspective'}
                                    </label>
                                    <textarea
                                        id="reframe-input"
                                        value={userReframe}
                                        onChange={(e) => setUserReframe(e.target.value)}
                                        placeholder={t('tool_reframing_card_placeholder')}
                                        className="w-full p-4 text-sm bg-secondary rounded-xl text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary border border-border min-h-[100px] resize-none"
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
                                        onClick={handleNextCard}
                                        className="flex-1 py-3 px-4 rounded-xl font-semibold text-white bg-secondary hover:bg-muted transition-colors flex items-center justify-center gap-2 text-sm"
                                    >
                                        <RefreshCw className="h-4 w-4" />
                                        {t('tool_reframing_new_card')}
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 py-3 px-4 rounded-xl font-semibold text-white bg-primary hover:bg-violet-700 transition-colors shadow-lg shadow-primary/20 text-sm flex items-center justify-center gap-2"
                                    >
                                        Submit Reframe (+10 pts)
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                ) : (
                    <div className="text-center space-y-6 animate-fadeIn max-w-md mx-auto">
                        <div className="inline-flex items-center justify-center p-3 bg-emerald-500/20 border border-emerald-500/30 rounded-full text-emerald-400 mb-2">
                            <CheckCircle2 className="h-12 w-12 animate-pulse" />
                        </div>
                        <h2 className="text-2xl font-bold text-foreground">Thought Reframed Successfully!</h2>
                        <p className="text-muted-foreground text-sm">
                            Excellent work. Challenging cognitive distortions is a vital skill that helps lower daily stress levels and prevent burnout.
                        </p>

                        <div className="bg-secondary/40 p-4 rounded-xl border border-border text-left space-y-2 mt-4">
                            <div>
                                <span className="text-xs font-semibold text-rose-400 uppercase tracking-wide">Automatic Thought:</span>
                                <p className="text-sm italic text-muted-foreground mt-0.5">"{t(currentCard.thoughtKey)}"</p>
                            </div>
                            <div className="border-t border-border pt-2 mt-2">
                                <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wide">Your Balanced Perspective:</span>
                                <p className="text-sm text-foreground mt-0.5">"{userReframe}"</p>
                            </div>
                        </div>

                        <div className="flex gap-3 pt-4">
                            <button
                                onClick={handleNextCard}
                                className="flex-1 py-3 px-4 rounded-xl font-semibold text-white bg-primary hover:bg-violet-700 transition-colors shadow-lg shadow-primary/10 text-sm flex items-center justify-center gap-2"
                            >
                                <RefreshCw className="h-4 w-4" />
                                {t('tool_reframing_new_card')}
                            </button>
                            <button
                                onClick={onBack}
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

export default CognitiveReframing;
