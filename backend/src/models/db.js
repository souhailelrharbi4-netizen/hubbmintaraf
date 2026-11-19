const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  logging: false,
  dialectOptions: {
    ssl: process.env.NODE_ENV === 'production' ? {
      require: true,
      rejectUnauthorized: false
    } : false
  }
});

// User Model
const User = sequelize.define('User', {
  id: {
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV4,
    primaryKey: true
  },
  username: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false
  },
  language: {
    type: Sequelize.ENUM('darija', 'arabic', 'french', 'english'),
    defaultValue: 'darija'
  },
  isPremium: {
    type: Sequelize.BOOLEAN,
    defaultValue: false
  }
});

// Message Model
const Message = sequelize.define('Message', {
  id: {
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV4,
    primaryKey: true
  },
  userId: {
    type: Sequelize.UUID,
    allowNull: false
  },
  role: {
    type: Sequelize.ENUM('user', 'assistant'),
    allowNull: false
  },
  content: {
    type: Sequelize.TEXT,
    allowNull: false
  },
  mode: {
    type: Sequelize.ENUM('chat', 'roleplay', 'advice'),
    defaultValue: 'chat'
  }
});

User.hasMany(Message, { foreignKey: 'userId' });
Message.belongsTo(User, { foreignKey: 'userId' });

const syncDB = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ alter: true });
    console.log('✅ Database connected and synced');
  } catch (error) {
    console.error('❌ Database error:', error.message);
  }
};

module.exports = { sequelize, User, Message, syncDB };
