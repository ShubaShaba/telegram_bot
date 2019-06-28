const getPhrase = require("./Phrases");
const request = require("request");

bot.onText(/\/Course/, function(msg) {
  const chatId = msg.chat.id;

  bot.sendMessage(chatId, getPhrase(chatId, "WCurrencyDoYouNeed"), {
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: "€ - EUR",
            callback_data: "cour: EUR"
          },
          {
            text: "$ - USD",
            callback_data: "cour: USD"
          },
          {
            text: "₽ - RUR",
            callback_data: "cour: RUR"
          },
          {
            text: "₿ - BTC",
            callback_data: "cour: BTC"
          }
        ]
      ]
    }
  });
});
bot.on("callback_query", query => {
  if (query.data.startsWith("cour: ")) {
    const id = query.message.chat.id;
    request(
      "https://api.privatbank.ua/p24api/pubinfo?json&exchange&coursid=5",
      function(error, response, body) {
        const data = JSON.parse(body);
        const result = data.filter(
          item => "cour: " + item.ccy === query.data
        )[0];
        const flag = {
          EUR: "🇪🇺",
          USD: "🇺🇸",
          RUR: "🇷🇺",
          UAH: "🇺🇦",
          BTC: "₿"
        };
        let md = `
            *${flag[result.ccy]} ${result.ccy} 💱 ${result.base_ccy} ${
          flag[result.base_ccy]
        }*
            ${getPhrase(id, "buy")}: _${result.buy}_
            ${getPhrase(id, "sale")}: _${result.sale}_
          `;
        bot.sendMessage(id, md, { parse_mode: "Markdown" });
      }
    );
  }
});
