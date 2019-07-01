const DB = require("./database");
//kick user
//spam to
const openKeyboard = [
  [
    {
      text: "get user id",
      callback_data: "CP: " + "get chat id"
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
let backPanel = [[{ text: "<=", callback_data: "CP: " + "<=" }]];
let chatsKeyboard = [[{ text: "<=", callback_data: "CP: " + "<=" }]];
let msgChatsKeyboard = [[{ text: "<=", callback_data: "CP: " + "<=" }]];
let usersKeyboard = [[{ text: "<=", callback_data: "CP: " + "<=" }]];
let groupKeyboard = [[{ text: "<=", callback_data: "CP: " + "<=" }]];

let users = DB.data.userMessageCount;

function createKeyboard(chats, keyboard, callback_key) {
  chats.forEach(chat => {
    let name = chat.first_name + " " + chat.last_name;
    let type = chat.type;
    if (type === "group" || type === "supergroup") {
      name = chat.title;
    }
    keyboard.unshift([{ text: name, callback_data: callback_key + chat.id }]);
  });
}

function createCurrentKeyboard(chat, keyboard, callback_key) {
  let name = chat.first_name + " " + chat.last_name;
  let type = chat.type;
  if (type === "group" || type === "supergroup") {
    name = chat.title;
  }
  keyboard.unshift([{ text: name, callback_data: callback_key + chat.id }]);
}

function editMessage(newText, chatId, msgId, keyboard) {
  bot.editMessageText(newText, {
    chat_id: chatId,
    message_id: msgId,
    reply_markup: {
      inline_keyboard: keyboard
    }
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
    if (query.data === "CP: " + "get chat id") {
      chatsKeyboard = [[{ text: "<=", callback_data: "CP: " + "<=" }]];
      Promise.all(Object.keys(users).map(key => bot.getChat(key)))
        .then(chats => {
          createKeyboard(chats, chatsKeyboard, "CP: chat ");
        })
        .then(result => {
          editMessage("Control_panel v.1.0 :", id, msgId, chatsKeyboard);
        });
    } else if (query.data.startsWith("CP: chat ")) {
      bot.sendMessage(id, query.data.split(" ")[2]);
    } else if (query.data === "CP: " + "sendMessage") {
      msgChatsKeyboard = [[{ text: "<=", callback_data: "CP: " + "<=" }]];
      Promise.all(Object.keys(users).map(key => bot.getChat(key)))
        .then(chats => {
          createKeyboard(chats, msgChatsKeyboard, "CP: msg ");
        })
        .then(result => {
          editMessage("Control_panel v.1.0 :", id, msgId, msgChatsKeyboard);
        });
    } else if (query.data.startsWith("CP: msg ")) {
      idToSend = query.data.split(" ")[2];
      editMessage(
        "sending to: " +
          msgChatsKeyboard.find(
            item => item[0].callback_data === "CP: msg " + idToSend
          )[0].text,
        id,
        msgId,
        backPanel
      );
    } else if (query.data === "CP: " + "kick user") {
      groupKeyboard = [[{ text: "<=", callback_data: "CP: " + "<=" }]];
      usersKeyboard = [[{ text: "<=", callback_data: "CP: " + "<=" }]];
      Promise.all(Object.keys(users).map(key => bot.getChat(key)))
        .then(chats => {
          chats.forEach(chat => {
            if (chat.type === "supergroup" || chat.type === "group") {
              createCurrentKeyboard(chat, groupKeyboard, "CP: group ");
            } else {
              createCurrentKeyboard(chat, usersKeyboard, "CP: kick ");
            }
          });
        })
        .then(result => {
          let userId = [];
          let groupId = [];
          for (let i = 0; i < usersKeyboard.length - 1; i++) {
            userId.push(usersKeyboard[i][0].callback_data.split(" ")[2]);
          }
          for (let g = 0; g < groupKeyboard.length - 1; g++) {
            groupId.push(groupKeyboard[g][0].callback_data.split(" ")[2]);
          }

          usersKeyboard = [[{ text: "<=", callback_data: "CP: " + "<=" }]];
          let usersInGroup = [];
          new Promise((resolve, reject) => {
            userId.forEach(key => {
              for (let g = 0; g < groupId.length; g++) {
                bot.getChatMember(groupId[g], key).then(data => {
                  usersInGroup.push(data);
                  if (data.status === "member") {
                    let name = data.user.first_name + " " + data.user.last_name;
                    let title = groupKeyboard.find(
                      item =>
                        item[0].callback_data === "CP: group " + groupId[g]
                    )[0].text;
                    usersKeyboard.unshift([
                      {
                        text: name + " " + title,
                        callback_data:
                          "CP: kick " + data.user.id + " " + groupId[g]
                      }
                    ]);
                  }
                  if (usersInGroup.length === groupId.length * userId.length) {
                    resolve(usersInGroup);
                  }
                });
              }
            });
          }).then(result => {
            editMessage("Control_panel v.1.0 :", id, msgId, usersKeyboard);
          });
        });
    } else if (query.data.startsWith("CP: kick ")) {
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
