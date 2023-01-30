import { route } from "../config.js";
import { postFormData } from "../helpers/api.js";
class ButtonCancel extends HTMLElement {
  constructor() {
    super();
    this.cancelRoute = route.cancelDialogue;

    const cancel = document.createElement("button");
    cancel.setAttribute("class", "wool-control-cancel");
    const cancelIcon = document.createElement("icancel");

    cancel.appendChild(cancelIcon);
    cancel.appendChild(cancelIcon.cloneNode(false));

    this.text = JSON.parse(this.getAttribute("data"));
    this.dialogueId =
      this.text?.value?.loggedDialogueId || this.text?.loggedDialogueId;

    const linkElem = document.createElement("link");
    linkElem.setAttribute("rel", "stylesheet");
    linkElem.setAttribute("href", "/WoolLib/cancel/cancel.css");

    const shadowRoot = this.attachShadow({ mode: "open" });
    shadowRoot.appendChild(cancel);
    shadowRoot.appendChild(linkElem);
  }

  connectedCallback() {
    const a = this.shadowRoot.querySelector("button");
    a.addEventListener("click", this.cancel.bind(this));
  }

  cancel(e) {
    e.preventDefault();
    postFormData(this.cancelRoute, {
      loggedDialogueId: this.dialogueId,
    }).then(async (response) => {
      let res = await response.json();
    });
  }
}

export default ButtonCancel;
