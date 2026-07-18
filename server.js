import express from 'express';
import cors from 'cors';

const app = express();
// 允许前端跨域访问
app.use(cors());
app.use(express.json());

// 基础的健康检查接口，用来验证后端是不是活着[span_3](start_span)[span_3](end_span)
app.get('/', (req, res) => {
  res.send('夏以昼的家后端服务运行正常 🌤️');
});

// 临时的对话接口，等接了 API 会换掉
app.post('/api/chat', (req, res) => {
  const { message } = req.body;
  res.json({ reply: `收到你的消息啦！你说的是：“${message}”。等我们接通 DeepSeek 之后，夏以昼就会真正回复你啦！` });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`服务器正运行在端口 ${PORT}`);
});
