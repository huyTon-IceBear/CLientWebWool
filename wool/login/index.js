const template = document.createElement('template');

template.innerHTML = `
    <link rel="stylesheet" href="wool/login/style.css"/>
    <div class="login-screen">
    <input type="checkbox" id="chk" aria-hidden="true" />
    <div class="signup">
        <form>
          <label for="chk" aria-hidden="true">Sign up</label>
          <input type="text" name="txt" placeholder="User name" required="" />
          <input type="email" name="email" placeholder="Email" required="" />
          <input
            type="password"
            name="pswd"
            placeholder="Password"
            required=""
          />
          <button>Sign up</button>
        </form>
      </div>
      <div class="login" id="login_form">
        <form>
          <label for="chk" aria-hidden="true">Login</label>
          <input type="email" name="email" placeholder="Email" required="" />
          <input
            type="password"
            name="pswd"
            placeholder="Password"
            required=""
          />
          <button class="btn">
            <img src="wool/assets/chat.svg" />
            <span class="text"> Start Chatting </span>
            <span class="loading-animate"></span>
          </button>
        </form>
      </div>
    </div>
`;

class LoginScreen extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }

  connectedCallback() {
    this.shadowRoot
      .querySelector('#login_form')
      .addEventListener('submit', (evt) => {
        evt.preventDefault();
      });

    this.shadowRoot.querySelector('.btn').addEventListener('click', (evt) => {
      evt.target.classList.add('loading');
      setTimeout(() => {
        setTimeout(() => {
          evt.target.classList.remove('loading');
        }, 1000);
        window.location.href = 'login/index.html';
      }, 2000);
    });
  }
}

export default LoginScreen;
