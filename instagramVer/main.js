let convoContainer = document.getElementsByClassName("container")[0];

let token = "",
  statement = "",
  dialogueId = "",
  node = "";
let content = [];
let interactionId = 0;

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
      console.log(res);
      getInfoNode(res);
      renderHTML();
    },
  });
}

function renderHTML() {
  let agentStatement = "";
  let replies = "";

  agentStatement += `<div class="statement">${statement}</div>`;

  for (let i = 0; i < content.length; i++) {
    const r = content[i].statement?.segments[0].text || "Continue";
    replies += `<p class="${node}-${interactionId}-reply${i}">${r}</p>`;
  }

  let repliesCtr = `<div class="reply-container">${replies}</div>`;

  let data = `<div class="agent-data">
              <img src="https://img.icons8.com/external-linector-lineal-linector/64/null/external-avatar-man-avatar-linector-lineal-linector-6.png" class="ava">
              <div>${agentStatement}${repliesCtr}</div>
              </div>`;
  convoContainer.insertAdjacentHTML("beforeend", data);

  for (let i = 0; i < content.length; i++) {
    const a = document.getElementsByClassName(
      `${node}-${interactionId}-reply${i}`
    )[0];
    a.setAttribute("reply-id", content[i].replyId);
    a.setAttribute("end-or-not", content[i].endsDialogue);
    a.addEventListener("click", progress);
  }
}

function progress(e) {
  e.preventDefault();
  let id = parseInt(e.target.getAttribute("reply-id"));
  let end = e.target.getAttribute("end-or-not");

  if (end === "true") {
    convoContainer.insertAdjacentHTML("beforeend", `<div class="end-dialogue">End Dialogue.</div>`);
  } else {
    const input = `<div class="user-data">
                    <p class="user-${id}">${e.target.innerHTML}</p>
                    <img src="https://img.icons8.com/external-linector-lineal-linector/64/null/external-avatar-man-avatar-linector-lineal-linector-6.png" class="ava">
                  </div>`;
    convoContainer.insertAdjacentHTML("beforeend", input);

    $.ajax({
      url: "http://localhost:8080/wool/v1/dialogue/progress",
      type: "POST",
      dataType: "json",
      data: {
        loggedDialogueId: dialogueId,
        loggedInteractionIndex: interactionId,
        replyId: id,
      },
      headers: { "X-Auth-Token": token },
      success: function (res) {
        console.log(res);
        getInfoNode(res);
        renderHTML();
      },
    });
  }
}

function getInfoNode(res) {
  node = res.value?.node || res.node;
  statement =
    res.value?.statement.segments[0].text || res.statement.segments[0].text;
  content = res.value?.replies || res.replies;
  dialogueId = res.value?.loggedDialogueId || res.loggedDialogueId;
  interactionId =
    res.value?.loggedInteractionIndex || res.loggedInteractionIndex;
}
