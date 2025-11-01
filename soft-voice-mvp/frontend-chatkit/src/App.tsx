import React, { useState } from 'react';
import { ChatKit, useChatKit } from '@openai/chatkit-react';
import { Mic } from 'lucide-react';

function App() {
  const [isRecording, setIsRecording] = useState(false);

  const { control } = useChatKit({
    // 使用自訂後端配置
    api: {
      url: 'http://localhost:3000/api/chatkit',
      domainKey: 'development-key', // 開發環境用的臨時 key
      fetch: (url, options) => {
        return fetch(url, {
          ...options,
          headers: {
            ...options?.headers,
            'Content-Type': 'application/json',
          },
        });
      },
    },

    // 花小軟主題配置
    theme: {
      colorScheme: 'light',
      color: {
        accent: {
          primary: '#ff6b95',  // 粉紅色
          level: 2,
        },
      },
      radius: 'round',
      density: 'normal',
      typography: { 
        fontFamily: 'Nunito, Helvetica Neue, sans-serif',
        baseSize: 16,
      },
    },

    // 啟動畫面配置
    startScreen: {
      greeting: '老爸你好～我是花小軟🌸\n點擊下面的按鈕開始跟我語音對話吧！',
      prompts: [
        { label: '打招呼', prompt: '你好' },
        { label: '問問題', prompt: '你是誰？' },
      ],
    },

    // Composer 配置
    composer: {
      placeholder: '和花小軟說話...',
    },

    // Header 配置
    header: {
      enabled: true,
      title: {
        text: '🌸 花小軟',
      },
    },

    // 事件處理
    onError: (event) => {
      console.error('ChatKit 錯誤:', event);
    },
    onReady: () => {
      console.log('🌸 花小軟已就緒～');
    },
    onResponseStart: () => {
      console.log('開始回應...');
    },
    onResponseEnd: () => {
      console.log('回應完成');
    },
  });

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col h-[90vh]">
        {/* 頂部裝飾 */}
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
                <p className="text-sm text-gray-500">語氣靈少女 · ChatKit 版本</p>
              </div>
            </div>

            {/* 語音錄製按鈕提示 */}
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Mic className="w-4 h-4" />
              <span>語音功能開發中...</span>
            </div>
          </div>
        </div>

        {/* ChatKit 組件 */}
        <div className="flex-1">
          <ChatKit 
            control={control} 
            className="w-full h-full"
          />
        </div>

        {/* 底部提示 */}
        <div className="p-4 border-t border-gray-200 bg-gray-50 text-center">
          <p className="text-xs text-gray-500">
            使用 OpenAI ChatKit 構建 · 自訂後端整合中
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;
