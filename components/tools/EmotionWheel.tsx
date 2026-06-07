import React, { useState } from 'react';
import type { StressDataHook, TranslationKey } from '../../types';
import { useLanguage } from '../../context/LanguageContext';
import { ArrowLeft, CheckCircle2, ChevronRight, Sparkles, Smile, Info } from 'lucide-react';

interface EmotionWheelProps {
    onBack: () => void;
    stressDataHook?: StressDataHook;
}

interface PrimaryEmotionConfig {
    key: string;
    translationKey: TranslationKey;
    color: string;
    bg: string;
    border: string;
    text: string;
    secondaryPrefix: string;
    secondaryCount: number;
}

const PRIMARY_EMOTIONS: PrimaryEmotionConfig[] = [
    {
        key: 'Joy',
        translationKey: 'emotion_joy',
        color: 'from-amber-400 to-amber-600',
        bg: 'rgba(245, 158, 11, 0.15)',
        border: 'border-amber-500/30 hover:border-amber-500',
        text: 'text-amber-400',
        secondaryPrefix: 'emotion_joy_secondary_',
        secondaryCount: 5
    },
    {
        key: 'Sadness',
        translationKey: 'emotion_sadness',
        color: 'from-blue-400 to-blue-600',
        bg: 'rgba(66, 133, 244, 0.15)',
        border: 'border-blue-500/30 hover:border-blue-500',
        text: 'text-blue-400',
        secondaryPrefix: 'emotion_sadness_secondary_',
        secondaryCount: 5
    },
    {
        key: 'Anger',
        translationKey: 'emotion_anger',
        color: 'from-red-400 to-red-600',
        bg: 'rgba(217, 48, 37, 0.15)',
        border: 'border-red-500/30 hover:border-red-500',
        text: 'text-red-400',
        secondaryPrefix: 'emotion_anger_secondary_',
        secondaryCount: 5
    },
    {
        key: 'Fear',
        translationKey: 'emotion_fear',
        color: 'from-purple-400 to-purple-600',
        bg: 'rgba(126, 87, 194, 0.15)',
        border: 'border-purple-500/30 hover:border-purple-500',
        text: 'text-purple-400',
        secondaryPrefix: 'emotion_fear_secondary_',
        secondaryCount: 5
    },
    {
        key: 'Surprise',
        translationKey: 'emotion_surprise',
        color: 'from-emerald-400 to-emerald-600',
        bg: 'rgba(52, 211, 153, 0.15)',
        border: 'border-emerald-500/30 hover:border-emerald-500',
        text: 'text-emerald-400',
        secondaryPrefix: 'emotion_surprise_secondary_',
        secondaryCount: 4
    },
    {
        key: 'Disgust',
        translationKey: 'emotion_disgust',
        color: 'from-green-400 to-green-600',
        bg: 'rgba(74, 222, 128, 0.15)',
        border: 'border-green-500/30 hover:border-green-500',
        text: 'text-green-400',
        secondaryPrefix: 'emotion_disgust_secondary_',
        secondaryCount: 4
    }
];

const EmotionWheel: React.FC<EmotionWheelProps> = ({ onBack, stressDataHook }) => {
    const { t } = useLanguage();
    const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1);
    const [selectedPrimary, setSelectedPrimary] = useState<PrimaryEmotionConfig | null>(null);
    const [selectedSecondaryKey, setSelectedSecondaryKey] = useState<string>('');
    const [intensity, setIntensity] = useState<number>(5);
    const [notes, setNotes] = useState<string>('');

    const handleSelectPrimary = (emotion: PrimaryEmotionConfig) => {
        setSelectedPrimary(emotion);
        setSelectedSecondaryKey('');
        setStep(2);
    };

    const handleSelectSecondary = (secondaryKey: string) => {
        setSelectedSecondaryKey(secondaryKey);
        setStep(3);
    };

    const handleIntensitySubmit = () => {
        setStep(4);
    };

    const handleLogEmotion = () => {
        if (!selectedPrimary || !selectedSecondaryKey || !stressDataHook) return;
        
        stressDataHook.addEmotionJournalEntry({
            primaryEmotion: selectedPrimary.key,
            secondaryEmotion: t(selectedSecondaryKey as TranslationKey),
            intensity,
            notes: notes.trim() ? notes.trim() : undefined
        });

        // Add 10 wellness points for logging emotion
        stressDataHook.addWellnessActivity(
            `${t('tools_emotion_wheel_title')}: ${t(selectedPrimary.translationKey)} (${t(selectedSecondaryKey as TranslationKey)})`
        );

        setStep(5);
    };

    const handleReset = () => {
        setSelectedPrimary(null);
        setSelectedSecondaryKey('');
        setIntensity(5);
        setNotes('');
        setStep(1);
    };

    const renderSecondaryEmotions = () => {
        if (!selectedPrimary) return null;
        const options = [];
        for (let i = 1; i <= selectedPrimary.secondaryCount; i++) {
            const key = `${selectedPrimary.secondaryPrefix}${i}`;
            options.push(key);
        }

        return (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-6 animate-fadeIn">
                {options.map((key) => {
                    const isSelected = selectedSecondaryKey === key;
                    return (
                        <button
                            key={key}
                            onClick={() => handleSelectSecondary(key)}
                            className={`p-4 rounded-xl text-center font-medium border transition-all duration-300 ${
                                isSelected
                                    ? `bg-gradient-to-r ${selectedPrimary.color} text-white border-transparent shadow-lg`
                                    : 'bg-secondary border-border text-foreground hover:border-primary/50 hover:bg-secondary/80'
                            }`}
                        >
                            {t(key as TranslationKey)}
                        </button>
                    );
                })}
            </div>
        );
    };

    return (
        <div className="glass-card p-6 sm:p-8 rounded-2xl max-w-3xl mx-auto animate-fadeIn flex flex-col min-h-[500px]">
            {/* Header / Nav */}
            <div className="flex items-center justify-between mb-6 flex-shrink-0">
                <button
                    onClick={step > 1 && step < 5 ? () => setStep((step - 1) as any) : onBack}
                    className="text-primary hover:text-violet-300 font-semibold transition-colors flex items-center gap-2"
                >
                    <ArrowLeft className="h-4 w-4" /> 
                    {step > 1 && step < 5 ? t('auth_forgot_back_to_login').replace('Log In', '') || 'Back' : t('tool_back_to_tools')}
                </button>
                <div className="text-xs text-muted-foreground bg-secondary px-3 py-1.5 rounded-full border border-border">
                    {step < 5 ? `${t('riddle_progress').replace('{current}', step.toString()).replace('{total}', '4')}` : t('tool_emotion_complete_title')}
                </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 flex flex-col justify-center">
                {step === 1 && (
                    <div className="space-y-6 animate-fadeIn">
                        <div className="text-center">
                            <Smile className="h-12 w-12 text-primary mx-auto mb-3" />
                            <h2 className="text-3xl font-bold">{t('tool_emotion_main_title')}</h2>
                            <p className="text-muted-foreground mt-1">{t('tools_emotion_wheel_desc')}</p>
                            <h3 className="text-lg font-semibold mt-6 text-foreground">{t('tool_emotion_step1_q')}</h3>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">
                            {PRIMARY_EMOTIONS.map((emotion) => (
                                <button
                                    key={emotion.key}
                                    onClick={() => handleSelectPrimary(emotion)}
                                    className={`p-6 rounded-2xl text-center border transition-all duration-300 hover:scale-[1.03] flex flex-col items-center justify-center gap-2 ${emotion.border}`}
                                    style={{ backgroundColor: emotion.bg }}
                                >
                                    <span className={`text-xl font-bold ${emotion.text}`}>{t(emotion.translationKey)}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {step === 2 && selectedPrimary && (
                    <div className="space-y-6 animate-fadeIn">
                        <div className="text-center">
                            <h2 className="text-3xl font-bold flex items-center justify-center gap-2">
                                <span className={`px-3 py-1 rounded-lg text-sm bg-secondary ${selectedPrimary.text}`}>
                                    {t(selectedPrimary.translationKey)}
                                </span>
                            </h2>
                            <h3 className="text-xl font-semibold mt-4 text-foreground">{t('tool_emotion_step2_q')}</h3>
                        </div>

                        {renderSecondaryEmotions()}
                    </div>
                )}

                {step === 3 && selectedPrimary && selectedSecondaryKey && (
                    <div className="space-y-8 animate-fadeIn max-w-md mx-auto w-full">
                        <div className="text-center">
                            <div className="flex items-center justify-center gap-2 flex-wrap">
                                <span className="px-3 py-1 rounded-lg text-sm bg-secondary text-muted-foreground">
                                    {t(selectedPrimary.translationKey)}
                                </span>
                                <ChevronRight className="h-4 w-4 text-muted-foreground" />
                                <span className={`px-3 py-1 rounded-lg text-sm bg-secondary font-bold ${selectedPrimary.text}`}>
                                    {t(selectedSecondaryKey as TranslationKey)}
                                </span>
                            </div>
                            <h3 className="text-xl font-semibold mt-6 text-foreground">{t('tool_emotion_step3_q')}</h3>
                        </div>

                        <div className="space-y-4">
                            <div className="flex justify-between text-sm text-muted-foreground font-medium px-1">
                                <span>{t('tool_emotion_step3_low')} (1)</span>
                                <span className={`text-lg font-bold ${selectedPrimary.text}`}>{intensity}</span>
                                <span>{t('tool_emotion_step3_high')} (10)</span>
                            </div>
                            <input
                                type="range"
                                min="1"
                                max="10"
                                value={intensity}
                                onChange={(e) => setIntensity(Number(e.target.value))}
                                className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
                                style={{
                                    background: `linear-gradient(to right, var(--primary) 0%, var(--primary) ${(intensity - 1) * 11}%, var(--secondary) ${(intensity - 1) * 11}%, var(--secondary) 100%)`
                                }}
                            />
                        </div>

                        <button
                            onClick={handleIntensitySubmit}
                            className="w-full py-3 px-4 rounded-xl font-semibold text-white bg-primary hover:bg-violet-700 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-primary/20"
                        >
                            {t('tool_emotion_continue')}
                        </button>
                    </div>
                )}

                {step === 4 && selectedPrimary && selectedSecondaryKey && (
                    <div className="space-y-6 animate-fadeIn max-w-lg mx-auto w-full">
                        <div className="text-center">
                            <div className="flex items-center justify-center gap-2 flex-wrap text-sm mb-2">
                                <span className="text-muted-foreground">{t(selectedPrimary.translationKey)}</span>
                                <ChevronRight className="h-3 w-3 text-muted-foreground" />
                                <span className={selectedPrimary.text}>{t(selectedSecondaryKey as TranslationKey)}</span>
                                <ChevronRight className="h-3 w-3 text-muted-foreground" />
                                <span className="font-semibold text-foreground">Intensity: {intensity}/10</span>
                            </div>
                            <h3 className="text-xl font-semibold text-foreground">{t('tool_emotion_step4_q')}</h3>
                        </div>

                        <textarea
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder={t('tool_emotion_step4_placeholder')}
                            className="w-full p-4 text-sm bg-secondary rounded-xl text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary border border-border min-h-[120px] resize-none"
                        />

                        <button
                            onClick={handleLogEmotion}
                            className="w-full py-3 px-4 rounded-xl font-semibold text-white bg-primary hover:bg-violet-700 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-primary/20"
                        >
                            {t('tool_emotion_log_button')}
                        </button>
                    </div>
                )}

                {step === 5 && selectedPrimary && selectedSecondaryKey && (
                    <div className="text-center space-y-6 animate-fadeIn max-w-md mx-auto">
                        <div className="inline-flex items-center justify-center p-3 bg-emerald-500/20 border border-emerald-500/30 rounded-full text-emerald-400 mb-2">
                            <CheckCircle2 className="h-12 w-12" />
                        </div>
                        <h2 className="text-3xl font-bold text-foreground">{t('tool_emotion_complete_title')}</h2>
                        <p className="text-muted-foreground">{t('tool_emotion_complete_desc')}</p>
                        
                        <div className="bg-secondary/50 p-4 rounded-xl border border-border text-left space-y-2 mt-4">
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-muted-foreground">Emotion logged:</span>
                                <span className={`font-bold ${selectedPrimary.text}`}>
                                    {t(selectedPrimary.translationKey)} ({t(selectedSecondaryKey as TranslationKey)})
                                </span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-muted-foreground">Intensity:</span>
                                <span className="font-semibold">{intensity}/10</span>
                            </div>
                            {notes.trim() && (
                                <div className="text-xs text-muted-foreground pt-1 border-t border-border mt-1 italic">
                                    "{notes}"
                                </div>
                            )}
                        </div>

                        <div className="flex gap-2.5 pt-4">
                            <button
                                onClick={handleReset}
                                className="flex-1 py-3 px-4 rounded-xl font-semibold text-white bg-secondary hover:bg-muted transition-colors"
                            >
                                {t('tool_emotion_log_another') || 'Log Another'}
                            </button>
                            <button
                                onClick={onBack}
                                className="flex-1 py-3 px-4 rounded-xl font-semibold text-white bg-primary hover:bg-violet-700 transition-colors shadow-lg shadow-primary/10"
                            >
                                {t('tool_emotion_start_over') || 'Done'}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default EmotionWheel;
