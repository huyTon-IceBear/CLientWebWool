let convoContainer = document.getElementsByClassName("container")[0];

let token = "",
  statement = "",
  dialogueId = "",
  node = "";

let content = [];
let interactionId = 0;

let response;

window.onload = function () {
  $.ajax({
    url: "http://localhost:8080/wool/v1/dialogue/start",
    type: "POST",
    dataType: "json",
    data: {
      dialogueName: "basic",
      language: "en",
      timeZone: "Europe/Lisbon",
    },
    headers: { "X-Auth-Token": sessionStorage.authToken },
    success: function (res) {
      response = res;
      getInfoNode(res);
      renderHTML();
    },
  });
};

function renderHTML() {
  let agentStatement = "";
  let replies = "";
  const res = JSON.stringify(response);
  console.log(res);

  agentStatement += `<agent-stmt data-text="${statement}"></agent-stmt>`

  for (let i = 0; i < content.length; i++) {
    const r = content[i].statement?.segments[0].text || "Continue";
    replies += `<p class="${node}-${interactionId}-reply${i}">${r}</p>`;
  }

  let repliesCtr = `<div class="reply-container">${replies}</div>`;

  let data = `<div class="agent-data"><agent-ava></agent-ava><div>${agentStatement}${repliesCtr}<node-replies data='${res}'></node-replies></div></div>`;
  // debugger
  convoContainer.insertAdjacentHTML("beforeend", data);

  for (let i = 0; i < content.length; i++) {
    const a = document.getElementsByClassName(
      `${node}-${interactionId}-reply${i}`
    )[0];
    a.setAttribute("reply-id", content[i].replyId);
    a.setAttribute("end-or-not", content[i].endsDialogue);
    a.setAttribute("interaction", interactionId);

    a.addEventListener("click", progress);
  }
}

function progress(e) {
  e.preventDefault();
  let id = parseInt(e.target.getAttribute("reply-id"));
  let end = e.target.getAttribute("end-or-not");
  let sameStep =
    parseInt(e.target.getAttribute("interaction")) == interactionId;

  if (sameStep) {
    if (end === "true") {
      convoContainer.insertAdjacentHTML(
        "beforeend",
        `<div class="end-dialogue">End Dialogue.</div>`
      );
      interactionId = -1;
    } else {
      const input = `<div class="user-data"><p class="user-${id}">${e.target.innerHTML}</p>${ava}</div>`;
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
          getInfoNode(res);
          renderHTML();
        },
      });
    }
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
