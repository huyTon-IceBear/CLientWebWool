const template = document.createElement('template');
import { config } from '../config.js';
import { cookies } from '../cookies/index.js';
template.innerHTML = `
    <link rel="stylesheet" href="WoolLib/conversation/style.css"/>
    <div class="conversation-container" id="conversation" />
`;

class ConversationScreen extends HTMLElement {
  constructor() {
    super();
    this.port = config.port;
    this.baseUrl = config.baseUrl;
    this.interactionId = 0;
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }

  async connectedCallback() {
    console.log('Custom square element added to page.');
    await this.startDialogue();
  }

  async startDialogue() {
    let condition = sessionStorage.cookies;
    let token =
      condition == 'true'
        ? cookies.getCookies('authToken')
        : sessionStorage.authToken;
    $.ajax({
      url: this.baseUrl + this.port + '/wool/v1/dialogue/start',
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
  }

  renderHTML(response) {
    const convoContainer = this.shadowRoot.querySelector('#conversation');
    const res = JSON.stringify(response);
    let agentStatement = `<agent-stmt data='${res}'></agent-stmt>`;
    let replies = `<node-replies class='step${this.interactionId}' data='${res}'></node-replies>`;
    let avatar = `<agent-avatar></agent-avatar>`;

    let data = `<div class="agent-data">${avatar}<div>${agentStatement}${replies}</div></div>`;
    convoContainer.insertAdjacentHTML('beforeend', data);
    progress();
  }

  progress() {
    const re = document.querySelector(`node-replies.step${this.interactionId}`);
    re.addEventListener('data-received', (event) => {
      getInfoNode(event.detail);
      renderHTML(event.detail);
    });
  }

  getInfoNode(res) {
    this.interactionId =
      res.value?.loggedInteractionIndex || res.loggedInteractionIndex;
  }
}

export default ConversationScreen;
