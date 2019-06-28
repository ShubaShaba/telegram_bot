const DB = require("./database");
//kick user
//spam to
function editMessage(newText, chatId, msgId, keyboard) {
  bot.editMessageText(newText, {
    chat_id: chatId,
    message_id: msgId,
    reply_markup: {
      inline_keyboard: keyboard
    }
  });
}

const openKeyboard = [
  [
    {
      text: "get user id",
      callback_data: "CP: " + "get user id"
    }
  ],
  [
    {
      text: "kick user",
      callback_data: "CP: " + "kick user"
    }
  ],
  [
    {
      text: "send message",
      callback_data: "CP: " + "sendMessage"
    }
  ],
  [
    {
      text: 0,
      callback_data: 0
    }
  ],
  [
    {
      text: "close panel",
      callback_data: "CP: " + "close panel"
    }
  ]
];
let usersKeyboard = [[{ text: "<=", callback_data: "CP: " + "<=" }]];
let msgUsersKeyboard = [[{ text: "<=", callback_data: "CP: " + "<=" }]];
let kickUsersKeyboard = [[{ text: "<=", callback_data: "CP: " + "<=" }]];
let backPanel = [[{ text: "<=", callback_data: "CP: " + "<=" }]];

let users = DB.data.userMessageCount;
for (let key in users) {
  let promise = bot.getChat(key);
  promise.then(function(data) {
    let name = data.first_name + " " + data.last_name;
    if (key.startsWith("-")) {
      name = data.title;
    }
    usersKeyboard.unshift([{ text: name, callback_data: "CP: user " + key }]);
    msgUsersKeyboard.unshift([{ text: name, callback_data: "CP: msg " + key }]);
    kickUsersKeyboard.unshift([
      { text: name, callback_data: "CP: kick " + key }
    ]);
  });
}

let msgId; //for edit panel
let idToSend; // for sending message (chat_id)

bot.onText(/\/controlP/, function(msg) {
  const chatId = msg.chat.id;
  if (chatId === 462509174) {
    if (msgId != null) {
      editMessage("Panel has been closed", chatId, msgId, []);
      msgId = null;
    }
    bot
      .sendMessage(chatId, "Control_panel v.1.0 :", {
        reply_markup: {
          inline_keyboard: openKeyboard
        }
      })
      .then(ms => {
        msgId = ms.message_id;
      });
  }
});

bot.on("callback_query", query => {
  if (query.data.startsWith("CP: ")) {
    const id = query.message.chat.id;
    if (query.data === "CP: " + "get user id") {
      //
      editMessage("Control_panel v.1.0 :", id, msgId, usersKeyboard);
      //
    } else if (query.data.startsWith("CP: user ")) {
      //
      bot.sendMessage(id, query.data.split(" ")[2]);
      //
    } else if (query.data === "CP: " + "kick user") {
      //
      editMessage("Control_panel v.1.0 :", id, msgId, kickUsersKeyboard);
      //
    } else if (query.data.startsWith("CP: kick ")) {
      //
      //
    } else if (query.data === "CP: " + "sendMessage") {
      editMessage("Control_panel v.1.0 :", id, msgId, msgUsersKeyboard);
    } else if (query.data.startsWith("CP: msg ")) {
      idToSend = query.data.split(" ")[2];
      editMessage(
        "sending to: " +
          msgUsersKeyboard.find(
            item => item[0].callback_data === "CP: msg " + idToSend
          )[0].text,
        id,
        msgId,
        backPanel
      );
    } else if (query.data === "CP: " + "<=") {
      editMessage("Control_panel v.1.0 :", id, msgId, openKeyboard);
      idToSend = null;
    } else if (query.data === "CP: " + "close panel") {
      editMessage("Panel has been closed", id, msgId, []);
      msgId = null;
    }
  }
});

bot.on("text", msg => {
  if (idToSend != null) {
    bot.sendMessage(idToSend, msg.text);
  }
});
