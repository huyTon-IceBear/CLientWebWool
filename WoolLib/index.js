import Avatar from "./avatar/avatar.js";
import Statement from "./statement/statement.js";
import LoginScreen from "./login/index.js";

customElements.define("agent-ava", Avatar);
window.customElements.define("agent-stmt", Statement);
window.customElements.define('login-screen', LoginScreen);
