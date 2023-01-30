# CLientWebWool
![An Image](https://www.woolplatform.eu/img/wool-logo.png)

<h1 align="center">Web-client for wool platform</h1>

**Web-client** contains web-components for fundamental functions. Each components will interact with shadow DOM to update their states and values.

1. `<agent-avatar>` display an avatar
2. `<agent-stmt>` display the statement of each node
3. `<node-replies>` display the replies which can choose of each node
4. `<login-screen>` display login component with authentication
5. `<conversation-back>` back to previous stage of the dialogue
6. `<conversation-cancel>` cancel ongoing dialogue
7. `<conversation-continue>` continue ongoing dialogue
8. `<rpg-conversation>` display the dialogue in rpg style
9. `<conversation-container>` display the dialogue

User can include the web component as a `<tag>` in `.html` file

## Installation

Before using the web-client library, you need to read about the WOOL platform. Make sure to follow the [tutorial](https://www.woolplatform.eu/docs/wool-platform/dev/tutorials/index.html) to set up the WOOL Web Server

Below are the steps for installing the web client.

1. Download/Clone source code from [Github Repo](https://github.com/ramen-IceBear/CLientWebWool)
2. Update the config file, especially config value and route. For example:

```javascript
    const config = {
        baseUrl: 'http://localhost:',
        port: 8080,
        redirectPath: '../../test.html',
        dialogueName: 'basic',
        language: 'en',
        timeZone: 'Europe/Lisbon',
    };

    const route = {
        login: '/wool/v1/auth/login',
        startDialogue: '/wool/v1/dialogue/start',
        processDialogue: '/wool/v1/dialogue/progress',
        backDialogue: '/wool/v1/dialogue/back',
        cancelDialogue: '/wool/v1/dialogue/cancel',
        continueDialogue: '/wool/v1/dialogue/continue',
    };
```

You should change the values, especially baseUrl, port, and route based on your local server.

### How to use

1. Create 2 separate **.html* files for login screen and conversation screen (rpg style or normal style).

2. Include the file in `script` in any `.html` files you want to add the web client

```html
    <script type="module" src="./WoolLib/index.js"></script>
```

3. Include the **login-screen** and **conversation-container** component in `.html` files.

```html
    /**login screen*/

    <body>
        <login-screen />
    </body>
```

```html
    /**conversation screen*/
    <body>
      <!--You can use <rpg-conversation/> for rpg style -->
      <conversation-container />
    </body>
```

4. Change the value of redirectPath in the config of the library. It should be the path of the **.html** for conversation screen.

## Pitfall

1. Wrong config value for dialogueName, language, timeZone

You should check which dialogue file that your server contain and adjust above value based on that.

![image](https://user-images.githubusercontent.com/78846812/215611290-0ecb22a8-a39d-4db1-a666-15d954b49981.png)

The dialogues files are listed in the folder **resources/dialogues** of the server. You can use the [WOOL Editor IDE](https://www.woolplatform.eu/docs/wool-platform/dev/tutorials/tutorial-author-first-wool-dialogue.html) to add create a new dialogue.

The value in the config file of wool library client is the default value.

2. Cannot login with credential

The credential for authentication are defined in the user.xml file in the wool server. 

![image](https://user-images.githubusercontent.com/78846812/215611684-c90bd9ea-f7f0-4007-9509-3d3b790661bf.png)

You can also change this based on your preferences.

![image](https://user-images.githubusercontent.com/78846812/215611782-fec9094b-a816-49e6-8603-a82c3a324cff.png)

3. Cannot run/use the client library

Check if the WOOL web server is running. The library only works will the api from the server. If not, it's only show the login component and will get error in the conversation screen.

## Questions

For how-to questions or bugs please use GitHub issues. We will try to resolve your issues as soon as we can.
