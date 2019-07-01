const getPhrase = require("./Phrases");

// function kickUser(chatId, userId) {
//   bot.kickChatMember(chatId, userId);
// }
// const KickedUsersId = match[1].split(" ")[1];
// const chatKUsId = match[1].split(" ")[0];

bot.on("text", function(msg) {
  const Mtext = msg.text;
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  const banPhrases = ["артур пидор", "артур пидарас"];
  if (msg.chat.type === "group" || msg.chat.type === "supergroup") {
    const result = banPhrases.find(item => Mtext.toLowerCase().includes(item));
    if (result != null) {
      bot.sendMessage(chatId, getPhrase(chatId, "banfor") + result + ";");
      setTimeout(function() {
        bot.kickChatMember(chatId, userId);
      }, 1500);
    }
  }
});

// module.exports = { kickUser };
