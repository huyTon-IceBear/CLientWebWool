import { route } from "../config.js";
import { postFormData } from "../helpers/api.js";

/**Button to cancel a dialogue
 * not used in conversation component
 */
class ButtonCancel extends HTMLElement {
  constructor() {
    super();
    this.cancelRoute = route.cancelDialogue;

    //Create cancel button component
    const cancel = document.createElement("button");
    cancel.setAttribute("class", "wool-control-cancel");
    const cancelIcon = document.createElement("icancel");

    cancel.appendChild(cancelIcon);
    cancel.appendChild(cancelIcon.cloneNode(false));

    //Get the data for cancel button
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

  /**Function to call cancel API */
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
