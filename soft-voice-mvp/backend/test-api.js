// 測試腳本：驗證 OpenAI 和 Cartesia API 是否正常
import dotenv from 'dotenv';
import OpenAI from 'openai';
import axios from 'axios';

dotenv.config({ path: './.env' });

console.log('🧪 開始測試 API...\n');

// 檢查環境變數
const openaiKey = process.env.OPENAI_API_KEY;
const cartesiaKey = process.env.CARTESIA_API_KEY;

console.log('📋 環境變數檢查:');
console.log(`  OpenAI Key: ${openaiKey ? '✅ 已設置' : '❌ 未設置'}`);
console.log(`  Cartesia Key: ${cartesiaKey ? '✅ 已設置' : '❌ 未設置'}\n`);

// 測試 OpenAI LLM API
async function testOpenAILLM() {
  try {
    console.log('🤖 測試 OpenAI LLM API...');
    const openai = new OpenAI({ apiKey: openaiKey });
    
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: '你是花小軟，一個可愛的語氣靈少女' },
        { role: 'user', content: '你好' }
      ],
      temperature: 0.8,
      max_tokens: 50,
    });
    
    console.log('  ✅ LLM 測試成功!');
    console.log(`  回應: ${response.choices[0].message.content}\n`);
    return true;
  } catch (error) {
    console.log('  ❌ LLM 測試失敗!');
    console.log(`  錯誤: ${error.message}\n`);
    return false;
  }
}

// 測試 Cartesia TTS API
async function testCartesiaTTS() {
  try {
    console.log('🎵 測試 Cartesia TTS API...');

    const response = await axios.post(
      'https://api.cartesia.ai/tts/bytes',
      {
        model_id: 'sonic-3',
        transcript: '你好，我是花小軟',
        voice: {
          mode: 'id',
          id: 'd3cb9a1f-73d1-48d4-8ee9-53183b40e284'
        },
        output_format: {
          container: 'wav',
          encoding: 'pcm_f32le',
          sample_rate: 44100
        },
        language: 'zh',
        speed: 'normal'
      },
      {
        headers: {
          'X-API-Key': cartesiaKey,
          'Cartesia-Version': '2025-04-16',
          'Content-Type': 'application/json'
        },
        responseType: 'arraybuffer',
        timeout: 10000
      }
    );
    
    console.log('  ✅ TTS 測試成功!');
    console.log(`  音訊大小: ${response.data.length} bytes\n`);
    return true;
  } catch (error) {
    const status = error.response?.status;
    const errorData = error.response?.data;

    console.log('  ❌ TTS 測試失敗!');
    if (status === 401 || status === 403) {
      console.log('  錯誤: Cartesia API 金鑰無效或沒有權限\n');
      console.log('  提示: 請到 https://cartesia.ai/ 取得新的 API Key，並確認啟用了 Sonic TTS 訂閱\n');
    } else {
      console.log(`  錯誤: ${errorData || error.message}\n`);
    }
    return false;
  }
}

// 執行測試
async function runTests() {
  const llmOk = await testOpenAILLM();
  const ttsOk = await testCartesiaTTS();
  
  console.log('📊 測試結果總結:');
  console.log(`  OpenAI LLM: ${llmOk ? '✅ 正常' : '❌ 異常'}`);
  console.log(`  Cartesia TTS: ${ttsOk ? '✅ 正常' : '❌ 異常'}`);
  
  if (llmOk && ttsOk) {
    console.log('\n🎉 所有 API 測試通過！');
    process.exit(0);
  } else {
    console.log('\n⚠️  部分 API 測試失敗，請檢查配置');
    process.exit(1);
  }
}

runTests();

