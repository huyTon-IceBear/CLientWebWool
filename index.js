import LoginScreen from './WoolLib/UI/login/index.js';
import { Ava, Statement } from "./WoolLib/convoComponent/main.js";
import { Login, Start } from "./WoolLib/feature/main.js";

customElements.define("agent-ava", Ava);
customElements.define("agent-stmt", Statement);
customElements.define('login-screen', LoginScreen);

let node;
export async function AuthLogin(object) {
  node = await Login(object);
  let temp = await Start(node?.token);
  console.log(temp);
}
