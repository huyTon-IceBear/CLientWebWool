const template = document.createElement('template');
import { config, route } from '../config.js';
import { postFormData } from '../helpers/api.js';

template.innerHTML = `
    <link rel="stylesheet" href="/WoolLib//rpg.css"/>
    <div class="textBox">
        <img class="avatar" alt="Conversation avatar">
        <div class="title"></div>
        <div class="text"> </div>
    </div>
`;

class RPGConversationScreen extends HTMLElement {
  constructor() {
    super();
    this.interactionId = 0;
    this.startRoute = route.startDialogue;

    this.t = 0;
    this.split = false; //Splits the
    this.finish = false; // Finishes the animation if true

    this.speaker = [];

    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }

  async connectedCallback() {
    await this.startDialogue();

    const a = this.shadowRoot.querySelector('.textBox');
    a.addEventListener('click', () => {
      this.finish = true;
    });
  }

  async startDialogue() {
    await postFormData(this.startRoute, {
      dialogueName: config.dialogueName,
      language: config.language,
      timeZone: config.timeZone,
    })
      .then(async (response) => {
        this.node = JSON.stringify(response);
        this.node = JSON.parse(node);
        console.log(node);

        this.lastSpeaker = node.speaker;
        this.speakers.push({ name: node.speaker, speaking: true });

        renderHTML();
      })
      .catch((error) => {
        console.error('Error:', error);
        const a = this.shadowRoot.querySelector('.textBox');
        const b = this.shadowRoot.querySelector('.text');
        a.innerHTML = '';
        b.innerHTML = 'Something went wrong :(';
      });
  }

  renderHTML(response) {
    // const convoContainer = this.shadowRoot.querySelector('#conversation');
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

export default RPGConversationScreen;
