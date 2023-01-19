const template = document.createElement('template');
import { config } from '../config.js';
import { cookies } from '../cookies/index.js';
template.innerHTML = `
    <link rel="stylesheet" href="../rpg/rpg.css"/>
    <div class="conversation-container" id="conversation" />
`;

class ConversationScreen extends HTMLElement {
    constructor() {
        super();
        this.port = config.port;
        this.baseUrl = config.baseUrl;
        this.interactionId = 0;
        this.convoContainer;
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.appendChild(template.content.cloneNode(true));
    }

    async connectedCallback() {
        console.log('Custom square element added to page.');
        this.convoContainer = this.shadowRoot.querySelector('#conversation');
        await this.startDialogue();
    }

    async startDialogue() {
        let condition = sessionStorage.cookies;
        let token =
            condition == 'true'
                ? cookies.getCookies('authToken')
                : sessionStorage.authToken;

        const formData = new FormData();
        formData.append('dialogueName', 'basic');
        formData.append('language', 'en');
        formData.append('timeZone', 'Europe/Lisbon');

        await fetch(this.baseUrl + this.port + '/wool/v1/dialogue/start', {
            method: 'POST',
            body: formData,
            headers: {
                'X-Auth-Token': token,
            },
        }).then(async (response) => {
            let res = await response.json();
            this.getInfoNode(res);
            this.renderHTML(res);
        });
    }

    renderHTML(response) {
        // const convoContainer = this.shadowRoot.querySelector('#conversation');
        const res = JSON.stringify(response);
        let agentStatement = `<agent-stmt data='${res}'></agent-stmt>`;
        let replies = `<node-replies class='step${this.interactionId}' data='${res}'></node-replies>`;
        let avatar = `<agent-avatar></agent-avatar>`;

        let data = `<div class="agent-data">${avatar}<div>${agentStatement}${replies}</div></div>`;
        this.convoContainer.insertAdjacentHTML('beforeend', data);
        this.progress();
    }

    progress() {
        const re = this.shadowRoot.querySelector(
            `node-replies.step${this.interactionId}`
        );
        re.addEventListener('data-received', (event) => {
            this.getInfoNode(event?.detail);
            this.renderHTML(event?.detail);
        });
    }

    getInfoNode(res) {
        this.interactionId =
            res.value?.loggedInteractionIndex || res?.loggedInteractionIndex;
    }
}

export default RPGConversationScreen;