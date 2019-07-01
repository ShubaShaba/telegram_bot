const getPhrase = require("./Phrases");
const stick = {
  stick_1: [
    "────────██────────",
    "────────██────────",
    "────────██────────",
    "────────██────────",
    "────────██────────"
  ],
  stick_2: [
    "────────────██────",
    "──────────██──────",
    "────────██────────",
    "──────██──────────",
    "────██────────────"
  ],
  stick_3: [
    "──────────────────",
    "──────────────────",
    "────██████████────",
    "──────────────────",
    "──────────────────"
  ],
  stick_4: [
    "────██────────────",
    "──────██──────────",
    "────────██────────",
    "──────────██──────",
    "────────────██────"
  ]
};

const animation = [
  stick.stick_1.join("\n"),
  stick.stick_2.join("\n"),
  stick.stick_3.join("\n"),
  stick.stick_4.join("\n")
];

bot.onText(/\/start_animation/, function(msg) {
  const chatId = msg.chat.id;
  if (msg.chat.type === "private") {
    bot.sendMessage(chatId, "...").then(ms => {
      let msgId = ms.message_id;
      let i = 0;
      let intervalAnimation = setInterval(function() {
        bot.editMessageText(animation[i], {
          chat_id: chatId,
          message_id: msgId
        });
        i++;
        if (i > animation.length - 1) {
          i = 0;
        }
      }, 400);

      bot.onText(/\/stop_animation/, function(m) {
        if (msgId != null) {
          clearInterval(intervalAnimation);
          bot.deleteMessage(chatId, msgId);
          msgId = null;
        }
      });
    });
  } else {
    bot.sendMessage(chatId, getPhrase(chatId, "animationErr"));
  }
});
