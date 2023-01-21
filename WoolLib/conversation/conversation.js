const template = document.createElement('template');
import { config, route } from '../config.js';
import { postFormData } from '../helpers/api.js';

template.innerHTML = `
    <link rel="stylesheet" href="/WoolLib/conversation/style.css"/>
    <div class="conversation-container" id="conversation" />
`;

class ConversationScreen extends HTMLElement {
  constructor() {
    super();
    this.startRoute = route.startDialogue;
    this.interactionId = 0;
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }

  async connectedCallback() {
    this.convoContainer = this.shadowRoot.querySelector('#conversation');
    await this.startDialogue();
  }

  async startDialogue() {
    await postFormData(this.startRoute, {
      dialogueName: config.dialogueName,
      language: config.language,
      timeZone: config.timeZone,
    }).then(async (response) => {
      let res = await response.json();
      this.getInfoNode(res);
      this.renderHTML(res);
    });
  }

  renderHTML(response) {
    const res = JSON.stringify(response);
    let agentStatement = `<agent-stmt data='${res}'></agent-stmt>`;
    let replies = `<node-replies class='step${this.interactionId}' data='${res}'></node-replies>`;
    let avatar = `<agent-avatar></agent-avatar>`;
    let data = `<div class="agent-data">${avatar}<div>${agentStatement}${replies}</div></div>`;
    this.convoContainer.insertAdjacentHTML('beforeend', data);
    this.progress();
  }

  progress() {
    const re = this.shadowRoot.querySelector(
      `node-replies.step${this.interactionId}`
    );
    re.addEventListener('data-received', (event) => {
      this.getInfoNode(event?.detail);
      this.renderHTML(event?.detail);
    });
  }

  getInfoNode(res) {
    this.interactionId =
      res.value?.loggedInteractionIndex || res?.loggedInteractionIndex;
  }
}

export default ConversationScreen;
