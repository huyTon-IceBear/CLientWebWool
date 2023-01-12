const template = document.createElement('template');
import { config } from '../config.js';
import { cookies } from '../cookies/index.js';
template.innerHTML = `
    <link rel="stylesheet" href="WoolLib/login/style.css"/>
    <div class="login-screen">
      <input type="checkbox" id="chk" aria-hidden="true" />
      <div class="signup">
        <form>
          <label for="chk" aria-hidden="true">Sign up</label>
          <input type="text" name="txt" placeholder="Username" required="" />
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
      <div class="login">
        <form id="login">
          <label for="chk" aria-hidden="true">Login</label>
          <input type="user" name="user" placeholder="Username" required/>
          <input
            type="password"
            name="pswd"
            placeholder="Password"
            required=""
          />
          <button class="btn">
            <img src="WoolLib/assets/chat.svg" />
            <span class="text"> Start Chatting </span>
            <span class="loading-animate"></span>
          </button>
          <div class="checkbox-container">
            <input class="checkbox" type="checkbox" id="my-checkbox">
            <p >Remember Me?</p>
          </div>
          <div id="error-message"></div>
        </form>
      </div>
    </div>
`;

class LoginScreen extends HTMLElement {
  constructor() {
    super();
    this.port = config.port;
    this.baseUrl = config.baseUrl;
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }

  connectedCallback() {
    const form = this.shadowRoot.querySelector('#login');
    form.addEventListener('submit', async (event) => {
      if (form.checkValidity()) {
        event.preventDefault();
        const user = form.elements.user.value;
        const password = form.elements.pswd.value;
        await this.callLoginApi(user, password);
        this.redirectToConversationPage();
      }
    });
  }

  redirectToConversationPage() {
    this.shadowRoot.querySelector('.btn').addEventListener('click', (evt) => {
      evt.target.classList.add('loading');
      setTimeout(() => {
        setTimeout(() => {
          evt.target.classList.remove('loading');
        }, 1000);
        // window.location.href = './test/instagramVer/insVer.html';
        window.location.href = '../../test.html';
      }, 2000);
    });
  }

  async callLoginApi(user, password) {
    try {
      const response = await fetch(
        this.baseUrl + this.port + '/wool/v1/auth/login',
        {
          method: 'POST',
          body: JSON.stringify({
            user: user,
            password: password,
            tokenExpiration: 0,
          }),
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      const data = await response.json();

      // Check for a successful status code
      if (response.status < 200 || response.status >= 300) {
        throw new Error(data?.message);
      }

      // Clear the error message
      const errorMessage = this.shadowRoot.querySelector('#error-message');
      errorMessage.innerText = '';

      // login was successful
      // store the authentication token (if provided by the API)
      const token = data?.token;

      const checkbox = this.shadowRoot.querySelector('#my-checkbox');
      const checked = checkbox.checked;

      if (checked) {
        cookies.setCookies('authToken', token, 1);
        sessionStorage.setItem('cookies', true);
      } else {
        sessionStorage.setItem('authToken', token);
        sessionStorage.setItem('cookies', false);
      }
    } catch (error) {
      // display the error message
      const errorMessage = this.shadowRoot.querySelector('#error-message');
      errorMessage.innerText = error.message;
    }
  }
}

export default LoginScreen;
