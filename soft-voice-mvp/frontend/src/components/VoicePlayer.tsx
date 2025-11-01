import React, { useRef, useEffect } from 'react';

interface VoicePlayerProps {
  audioUrl: string;
  autoPlay?: boolean;
}

export default function VoicePlayer({ audioUrl, autoPlay = true }: VoicePlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (autoPlay && audioRef.current) {
      audioRef.current.play().catch(err => {
        console.error('自動播放失敗:', err);
      });
    }
  }, [audioUrl, autoPlay]);

  return (
    <div className="flex items-center space-x-2 p-2 bg-soft-pink-50 rounded-lg">
      <audio 
        ref={audioRef}
        src={audioUrl} 
        controls 
        className="flex-1 h-8"
      />
    </div>
  );
}

