import React, { useState, useRef } from 'react';
import { Mic, MicOff, Radio } from 'lucide-react';

interface RecorderButtonProps {
  onRecordingComplete: (audioBlob: Blob) => void;
  disabled?: boolean;
}

export default function RecorderButton({ onRecordingComplete, disabled }: RecorderButtonProps) {
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const maxDuration = 10000; // 10秒

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });
      
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };
      
      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(chunksRef.current, { type: 'audio/webm' });
        onRecordingComplete(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };
      
      mediaRecorder.start();
      setIsRecording(true);
      
      // 自動停止
      setTimeout(() => {
        if (isRecording && mediaRecorderRef.current?.state === 'recording') {
          stopRecording();
        }
      }, maxDuration);
      
    } catch (error) {
      console.error('麥克風權限被拒絕:', error);
      alert('請允許麥克風權限');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleClick = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={disabled || isRecording}
      className={`
        relative w-14 h-14 rounded-full flex items-center justify-center
        transition-all duration-300 shadow-lg
        ${isRecording 
          ? 'bg-red-500 hover:bg-red-600 animate-pulse' 
          : 'bg-gradient-to-r from-soft-pink-600 to-soft-pink-500 hover:from-soft-pink-500 hover:to-soft-pink-600'
        }
        disabled:opacity-50 disabled:cursor-not-allowed
      `}
    >
      {isRecording ? (
        <Radio className="w-6 h-6 text-white" />
      ) : (
        <Mic className="w-6 h-6 text-white" />
      )}
      
      {isRecording && (
        <span className="absolute -top-2 -right-2 w-4 h-4 bg-red-600 rounded-full animate-ping"></span>
      )}
    </button>
  );
}

