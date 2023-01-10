let convoContainer = document.getElementsByClassName('container')[0];
let interactionId = 0;

window.onload = async function () {
  const { config } = await import('../../WoolLib/config.js');
  const { cookies } = await import('../../WoolLib/cookies/index.js');
  let condition = sessionStorage.cookies;
  let token =
    condition == true
      ? cookies.getCookies('authToken')
      : sessionStorage.authToken;

  $.ajax({
    url: config.baseUrl + config.port + '/wool/v1/dialogue/start',
    type: 'POST',
    dataType: 'json',
    data: {
      dialogueName: 'basic',
      language: 'en',
      timeZone: 'Europe/Lisbon',
    },
    headers: { 'X-Auth-Token': token },
    success: function (res) {
      getInfoNode(res);
      renderHTML(res);
    },
  });
};

function renderHTML(response) {
  const res = JSON.stringify(response);
  let agentStatement = `<agent-stmt data='${res}'></agent-stmt>`;
  let replies = `<node-replies class='step${interactionId}' data='${res}'></node-replies>`;
  let avatar = `<agent-avatar></agent-avatar>`;

  let data = `<div class="agent-data">${avatar}<div>${agentStatement}${replies}</div></div>`;
  convoContainer.insertAdjacentHTML('beforeend', data);
  progress();
}

function progress() {
  const re = document.querySelector(`node-replies.step${interactionId}`);
  re.addEventListener('data-received', (event) => {
    getInfoNode(event.detail);
    renderHTML(event.detail);
  });
}

function getInfoNode(res) {
  interactionId =
    res.value?.loggedInteractionIndex || res.loggedInteractionIndex;
}
