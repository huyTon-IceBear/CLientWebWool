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
      this.renderHTML();

      let back = `<conversation-back data='${this.passRes}'></conversation-back>`;
      this.convoContainer.insertAdjacentHTML("afterend", back);
    });
  }

  renderHTML() {
    let agentStatement = `<agent-stmt data='${this.passRes}'></agent-stmt>`;
    let replies = `<node-replies class='step${this.interactionId}' data='${this.passRes}'></node-replies>`;
    let avatar = `<agent-avatar speaker='${this.speaker}' 
                  img="https://img.icons8.com/external-linector-lineal-linector/512/external-avatar-man-avatar-linector-lineal-linector-3.png">
                  </agent-avatar>`;

    let data = `<div class="agent-data">${avatar}<div>${agentStatement}${replies}</div></div>`;
    this.convoContainer.insertAdjacentHTML("beforeend", data);

    this.convoContainer.lastElementChild.scrollIntoView();
    this.progress();
  }

  progress() {
    const backBtn = this.shadowRoot.querySelector("conversation-back");
    const re = this.shadowRoot.querySelector(
      `node-replies.step${this.interactionId}`
    );
    re.addEventListener("data-received", (event) => {
      this.getInfoNode(event?.detail);
      backBtn.setAttribute("data", this.passRes);
      backBtn.dispatchEvent(new Event("updateData"));
      this.renderHTML();
    });

    backBtn.addEventListener("event-received", (event) => {
      this.getInfoNode(event?.detail);
      this.renderHTML();
    });
  }

  getInfoNode(response) {
    this.passRes = JSON.stringify(response);
    this.speaker =
      JSON.stringify(response?.speaker) ||
      JSON.stringify(response?.value?.speaker);
    this.interactionId =
      response?.value?.loggedInteractionIndex ||
      response?.loggedInteractionIndex;
  }
}

export default ConversationScreen;
