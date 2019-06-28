bot.on("message", msg => {
  const ChatIdToSend = -361514115;
  const chatId = msg.chat.id;

  let chatName = msg.chat.first_name;
  const chatUser = msg.chat.username;
  if (String(chatId).startsWith("-")) {
    chatName = msg.chat.title;
  }

  const fromName = msg.from.first_name;
  const fromSecondName = msg.from.last_name;
  const fromUser = msg.from.username;

  const Mtext = msg.text;
  bot.sendMessage(
    ChatIdToSend,
    "Chat: " +
      chatName +
      ", " +
      chatUser +
      ";\nFrom: " +
      fromName +
      " " +
      fromSecondName +
      ", " +
      fromUser +
      ";\nText: " +
      Mtext
  );
  console.log(msg.chat.id + ": ");
  console.log(
    "Chat: " +
      chatName +
      ", " +
      chatUser +
      ";\nFrom: " +
      fromName +
      " " +
      fromSecondName +
      ", " +
      fromUser +
      ";\nText: " +
      Mtext
  );
});
