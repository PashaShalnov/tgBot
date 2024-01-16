const TelegramApi = require('node-telegram-bot-api')
const {gameOptions, againOptions} = require('./options');
const token = '6848380149:AAEejsN5uubaZ61jZDjlE8bf2JBe7EbidF4';

const bot = new TelegramApi(token, {polling: true});

const chats = {};

const startGame = async (chatId) => {
    await bot.sendMessage(chatId, `I think of a number from 0 to 10, guess it`)
    const randomNumder = Math.floor(Math.random() * 10)
    chats[chatId] = randomNumder;
    await bot.sendMessage(chatId, 'guess it', gameOptions);
}

const start = async () => {
    bot.setMyCommands([
        {command: '/start', description: "Greetings"},
        {command: '/info', description: "info"},
        {command: '/button', description: "give a button"},
        {command: '/game', description: "let's play"}
    ])
    
    bot.on('message', async msg => {
        const text = msg.text;
        const chatId = msg.chat.id;
    
        if (text === '/start') {
            await bot.sendSticker(chatId, 'https://tlgrm.eu/_/stickers/f93/ad8/f93ad8be-71fe-43ed-9fe0-80c650082781/1.webp')
            return bot.sendMessage(chatId, `Welcome my friend`)
        }  
        if (text === '/info') {
            return bot.sendMessage(chatId, `Your name is ${msg.from.first_name} ${msg.from.last_name}`)
        }
        if(text === `/game`) {
            return startGame(chatId);
        }
        return bot.sendMessage(chatId, `I don't understand, try again`)
    })

    bot.on('callback_query', async msg => {
        const data = msg.data;
        const chatId = msg.message.chat.id;
        if(data === '/again') {
            return startGame(chatId);
        }
        if (data == chats[chatId]) {
            console.log('sd');
            return bot.sendMessage(chatId, `Congrats, you guessed the number ${chats[chatId]}`, againOptions)
        } else {
            console.log('bug');
            return  bot.sendMessage(chatId, `You failed, bot guessed ${chats[chatId]}`, againOptions)
        }
    })
}

start()