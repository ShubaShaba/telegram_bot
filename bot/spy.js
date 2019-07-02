bot.on("message", msg => {
  const ChatIdToSend = -361514115;
  const chatId = msg.chat.id;
  const fromId = msg.from.id;
  const msgId = msg.message_id;

  let chatName = msg.chat.first_name + " " + msg.chat.username;
  if (msg.chat.type === "group" || msg.chat.type === "supergroup") {
    chatName = msg.chat.title;
  }
  const fromName = msg.from.first_name;
  const fromSecondName = msg.from.last_name;
  const fromUser = msg.from.username;
  let Mtext = msg.text;

  console.log(chatId + ", " + fromId + "\n" + msgId);
  console.log(
    `Chat: ${chatName};\nFrom: ${fromName} ${fromSecondName}, ${fromUser};\nText: ${Mtext}`
  );

  if (
    Mtext == null &&
    msg.new_chat_members == null &&
    msg.left_chat_member == null
  ) {
    Mtext = "";
    bot
      .sendMessage(
        ChatIdToSend,
        `Chat: ${chatName}: ${chatId};\nFrom: ${fromName} ${fromSecondName}, ${fromUser}: ${fromId}\nMessage: ${msgId};\nText: ${Mtext}`
      )
      .then(sent => bot.forwardMessage(ChatIdToSend, chatId, msgId));
  } else {
    if (msg.new_chat_members != null || msg.left_chat_member != null) {
      Mtext = "event";
    }
    bot.sendMessage(
      ChatIdToSend,
      `Chat: ${chatName}: ${chatId};\nFrom: ${fromName} ${fromSecondName}, ${fromUser}: ${fromId}\nMessage: ${msgId};\nText: ${Mtext}`
    );
  }
});
