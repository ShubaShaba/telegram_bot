const DB = require("./database");
//spam to
const queryPrefix = "CP: ";
const version = "beta v.0.5";

let panelMessage = {
  default: "Control panel " + version,
  getChatId: "Get user's id: ",
  kickUser: "Kick user: ",
  sendMessage: "Sending to: ",
  msg: "Sending to: ",
  closePanel: "Panel has been closed"
};

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
  // [
  //   {
  //     text: 0,
  //     callback_data: 0
  //   }
  // ],
  [
    {
      text: "CLOSE PANEL",
      callback_data: queryPrefix + "closePanel"
    }
  ]
];

let userMessageCount = DB.data.userMessageCount;

function createDefaultKeyboard() {
  let keyboard = [[{ text: "<=", callback_data: queryPrefix + "default" }]];
  return keyboard;
}

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
    bot.sendMessage(chatId, panelMessage.default, {
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
    let chatsKeyboard = createDefaultKeyboard();

    Promise.all(Object.keys(userMessageCount).map(key => bot.getChat(key)))
      .then(chats => {
        createKeyboard(chats, chatsKeyboard, queryPrefix + "chat ");
      })
      .then(result => {
        editMessage(panelMessage[cmdName], id, msgId, chatsKeyboard);
      });
  } else if (cmdName === "chat") {
    bot.sendMessage(id, args[1]);
  } else if (cmdName === "sendMessage") {
    let msgChatsKeyboard = createDefaultKeyboard();

    Promise.all(Object.keys(userMessageCount).map(key => bot.getChat(key)))
      .then(chats => {
        createKeyboard(chats, msgChatsKeyboard, queryPrefix + "msg ");
      })
      .then(result => {
        editMessage(panelMessage[cmdName], id, msgId, msgChatsKeyboard);
      });
  } else if (cmdName === "msg") {
    let listOfChats = [];
    idToSend = args[1];

    Promise.all(Object.keys(userMessageCount).map(key => bot.getChat(key)))
      .then(chats => {
        createKeyboard(chats, listOfChats, queryPrefix + "msg ");
      })
      .then(result => {
        editMessage(
          panelMessage[cmdName] +
            listOfChats.find(
              item => item[0].callback_data === queryPrefix + "msg " + idToSend
            )[0].text,
          id,
          msgId,
          createDefaultKeyboard()
        );
      });
  } else if (cmdName === "kickUser") {
    groupKeyboard = createDefaultKeyboard();
    usersKeyboard = createDefaultKeyboard();

    Promise.all(Object.keys(userMessageCount).map(key => bot.getChat(key)))
      .then(chats => {
        chats.forEach(chat => {
          if (chat.type === "supergroup" || chat.type === "group") {
            createCurrentKeyboard(chat, groupKeyboard, queryPrefix + "group ");
          } else {
            createCurrentKeyboard(chat, usersKeyboard, queryPrefix + "kick ");
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

        usersKeyboard = createDefaultKeyboard();

        let usersInGroup = [];
        userId.forEach(key => {
          for (let g = 0; g < groupId.length; g++) {
            bot.getChatMember(groupId[g], key).then(data => {
              usersInGroup.push(data);
              if (data.status === "member") {
                let name = data.user.first_name + " " + data.user.last_name;
                let title = groupKeyboard.find(
                  item =>
                    item[0].callback_data ===
                    queryPrefix + "group " + groupId[g]
                )[0].text;
                usersKeyboard.unshift([
                  {
                    text: name + " " + title,
                    callback_data:
                      queryPrefix + "kick " + data.user.id + " " + groupId[g]
                  }
                ]);
              }
              if (usersInGroup.length === groupId.length * userId.length) {
                editMessage(panelMessage[cmdName], id, msgId, usersKeyboard);
              }
            });
          }
        });
      });
  } else if (cmdName === "kick") {
    bot.kickChatMember(args[2], args[1]);
  } else if (cmdName === "default") {
    editMessage(panelMessage[cmdName], id, msgId, openKeyboard);
    idToSend = null;
  } else if (cmdName === "closePanel") {
    editMessage(panelMessage[cmdName], id, msgId, []);
  }
});

bot.on("text", msg => {
  if (idToSend != null) {
    bot.sendMessage(idToSend, msg.text);
  }
});
