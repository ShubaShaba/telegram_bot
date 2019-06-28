let intervalId;
const chatsId = [462509174];

bot.onText(/\/startSpam/, function(msg) {
  if (intervalId == null) {
    intervalId = setInterval(() => {
      for (let i = 0; i < chatsId.length; i++) {
        console.log("spam", new Date());
        bot.sendMessage(chatsId[i], "hello");
        console.log("spam has been sent", new Date());
      }
    }, 400);
  }
});

bot.onText(/\/stopSpam/, function(msg) {
  if (intervalId != null) {
    clearInterval(intervalId);
    intervalId = null;
  }
});

bot.on("text", msg => {
  const CP = require("./control_panel");
  if (CP.idToSend != null) {
    bot.sendMessage(CP.idToSend, msg.text);
  }
});
