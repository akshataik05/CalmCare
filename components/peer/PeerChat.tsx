import React, { useState, useEffect, useRef, useCallback } from 'react';
import { type Peer, type PeerChatMessage, type StressDataHook } from '../../types';
import { getPeerReply } from '../../services/geminiService';
import { Send, ArrowLeft, Loader2, User } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';


interface PeerChatProps {
    peer: Peer;
    stressDataHook: StressDataHook;
    onBack: () => void;
}

const PeerChat: React.FC<PeerChatProps> = ({ peer, stressDataHook, onBack }) => {
    const { peerChats, addPeerMessage } = stressDataHook;
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const { t } = useLanguage();

    const chatHistory = peerChats[peer.id] || [];

    const scrollToBottom = useCallback(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, []);

    useEffect(() => {
        scrollToBottom();
    }, [chatHistory.length, scrollToBottom]);

    const handleSend = async () => {
        if (input.trim() === '' || isLoading) return;

        const userMessageText = input.trim();
        setInput('');
        setError(null);

        const userMessage: PeerChatMessage = {
            role: 'user',
            text: userMessageText,
        };

        // Update UI immediately
        addPeerMessage(peer.id, userMessage);

        // Prepare history including the latest user message for the model
        const updatedHistory: PeerChatMessage[] = [...chatHistory, userMessage];

        setIsLoading(true);

        try {
            const aiReply = await getPeerReply(userMessageText, updatedHistory);

            const peerMessage: PeerChatMessage = {
                role: 'peer',
                text: aiReply,
            };

            addPeerMessage(peer.id, peerMessage);
        } catch (err) {
            console.error('Error getting peer reply:', err);
            setError(t('peer_chat_error') || 'Something went wrong. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="flex flex-col h-full glass-card rounded-2xl shadow-lg animate-fadeIn">
            <header className="flex items-center p-4 border-b border-border">
                <button
                    type="button"
                    onClick={onBack}
                    className="p-2 rounded-full hover:bg-secondary mr-3"
                    aria-label={t('chat_back_aria') || 'Back'}
                    title={t('chat_back_aria') || 'Back'}
                >
                    <ArrowLeft className="h-5 w-5" aria-hidden="true" />
                </button>
                <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold mr-3">
                    {peer.avatar}
                </div>
                <div>
                    <h3 className="font-bold text-foreground">{peer.name}</h3>
                    <p className="text-sm text-muted-foreground">{peer.title}</p>
                </div>
            </header>

            <div className="flex-1 p-6 space-y-6 overflow-y-auto">
                {chatHistory.map((msg, index) => {
                    if (msg.role === 'user') {
                        return (
                            <div key={index} className="flex items-start justify-end gap-3">
                                <div className="max-w-md p-3 rounded-2xl shadow-md bg-primary text-primary-foreground rounded-br-none">
                                    <p className="text-sm leading-relaxed">{msg.text}</p>
                                </div>
                                <div className="flex-shrink-0 h-8 w-8 rounded-full bg-secondary flex items-center justify-center">
                                    <User className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
                                </div>
                            </div>
                        );
                    }

                    if (msg.role === 'peer') {
                        return (
                            <div key={index} className="flex items-start gap-3">
                                <div className="flex-shrink-0 h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">
                                    {peer.avatar}
                                </div>
                                <div className="max-w-md p-3 rounded-2xl shadow-md bg-secondary text-secondary-foreground rounded-bl-none">
                                    <p className="text-sm leading-relaxed">{msg.text}</p>
                                </div>
                            </div>
                        );
                    }

                    return null;
                })}

                {isLoading && (
                    <div className="flex items-end gap-3 animate-fadeIn">
                        <div className="flex-shrink-0 h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">
                            {peer.avatar}
                        </div>
                        <div className="max-w-md p-3 rounded-2xl shadow-md bg-secondary">
                            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" aria-hidden="true" />
                        </div>
                    </div>
                )}

                {error && (
                    <div className="text-xs text-red-500 px-1">
                        {error}
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>

            <div className="p-4 bg-card border-t border-border rounded-b-2xl">
                <div className="relative">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder={t('peer_chat_placeholder_dynamic').replace('{peerName}', peer.name)}
                        className="w-full py-3 pl-4 pr-12 text-sm bg-background rounded-full text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-shadow disabled:opacity-60"
                        disabled={isLoading}
                    />
                    <button
                        type="button"
                        onClick={handleSend}
                        disabled={isLoading || !input.trim()}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-primary text-primary-foreground hover:bg-violet-700 disabled:bg-muted disabled:cursor-not-allowed transition-colors"
                        aria-label={t('chat_send_aria') || 'Send message'}
                        title={t('chat_send_aria') || 'Send message'}
                    >
                        <Send className="h-5 w-5" aria-hidden="true" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PeerChat;
