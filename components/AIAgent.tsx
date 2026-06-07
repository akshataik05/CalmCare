import React, { useState } from 'react';
import { FlaskConical, Loader2, BrainCircuit, Thermometer, Footprints, Info, AlertTriangle, Languages, TrendingUp, ArrowRightLeft, Sparkles } from 'lucide-react';
import { getStressPrediction, translateMedicalText } from '../services/geminiService';
import { useLanguage } from '../context/LanguageContext';

type AgentView = 'translator' | 'prediction';

const LANGUAGES = [
  'English', 'Spanish', 'French', 'German', 'Mandarin', 'Hindi', 'Arabic', 
  'Portuguese', 'Russian', 'Japanese', 'Kannada', 'Tamil', 'Telugu'
];

// Main Component
const AIAgent: React.FC = () => {
    const [activeView, setActiveView] = useState<AgentView>('translator');
    const { t } = useLanguage();

    const TabButton = ({ view, label, icon: Icon }: { view: AgentView; label: string; icon: React.ElementType }) => (
        <button
            onClick={() => setActiveView(view)}
            className={`flex items-center gap-2 px-6 py-3 text-sm font-medium transition-all duration-300 relative overflow-hidden group ${
                activeView === view
                    ? 'text-primary'
                    : 'text-muted-foreground hover:text-foreground'
            }`}
        >
            <div className={`absolute inset-0 bg-primary/10 transition-opacity duration-300 ${activeView === view ? 'opacity-100' : 'opacity-0 group-hover:opacity-50'}`} />
            <div className={`absolute bottom-0 left-0 right-0 h-0.5 bg-primary transition-transform duration-300 ${activeView === view ? 'scale-x-100' : 'scale-x-0'}`} />
            <Icon className={`h-4 w-4 relative z-10 ${activeView === view ? 'animate-pulse' : ''}`} />
            <span className="relative z-10">{label}</span>
        </button>
    );

    return (
        <div className="max-w-6xl mx-auto space-y-8 animate-fadeIn p-4 sm:p-6">
             <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-foreground">AI Intelligence Center</h1>
                    <p className="text-muted-foreground mt-1">Advanced diagnostic and communication tools powered by CalmCare AI.</p>
                </div>
             </div>

            <div className="glass-card rounded-2xl overflow-hidden border border-border">
                <div className="flex border-b border-border bg-black/20">
                    <TabButton view="translator" label={t('agent_tab_translator')} icon={Languages} />
                    <TabButton view="prediction" label={t('agent_tab_prediction')} icon={FlaskConical} />
                </div>

                <div className="p-6 sm:p-8 bg-gradient-to-b from-card to-background/50">
                    {activeView === 'translator' && <MedicalTranslator />}
                    {activeView === 'prediction' && <StressPredictor />}
                </div>
            </div>
        </div>
    );
};


// 1. Medical Translator Component
const MedicalTranslator = () => {
    const [sourceLang, setSourceLang] = useState('English');
    const [targetLang, setTargetLang] = useState('Spanish');
    const [inputText, setInputText] = useState('');
    const [translatedText, setTranslatedText] = useState('');
    const [simplify, setSimplify] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const { t } = useLanguage();

    const handleTranslate = async () => {
        if (!inputText.trim()) return;
        setIsLoading(true);
        setTranslatedText('');
        try {
            const result = await translateMedicalText(inputText, sourceLang, targetLang, simplify);
            setTranslatedText(result);
        } catch (error) {
            console.error("Translation failed", error);
            setTranslatedText("Translation service unavailable. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="animate-fadeIn">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
                        <Languages className="text-primary h-6 w-6"/>
                        {t('agent_translator_title')}
                    </h2>
                    <p className="text-sm text-muted-foreground mt-1">Real-time medical translation with automatic terminology simplification.</p>
                </div>
                <div className="flex items-center gap-3 bg-secondary/30 px-4 py-2 rounded-full border border-border">
                    <span className="text-sm font-medium text-muted-foreground">{t('agent_translator_simplify')}</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" checked={simplify} onChange={() => setSimplify(!simplify)} className="sr-only toggle-switch-input" />
                        <div className="toggle-switch-track">
                            <div className="toggle-switch-knob"></div>
                        </div>
                    </label>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative">
                {/* Arrow Icon in Center */}
                <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 bg-card border border-border p-2 rounded-full shadow-xl text-primary">
                    <ArrowRightLeft className="h-5 w-5" />
                </div>

                {/* Healthcare Worker Side */}
                <div className="space-y-4">
                     <div className="flex justify-between items-end">
                        <label className="text-xs font-semibold uppercase tracking-wider text-primary">{t('agent_translator_hcw')}</label>
                        <select 
                            value={sourceLang} 
                            onChange={(e) => setSourceLang(e.target.value)} 
                            className="bg-[#151921] text-sm text-gray-200 border border-[#2A2D36] rounded-lg px-3 py-1.5 focus:ring-1 focus:ring-primary focus:outline-none cursor-pointer hover:bg-[#1E2129] transition-colors"
                        >
                            {LANGUAGES.map(lang => <option key={lang} value={lang} className="bg-[#151921] text-gray-200">{lang}</option>)}
                        </select>
                    </div>
                    <div className="relative group">
                        <textarea
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            placeholder={t('agent_translator_placeholder')}
                            className="w-full h-64 p-4 text-base bg-[#0A0E1A]/60 rounded-xl text-foreground placeholder-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50 border border-border resize-none transition-all shadow-inner"
                        />
                        <div className="absolute bottom-4 right-4">
                            <button 
                                onClick={handleTranslate} 
                                disabled={isLoading || !inputText.trim()} 
                                className="py-2 px-6 rounded-lg font-semibold text-sm text-black bg-primary hover:bg-cyan-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-primary/20 hover:shadow-primary/40 flex items-center gap-2 transform active:scale-95"
                            >
                                {isLoading ? <Loader2 className="animate-spin h-4 w-4" /> : <><Sparkles className="h-4 w-4 fill-current"/> {t('agent_translator_button')}</>}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Patient Side */}
                <div className="space-y-4">
                    <div className="flex justify-between items-end">
                        <label className="text-xs font-semibold uppercase tracking-wider text-primary">{t('agent_translator_patient')}</label>
                         <select 
                            value={targetLang} 
                            onChange={(e) => setTargetLang(e.target.value)} 
                            className="bg-[#151921] text-sm text-gray-200 border border-[#2A2D36] rounded-lg px-3 py-1.5 focus:ring-1 focus:ring-primary focus:outline-none cursor-pointer hover:bg-[#1E2129] transition-colors"
                        >
                            {LANGUAGES.map(lang => <option key={lang} value={lang} className="bg-[#151921] text-gray-200">{lang}</option>)}
                        </select>
                    </div>
                    <div className="relative h-64 bg-secondary/20 rounded-xl border border-border/50 p-4">
                        {translatedText ? (
                            <p className="text-base text-foreground leading-relaxed animate-fadeIn">{translatedText}</p>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-muted-foreground/30">
                                <Languages className="h-12 w-12 mb-2 opacity-20" />
                                <p className="text-sm">Translation will appear here</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};


// Stress Predictor Component
interface PredictionResult {
    prediction: number; // 0: low, 1: medium, 2: high, -1: error
    explanation: string;
}

const StressPredictor: React.FC = () => {
    const [formData, setFormData] = useState({ humidity: '60', temperature: '75', stepCount: '5000' });
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState<PredictionResult | null>(null);
    const { t } = useLanguage();

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setResult(null);
        
        try {
            const predictionResult = await getStressPrediction(
                Number(formData.humidity),
                Number(formData.temperature),
                Number(formData.stepCount)
            );
            setResult(predictionResult);
        } catch (error) {
             setResult({ prediction: -1, explanation: "Failed to fetch prediction." });
        } finally {
            setIsLoading(false);
        }
    };

    const ResultCard = ({ result }: { result: PredictionResult }) => {
        const { t } = useLanguage();
        if (result.prediction === -1) {
            return (
                <div className="bg-red-500/10 border border-red-500/30 p-8 rounded-2xl text-center animate-fadeIn relative overflow-hidden">
                    <div className="absolute inset-0 bg-red-500/5 blur-3xl"></div>
                    <AlertTriangle className="h-12 w-12 text-red-400 mx-auto mb-4 relative z-10" />
                    <h3 className="text-xl font-bold text-red-200 mb-2 relative z-10">{t('agent_prediction_error_title')}</h3>
                    <p className="text-red-300/80 relative z-10">{result.explanation}</p>
                </div>
            )
        }

        const stressLevels = [
            { label: t('stress_level_low'), color: 'emerald', icon: <TrendingUp /> },
            { label: t('stress_level_medium'), color: 'amber', icon: <TrendingUp /> },
            { label: t('stress_level_high'), color: 'red', icon: <TrendingUp /> },
        ];
        const levelInfo = stressLevels[result.prediction];

        const colorClasses = {
            emerald: { bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', text: 'text-emerald-400', glow: 'shadow-emerald-500/20' },
            amber: { bg: 'bg-amber-500/10', border: 'border-amber-500/30', text: 'text-amber-400', glow: 'shadow-amber-500/20' },
            red: { bg: 'bg-red-500/10', border: 'border-red-500/30', text: 'text-red-400', glow: 'shadow-red-500/20' },
        }
        
        const classes = colorClasses[levelInfo.color as keyof typeof colorClasses];

        return (
            <div className={`${classes.bg} border ${classes.border} p-8 rounded-2xl animate-fadeIn text-center relative overflow-hidden shadow-2xl ${classes.glow}`}>
                {/* Background decorative elements */}
                <div className="absolute -top-24 -left-24 w-48 h-48 bg-gradient-to-br from-white/10 to-transparent rounded-full blur-3xl pointer-events-none"></div>
                
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-widest mb-6 relative z-10">{t('agent_prediction_result_title')}</h3>
                <div className="mb-6 relative z-10">
                    <p className={`text-6xl font-black ${classes.text} tracking-tight drop-shadow-sm`}>{levelInfo.label}</p>
                </div>
                <div className="bg-background/40 backdrop-blur-sm rounded-xl p-4 border border-white/5 inline-block w-full">
                    <p className="text-gray-300 leading-relaxed text-sm">{result.explanation}</p>
                </div>
            </div>
        )
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-fadeIn">
            {/* Left Column: Input Form */}
            <div className="lg:col-span-5 space-y-6">
                <div>
                     <h2 className="text-2xl font-bold text-foreground flex items-center gap-2 mb-2">
                        <FlaskConical className="text-primary h-6 w-6"/>
                        {t('agent_prediction_form_title')}
                    </h2>
                    <p className="text-sm text-muted-foreground">Enter environmental and biometric data to forecast stress levels.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5 bg-card/50 p-6 rounded-2xl border border-border shadow-inner">
                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                            <Thermometer className="h-3.5 w-3.5" />{t('agent_prediction_humidity')} (%)
                        </label>
                        <input 
                            type="number" 
                            name="humidity" 
                            value={formData.humidity} 
                            onChange={handleInputChange} 
                            className="w-full py-3 px-4 bg-background rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 border border-border transition-all" 
                            placeholder="e.g. 60"
                        />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                            <Thermometer className="h-3.5 w-3.5" />{t('agent_prediction_temperature')} (°F)
                        </label>
                        <input 
                            type="number" 
                            name="temperature" 
                            value={formData.temperature} 
                            onChange={handleInputChange} 
                            className="w-full py-3 px-4 bg-background rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 border border-border transition-all" 
                            placeholder="e.g. 75"
                        />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                            <Footprints className="h-3.5 w-3.5" />{t('agent_prediction_steps')}
                        </label>
                        <input 
                            type="number" 
                            name="stepCount" 
                            value={formData.stepCount} 
                            onChange={handleInputChange} 
                            className="w-full py-3 px-4 bg-background rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 border border-border transition-all" 
                            placeholder="e.g. 5000"
                        />
                    </div>
                    <button 
                        type="submit" 
                        disabled={isLoading} 
                        className="w-full py-3.5 px-4 rounded-xl font-bold text-black bg-primary hover:bg-cyan-300 transition-all shadow-lg shadow-primary/25 hover:shadow-primary/40 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-4"
                    >
                        {isLoading ? <><Loader2 className="animate-spin h-5 w-5" /> Analyzing...</> : <><BrainCircuit className="h-5 w-5" /> {t('agent_prediction_button')}</>}
                    </button>
                </form>
            </div>

            {/* Right Column: Results & Info */}
            <div className="lg:col-span-7 space-y-6 flex flex-col h-full">
                 {result ? (
                     <ResultCard result={result} />
                 ) : (
                    <div className="flex-1 bg-secondary/20 border border-border border-dashed rounded-2xl flex flex-col items-center justify-center p-8 text-center min-h-[300px]">
                        <div className="bg-primary/10 p-4 rounded-full mb-4">
                            <BrainCircuit className="h-10 w-10 text-primary/50" />
                        </div>
                        <h3 className="text-lg font-semibold text-muted-foreground">Ready to Predict</h3>
                        <p className="text-sm text-muted-foreground/60 max-w-xs mt-2">Enter your biometric data on the left to generate an AI stress forecast.</p>
                    </div>
                 )}

                <div className="glass-card p-6 rounded-2xl border border-border bg-card/30">
                     <h3 className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
                        <Info className="h-4 w-4 text-primary" /> 
                        {t('agent_prediction_how_it_works')}
                     </h3>
                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-muted-foreground">
                        <div className="bg-background/50 p-3 rounded-lg border border-border/50">
                            <span className="font-semibold text-primary block mb-1">{t('agent_prediction_factor1')}</span> 
                            {t('agent_prediction_factor1_desc')}
                        </div>
                        <div className="bg-background/50 p-3 rounded-lg border border-border/50">
                            <span className="font-semibold text-primary block mb-1">{t('agent_prediction_factor2')}</span> 
                            {t('agent_prediction_factor2_desc')}
                        </div>
                     </div>
                </div>
            </div>
        </div>
    );
};


export default AIAgent;