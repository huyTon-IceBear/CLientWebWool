export class Reply extends HTMLElement {
  constructor() {
    super();
    let stmt = document.createElement("div");
    stmt.setAttribute("class", "statement");

    const text = this.getAttribute("data-text");
    stmt.textContent = text;

    const shadowRoot = this.attachShadow({ mode: "open" });
    shadowRoot.appendChild(stmt);
  }
}
