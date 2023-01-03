let statement;

class Statement extends HTMLElement {
  constructor() {
    super();
    const stmt = document.createElement("div");
    stmt.setAttribute("class", "wool-statement");

    const text = JSON.parse(this.getAttribute("data"));
    statement =
    text.value?.statement.segments[0].text || text.statement.segments[0].text;
    stmt.textContent = statement;

    const linkElem = document.createElement("link");
    linkElem.setAttribute("rel", "stylesheet");
    linkElem.setAttribute("href", "../../WoolLib/statement/statement.css");

    const shadowRoot = this.attachShadow({ mode: "open" });
    shadowRoot.appendChild(stmt);
    shadowRoot.appendChild(linkElem);
  }
}

export default Statement;