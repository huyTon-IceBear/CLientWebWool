let content, node, interactionId, dialogueId;
import { config } from '../config.js';
import { cookies } from '../cookies/index.js';

class Reply extends HTMLElement {
  constructor() {
    super();
    this.port = config.port;
    this.baseUrl = config.baseUrl;
    let replies = document.createElement('div');
    replies.setAttribute('class', 'reply-container');

    const text = JSON.parse(this.getAttribute('data'));
    content = text.value?.replies || text.replies;
    console.log(content);
    node = text.value?.node || text.node;
    interactionId =
      text.value?.loggedInteractionIndex || text.loggedInteractionIndex;
    dialogueId = text.value?.loggedDialogueId || text.loggedDialogueId;
    replies.setAttribute('id', interactionId);

    if (content !== null) {
      for (let i = 0; i < content.length; i++) {
        const r = content[i].statement?.segments[0].text || 'Continue';
        replies.innerHTML += `<p class="${node}-${interactionId}-reply${i}">${r}</p>`;
      }
    }

    const linkElem = document.createElement('link');
    linkElem.setAttribute('rel', 'stylesheet');
    linkElem.setAttribute('href', '../../WoolLib/replies/reply.css');

    const shadowRoot = this.attachShadow({ mode: 'open' });
    shadowRoot.appendChild(replies);
    shadowRoot.appendChild(linkElem);
  }

  connectedCallback() {
    for (let i = 0; i < content.length; i++) {
      const a = this.shadowRoot.querySelector(
        `.${node}-${interactionId}-reply${i}`
      );
      a.setAttribute('reply-id', content[i].replyId);
      a.setAttribute('end-or-not', content[i].endsDialogue);
      a.setAttribute('interaction', interactionId);

      a.addEventListener('click', this.progress.bind(this));
    }
  }

  async progress(e) {
    e.preventDefault();
    let id = parseInt(e.target.getAttribute('reply-id'));
    let end = e.target.getAttribute('end-or-not');
    let sameStep =
      parseInt(e.target.getAttribute('interaction')) == interactionId;

    if (sameStep) {
      if (end === 'true') {
        convoContainer.insertAdjacentHTML(
          'beforeend',
          `<div class="end-dialogue">End Dialogue.</div>`
        );
        interactionId = -1;
      } else {
        const input = `<div class="user-data"><p class="user-${id}">${e.target.innerHTML}</p><agent-avatar></agent-avatar></div>`;
        convoContainer.insertAdjacentHTML('beforeend', input);

        let condition = sessionStorage.cookies;
        let token =
          condition == 'true'
            ? cookies.getCookies('authToken')
            : sessionStorage.authToken;

        await $.ajax({
          url: this.baseUrl + this.port + '/wool/v1/dialogue/progress',
          type: 'POST',
          dataType: 'json',
          data: {
            loggedDialogueId: dialogueId,
            loggedInteractionIndex: interactionId,
            replyId: id,
          },
          headers: { 'X-Auth-Token': token },
          success: function (res) {
            this.dispatchEvent(
              new CustomEvent('data-received', { detail: res })
            );
            // return res;
          }.bind(this),
        });
      }
    }
  }
}

export default Reply;
