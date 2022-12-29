class Reply extends HTMLElement {
  constructor() {
    super();
    let replies = document.createElement("div");
    replies.setAttribute("class", "reply");

    const text = JSON.parse(this.getAttribute("data"));
    const content = text.value?.replies || text.replies;
    const node = text.value?.node || text.node;
    const interactionId =
    text.value?.loggedInteractionIndex || text.loggedInteractionIndex;

    if (content !== null) {
      for (let i = 0; i < content.length; i++) {
        const r = content[i].statement?.segments[0].text || "Continue";
        console.log(r)
        replies.innerHTML += `<p class="${node}-${interactionId}-reply${i}">${r}</p>`;
      }
    }

    const shadowRoot = this.attachShadow({ mode: "open" });
    shadowRoot.appendChild(replies);
  }

  connectedCallback(){
    
  }
}

export default Reply;
