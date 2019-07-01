const fs = require("fs");
const MC = require("./Markov_chain");
const getPhrase = require("./Phrases");

const phrases = {
  main: [
    "ссср",
    "совок",
    "советский союз",
    "кпсс",
    "союз",
    "империали",
    "коммуни",
    "социал"
  ],
  stalin_quote: [
    "сталин",
    "собственность",
    "капитал",
    "револю",
    "вожд",
    "товарищ"
  ],
  lenin_quote: ["ленин", "призрак", "буржуа", "цар"],
  propaganda_posters: [
    "хрущев",
    "хрущёв",
    "совет",
    "совке",
    "труд",
    "пролета",
    "рабоч"
  ]
};

const reaction = {
  main: ["Слава КПСС", "Пролетариаты Всех Стран - Объединяйтесь!"],
  stalin_quote: [
    "Есть человек — есть проблема, нет человека — нет проблемы.",
    "Неважно, как проголосовали, — важно, как подсчитали.",
    "Ленин создал наше государство, а мы его просрали.",
    "Идея сильнее оружия!",
    "Троцкизм есть передовой отряд контрреволюционной буржуазии.",
    "...колонии — это ахиллесова пята империализма...",
    "Победа никогда не приходит сама, — её обычно притаскивают.",
    "Автономия — не предполагает независимости."
  ],
  lenin_quote: [
    "Хранить наследство — вовсе не значит ещё ограничиваться наследством.",
    "Скажи мне, кто тебя хвалит, и я тебе скажу, в чем ты ошибся.",
    "Учение Маркса всесильно, потому что оно верно.",
    "…Больших слов нельзя бросать на ветер.",
    "Русский язык мы портим. Иностранные слова употребляем без надобности. Употребляем их неправильно. К чему говорить «дефекты», когда можно сказать недочёты, или недостатки, или пробелы?.. Не пора ли нам объявить войну употреблению иностранных слов без надобности? ",
    "…Не так опасно поражение, как опасна боязнь признать своё поражение…",
    "Сплетней факта не перешибёшь",
    "Мы не хотим загонять в рай дубиной"
  ],
  propaganda_posters: []
};

const photos = {
  main: fs.readdirSync("bot/img/comunism/main"),
  stalin_quote: fs.readdirSync("bot/img/comunism/stalin_quote"),
  lenin_quote: fs.readdirSync("bot/img/comunism/lenin_quote"),
  propaganda_posters: fs.readdirSync("bot/img/comunism/propaganda_posters"),
  kick_lenin: fs.readdirSync("bot/img/comunism/kick_lenin"),
  wellcome_stalin: fs.readdirSync("bot/img/comunism/wellcome_stalin")
};

bot.on("text", function(msg) {
  const chatId = msg.chat.id;
  const mText = msg.text.toLowerCase();
  if (chatId !== msg.from.id) {
    let section;
    let result;
    for (let key in phrases) {
      result = phrases[key].find(item => mText.includes(item));
      if (result !== undefined) {
        section = key;
        break;
      }
    }
    if (result !== undefined) {
      bot.sendPhoto(
        chatId,
        "bot/img/comunism/" +
          section +
          "/" +
          photos[section][Math.floor(Math.random() * photos[section].length)],
        {
          caption:
            section === "propaganda_posters"
              ? undefined
              : reaction[section][
                  Math.floor(Math.random() * reaction[section].length)
                ]
        }
      );
    }
  }
});

const comunismText = fs.readdirSync("bot/stuff");

bot.onText(/\/getCommunismStory/, function(msg) {
  const chatId = msg.chat.id;
  let keyboard = [];
  comunismText.forEach(function(text) {
    keyboard.push([
      {
        text: text,
        callback_data: "story: " + text
      }
    ]);
  });

  bot.sendMessage(chatId, getPhrase(chatId, "whatStuffOfStory"), {
    reply_markup: {
      inline_keyboard: keyboard
    }
  });
});

bot.on("callback_query", query => {
  if (query.data.startsWith("story: ")) {
    const chatId = query.message.chat.id;
    const result = comunismText.find(item => "story: " + item === query.data);
    bot.sendMessage(chatId, MC.getStory(result, 20, 40).join(" "));
  }
});

bot.on("left_chat_member", function(msg) {
  bot.sendPhoto(
    msg.chat.id,
    "bot/img/comunism/kick_lenin" +
      "/" +
      photos.kick_lenin[Math.floor(Math.random() * photos.kick_lenin.length)]
  );
});

bot.on("new_chat_members", function(msg) {
  bot.sendPhoto(
    msg.chat.id,
    "bot/img/comunism/wellcome_stalin" +
      "/" +
      photos.wellcome_stalin[
        Math.floor(Math.random() * photos.wellcome_stalin.length)
      ]
  );
});
