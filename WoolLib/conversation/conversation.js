const template = document.createElement("template");
import { config, route } from "../config.js";
import { postFormData } from "../helpers/api.js";

template.innerHTML = `
    <link rel="stylesheet" href="/WoolLib/conversation/style.css"/>
    <div class="conversation-container" id="conversation" />
`;

class ConversationScreen extends HTMLElement {
  constructor() {
    super();
    this.startRoute = route.startDialogue;
    this.interactionId = 0;
    this.attachShadow({ mode: "open" });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }

  async connectedCallback() {
    this.convoContainer = this.shadowRoot.querySelector("#conversation");
    await this.startDialogue();
  }

  async startDialogue() {
    await postFormData(this.startRoute, {
      dialogueName: config.dialogueName,
      language: config.language,
      timeZone: config.timeZone,
    }).then(async (response) => {
      this.res = await response.json();
      this.getInfoNode(this.res);
      this.renderHTML(this.res);
    });
  }

  renderHTML(response) {
    const responses = JSON.stringify(response);
    const speaker =
      JSON.stringify(response?.speaker) ||
      JSON.stringify(response?.value?.speaker);

    let agentStatement = `<agent-stmt data='${responses}'></agent-stmt>`;
    let replies = `<node-replies class='step${this.interactionId}' data='${responses}'></node-replies>`;
    let avatar = `<agent-avatar speaker='${speaker}' 
                  img="https://img.icons8.com/external-linector-lineal-linector/512/external-avatar-man-avatar-linector-lineal-linector-3.png">
                  </agent-avatar>`;

    let data = `<div class="agent-data">${avatar}<div>${agentStatement}${replies}</div></div>`;
    let back = `<conversation-back/>`;

    this.convoContainer.insertAdjacentHTML("beforeend", data);
    this.convoContainer.insertAdjacentHTML("beforeend", back);

    this.convoContainer.lastElementChild.scrollIntoView();
    this.progress();
  }

  progress() {
    const re = this.shadowRoot.querySelector(
      `node-replies.step${this.interactionId}`
    );
    re.addEventListener("data-received", (event) => {
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
