class Statement extends HTMLElement {
  constructor() {
    super();
    const stmt = document.createElement("div");
    stmt.setAttribute("class", "wool-statement");

    const text = this.getAttribute("data-text");
    stmt.textContent = text;

    const linkElem = document.createElement("link");
    linkElem.setAttribute("rel", "stylesheet");
    linkElem.setAttribute("href", "../../WoolLib/statement/statement.css");

    const shadowRoot = this.attachShadow({ mode: "open" });
    shadowRoot.appendChild(stmt);
    shadowRoot.appendChild(linkElem);
  }
}

export default Statement;