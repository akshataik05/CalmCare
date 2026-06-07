import React from 'react';

export const SoundPlayer: React.FC<{ soundUrl: string }> = ({ soundUrl }) => {
  const handlePlaySound = () => {
    const audio = new Audio(soundUrl);
    audio.play().catch(err => console.error('Error playing sound:', err));
  };

  return (
    <button onClick={handlePlaySound} className="text-sm text-primary hover:text-primary/80">
      Play Sound
    </button>
  );
};

export default SoundPlayer;