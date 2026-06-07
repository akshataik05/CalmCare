import type { FC } from 'react';
import type { Peer } from '../../types';
import { Users, UserPlus } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

interface PeerListProps {
    peers: Peer[];
    onSelectPeer: (peer: Peer) => void;
    onFindPeer: () => void;
}

const PeerList: FC<PeerListProps> = ({ peers, onSelectPeer, onFindPeer }) => {
    const { t } = useLanguage();

    const hasPeers = Array.isArray(peers) && peers.length > 0;

    return (
        <div className="space-y-6 animate-fadeIn">
            <div className="flex items-center gap-4">
                <Users className="h-10 w-10 text-primary" aria-hidden="true" />
                <div>
                    <h2 className="text-3xl font-bold">{t('peer_title')}</h2>
                    <p className="text-muted-foreground">{t('peer_description')}</p>
                </div>
            </div>

            <section
                className="glass-card p-6 rounded-2xl transition-transform duration-300 ease-in-out hover:scale-[0.98]"
                aria-label={t('peer_list_title')}
            >
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold">{t('peer_list_title')}</h3>
                    <button
                        type="button"
                        onClick={onFindPeer}
                        className="flex items-center gap-2 py-2 px-4 rounded-lg font-semibold text-white bg-primary hover:bg-violet-700 transition-colors"
                        aria-label={t('peer_list_find_button')}
                    >
                        <UserPlus className="h-5 w-5" aria-hidden="true" />
                        {t('peer_list_find_button')}
                    </button>
                </div>

                {hasPeers ? (
                    <div className="space-y-3">
                        {peers.map((peer) => (
                            <button
                                type="button"
                                key={peer.id}
                                onClick={() => onSelectPeer(peer)}
                                className="w-full flex items-center p-4 bg-secondary rounded-lg hover:bg-muted transition-colors text-left"
                                aria-label={peer.name}
                            >
                                <div className="h-12 w-12 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold mr-4">
                                    {peer.avatar}
                                </div>
                                <div>
                                    <p className="font-bold text-foreground">{peer.name}</p>
                                    <p className="text-sm text-muted-foreground">{peer.title}</p>
                                </div>
                            </button>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12 text-muted-foreground">
                        <Users className="h-12 w-12 mx-auto mb-4" aria-hidden="true" />
                        <p className="font-semibold">{t('peer_list_empty_title')}</p>
                        <p className="text-sm">{t('peer_list_empty_desc')}</p>
                    </div>
                )}
            </section>
        </div>
    );
};

export default PeerList;
