class Avatar extends HTMLElement {
  constructor() {
    super();
    const ava = document.createElement("img");
    ava.setAttribute("class", "wool-ava");
    ava.src = this.hasAttribute("img")
      ? this.getAttribute("img")
      : "https://img.icons8.com/external-linector-lineal-linector/64/null/external-avatar-man-avatar-linector-lineal-linector-6.png";
    ava.alt = this.hasAttribute("alt") ? this.getAttribute("alt") : "";

    const linkElem = document.createElement("link");
    linkElem.setAttribute("rel", "stylesheet");
    linkElem.setAttribute("href", "/WoolLib/avatar/avatar.css");

    const shadowRoot = this.attachShadow({ mode: "open" });
    shadowRoot.appendChild(ava);
    shadowRoot.appendChild(linkElem);
  }
}

export default Avatar;
