const DB = require("./database");
const getPhrase = require("./Phrases");

bot.on("message", function(msg) {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  DB.addKey(["userMessageCount", chatId]);
  const chatData = DB.data.userMessageCount[chatId];
  if (userId in chatData) {
    chatData[userId]++;
  } else {
    chatData[userId] = 1;
  }
  DB.write();
});

bot.onText(/\/getUserStatistic/, function(msg) {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  const result = DB.data.userMessageCount[chatId];
  bot.sendMessage(
    chatId,
    getPhrase(chatId, "CountOfMessages") + JSON.stringify(result[userId])
  );
});

bot.onText(/\/getAllUsersStatistic/, function(msg) {
  const chatId = msg.chat.id;

  let users = DB.data.userMessageCount;
  let result = "";
  for (let key in users) {
    let promise = bot.getChat(key);
    let countOfMsg = users[key][key];
    if (key.startsWith("-")) {
      countOfMsg = 0;
      for (let k in users[key]) {
        countOfMsg += users[key][k];
      }
    }
    promise.then(function(data) {
      let name = data.first_name + " " + data.last_name;
      if (key.startsWith("-")) {
        name = data.title;
      }
      result += name + " " + key + ": " + countOfMsg + ", " + "\n";
    });
  }
  for (let i = 0; i < 3; i++) {
    setTimeout(function() {
      if (i === 2) {
        bot.sendMessage(chatId, result);
      } else {
        bot.sendMessage(
          chatId,
          getPhrase(chatId, "loading") + " " + Number(i + 1)
        );
      }
    }, i * 1000);
  }
});

DB.addKey(["userMessageCount"]);
DB.write();
