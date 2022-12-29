class Reply extends HTMLElement {
  constructor() {
    super();
    let replies = document.createElement("div");
    replies.setAttribute("class", "reply");

    const text = JSON.parse(this.getAttribute("data"));
    // replies.textContent = text;

    console.log(text);

    const shadowRoot = this.attachShadow({ mode: "open" });
    shadowRoot.appendChild(replies);
  }
}

export default Reply;