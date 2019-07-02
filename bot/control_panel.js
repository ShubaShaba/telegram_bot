const DB = require("./database");
//spam to
const queryPrefix = "CP: ";
const openKeyboard = [
  [
    {
      text: "get user id",
      callback_data: queryPrefix + "getChatId"
    }
  ],
  [
    {
      text: "kick user",
      callback_data: queryPrefix + "kickUser"
    }
  ],
  [
    {
      text: "send message",
      callback_data: queryPrefix + "sendMessage"
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
      callback_data: queryPrefix + "closePanel"
    }
  ]
];
let backPanel = [[{ text: "<=", callback_data: "CP: " + "<=" }]];
let chatsKeyboard = [[{ text: "<=", callback_data: "CP: " + "<=" }]];
let msgChatsKeyboard = [[{ text: "<=", callback_data: "CP: " + "<=" }]];
let usersKeyboard = [[{ text: "<=", callback_data: "CP: " + "<=" }]];
let groupKeyboard = [[{ text: "<=", callback_data: "CP: " + "<=" }]];

let userMessageCount = DB.data.userMessageCount;

function createKeyboard(chats, keyboard, callback_key) {
  chats.forEach(chat => {
    createCurrentKeyboard(chat, keyboard, callback_key);
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

let idToSend; // for sending message (chat_id)

bot.onText(/\/controlP/, function(msg) {
  const chatId = msg.chat.id;
  if (chatId === 462509174) {
    bot.sendMessage(chatId, "Control_panel v.1.0 :", {
      reply_markup: {
        inline_keyboard: openKeyboard
      }
    });
  }
});

bot.on("callback_query", query => {
  if (!query.data.startsWith(queryPrefix)) {
    return;
  }

  let msgId = query.message.message_id;
  const cmd = query.data.substring(queryPrefix.length);
  const parts = cmd.split(" ");
  const cmdName = parts[0];
  const args = parts.slice(0);
  const id = query.message.chat.id;

  if (cmdName === "getChatId") {
    chatsKeyboard = [[{ text: "<=", callback_data: "CP: " + "<=" }]];
    Promise.all(Object.keys(userMessageCount).map(key => bot.getChat(key)))
      .then(chats => {
        createKeyboard(chats, chatsKeyboard, "CP: chat ");
      })
      .then(result => {
        editMessage("Control_panel v.1.0 :", id, msgId, chatsKeyboard);
      });
  } else if (cmdName === "chat") {
    bot.sendMessage(id, args[1]);
  } else if (cmdName === "sendMessage") {
    msgChatsKeyboard = [[{ text: "<=", callback_data: "CP: " + "<=" }]];
    Promise.all(Object.keys(userMessageCount).map(key => bot.getChat(key)))
      .then(chats => {
        createKeyboard(chats, msgChatsKeyboard, "CP: msg ");
      })
      .then(result => {
        editMessage("Control_panel v.1.0 :", id, msgId, msgChatsKeyboard);
      });
  } else if (cmdName === "msg") {
    idToSend = args[1];
    editMessage(
      "sending to: " +
        msgChatsKeyboard.find(
          item => item[0].callback_data === "CP: msg " + idToSend
        )[0].text,
      id,
      msgId,
      backPanel
    );
  } else if (cmdName === "kickUser") {
    groupKeyboard = [[{ text: "<=", callback_data: "CP: " + "<=" }]];
    usersKeyboard = [[{ text: "<=", callback_data: "CP: " + "<=" }]];
    Promise.all(Object.keys(userMessageCount).map(key => bot.getChat(key)))
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
        userId.forEach(key => {
          for (let g = 0; g < groupId.length; g++) {
            bot.getChatMember(groupId[g], key).then(data => {
              usersInGroup.push(data);
              if (data.status === "member") {
                let name = data.user.first_name + " " + data.user.last_name;
                let title = groupKeyboard.find(
                  item => item[0].callback_data === "CP: group " + groupId[g]
                )[0].text;
                usersKeyboard.unshift([
                  {
                    text: name + " " + title,
                    callback_data: "CP: kick " + data.user.id + " " + groupId[g]
                  }
                ]);
              }
              if (usersInGroup.length === groupId.length * userId.length) {
                editMessage("Control_panel v.1.0 :", id, msgId, usersKeyboard);
              }
            });
          }
        });
      });
  } else if (cmdName === "kick") {
    bot.kickChatMember(args[2], args[1]);
  } else if (cmdName === "<=") {
    editMessage("Control_panel v.1.0 :", id, msgId, openKeyboard);
    idToSend = null;
  } else if (cmdName === "closePanel") {
    editMessage("Panel has been closed", id, msgId, []);
  }
});

bot.on("text", msg => {
  if (idToSend != null) {
    bot.sendMessage(idToSend, msg.text);
  }
});
