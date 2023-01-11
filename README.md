# CLientWebWool
![An Image](https://www.woolplatform.eu/img/wool-logo.png)

<h1 align="center">Web-client for wool platform</h1>

**Web-client** contains web-components for fundamental functions. Each components will interact with shadow DOM to update their states and values.

1. `<agent-avatar>` display an avatar
2. `<agent-stmt>` display the statement of each node
3. `<node-replies>` display the replies which can choose of each node
4. `<login-screen>` display login component with authentication

User can include the web component as a `<tag>` in `.html` file

## Installation

For how to use the web-client library, you need to follow the installation for setting up files

1. Download/Clone source code from [Github Repo](https://github.com/ramen-IceBear/CLientWebWool)
2. In the **WoolLib** library, there is a `index.js`. User need to include the file in `script` in the `.html` file you want to add the web client

```html
    <script type="module" src="./WoolLib/index.js"></script>
```

3. Include the **login-screen** in the same `.html` file you include the `index.js` in the body of the file. This will be your login screen.

```html
    <body>
        <login-screen />
    </body>
```

4. Next, create a another `.html` file to display the conversation. You also need to include the `index.js` in the body of the file like you need in step 3.

5. Add the css file for styling the page.

```css
body{
    font-size: 1.25em;
    font-family: Arial, Helvetica, sans-serif;
}

.container{
    display: flex;
    flex-direction: column;
    margin: 2rem 20rem;
    flex-wrap: nowrap;
}

.agent-data, .user-data{
    display: flex;
    flex-direction: row;
}

p[class^="user"], .end-dialogue {
    width: fit-content;
    max-width: 60%;
    padding: 0.4em 1.25em 0.4em 1em;
    border-radius: 0.8em;
    box-shadow: rgba(0, 0, 0, 0.1) 0px 4px 6px -1px, rgba(0, 0, 0, 0.06) 0px 2px 4px -1px;
}

p[class^="user"], .end-dialogue{
    margin-left: auto;
    background-color: beige;
    color: blueviolet;
}

```

6. Include the css file in the conversation `.html` file.

```html
    <head>
        <link rel="stylesheet" href="style.css" />
    </head>
```

7. Create a `main.js` file with these functions.
    - The onLoad function is responsible for starting the conversation and fetching data from server.
    - The renderHTML is responsible for creating web components and insert them into DOM.
    - The progress is responsible for fetching the next step in the conversation.
    - The getInfoNode is responsible for getting the ID of the current step/node.

```javascript
let convoContainer = document.getElementsByClassName('container')[0];
let interactionId = 0;

window.onload = async function () {
  const { config } = await import('../../WoolLib/config.js');
  const { cookies } = await import('../../WoolLib/cookies/index.js');
  let condition = sessionStorage.cookies;
  let token =
    condition == 'true'
      ? cookies.getCookies('authToken')
      : sessionStorage.authToken;
  $.ajax({
    url: config.baseUrl + config.port + '/wool/v1/dialogue/start',
    type: 'POST',
    dataType: 'json',
    data: {
      dialogueName: 'basic',
      language: 'en',
      timeZone: 'Europe/Lisbon',
    },
    headers: { 'X-Auth-Token': token },
    success: function (res) {
      getInfoNode(res);
      renderHTML(res);
    },
  });
};

function renderHTML(response) {
  const res = JSON.stringify(response);
  let agentStatement = `<agent-stmt data='${res}'></agent-stmt>`;
  let replies = `<node-replies class='step${interactionId}' data='${res}'></node-replies>`;
  let avatar = `<agent-avatar></agent-avatar>`;
  let data = `<div class="agent-data">${avatar}<div>${agentStatement}${replies}</div></div>`;
  convoContainer.insertAdjacentHTML('beforeend', data);
  progress();
}

function progress() {
  const re = document.querySelector(`node-replies.step${interactionId}`);
  re.addEventListener('data-received', (event) => {
    getInfoNode(event.detail);
    renderHTML(event.detail);
  });
}

function getInfoNode(res) {
  interactionId =
    res.value?.loggedInteractionIndex || res.loggedInteractionIndex;
}

```

8. Include the `main.js` in the conversation `.html` body

```html
    <body>
        <div class="container" />
        <script src="main.js"></script>
    </body>
```

## Getting started

Here is an example of a basic app using **Web-client** 's `login-screen` component:

```html
    <body>
        <login-screen />
    </body>
```

## Questions

For how-to questions or bugs please use GitHub issues. We will try to resolve your issues as soon as we can.
