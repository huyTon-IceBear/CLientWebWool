import { config, route } from "../config.js";
import { postFormData } from "../helpers/api.js";
class ButtonContinue extends HTMLElement {
  constructor() {
    super();
    this.continueRoute = route.continueDialogue;

    const contn = document.createElement("button");
    contn.setAttribute("class", "wool-control-continue");
    const continueIcon = document.createElement("icontinue");

    contn.appendChild(continueIcon);
    contn.appendChild(continueIcon.cloneNode(false));

    this.text = JSON.parse(this.getAttribute("data"));
    this.dialogueId =
      this.text?.value?.loggedDialogueId || this.text?.loggedDialogueId;

    const linkElem = document.createElement("link");
    linkElem.setAttribute("rel", "stylesheet");
    linkElem.setAttribute("href", "/WoolLib/continue/continue.css");

    const shadowRoot = this.attachShadow({ mode: "open" });
    shadowRoot.appendChild(contn);
    shadowRoot.appendChild(linkElem);
  }

  connectedCallback() {
    const a = this.shadowRoot.querySelector("button");
    a.addEventListener("click", this.continue.bind(this));
  }

  continue(e) {
    e.preventDefault();
    postFormData(this.continueRoute, {
        dialogueName: config.dialogueName,
        timeZone: config.timeZone,
    }).then(async (response) => {
      let res = await response.json();
      console.log(res)
      this.dispatchEvent(new CustomEvent("eventContn-received", { detail: res }));
    });
  }
}

export default ButtonContinue;
