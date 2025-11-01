import React from 'react';
import { Volume2, User } from 'lucide-react';

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  audioUrl?: string;
  timestamp: Date;
}

interface ChatMessageProps {
  message: Message;
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === 'user';
  const timeStr = message.timestamp.toLocaleTimeString('zh-CN', { 
    hour: '2-digit', 
    minute: '2-digit' 
  });

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-6`}>
      {!isUser && (
        <div className="w-10 h-10 mr-3 flex-shrink-0">
          <div className="w-full h-full rounded-full bg-gradient-to-r from-soft-pink-300 to-soft-pink-400 flex items-center justify-center animate-float">
            <span className="text-2xl">🌸</span>
          </div>
        </div>
      )}
      
      <div className="max-w-[85%]">
        <div
          className={`
            message-animate rounded-2xl p-4 relative
            ${isUser
              ? 'bg-gradient-to-r from-blue-100 to-blue-200 text-blue-900 rounded-tr-none'
              : 'bg-gradient-to-r from-soft-pink-100 to-soft-pink-200 text-soft-pink-900 rounded-tl-none'
            }
          `}
        >
          <div className="flex items-center mb-2">
            {!isUser && (
              <span className={`font-semibold ${isUser ? 'text-blue-800' : 'text-soft-pink-700'}`}>
                花小軟
              </span>
            )}
            <span className={`text-xs ml-2 ${isUser ? 'text-blue-600' : 'text-soft-pink-600'}`}>
              {timeStr}
            </span>
          </div>
          
          <div className="whitespace-pre-wrap">{message.text}</div>
          
          {message.audioUrl && !isUser && (
            <div className="mt-3 pt-3 border-t border-soft-pink-300">
              <audio 
                src={message.audioUrl} 
                controls 
                className="w-full h-8"
                autoPlay
              />
            </div>
          )}
        </div>
      </div>
      
      {isUser && (
        <div className="w-10 h-10 ml-3 flex-shrink-0">
          <div className="w-full h-full rounded-full bg-gradient-to-r from-blue-400 to-blue-500 flex items-center justify-center">
            <User className="w-5 h-5 text-white" />
          </div>
        </div>
      )}
    </div>
  );
}

