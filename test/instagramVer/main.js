let convoContainer = document.getElementsByClassName("container")[0];

let dialogueId = "";
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
  const res = JSON.stringify(response);
  let agentStatement = `<agent-stmt data='${res}'></agent-stmt>`;
  let replies = `<node-replies data='${res}'></node-replies>`;
  let avatar = `<agent-avatar></agent-avatar>`;

  let data = `<div class="agent-data">${avatar}<div>${agentStatement}${replies}</div></div>`;
  convoContainer.insertAdjacentHTML("beforeend", data);

  const re = document.querySelector("node-replies");
  re.addEventListener("data-received", (event) => {
    //only work 1 time
    response = event.detail;
    getInfoNode(event.detail);
    renderHTML();
  });
}

function getInfoNode(res) {
  dialogueId = res.value?.loggedDialogueId || res.loggedDialogueId;
  interactionId =
    res.value?.loggedInteractionIndex || res.loggedInteractionIndex;
}
