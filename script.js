

intent("Type me a message", (p) => {
  //      p.play("ok sure");
  p.play({ command: "type_message" });
});

intent("Open $(username* (.*)) (chat| chat box|)", (p) => {
  let username = p.username.value;
  let users = p.visual.data;
  username = username.toLowerCase();
  let valid;
  if (users) {
    if (!users.find((u) => u.username === username)) {
      p.play(`No user found of username ${username}`);
    } else {
      p.play(`Opening ${username}'s chat`);
      p.play({ command: "openUser", username: username, data: users });
    }
  }
});

intent("Read me (all|) the messages", async (p) => {
  let users = p.visual.data;
  if (users) {
    let selectedUser = users.find((u) => u.selected === true);
    if (selectedUser) {
      if (selectedUser.messages) {
        for (let i = selectedUser.messages.length - 1; i >= 0; i--) {
          p.play(`${selectedUser.messages[i].content}`);
        }
        p.play({ command: "readUserMessage", data: selectedUser });
      }
    } else if (!selectedUser) {
      p.play("There are no messages to read");
      p.play("send some messages..");
    }
  }
});

intent("Read me the last message", async (p) => {
  let users = p.visual.data;
  if (users) {
    let selectedUser = users.find((u) => u.selected === true);
    if (selectedUser) {
      if (selectedUser.messages) {
        let msg = selectedUser.messages[0];
        if (selectedUser.username === msg.from) {
          p.play(`${msg.from} sent you message ${msg.content}`);
        } else {
          p.play(`You send ${msg.content} to ${msg.to}`);
        }
        p.play({ command: "readLastMessage", data: selectedUser });
        p.play(`Would you like to send message to ${selectedUser.username}?`);
      }
    }
  }
});

const confirmation = context(() => {
  intent("yes", async (p) => {});
  intent("no", async (p) => {
    let users = p.visual.data;
    if (users) {
      let selectedUser = users.find((u) => u.selected === true);
      if (selectedUser) {
        if (selectedUser.messages) {
          p.play("Ok, no problem.");
        }
      }
    }
  });
});
