const TelegramBot = require("node-telegram-bot-api");
const request = require("request");
const token = "733052724:AAHJawU7itt_TowKDfbL-RV_feC0fZRWoTk";
const bot = new TelegramBot(token, { polling: true });
global.bot = bot;

const getPhrase = require("./Phrases");
require("./statistics");
require("./sendingMessages");
require("./kickMember");
require("./Course");
require("./spy");
require("./jokes");
require("./animations");
require("./control_panel");

const comands = {
  start_section_for_users: ["/start", "/help", "/changeLang"],
  help_for_users: [
    "/start",
    "/help",
    "/changeLang",
    "/Course",
    "/getCommunismStory",
    "/start_animation",
    "/stop_animation",
    "/getUserStatistic",
    "/getIp",
    "/getFullListsOfComands"
  ],
  hidden_lists_of_comands: [
    "/getFullListsOfComands",
    "/controlP",
    "/startSpam",
    "/stopSpam",
    "/getAllUsersStatistic"
  ]
};

bot.onText(/\/start/, function start(msg) {
  if (msg.text == "/start") {
    const chatId = msg.chat.id;
    let startComandsPack = comands.start_section_for_users.join("; \n");
    bot.sendMessage(chatId, getPhrase(chatId, "hello"));
    bot.sendMessage(
      chatId,
      getPhrase(chatId, "comandsList") + "\n" + startComandsPack
    );
  }
});

bot.onText(/\/help/, function(msg) {
  const chatId = msg.chat.id;
  comands.help_for_users[comands.help_for_users.length - 1] =
    "\n/getFullListsOfComands (" + getPhrase(chatId, "available") + ");";

  let mainComandsPack = comands.help_for_users.join("; \n");
  bot.sendMessage(
    chatId,
    getPhrase(chatId, "comandsList") + "\n" + mainComandsPack
  );
});

bot.onText(/\/getFullListsOfComands/, function(msg) {
  const chatId = msg.chat.id;
  let hiddenComandsPack = comands.hidden_lists_of_comands.join("; \n");
  if (chatId === 462509174) {
    bot.sendMessage(
      chatId,
      getPhrase(chatId, "comandsList") + "\n" + hiddenComandsPack
    );
  } else {
    bot.sendMessage(chatId, getPhrase(chatId, "hiddenComands"));
  }
});

bot.onText(/\/getIp/, function(msg) {
  const chatId = msg.chat.id;
  request("http://ip-api.com/json/", function(error, response, body) {
    const data = JSON.parse(body);
    const result = getPhrase(chatId, "serverIp") + data.query;
    bot.sendMessage(chatId, result);
  });
});

bot.on("text", function(msg) {
  const chatId = msg.chat.id;
  const MText = msg.text.toLowerCase();
  if (MText.startsWith("hello") || MText.startsWith("привет")) {
    bot.sendMessage(
      chatId,
      getPhrase(chatId, "hello") + " " + msg.from.first_name
    );
  }
});

bot.on("polling_error", msg => console.log(msg));
