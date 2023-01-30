let a;
import { route } from "../config.js";
import { postFormData } from "../helpers/api.js";
class ButtonBack extends HTMLElement {
  constructor() {
    super();
    this.backRoute = route.backDialogue;

    const back = document.createElement("button");
    back.setAttribute("class", "wool-control-back");
    const backIcon = document.createElement("i");

    back.appendChild(backIcon);
    back.appendChild(backIcon.cloneNode(false));

    this.text = JSON.parse(this.getAttribute("data"));
    this.interactionId =
      this.text?.value?.loggedInteractionIndex ||
      this.text?.loggedInteractionIndex;
    this.dialogueId =
      this.text?.value?.loggedDialogueId || this.text?.loggedDialogueId;

    const linkElem = document.createElement("link");
    linkElem.setAttribute("rel", "stylesheet");
    linkElem.setAttribute("href", "/WoolLib/back/back.css");

    const shadowRoot = this.attachShadow({ mode: "open" });
    shadowRoot.appendChild(back);
    shadowRoot.appendChild(linkElem);
  }

  connectedCallback() {
    a = this.shadowRoot.querySelector("button");
    a.addEventListener("click", this.back.bind(this));
  }

  back(e) {
    e.preventDefault();
    postFormData(this.backRoute, {
      loggedDialogueId: this.dialogueId,
      loggedInteractionIndex: this.interactionId,
    }).then(async (response) => {
      let res = await response.json();
      this.dispatchEvent(new CustomEvent("event-received", { detail: res }));
    });
  }

  updateData() {
    if (this.getAttribute("data") !== "true") {
      this.text = JSON.parse(this.getAttribute("data"));
      this.interactionId =
        this.text?.value?.loggedInteractionIndex ||
        this.text?.loggedInteractionIndex;
      this.dialogueId =
        this.text?.value?.loggedDialogueId || this.text?.loggedDialogueId;
        a.disabled = false;
    } else a.disabled = true;
  }
}

export default ButtonBack;
