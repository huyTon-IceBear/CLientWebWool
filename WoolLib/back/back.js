class ButtonBack extends HTMLElement {
  constructor() {
    super();
    const back = document.createElement("button");
    back.setAttribute("class", "wool-control-back arrow");

    const backIcon = document.createElement("i");

    back.appendChild(backIcon);
    back.appendChild(backIcon.cloneNode(false));

    const linkElem = document.createElement("link");
    linkElem.setAttribute("rel", "stylesheet");
    linkElem.setAttribute("href", "/WoolLib/back/back.css");

    const shadowRoot = this.attachShadow({ mode: "open" });
    shadowRoot.appendChild(back);
    shadowRoot.appendChild(linkElem);
  }

  connectedCallback() {}
}

export default ButtonBack;
