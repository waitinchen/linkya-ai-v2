import React, { useState, useRef, useEffect } from 'react';
import { Mic, MicOff } from 'lucide-react';

interface RecorderButtonProps {
  onRecordingComplete: (audioBlob: Blob) => void;
  disabled?: boolean;
}

export default function RecorderButton({ onRecordingComplete, disabled }: RecorderButtonProps) {
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
  const waveScale = micStatus === 'recording' ? 1 + (audioLevel / 30) : 1;
  
  return (
    <div className="flex items-center space-x-2">
      {/* 錄音按鈕 */}
      <button
        onClick={handleClick}
        disabled={disabled}
        className={`
          relative w-10 h-10 rounded-full flex items-center justify-center
          transition-all duration-300
          ${micStatus === 'recording'
            ? 'bg-red-500 hover:bg-red-600' 
            : micStatus === 'error'
            ? 'bg-gray-500 hover:bg-gray-600'
            : 'bg-white/10 hover:bg-white/20'
          }
          disabled:opacity-50 disabled:cursor-not-allowed
        `}
        style={{
          transform: `scale(${waveScale})`,
        }}
      >
        {micStatus === 'error' ? (
          <MicOff className="w-5 h-5 text-white" />
        ) : (
          <Mic className="w-5 h-5 text-white" />
        )}
        
        {/* 波動背景動畫 */}
        {micStatus === 'recording' && (
          <div 
            className="absolute inset-0 rounded-full border-2 border-red-300 animate-ping"
            style={{
              animationDelay: '0s',
              borderWidth: '2px',
            }}
          />
        )}
      </button>

      {/* 音量波形可視化（整合在按鈕右側） */}
      {micStatus === 'recording' && (
        <div className="flex items-center space-x-0.5 h-6">
          <div 
            className="w-0.5 bg-red-400 rounded-full transition-all duration-75"
            style={{ height: `${Math.max(6, audioLevel / 2)}px` }}
          />
          <div 
            className="w-0.5 bg-red-400 rounded-full transition-all duration-75"
            style={{ height: `${Math.max(8, audioLevel / 1.5)}px` }}
          />
          <div 
            className="w-0.5 bg-red-500 rounded-full transition-all duration-75"
            style={{ height: `${Math.max(10, audioLevel)}px` }}
          />
          <div 
            className="w-0.5 bg-red-400 rounded-full transition-all duration-75"
            style={{ height: `${Math.max(8, audioLevel / 1.5)}px` }}
          />
          <div 
            className="w-0.5 bg-red-400 rounded-full transition-all duration-75"
            style={{ height: `${Math.max(6, audioLevel / 2)}px` }}
          />
        </div>
      )}
    </div>
  );
}

