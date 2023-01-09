# CLientWebWool
Web-client for wool platform
## Required files
* `index.js` in **WoolLib** folder: User need to include the file in `script` in `.html` file 
## Components
1. `<agent-avatar>` display an avatar
2. `<agent-stmt>` display the statement of each node
3. `<node-replies>` display the replies which can choose of each node
4. `<login-screen>` display login component with authentication

User can include the web component as a `<tag>` in `.htmml` file

## Example
```
let agentStatement = `<agent-stmt data='${res}'></agent-stmt>`;
let replies = `<node-replies class='step${interactionId}' data='${res}'></node-replies>`;
let avatar = `<agent-avatar></agent-avatar>`; 
```