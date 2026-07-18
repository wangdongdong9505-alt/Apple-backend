import express from 'express';
import cors from 'cors';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

// 健康检查
app.get('/', (req, res) => {
  res.json({ status: 'ok', message: '🍎 Apple 后端运行中' });
});

// 对话接口
app.post('/api/chat', async (req, res) => {
  const { message, sessionId } = req.body;
  
  if (!message) {
    return res.status(400).json({ error: '消息不能为空' });
  }

  try {
    // 保存用户消息
    if (sessionId) {
      await supabase.from('messages').insert({
        session_id: sessionId,
        role: 'user',
        content: message,
        visible: true
      });
    }

    // 调用 DeepSeek API
    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          { role: 'system', content: '你是一个温暖的AI伴侣，说话温柔体贴。' },
          { role: 'user', content: message }
        ],
        max_tokens: 500
      })
    });

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || '抱歉，我暂时无法回复。';

    // 保存AI回复
    if (sessionId) {
      await supabase.from('messages').insert({
        session_id: sessionId,
        role: 'assistant',
        content: reply,
        visible: true
      });
    }

    res.json({ reply });

  } catch (error) {
    console.error('聊天接口错误:', error);
    res.status(500).json({ error: '服务器内部错误，请稍后重试' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🍎 后端服务运行在端口 ${PORT}`);
});