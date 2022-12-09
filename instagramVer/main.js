let convoContainer = document.getElementsByClassName("container")[0];

let token = "";
let content = [];
let statement = "";

window.onload = function () {
  $.ajax({
    url: "http://localhost:8080/wool/v1/auth/login",
    type: "POST",
    dataType: "json",
    contentType: "application/json",
    data: JSON.stringify({
      user: "user",
      password: "user",
      tokenExpiration: 0,
    }),
    success: function (res) {
      token = res.token;
      startDialog();
    },
  });
};

function startDialog() {
  $.ajax({
    url: "http://localhost:8080/wool/v1/dialogue/start",
    type: "POST",
    dataType: "json",
    data: {
      dialogueName: "basic",
      language: "en",
      timeZone: "Europe/Lisbon",
    },
    headers: { "X-Auth-Token": token },
    success: function (res) {
      statement = res.statement.segments[0].text;
      content = res.replies;
      console.log(content);
      renderHTML();
    },
  });
}

function renderHTML() {
  let agentStatement = "";
  let replies = "";
  let a;

  agentStatement += `<div class="statement">${statement}</div>`;

  for (let i = 0; i < content.length; i++) {
    replies += `<div class="reply${i}">${content[i].statement.segments[0].text}</div>`;
  }

//   const a = document.getElementsByClassName("reply0")[0];
    // a.addEventListener("click", sayHi);

  let data = agentStatement + replies;
  convoContainer.insertAdjacentHTML("beforeend", data);
}

function sayHi() {
    console.log("Hi")
}