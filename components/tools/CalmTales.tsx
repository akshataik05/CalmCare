import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { ArrowLeft, BookOpen, Heart, RefreshCw, Star, Sparkles } from 'lucide-react';
import type { StressDataHook, TranslationKey } from '../../types';

interface CalmTalesProps {
    onBack: () => void;
    stressDataHook?: StressDataHook;
}

interface CalmTale {
    id: string;
    title: string;
    author: string;
    quote: string;
    category: 'Calm Tales' | 'Happy Laughs' | 'Kind Hearts' | 'Mini Adventures';
    categoryKey: TranslationKey;
    mood: 'Calm' | 'Funny' | 'Motivating' | 'Wholesome';
    coverColors: string; // Tailwind gradient classes
    content: string[];
}

const TALES: CalmTale[] = [
    {
        id: 'tale_1',
        title: 'The Whispering Brook',
        author: 'Aura Scribes',
        quote: 'In the quietest currents, we find the deepest stillness.',
        category: 'Calm Tales',
        categoryKey: 'tale_library_category_calm',
        mood: 'Calm',
        coverColors: 'from-blue-600 to-indigo-900',
        content: [
            'Deep within the ancient woods, where the giant pines reach to touch the clouds, flows the Whispering Brook. It does not rush, nor does it strive to overcome the smooth grey pebbles in its path. It simply flows, murmuring a soft, endless song of peace to the green moss clinging to its banks.',
            'A weary traveler sat by the water, listening to the gentle gurgles. With each breath, the traveler let go of a worry, watching it drift downstream like a fallen leaf. The cool breeze rustled the ferns, carrying the scent of damp earth and pine needles.',
            'As the sun began to set, casting golden shafts of light through the canopy, the forest grew still. The stream rolled on, reminding the traveler that sometimes, the most productive thing we can do is simply allow ourselves to move gently through the current of the present moment.'
        ]
    },
    {
        id: 'tale_2',
        title: "The Baker's Happy Mistake",
        author: 'Joyful Baker',
        quote: 'A dash of confusion can lead to the sweetest results.',
        category: 'Happy Laughs',
        categoryKey: 'tale_library_category_happy',
        mood: 'Funny',
        coverColors: 'from-amber-500 to-orange-700',
        content: [
            'Barnaby was a baker of great dedication but terrible coordination. One morning, distracted by a colorful butterfly outside the window, he accidentally knocked a jar of cocoa powder, a cup of crushed walnuts, and a splash of wild honey into his sourdough dough instead of his brioche mixture.',
            'Realizing what he did only after the loaf was baking, Barnaby panicked as the sweet, rich aroma filled the village square. A crowd gathered outside, lured by the heavenly scent. When the dark, chocolatey loaf emerged, the villagers clamored for a bite.',
            'It was an absolute sensation. The "Choco-Sourdough" became the talk of the county. Barnaby laughed, realizing that some of life\'s best surprises are born from our slip-ups, proving that errors are just ingredients we haven\'t understood yet.'
        ]
    },
    {
        id: 'tale_3',
        title: 'The Lost Red Umbrella',
        author: 'Kindred Soul',
        quote: 'A small shelter shared can brighten the grayest days.',
        category: 'Kind Hearts',
        categoryKey: 'tale_library_category_kind',
        mood: 'Wholesome',
        coverColors: 'from-rose-500 to-red-800',
        content: [
            'On a dark, rainy Tuesday, a vibrant red umbrella lay forgotten on a bench in the busy central station. A hurried doctor, running to catch the night shift, noticed it. Realizing the rain was pouring harder, she picked it up, grateful for the unexpected shelter.',
            'On her way out, she saw an elderly man huddled under the station awning, shivering. Without hesitation, she walked over, popped the red umbrella open over him, and handed him the handle. "Here, take this," she smiled. "I am already heading inside."',
            'The man smiled, his eyes twinkling. The next morning, he left the umbrella on the same bench for another wet traveler. For weeks, the red umbrella passed from hand to hand around the town—a quiet, bright red vessel of kindness shared among strangers.'
        ]
    },
    {
        id: 'tale_4',
        title: 'The Cloud Cartographer',
        author: 'Dream Weaver',
        quote: 'Mapping the skies teaches us to appreciate the beauty of change.',
        category: 'Mini Adventures',
        categoryKey: 'tale_library_category_mini',
        mood: 'Motivating',
        coverColors: 'from-purple-600 to-violet-900',
        content: [
            'High in a tower built of wind and glass lived Pip, the Cloud Cartographer. While others mapped the solid, unchanging hills, Pip spent his days mapping the shape of the passing clouds. "How can you map what changes every second?" the townspeople asked.',
            '"That is the entire point," Pip would reply, adjusting his brass telescope. "To map them is to appreciate their temporary beauty. A cloud shaped like a sailing ship is no less real because it becomes a sleeping bear a minute later."',
            'One day, a storm rolled in. Instead of hiding, Pip drew the wild, dark cumulus formations. His maps taught the villagers that changes and storms in our lives are not things to fear, but beautiful, rolling shapes passing across the endless canvas of our minds.'
        ]
    }
];

const CalmTales: React.FC<CalmTalesProps> = ({ onBack, stressDataHook }) => {
    const { t } = useLanguage();
    const [selectedTale, setSelectedTale] = useState<CalmTale | null>(null);
    const [favorites, setFavorites] = useState<string[]>([]);
    const [filterCategory, setFilterCategory] = useState<string>('All');

    const toggleFavorite = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        setFavorites(prev => 
            prev.includes(id) ? prev.filter(fId => fId !== id) : [...prev, id]
        );
    };

    const handleReadTale = (tale: CalmTale) => {
        setSelectedTale(tale);
        
        // Add points for reading a story
        if (stressDataHook) {
            stressDataHook.addWellnessActivity(`Read Calm Tale: "${tale.title}"`);
        }
    };

    const handleRandomTale = () => {
        const randomIndex = Math.floor(Math.random() * TALES.length);
        handleReadTale(TALES[randomIndex]);
    };

    const categories = ['All', 'Calm Tales', 'Happy Laughs', 'Kind Hearts', 'Mini Adventures'];

    const filteredTales = filterCategory === 'All' 
        ? TALES 
        : TALES.filter(t => t.category === filterCategory);

    return (
        <div className="glass-card p-6 sm:p-8 rounded-2xl max-w-4xl mx-auto animate-fadeIn flex flex-col min-h-[550px]">
            {!selectedTale ? (
                <div className="space-y-6 flex-1 flex flex-col">
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 flex-shrink-0">
                        <button
                            onClick={onBack}
                            className="text-primary hover:text-violet-300 font-semibold transition-colors flex items-center gap-2"
                        >
                            <ArrowLeft className="h-4 w-4" /> {t('tool_back_to_tools')}
                        </button>
                        <button
                            onClick={handleRandomTale}
                            className="py-2 px-4 rounded-xl bg-primary hover:bg-violet-700 text-white font-semibold transition-colors shadow-lg shadow-primary/15 flex items-center gap-2 text-sm self-stretch sm:self-auto justify-center"
                        >
                            <RefreshCw className="h-4 w-4" />
                            {t('tale_library_random') || 'Random Story'}
                        </button>
                    </div>

                    {/* Intro */}
                    <div className="text-center">
                        <BookOpen className="h-10 w-10 text-primary mx-auto mb-2" />
                        <h2 className="text-3xl font-bold">{t('tool_tale_library_title')}</h2>
                        <p className="text-muted-foreground text-sm max-w-lg mx-auto">{t('tool_tale_library_desc')}</p>
                    </div>

                    {/* Filter Category Tabs */}
                    <div className="flex gap-2 overflow-x-auto pb-2 border-b border-border scrollbar-none flex-shrink-0">
                        {categories.map(cat => {
                            const isSelected = filterCategory === cat;
                            let transKey: TranslationKey = 'tale_library_mood_all';
                            if (cat === 'Calm Tales') transKey = 'tale_library_category_calm';
                            else if (cat === 'Happy Laughs') transKey = 'tale_library_category_happy';
                            else if (cat === 'Kind Hearts') transKey = 'tale_library_category_kind';
                            else if (cat === 'Mini Adventures') transKey = 'tale_library_category_mini';

                            return (
                                <button
                                    key={cat}
                                    onClick={() => setFilterCategory(cat)}
                                    className={`py-1.5 px-4 rounded-full text-xs font-semibold whitespace-nowrap border transition-all duration-300 ${
                                        isSelected 
                                            ? 'bg-primary border-transparent text-white shadow-md' 
                                            : 'bg-secondary border-border text-muted-foreground hover:text-foreground'
                                    }`}
                                >
                                    {t(transKey)}
                                </button>
                            );
                        })}
                    </div>

                    {/* Book Catalog Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 flex-1 items-center mt-4">
                        {filteredTales.map(tale => {
                            const isFavorite = favorites.includes(tale.id);
                            return (
                                <div 
                                    key={tale.id} 
                                    onClick={() => handleReadTale(tale)}
                                    className="cursor-pointer group flex flex-col h-full justify-between"
                                >
                                    {/* Book Cover using pre-defined index.html classes */}
                                    <div 
                                        className={`story-book-cover bg-gradient-to-br ${tale.coverColors}`}
                                    >
                                        <div className="story-book-cover-overlay"></div>
                                        
                                        {/* Favorite Star */}
                                        <button
                                            onClick={(e) => toggleFavorite(tale.id, e)}
                                            className="absolute top-3 right-3 p-1.5 rounded-full bg-black/40 hover:bg-black/60 text-white z-10 transition-colors"
                                            aria-label={t('tale_library_favorite')}
                                        >
                                            <Star className={`h-4 w-4 ${isFavorite ? 'fill-yellow-400 text-yellow-400' : 'text-white'}`} />
                                        </button>

                                        {/* Cover Text */}
                                        <div className="relative z-10 space-y-1">
                                            <span className="text-[10px] uppercase font-bold tracking-wider text-primary-foreground/75 bg-white/10 px-2 py-0.5 rounded">
                                                {t(tale.categoryKey)}
                                            </span>
                                            <h3 className="text-base font-bold text-white leading-tight mt-1 line-clamp-2">
                                                {tale.title}
                                            </h3>
                                            <p className="text-[10px] text-white/75 font-semibold">
                                                {t('tale_library_by')} {tale.author}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            ) : (
                /* Immersive Reader View matching pre-defined classes */
                <div className="flex-1 flex flex-col justify-between animate-fadeIn">
                    {/* Reader Header */}
                    <div className="flex items-center justify-between pb-4 border-b border-border flex-shrink-0">
                        <button
                            onClick={() => setSelectedTale(null)}
                            className="text-primary hover:text-violet-300 font-semibold transition-colors flex items-center gap-2 text-sm"
                        >
                            <ArrowLeft className="h-4 w-4" /> {t('tool_back_to_library') || 'Back to Catalog'}
                        </button>

                        <div className="flex items-center gap-3">
                            <button
                                onClick={(e) => toggleFavorite(selectedTale.id, e)}
                                className={`p-2 rounded-full border border-border bg-secondary hover:bg-muted transition-colors`}
                                title={t('tale_library_favorite')}
                            >
                                <Star className={`h-4 w-4 ${favorites.includes(selectedTale.id) ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground'}`} />
                            </button>
                        </div>
                    </div>

                    {/* Book Content - using .story-reader-view & .story-reader-content */}
                    <div className="flex-1 my-6 story-reader-view max-w-2xl mx-auto w-full">
                        <div className="story-reader-content">
                            <span className="text-xs uppercase font-bold tracking-wider text-primary">
                                {t(selectedTale.categoryKey)}
                            </span>
                            <h1>{selectedTale.title}</h1>
                            <h2>{t('tale_library_by')} {selectedTale.author}</h2>
                            
                            <div className="quote">
                                "{selectedTale.quote}"
                            </div>

                            <div className="space-y-4 text-justify">
                                {selectedTale.content.map((para, index) => (
                                    <p key={`para-${index}`}>{para}</p>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Reader Footer Actions */}
                    <div className="flex gap-4 border-t border-border pt-4 flex-shrink-0">
                        <button
                            onClick={() => handleReadTale(selectedTale)}
                            className="flex-1 py-2.5 px-4 rounded-xl font-semibold text-white bg-secondary hover:bg-muted transition-colors text-sm flex items-center justify-center gap-2"
                        >
                            <RefreshCw className="h-4 w-4" /> {t('tale_library_read_again') || 'Read Again'}
                        </button>
                        <button
                            onClick={() => setSelectedTale(null)}
                            className="flex-1 py-2.5 px-4 rounded-xl font-semibold text-white bg-primary hover:bg-violet-700 transition-colors shadow-lg shadow-primary/20 text-sm flex items-center justify-center gap-2"
                        >
                            <Sparkles className="h-4 w-4" />
                            {t('tool_back_to_library') || 'Finish Story'}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CalmTales;
