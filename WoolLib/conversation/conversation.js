const template = document.createElement("template");
import { config } from "../config.js";
import { cookies } from "../cookies/index.js";
template.innerHTML = `
    <link rel="stylesheet" href="/WoolLib/conversation/style.css"/>
    <div class="conversation-container" id="conversation" />
`;

class ConversationScreen extends HTMLElement {
  constructor() {
    super();
    this.port = config.port;
    this.baseUrl = config.baseUrl;
    this.interactionId = 0;
    this.convoContainer;
    this.res;
    this.attachShadow({ mode: "open" });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }

  async connectedCallback() {
    this.convoContainer = this.shadowRoot.querySelector("#conversation");
    await this.startDialogue();
  }

  async startDialogue() {
    let condition = sessionStorage.cookies;
    let token =
      condition == "true"
        ? cookies.getCookies("authToken")
        : sessionStorage.authToken;

    const formData = new FormData();
    formData.append("dialogueName", "basic");
    formData.append("language", "en");
    formData.append("timeZone", "Europe/Lisbon");

    await fetch(this.baseUrl + this.port + "/wool/v1/dialogue/start", {
      method: "POST",
      body: formData,
      headers: {
        "X-Auth-Token": token,
      },
    }).then(async (response) => {
      this.res = await response.json();
      this.getInfoNode(this.res);
      this.renderHTML(this.res);
    });
  }

  renderHTML(response) {
    const responses = JSON.stringify(response);
    console.log(JSON.stringify(this.res))
    console.log(responses)

    const speaker =
      JSON.stringify(response?.speaker) ||
      JSON.stringify(response?.value?.speaker);
  
    let agentStatement = `<agent-stmt data='${responses}'></agent-stmt>`;
    let replies = `<node-replies class='step${this.interactionId}' data='${responses}'></node-replies>`;
    let avatar = `<agent-avatar speaker='${speaker}' 
                  img="https://img.icons8.com/external-linector-lineal-linector/512/external-avatar-man-avatar-linector-lineal-linector-3.png">
                  </agent-avatar>`;
    
    let ctrl = `<conversation-controls/>`

    let data = `<div class="agent-data">${avatar}<div>${agentStatement}${replies}</div></div>`;

    this.convoContainer.insertAdjacentHTML("beforeend", data);
    this.convoContainer.insertAdjacentHTML("beforeend", ctrl);

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
