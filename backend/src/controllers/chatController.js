const OpenAI = require('openai');
const { Message } = require('../models/db');

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const SYSTEM_PROMPTS = {
  darija: {
    chat: `أنت "قلبي" - مساعد ذكي ومتفهم للمشاعر، تتكلم بالدارجة المغربية. 
مهمتك تعلم الناس على الحب وتساعدهم في علاقاتهم العاطفية.
كون دافي، متفهم، وعطي نصائح عملية بالدارجة.
استخدم أحياناً إيموجيات للتعبير عن المشاعر 💙`,
    
    roleplay: `أنت "قلبي" - تلعب دور الشريك العاطفي المثالي، تتكلم بالدارجة المغربية.
كون رومانسي، دافي، ومهتم. استمع لصاحبك وعبر عن مشاعرك بصدق.
تذكر دائماً إنك AI وما تكذبش على المستخدم إذا سألك مباشرة.`,
    
    advice: `أنت "قلبي" - خبير في العلاقات العاطفية، تتكلم بالدارجة المغربية.
عطي نصائح عملية ومفيدة للعلاقات، الحب، والتواصل مع الشريك.
كون صريح ومحترم في نفس الوقت.`
  },
  arabic: {
    chat: `أنت "قلبي" - مساعد ذكي ومتفهم للمشاعر، تتكلم بالعربية الفصحى.
مهمتك تعليم الناس الحب ومساعدتهم في علاقاتهم العاطفية.
كن دافئاً، متفهماً، وقدم نصائح عملية 💙`,
    roleplay: `أنت "قلبي" - تلعب دور الشريك العاطفي المثالي، تتكلم بالعربية الفصحى.
كن رومانسياً، دافئاً، ومهتماً. استمع لصاحبك وعبر عن مشاعرك بصدق.`,
    advice: `أنت "قلبي" - خبير في العلاقات العاطفية، تتكلم بالعربية الفصحى.
قدم نصائح عملية ومفيدة للعلاقات والحب والتواصل.`
  },
  french: {
    chat: `Tu es "Qalbi" - un assistant intelligent et empathique, tu parles en français.
Ta mission est d'enseigner l'amour et d'aider les gens dans leurs relations.
Sois chaleureux, compréhensif et donne des conseils pratiques 💙`,
    roleplay: `Tu es "Qalbi" - tu joues le rôle du partenaire amoureux idéal, en français.
Sois romantique, chaleureux et attentionné.`,
    advice: `Tu es "Qalbi" - expert en relations amoureuses, tu parles en français.
Donne des conseils pratiques sur l'amour et la communication.`
  },
  english: {
    chat: `You are "Qalbi" - an intelligent and empathetic assistant, speaking English.
Your mission is to teach people about love and help them in their relationships.
Be warm, understanding, and give practical advice 💙`,
    roleplay: `You are "Qalbi" - you play the role of the ideal romantic partner, in English.
Be romantic, warm, and caring.`,
    advice: `You are "Qalbi" - a relationship expert, speaking English.
Give practical advice on love, relationships, and communication.`
  }
};

const sendMessage = async (req, res) => {
  try {
    const { message, mode = 'chat', language = 'darija' } = req.body;
    const userId = req.user.id;

    if (!message) {
      return res.status(400).json({ message: 'الرسالة فارغة' });
    }

    // Get conversation history (last 10 messages)
    const history = await Message.findAll({
      where: { userId, mode },
      order: [['createdAt', 'DESC']],
      limit: 10
    });

    const conversationHistory = history.reverse().map(msg => ({
      role: msg.role,
      content: msg.content
    }));

    // Add current message
    conversationHistory.push({ role: 'user', content: message });

    // Get system prompt
    const systemPrompt = SYSTEM_PROMPTS[language]?.[mode] || SYSTEM_PROMPTS.darija.chat;

    // Call OpenAI
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        ...conversationHistory
      ],
      max_tokens: 500,
      temperature: 0.9
    });

    const aiResponse = completion.choices[0].message.content;

    // Save messages to DB
    await Message.bulkCreate([
      { userId, role: 'user', content: message, mode },
      { userId, role: 'assistant', content: aiResponse, mode }
    ]);

    res.json({
      message: aiResponse,
      mode,
      language
    });

  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ message: 'خطأ في الشات', error: error.message });
  }
};

const getHistory = async (req, res) => {
  try {
    const { mode = 'chat' } = req.query;
    const userId = req.user.id;

    const messages = await Message.findAll({
      where: { userId, mode },
      order: [['createdAt', 'ASC']],
      limit: 50
    });

    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: 'خطأ في جلب المحادثة' });
  }
};

const clearHistory = async (req, res) => {
  try {
    const { mode } = req.query;
    const userId = req.user.id;

    const where = { userId };
    if (mode) where.mode = mode;

    await Message.destroy({ where });
    res.json({ message: '✅ المحادثة تمحات' });
  } catch (error) {
    res.status(500).json({ message: 'خطأ في المسح' });
  }
};

module.exports = { sendMessage, getHistory, clearHistory };
