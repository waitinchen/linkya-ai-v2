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
    <div className="flex flex-col items-center space-y-2">
      {/* 麥克風狀態指示燈 */}
      <div className="flex items-center space-x-2">
        <div className="flex items-center space-x-1">
          <div 
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              micStatus === 'idle' ? 'bg-gray-300' :
              micStatus === 'ready' ? 'bg-yellow-400 animate-pulse' :
              micStatus === 'recording' ? 'bg-green-500 animate-pulse' :
              'bg-red-500 animate-pulse'
            }`}
          />
          <span className="text-xs text-gray-600">
            {micStatus === 'idle' ? '待機' :
             micStatus === 'ready' ? '準備中' :
             micStatus === 'recording' ? '錄音中' :
             '錯誤'}
          </span>
        </div>
      </div>

      {/* 錄音按鈕 */}
      <button
        onClick={handleClick}
        disabled={disabled}
        className={`
          relative w-14 h-14 rounded-full flex items-center justify-center
          transition-all duration-300 shadow-lg
          ${micStatus === 'recording'
            ? 'bg-red-500 hover:bg-red-600' 
            : micStatus === 'error'
            ? 'bg-gray-400 hover:bg-gray-500'
            : 'bg-gradient-to-r from-soft-pink-600 to-soft-pink-500 hover:from-soft-pink-500 hover:to-soft-pink-600'
          }
          disabled:opacity-50 disabled:cursor-not-allowed
        `}
        style={{
          transform: `scale(${waveScale})`,
        }}
      >
        {micStatus === 'error' ? (
          <MicOff className="w-6 h-6 text-white" />
        ) : (
          <Mic className="w-6 h-6 text-white" />
        )}
        
        {/* 波動背景動畫 */}
        {micStatus === 'recording' && (
          <>
            <div 
              className="absolute inset-0 rounded-full border-2 border-red-300 animate-ping"
              style={{
                animationDelay: '0s',
                borderWidth: '3px',
              }}
            />
            <div 
              className="absolute inset-0 rounded-full border-2 border-red-200 animate-ping"
              style={{
                animationDelay: '0.5s',
                borderWidth: '3px',
              }}
            />
          </>
        )}
      </button>

      {/* 音量波形可視化 */}
      {micStatus === 'recording' && (
        <div className="flex items-center space-x-1 h-4">
          <div 
            className="w-1 bg-red-400 rounded-full transition-all duration-75"
            style={{ height: `${Math.max(4, audioLevel / 2)}px` }}
          />
          <div 
            className="w-1 bg-red-400 rounded-full transition-all duration-75"
            style={{ height: `${Math.max(4, audioLevel / 1.5)}px` }}
          />
          <div 
            className="w-1 bg-red-500 rounded-full transition-all duration-75"
            style={{ height: `${Math.max(4, audioLevel)}px` }}
          />
          <div 
            className="w-1 bg-red-400 rounded-full transition-all duration-75"
            style={{ height: `${Math.max(4, audioLevel / 1.5)}px` }}
          />
          <div 
            className="w-1 bg-red-400 rounded-full transition-all duration-75"
            style={{ height: `${Math.max(4, audioLevel / 2)}px` }}
          />
        </div>
      )}
    </div>
  );
}

