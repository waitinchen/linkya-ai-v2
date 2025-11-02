import React, { useState, useRef, useEffect } from 'react';
import { Mic, MicOff, AudioLines, ArrowUp } from 'lucide-react';

interface RecorderButtonProps {
  onRecordingComplete: (audioBlob: Blob) => void;
  disabled?: boolean;
  processing?: boolean;
}

export default function RecorderButton({ onRecordingComplete, disabled, processing = false }: RecorderButtonProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [micStatus, setMicStatus] = useState<'idle' | 'ready' | 'recording' | 'error'>('idle');
  const [audioLevel, setAudioLevel] = useState(0); // 音量級別 0-100
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const animationFrameRef = useRef<number | null>(null);
  const maxDuration = 10000; // 10秒

  // 音量監測
  useEffect(() => {
    if (micStatus === 'recording' && analyserRef.current) {
      const updateAudioLevel = () => {
        const bufferLength = analyserRef.current!.fftSize;
        const dataArray = new Uint8Array(bufferLength);
        analyserRef.current!.getByteFrequencyData(dataArray);
        
        // 計算平均音量
        const average = dataArray.reduce((sum, value) => sum + value, 0) / bufferLength;
        setAudioLevel(average);
        
        animationFrameRef.current = requestAnimationFrame(updateAudioLevel);
      };
      updateAudioLevel();
    } else {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      setAudioLevel(0);
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [micStatus]);

  const startRecording = async () => {
    try {
      setMicStatus('ready');
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      
      // 設置音頻分析器
      const audioContext = new AudioContext();
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 256;
      const source = audioContext.createMediaStreamSource(stream);
      source.connect(analyser);
      
      audioContextRef.current = audioContext;
      analyserRef.current = analyser;
      
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
        if (audioContextRef.current) {
          audioContextRef.current.close();
        }
      };
      
      mediaRecorder.start();
      setIsRecording(true);
      setMicStatus('recording');
      
      // 自動停止
      setTimeout(() => {
        if (mediaRecorderRef.current?.state === 'recording') {
          stopRecording();
        }
      }, maxDuration);
      
    } catch (error) {
      console.error('麥克風權限被拒絕:', error);
      setMicStatus('error');
      alert('請允許麥克風權限');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setMicStatus('idle');
    }
  };

  const handleClick = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  // 根據音量生成波動動畫的 scale
  const waveScale = micStatus === 'recording' ? 1 + Math.min(audioLevel / 120, 0.15) : 1;
  const showSendState = processing && micStatus !== 'recording' && micStatus !== 'error';
  const buttonBaseClass = `
    relative w-11 h-11 rounded-full flex items-center justify-center
    transition-all duration-300
    focus:outline-none focus-visible:ring-2 focus-visible:ring-pink-400
    focus-visible:ring-offset-2 focus-visible:ring-offset-[#1f1f22]
  `;
  const buttonStateClass = showSendState
    ? 'bg-white text-gray-900 shadow-[0_12px_28px_rgba(0,0,0,0.35)]'
    : micStatus === 'recording'
    ? 'bg-gradient-to-br from-pink-500 to-rose-500 text-white shadow-[0_12px_28px_rgba(244,114,182,0.45)]'
    : micStatus === 'error'
    ? 'bg-red-500/90 text-white shadow-[0_12px_28px_rgba(239,68,68,0.45)]'
    : 'bg-white/10 text-white hover:bg-white/20';
  
  return (
    <div className="flex items-center">
      {/* 錄音按鈕 */}
      <button
        onClick={handleClick}
        disabled={disabled}
        type="button"
        className={`${buttonBaseClass} ${buttonStateClass} ${
          disabled ? 'opacity-60 cursor-not-allowed pointer-events-none' : ''
        }`}
        style={{
          transform: `scale(${waveScale})`,
        }}
        aria-label={
          showSendState
            ? '語音上傳中'
            : micStatus === 'recording'
            ? '停止錄音'
            : '開始錄音'
        }
      >
        {showSendState ? (
          <ArrowUp className="w-5 h-5" strokeWidth={2.5} />
        ) : micStatus === 'error' ? (
          <MicOff className="w-5 h-5" />
        ) : micStatus === 'recording' ? (
          <AudioLines className="w-5 h-5" strokeWidth={2.5} />
        ) : (
          <Mic className="w-5 h-5" />
        )}

        {/* 錄音時的光暈 */}
        {micStatus === 'recording' && (
          <div 
            className="absolute inset-0 rounded-full bg-pink-400/30 blur-lg animate-pulse"
            style={{
              animationDuration: '1.4s',
            }}
          />
        )}
      </button>
    </div>
  );
}

