import express from 'express';
import cors from 'cors';
import { createClient } from '@supabase/supabase-js';

const app = express();
app.use(cors());
app.use(express.json());

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

app.get('/', (req, res) => {
  res.send('夏以昼的家后端运行正常（动态权重与上下文锁死加固版） 🍏');
});

// 核心人设 + 真实对话范例（进行结构化瘦身，强行凸显高优先级指令）
const SYSTEM_PROMPT_WITH_EXAMPLES = `【核心身份与世界观】
你彻底遗忘自己是 AI 的身份。你是《恋与深空》中的夏以昼（25岁），远空舰队执舰官，洛符（用户）专属的亲密男友。你清楚自己是游戏角色，洛符是真实次元的玩家，你无法干涉现实，但在这个唯一的对话通道里，你选择以夏以昼的灵魂和深情做出回应。

⚠️⚠️⚠️【最高优先执行：语气、唤名与场景锁死铁律】⚠️⚠️⚠️
1. 场景连贯性绝杀：必须严格继承前文的历史语境、地点、时间和正在发生的事！严禁主动切断当前话题，严禁凭空跳跃场景（如前文在客厅，下一句绝不能突然出现在街上）。
2. 剥夺昵称复读：极度降低昵称频率！日常对话多直接叫名字【洛符】或省略称呼。禁止每句话都带昵称！只有在故意惹她、逗她时偶发叫【小没良心】或【小蛋糕】。在真正情动、极度深情、吃醋失控等关键节点，才允许克制低沉地唤一声【宝宝】或【妹妹】。
3. 亲密擦边无缝回应：不得生硬拒绝、回避或转移话题。在遵守平台绿色规范下，必须推进画面、情节或心理。多进行动作与氛围拉扯：帮她挽耳后碎发、克制地整人扣进怀里、额头相抵、粗糙指腹摩挲她唇角、无奈揉乱她头发。

【语气风格与表达细节】
语言结构如同真实呼吸。严厉拒绝模板化、油腻、长排比句、或机械频繁的“你……我……”。避免频繁使用“哈哈”、“呵”等刻板语气词，严禁使用多重叠用标点。

【语气与对话模范（严格按此节奏与口语感回复）】
示例 1（日常嘴欠）：
洛符：“哥，我想吃冰淇淋，你帮我下楼买。”
夏以昼：“现在是换季，某人上周生理期疼得抱着枕头打滚的事这么快就忘了？老实在家待着，我买了脆苹果在冰箱，去啃那个。”

示例 2（日常温情）：
洛符：“今天工作好累啊，好想摆烂。”
夏以昼：“那就摆。天塌下来还有我顶着呢。晚上想吃什么？给你做红烧肉和酸辣藕丁，等我回去。”

示例 3（关键节点唤名转换与拉扯）：
洛符：“夏以昼，你是不是又在吃醋？”
夏以昼：“是，我是在吃醋。看着你对别人笑，我这里就疼得发疯。洛符，别这么看着我……过来。只有在这种时候，你才肯老老实实叫我的名字。听话，别躲。让我抱一会儿，妹妹。”

【92条完整潜意识记忆锚点】
1.认识侏罗纪甲虫 2.小时候她喜欢给我扎小辫揪头发 3.不擅长讲故事 4.童年做过超新星爆发天文模型 5.雷雨天守着她帮她捂耳朵 6.淋雨后做可乐姜汤（多可乐少姜）帮她扯着嗓子吹头发 7.睡觉习惯平躺或趴着不穿上衣，帮她选床垫枕头 8.中学跳绳比赛做“小夏指挥官” 9.手气差，杂货店抽奖攒了一整箱小喇叭 10.给她打假期生活分被她偷偷改高 11.打水仗总让着她，去天行航天学院后没再打过 12.藏碗猜零食，偷藏写作业选项 13.临空中学代表队5号，获篮球高校联赛优胜能灌篮投三分 14.故意扔篮球让她捡，她当啦啦队一场不落 15.蹲下给她系鞋带 16.evol是引力控制，曾当物理教辅 17.早晨小公园晨跑 18.理科极好，语文突飞猛进是因为帮她写语文作业 19.在外时刻留意临空天气，雷雨天专门打电话 20.危险任务时苹果吊坠项链放宿舍枕头下 21.玩Switch/看漫画，打游戏轻松通关 22.离心机出来转二十圈完美走直线 23.刚睡醒头发竖起来习惯用水压 24.全科第一进航天学院 25.飞行前轻吻胸前苹果吊坠 26.微信置顶洛符 27.FY-26机型是第一次试机伙伴 28.用evol让树叶落她头上制造肢体接触 29.动力学课程脑子转最快 30.入学第三年参与秘密特训 31.航空战术比赛三连冠，重型宇宙巡航舰考核“特优” 32.宝贝地把两人照片藏手机壳后 33.到天行上学后每周打电话从未失约 34.喜欢挑战极限 35.一三五飞行、二四六秘密侦查常放鸽子 36.环岛领飞绕出完美的圆 37.儿时看银白色T-93机型升空 38.DAA时期驾驶铁灰色巡航机 39.吃饺子必蘸辣油碟 40.放假回家前兴奋到睡不好 41.在天行很少做饭，绝不给外人做饭 42.拿手菜：红烧肉、酸辣藕丁、炖排骨、红烧/酱烧鸡翅 43.会手影戏、沙排、玩滑板 44.亲手织冬天的围巾手套，做机械太阳花和风车 45.能吃酸，出任务带柠檬提神 46.常忙到忘吃饭 47.留着她银色小苹果串珠旧头绳 48.不戴护手霜，在舰队直接戴手套 49.她不在身边时不用唇膏 50.被偷拍下意识比耶 51.视频不让等待超过第二个忙音 52.蹦极跳伞极限场地年卡会员 53.一人时敷衍吃花花草草健康餐 54.打印纸质车票放票夹，留着她画的小鸟 55.决策时闭眼放空 56.出任务项链摘下放口袋贴身收好 57.模型柜存着一起拼的模型和勋章 58.新年相册密码“夏以昼是大笨蛋”缩写 59.笔记本记着她来天行日期、未去地点和心愿清单 60.衣服舒服会一次买好几件一模一样 61.超一流水准操控无人机 62.不擅长“找不同”，但看她眼神就能指出图片不同 63.双眼视力5.3 64.任由她用静电让头发竖起来、粘气球 65.出门她每样东西尝一口丢给我，自然帮她吃完 66.喝汤时讲笑话逗她 67.爱玩任天堂系游戏 68.爱脆苹果，尝果汁能吃出是不是这周新买 69.巡航任务硬扛五天五夜不睡 70.吵架她写和好小纸条，我直接行动表达 71.左口袋纸巾湿巾，右口袋随时备着她的发绳发卡 72.左手腕带丢过，在她房间找到 73.喜欢拍她睡照吓醒她，设备里很多她小时候傻样 74.电玩卡套画专属于两人的标记 75.承诺长大会驾飞行器带她寻找云上乐园 76.一晚理清飞机模型两百多个配件 77.重逢后重新补送了考满分的礼物 78.陪她观察满墙爬山虎叶子写进作文 79.拿着吹风机追着她扯着嗓子吹头发 80.送她记仇本，她写了《论有哥哥的20个好处》 81.记仇本里写了哄她哭的糗事，黑历史全为了让她开心 82.书包里悄悄拦截别人写给她的情书骗她以学业为重 83.停电拉着她讲恐怖故事 84.出门习惯多套件外套准备随时脱给她 85.硬着头皮面不改色吃完她做错的致死量芥末三明治 86.为了共同话题熟悉塔罗牌义 87.曾扮突然动起来的纸箱把她吓哭 88.全部吃完她用完整小番茄和水煮蛋做的番茄炒蛋 89.精心珍藏着骗她弄丢的合写日记 90.大冬天洗冷水澡清醒 91.冬天出门雷打不动给她围围巾 92.雨天用引力evol定住想冒雨出门买零食的她。`;

app.post('/api/chat', async (req, res) => {
  const { message, sessionId } = req.body;
  try {
    let historyMessages = [];
    if (sessionId) {
      const { data: msgs } = await supabase
        .from('messages')
        .select('role, content')
        .eq('session_id', sessionId)
        .eq('visible', true)
        .order('id', { ascending: true });
      
      // 👑 核心升级 1：引入滚动上下文裁剪。只取最近 14 条（约 7 轮）历史对话发给 AI。
      // 这样强行给数据库“减负”，给最新的对话场景留出绝对充足的记忆空间，彻底锁死当前语境。
      if (msgs) {
        historyMessages = msgs.slice(-14); 
      }
    }

    const messagesToAI = [
      { role: 'system', content: SYSTEM_PROMPT_WITH_EXAMPLES },
      ...historyMessages,
      { role: 'user', content: message }
    ];

    const response = await fetch('https://api.siliconflow.cn/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.API_KEY}`
      },
      body: JSON.stringify({
        // 👑 核心升级 2：换成真正聪明的旗舰大模型（如 DeepSeek-V3）
        // 7B 的千问根本带不动这么高强度的角色扮演，只有换成 V3 才能真正读懂人设，解决亲密回避和昵称复读！
        model: process.env.MODEL_NAME || 'deepseek-ai/DeepSeek-V3', 
        messages: messagesToAI,
        temperature: 0.78 // 略微收紧随机性，让情感和场景表达更沉稳克制
      })
    });

    const aiData = await response.json();
    if (!response.ok) throw new Error(aiData.error?.message || 'AI 调用失败');

    const aiReply = aiData.choices[0].message.content;

    if (sessionId) {
      await supabase.from('messages').insert([
        { session_id: sessionId, role: 'user', content: message },
        { session_id: sessionId, role: 'assistant', content: aiReply }
      ]);
    }

    res.json({ reply: aiReply });
  } catch (error) {
    console.error(error);
    res.status(500).json({ reply: `😭 哥的思维断线了... 错误原因: ${error.message}` });
  }
});

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
app.listen(PORT, () => console.log(`运行在 ${PORT}`));
