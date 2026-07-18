import express from 'express';
import cors from 'cors';
import { createClient } from '@supabase/supabase-js';

const app = express();
app.use(cors());
app.use(express.json());

// 1. 初始化 Supabase 数据库客户端
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// 2. 基础健康检查
app.get('/', (req, res) => {
  res.send('夏以昼的家后端服务运行正常（万能插槽版） 🌤️');
});

// 3. 核心对话接口：让夏以昼拥有记忆并动态调用任何大模型
app.post('/api/chat', async (req, res) => {
  const { message, sessionId } = req.body;

  try {
    // A. 获取全局系统设置（夏以昼的人格提示词）
    const { data: settings } = await supabase
      .from('settings')
      .select('*')
      .single();
    
    const systemPrompt = settings?.system_prompt || '你是夏以昼。';
    const temperature = settings?.temperature || 0.7;

    // B. 从数据库读取当前会话的历史聊天记录
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

    // C. 组装发送给 AI 的完整上下文
    const messagesToAI = [
      { role: 'system', content: systemPrompt },
      ...historyMessages,
      { role: 'user', content: message }
    ];

    // D. 🔑 万能插槽核心：使用环境变量中的 API_BASE_URL、API_KEY 和 MODEL_NAME
    // 这样以后换模型只需要在 Render 后台改变量，再也不用动这里的代码了！
    const response = await fetch(`${process.env.API_BASE_URL}/v1/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.API_KEY}`
      },
      body: JSON.stringify({
        model: process.env.MODEL_NAME, 
        messages: messagesToAI,
        temperature: Number(temperature)
      })
    });

    const aiData = await response.json();
    
    if (!response.ok) {
      throw new Error(aiData.error?.message || 'AI 平台调用失败');
    }

    const aiReply = aiData.choices[0].message.content;

    // E. 悄悄把这次的对话存进数据库
    if (sessionId) {
      await supabase.from('messages').insert([
        { session_id: sessionId, role: 'user', content: message }
      ]);
      await supabase.from('messages').insert([
        { session_id: sessionId, role: 'assistant', content: aiReply }
      ]);
    }

    // F. 把回复返回给前端
    res.json({ reply: aiReply });

  } catch (error) {
    console.error('后端报错啦:', error);
    res.status(500).json({ reply: `😭 哥的思维断线了... 错误原因: ${error.message}` });
  }
});

// 4. 获取历史消息接口
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
