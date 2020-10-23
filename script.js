// Use this sample to create your own voice commands
intent("hello world", (p) => {
  p.play("(hello|hi there)");
});

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

intent("Read me the (last | latest) message", (p) => {
  let users = p.visual.data;
  if (users) {
    let selectedUser = users.find((u) => u.selected === true);
    if (selectedUser) {
      if (selectedUser.messages) {
        for (let i = 0; i < selectedUser.messages.length; i++) {
          p.play(`${selectedUser.messages[i].content}`);
        }
        p.play({ command: "readUserMessage", data: selectedUser });
      } else {
        p.play("There are no messages to read");
        p.play("send some messages..");
      }
    }
  }
});
