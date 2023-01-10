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
2. In the **WoolLib** library, there is a `index.js`. User need to include the file in `script` in the `.html` file you want to add the web client.

```html
    <script type="module" src="./WoolLib/index.js"></script>
```

3. 

## Getting started with Material UI

Here is an example of basic using of web components

```
let agentStatement = `<agent-stmt data='${res}'></agent-stmt>`;
let replies = `<node-replies class='step${interactionId}' data='${res}'></node-replies>`;
let avatar = `<agent-avatar></agent-avatar>`; 
```
