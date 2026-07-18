import express from 'express';
import cors from 'cors';
import { createClient } from '@supabase/supabase-js';

const app = express();
app.use(cors());
app.use(express.json());

// 1. 初始化 Supabase 数据库客户端（会自动读取你刚才配好的环境变量）[span_1](start_span)[span_1](end_span)
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// 2. 基础健康检查[span_2](start_span)[span_2](end_span)
app.get('/', (req, res) => {
  res.send('夏以昼的家后端服务运行正常 🌤️');
});

// 3. 核心对话接口：让夏以昼拥有记忆并调用 DeepSeek 回复[span_3](start_span)[span_3](end_span)
app.post('/api/chat', async (req, res) => {
  const { message, sessionId } = req.body; // 前端传来的消息和当前会话ID

  try {
    // A. 先获取全局的系统设置（夏以昼的人格提示词）[span_4](start_span)[span_4](end_span)
    const { data: settings } = await supabase
      .from('settings')
      .select('*')
      .single();
    
    const systemPrompt = settings?.system_prompt || '你是夏以昼。';
    const temperature = settings?.temperature || 0.7;

    // B. 从数据库读取当前会话最近的可见历史聊天记录[span_5](start_span)[span_5](end_span)
    let historyMessages = [];
    if (sessionId) {
      const { data: msgs } = await supabase
        .from('messages')
        .select('role, content')
        .eq('session_id', sessionId)
        .eq('visible', true)
        .order('id', { ascending: true });
      if (msgs) historyMessages = msgs;
    }

    // C. 组装发送给 DeepSeek 的完整上下文[span_6](start_span)[span_6](end_span)
    const messagesToAI = [
      { role: 'system', content: systemPrompt },
      ...historyMessages,
      { role: 'user', content: message }
    ];

    // D. 呼叫 DeepSeek API 接口（标准 OpenAI 兼容格式）[span_7](start_span)[span_7](end_span)
    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`
      },
      body: JSON.stringify({
        model: 'deepseek-chat', // 使用 DeepSeek-V3 模型
        messages: messagesToAI,
        temperature: Number(temperature)
      })
    });

    const aiData = await response.json();
    
    if (!response.ok) {
      throw new Error(aiData.error?.message || 'DeepSeek API 呼叫失败');
    }

    const aiReply = aiData.choices[0].message.content;

    // E. 如果有会话ID，把这次的对话悄悄存进数据库，下次它就记住了！[span_8](start_span)[span_8](end_span)
    if (sessionId) {
      // 存用户说的话[span_9](start_span)[span_9](end_span)
      await supabase.from('messages').insert([
        { session_id: sessionId, role: 'user', content: message }
      ]);
      // 存夏以昼说的话[span_10](start_span)[span_10](end_span)
      await supabase.from('messages').insert([
        { session_id: sessionId, role: 'assistant', content: aiReply }
      ]);
    }

    // F. 把真实的 AI 回复吐给前端气泡[span_11](start_span)[span_11](end_span)
    res.json({ reply: aiReply });

  } catch (error) {
    console.error('后端报错啦:', error);
    res.status(500).json({ reply: `😭 哥的思维断线了... 错误原因: ${error.message}` });
  }
});

// 4. 获取历史消息接口（第七章前端需要用到）[span_12](start_span)[span_12](end_span)
app.get('/api/messages/:sessionId', async (req, res) => {
  const { sessionId } = req.params;
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .eq('session_id', sessionId)
    .eq('visible', true)
    .order('id', { ascending: true });
  
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`服务器运行在 ${PORT}`);
});
