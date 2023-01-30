let content, node, interactionId, dialogueId, a;
import { route } from "../config.js";
import { postFormData } from "../helpers/api.js";
class Reply extends HTMLElement {
  constructor() {
    super();
    this.processRoute = route.processDialogue;
    //Create Reply component
    let replies = document.createElement("div");
    replies.setAttribute("class", "reply-container");

    //Get data for each execution state
    const text = JSON.parse(this.getAttribute("data"));
    content = text?.value?.replies || text?.replies;
    node = text?.value?.node || text?.node;
    interactionId =
      text?.value?.loggedInteractionIndex || text?.loggedInteractionIndex;
    dialogueId = text?.value?.loggedDialogueId || text?.loggedDialogueId;
    replies.setAttribute("id", interactionId);

    //Auto render option when node just has the statement
    if (content !== null) {
      for (let i = 0; i < content?.length; i++) {
        const r = content?.[i]?.statement?.segments?.[0]?.text || "Continue";
        replies.innerHTML += `<p class="${node}-${interactionId}-reply${i}">${r}</p>`;
      }
    }

    const linkElem = document.createElement("link");
    linkElem.setAttribute("rel", "stylesheet");
    linkElem.setAttribute("href", "/WoolLib/replies/reply.css");

    const shadowRoot = this.attachShadow({ mode: "open" });
    shadowRoot.appendChild(replies);
    shadowRoot.appendChild(linkElem);
  }

  connectedCallback() {
    //Set attributes to distinguish options
    for (let i = 0; i < content?.length; i++) {
      a = this.shadowRoot.querySelector(`.${node}-${interactionId}-reply${i}`);
      a.setAttribute("reply-id", content?.[i]?.replyId);
      a.setAttribute("end-or-not", content?.[i]?.endsDialogue);
      a.setAttribute("interaction", interactionId);
      a.addEventListener("click", this.progress.bind(this));
    }
  }

  async progress(e) {
    e.preventDefault();
    let id = parseInt(e.target.getAttribute("reply-id"));
    let end = e.target.getAttribute("end-or-not");
    let sameStep =
      parseInt(e.target.getAttribute("interaction")) === interactionId;

    const el = document.querySelector(`conversation-container`);
    if (el.shadowRoot) {
      let convoContainer = el.shadowRoot.querySelector(`#conversation`);

      //If the replies are in the same state as the current node, 
      //they will be triggered
      if (sameStep) {
        if (end === "true") {
          convoContainer.insertAdjacentHTML(
            "beforeend",
            `<div class="user-data"><div class="end-dialogue">End Dialogue.</div><agent-avatar/></div>`
          );
          interactionId = -1;
          //If at the last step, return "true" to stop interaction
          this.dispatchEvent(
            new CustomEvent("data-received", { detail: end })
          );
        } else {
          const input = `<div class="user-data"><p class="user-${id}">${e.target.innerHTML}</p><agent-avatar/></div>`;
          convoContainer.insertAdjacentHTML("beforeend", input);

          //Call progress API
          await postFormData(this.processRoute, {
            loggedDialogueId: dialogueId,
            loggedInteractionIndex: interactionId,
            replyId: id,
          }).then(async (response) => {
            let res = await response.json();
            //Change the "interaction" attribute to avoid confusion when using the back function
            a.setAttribute("interaction", `OLD${interactionId}`);
            this.dispatchEvent(
              new CustomEvent("data-received", { detail: res })
            );
          });
        }
      }
    }
  }
}

export default Reply;
