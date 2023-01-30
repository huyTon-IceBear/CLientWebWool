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

      let contn = `<conversation-continue data='${this.passRes}'></conversation-continue>`;
      this.convoContainer.insertAdjacentHTML("afterend", contn);
      // let cancel = `<conversation-cancel data='${this.passRes}'></conversation-cancel>`;
      // this.convoContainer.insertAdjacentHTML("afterend", cancel);
      let back = `<conversation-back data='${this.passRes}'></conversation-back>`;
      this.convoContainer.insertAdjacentHTML("afterend", back);


      this.renderHTML();
    });
  }

  renderHTML() {
    if (this.passRes !== "true") {
      let agentStatement = `<agent-stmt data='${this.passRes}'></agent-stmt>`;
      let replies = `<node-replies class='step${this.interactionId}' data='${this.passRes}'></node-replies>`;
      let avatar = `<agent-avatar speaker='${this.speaker}' 
                  img="https://img.icons8.com/external-linector-lineal-linector/512/external-avatar-man-avatar-linector-lineal-linector-3.png">
                  </agent-avatar>`;

      let data = `<div class="agent-data">${avatar}<div>${agentStatement}${replies}</div></div>`;
      this.convoContainer.insertAdjacentHTML("beforeend", data);

      this.convoContainer.lastElementChild.scrollIntoView();
      this.progress();
      this.back();
      this.continue();
    }
  }

  progress() {
    const backBtn = this.shadowRoot.querySelector("conversation-back");
    const re = this.shadowRoot.querySelectorAll(
      `node-replies.step${this.interactionId}`
    );
    const lastRe = re[re.length - 1];

    lastRe.addEventListener("data-received", (event) => {
      this.getInfoNode(event?.detail);
      backBtn.setAttribute("data", this.passRes);
      backBtn.updateData();
      this.renderHTML();
    });
  }

  back() {
    const backBtn = this.shadowRoot.querySelector("conversation-back");
    backBtn.removeEventListener("event-received", this.backListener);
    this.backListener = (event) => {
      this.getInfoNode(event?.detail);
      if (event?.detail?.loggedInteractionIndex === 0) {
        backBtn.setAttribute("data", "true");
      } else backBtn.setAttribute("data", this.passRes);
      backBtn.updateData();
      this.renderHTML();
    };
    backBtn.addEventListener("event-received", this.backListener);
  }

  continue() {
    const backBtn = this.shadowRoot.querySelector("conversation-back");
    const continueBtn = this.shadowRoot.querySelector("conversation-continue");

    continueBtn.removeEventListener("eventContn-received", this.continueListener);
    this.continueListener = (event) => {
      this.getInfoNode(event?.detail);
      backBtn.setAttribute("data", this.passRes);
      backBtn.updateData();
      this.renderHTML();
    };
    continueBtn.addEventListener("eventContn-received", this.continueListener);
  }

  getInfoNode(response) {
    if (response !== "true") {
      this.passRes = JSON.stringify(response);
      this.speaker =
        JSON.stringify(response?.speaker) ||
        JSON.stringify(response?.value?.speaker);
      this.interactionId =
        response?.value?.loggedInteractionIndex ||
        response?.loggedInteractionIndex;
    } else this.passRes = response;
  }
}

export default ConversationScreen;
