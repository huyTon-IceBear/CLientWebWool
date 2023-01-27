const template = document.createElement('template');
import { config, route } from '../config.js';
import { postFormData, postJSON } from '../helpers/api.js';

template.innerHTML = `
    <link rel="stylesheet" href="/WoolLib/rpg/rpg.css"/>
    <div class="rpg-container">
      <div class="textBox">
          <img class="avatar" alt="Conversation avatar">
          <div class="title"></div>
          <div class="text"> </div>
      </div>
    </div>
`;

class RPGConversationScreen extends HTMLElement {
  constructor() {
    super();
    this.interactionId = 0;
    this.t = 0;
    this.split = false; //Splits the
    this.finish = false; // Finishes the animation if true

    this.startRoute = route.startDialogue;
    this.progressRoute = route.progressRoute;

    this.node;
    this.lastSpeaker;

    this.speakers = [];

    this.dateContinue = {
      loggedDialogueId: 0,
      loggedInteractionIndex: '',
      replyId: 0,
    };

    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }

  async connectedCallback() {
    await this.startDialogue();

    const a = this.shadowRoot.querySelector('.textBox');

    a.addEventListener('click', () => {
      this.finish = true;
    });
  }

  async startDialogue() {
    await postFormData(this.startRoute, {
      dialogueName: config.dialogueName,
      language: config.language,
      timeZone: config.timeZone,
    })
      .then(async (response) => {
        let res = await response.json();
        this.node = res;
        this.lastSpeaker = this.node.speaker;
        this.speakers.push({ name: this.node?.speaker, speaking: true });

        this.renderHTML();
      })
      .catch((error) => {
        console.error('Error:', error);
        this.shadowRoot.querySelector('.textBox').innerHTML = '';
        this.shadowRoot.querySelector('.text').innerHTML =
          'Something went wrong :(';
      });
  }

  async continueDialogue(id) {
    this.dateContinue.loggedDialogueId = this.node.loggedDialogueId;
    this.dateContinue.loggedInteractionIndex = this.node.loggedInteractionIndex;
    this.dateContinue.replyId = parseInt(id);

    await postFormData(route.processDialogue, this.dateContinue)
      .then(async (response) => {
        let res = await response.json();
        this.node = res['value'];
        this.renderHTML();
      })
      .catch((error) => {
        console.error('Error:', error);
        this.shadowRoot.querySelector('.textBox').innerHTML = '';
        this.shadowRoot.querySelector('.text').innerHTML =
          'Something went wrong :(';
      });
  }

  async typeWriter() {
    //The text that gets put into the div
    //The split is for the 2 different elements and gets dealt with in the loop
    let txt =
      this.node?.speaker + '|' + this.node?.statement?.segments?.[0]?.text;

    const name = document.createElement('h2');
    name.setAttribute('id', 'name');

    const dialogue = document.createElement('p');
    dialogue.setAttribute('id', 'dialogue');

    //First it adds a h2 and paragraph to the existing div
    const title = this.shadowRoot.querySelector('.title');
    title.appendChild(name);
    title.appendChild(dialogue);

    //Then for every character it will add a character to the right element with a delay
    if (this.t < txt.length) {
      if (txt.charAt(this.t) === '|') {
        this.split = true;
        this.t++;
      }
      if (!this.split) {
        this.shadowRoot.querySelector('#name').innerHTML += txt.charAt(this.t);
      } else {
        this.shadowRoot.querySelector('#dialogue').innerHTML += txt.charAt(
          this.t
        );
      }
      this.t++;
      //If the user clicks somewhere in the div it will set the delay to 0 to speed the animation up
      if (!this.finish) {
        await new Promise((resolve) => setTimeout(resolve, 25));
        this.typeWriter();
      } else {
        await new Promise((resolve) => setTimeout(resolve, 0));
        this.typeWriter();
      }
    }
  }

  renderHTML() {
    this.shadowRoot.querySelector('.title').innerHTML = '';
    this.shadowRoot.querySelector('.text').innerHTML = '';

    this.t = 0;
    this.split = false;
    this.finish = false;

    this.typeWriter();

    let textOnly = true;
    let endsDialogue = false; //If the node ends the dialogue
    this.node.replies.forEach((reply) => {
      const paragraph = document.createElement('p');

      const button = document.createElement('button');
      button.setAttribute('type', 'button');
      button.setAttribute('class', 'button');
      button.setAttribute('id', reply.replyId);

      const input = document.createElement('input');

      //Sets end dialogue to true
      if (reply.endsDialogue === true) {
        endsDialogue = true;
      }
      if (reply.statement === null && !endsDialogue) {
        button.innerHTML = 'CONTINUE';
        button.addEventListener('click', () => {
          this.continueDialogue(reply.replyId);
        });
        paragraph.appendChild(button);
      } else {
        //This loop checks each part of a reply (replies can come in different parts, often when a action or input is included)
        //And checks each part and adds something different to the temporary string
        reply.statement.segments.forEach((segment) => {
          switch (segment.segmentType) {
            case 'TEXT':
              button.innerHTML = segment.text;
              break;
            case 'INPUT':
              input.type = 'text';
              input.id = segment.variableName;
              textOnly = false;
              break;
            case 'ACTION':
              input.type = 'text';
              input.id = segment.variableName;
              textOnly = false;
              break;
            default:
              paragraph.innerHTML = 'Something went wrong...';
              break;
          }
        });
        //Depending on if the node is text only and doesn't end the conversation it
        //will make different buttons with different functionality
        //Also kinda broken if there's an input
        if (textOnly && !endsDialogue) {
          button.addEventListener('click', () => {
            this.continueDialogue(reply.replyId);
          });
          paragraph.appendChild(button);
        } else if (!textOnly && !endsDialogue) {
          paragraph.appendChild(input);
          paragraph.appendChild(button);
        } else if (endsDialogue) {
          paragraph.appendChild(button);
          button.addEventListener('click', () => {
            this.endDialogue();
          });
        }
      }
      //Lastly appends the whole thing to the div
      if (this.shadowRoot) {
        const element = this.shadowRoot.querySelector('.text');
        element.appendChild(paragraph);
      }
    });

    this.lastSpeaker = this.node.speaker;
  }

  //Ends the node dialogue
  endDialogue() {
    this.shadowRoot.querySelector('.title').innerHTML = '';
    this.shadowRoot.querySelector('.text').innerHTML = '';
    this.t = 0;
    this.split = false;
    this.finish = false;

    this.typeWriter();
  }
}

export default RPGConversationScreen;
