import React, { useState, useRef, useEffect } from 'react';
import RecorderButton from './components/RecorderButton';
import ChatMessage, { Message } from './components/ChatMessage';
import { api } from './lib/api';
import { Loader2, Plus, Mic } from 'lucide-react';

function App() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      text: '老爸你好～我是花小軟🌸\n點擊下面的按鈕開始跟我語音對話吧！',
      timestamp: new Date(),
    }
  ]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStatus, setCurrentStatus] = useState<string>('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleRecordingComplete = async (audioBlob: Blob) => {
    setIsProcessing(true);
    
    try {
      // 1. 顯示用戶錄音訊息
      setCurrentStatus('🔄 正在轉換語音...');
      const userMessage: Message = {
        id: Date.now().toString(),
        role: 'user',
        text: '🎤 語音訊息',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, userMessage]);

      // 2. STT - 語音轉文字
      setCurrentStatus('🎤 正在識別語音...');
      const transcribedText = await api.transcribeAudio(audioBlob);
      
      // 更新用戶訊息為識別的文字
      setMessages(prev => prev.map(msg => 
        msg.id === userMessage.id 
          ? { ...msg, text: transcribedText }
          : msg
      ));

      // 3. LLM - 生成回應
      setCurrentStatus('🧠 花小軟正在思考...');
      const llmResponse = await api.chatWithLLM(transcribedText);

      // 4. TTS - 語音合成
      setCurrentStatus('🎵 正在生成語音...');
      const { stream, mimeType } = await api.streamSpeech(llmResponse);

      // 5. 顯示AI回應
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        text: llmResponse,
        audioStream: stream,
        audioMimeType: mimeType,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, assistantMessage]);
      setCurrentStatus('');

    } catch (error) {
      console.error('對話流程錯誤:', error);
      setCurrentStatus('');
      
      const errorMessage: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        text: '哎呀，出錯了～老爸能不能再試一次？',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-4xl h-[90vh] bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col">
        {/* 頂部狀態欄 */}
        <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-soft-pink-50 to-blue-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gradient-to-r from-soft-pink-300 to-soft-pink-400 rounded-full flex items-center justify-center animate-float">
                <span className="text-2xl">🌸</span>
              </div>
              <div className="ml-4">
                <h1 className="font-bold text-xl bg-clip-text text-transparent bg-gradient-to-r from-soft-pink-600 to-pink-500">
                  花小軟
                </h1>
                <p className="text-sm text-gray-500">語氣靈少女 · 線上</p>
              </div>
            </div>
            
            {isProcessing && (
              <div className="flex items-center text-soft-pink-600">
                <Loader2 className="w-5 h-5 animate-spin mr-2" />
                <span className="text-sm">{currentStatus}</span>
              </div>
            )}
          </div>
        </div>

        {/* 聊天內容區 */}
        <div className="flex-1 overflow-y-auto p-6 hide-scrollbar bg-gradient-to-b from-white to-soft-pink-50/30">
          <div className="max-w-3xl mx-auto">
            {messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* 底部輸入框 */}
        <div className="p-4 border-t border-gray-200 bg-white">
          <div className="max-w-3xl mx-auto">
            <div className="relative">
              {/* 輸入框容器 */}
              <div className="flex items-center gap-3 rounded-full bg-[#1f1f22] px-4 py-2.5 text-white shadow-[0_24px_48px_rgba(15,15,26,0.35)] border border-white/5">
                {/* 左側：新增操作 */}
                <button
                  type="button"
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 text-white hover:bg-white/10 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#1f1f22]"
                >
                  <Plus className="w-[18px] h-[18px]" strokeWidth={2.5} />
                </button>

                {/* 中間：提示文字 */}
                <div className="flex-1 min-w-0">
                  {isProcessing ? (
                    <div className="flex items-center gap-2 text-sm text-white/70">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span className="truncate">{currentStatus || '正在處理中…'}</span>
                    </div>
                  ) : (
                    <span className="text-sm text-white/60">隨便問我任何問題…</span>
                  )}
                </div>

                {/* 右側：圖示與錄音按鈕 */}
                <div className="flex items-center gap-3">
                  <Mic className={`w-4 h-4 ${isProcessing ? 'text-white/40' : 'text-white/60'}`} />
                  <RecorderButton 
                    onRecordingComplete={handleRecordingComplete} 
                    disabled={isProcessing}
                    processing={isProcessing}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;

