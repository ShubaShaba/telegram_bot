const DB = require("./database");

bot.onText(/\/changeLang/, function(msg) {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, getPhrase(chatId, "WLanguageDoYouNeed"), {
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: "Русский",
            callback_data: "lang;ru"
          },
          {
            text: "English",
            callback_data: "lang;en"
          }
        ]
      ]
    }
  });
});

const phrases = {
  hello: { en: "Hello", ru: "Привет" },
  comandsList: { en: "Comands list: ", ru: "Список команд: " },
  languageHasBeenChanged: {
    en: "Language has been changed",
    ru: "Язык изменен"
  },
  WLanguageDoYouNeed: {
    en: "What language do you need?",
    ru: "Какой язык вам нужен?"
  },
  serverIp: { en: "Server`s ip: ", ru: "Ip сервера: " },
  "You are lucky man)": { en: "You are lucky man)", ru: "Да ты везучий)" },
  "nice cat)": { en: "nice cat)", ru: "Милый котик)" },
  WPicturesDoYouNeed: {
    en: "What pictures do you need?",
    ru: "Какая картинка вам нужна?"
  },
  WCurrencyDoYouNeed: {
    en: "What currency do you need?",
    ru: "Какая валюта вам нужна?"
  },
  ReceivedYourMessage: {
    en: "Received your message",
    ru: "Сообщение получено"
  },
  CountOfMessages: {
    en: "Number of your messages in this chat: ",
    ru: "Количество оставленных вами сообщений в этом чате: "
  },
  banfor: {
    en: "Ban for: ",
    ru: "Бан за: "
  },
  available: {
    en: "available only for my creator",
    ru: "доступно только моему создателю"
  },
  hiddenComands: {
    en: "Sorry it's not a my creator's private chat",
    ru: "Простите это не приватный чат моего создателя"
  },
  loading: {
    en: "Loading...",
    ru: "Загрузка..."
  },
  buy: {
    en: "Buy",
    ru: "Покупка"
  },
  sale: {
    en: "Sale",
    ru: "Продажа"
  },
  whatStuffOfStory: {
    en: "What to use as a source?",
    ru: "Что использовать в качестве источника?"
  },
  animationErr: {
    en: "Available only in private chat",
    ru: "Доступно только в приватном чате"
  }
};

DB.addKey(["userLanguages"]);
DB.write();

bot.on("callback_query", function lang(query) {
  console.log(query);
  const queryParts = query.data.split(";");
  if (queryParts[0] == "lang") {
    const chatId = query.message.chat.id;
    const lang = queryParts[1];
    DB.data.userLanguages[chatId] = lang;
    DB.write();
    bot.sendMessage(chatId, getPhrase(chatId, "languageHasBeenChanged"));
  }
});

function getPhrase(chatId, phraseId) {
  const lang =
    chatId in DB.data.userLanguages ? DB.data.userLanguages[chatId] : "en";
  return phrases[phraseId][lang];
}
module.exports = getPhrase;
