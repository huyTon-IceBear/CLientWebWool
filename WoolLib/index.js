import Avatar from './avatar/avatar.js';
import Statement from './statement/statement.js';
import LoginScreen from './login/index.js';
import Reply from './replies/reply.js';
import ButtonBack from './back/back.js';
import ConversationScreen from './conversation/conversation.js';

customElements.define('agent-avatar', Avatar);
customElements.define('agent-stmt', Statement);
customElements.define('node-replies', Reply);
customElements.define('login-screen', LoginScreen);
customElements.define('conversation-back', ButtonBack);
customElements.define('conversation-container', ConversationScreen);
