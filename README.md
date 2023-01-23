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
2. In the **WoolLib** library, there is a `index.js`. User need to include the file in `script` in any `.html` files you want to add the web client

```html
    <script type="module" src="./WoolLib/index.js"></script>
```

3. Include the **login-screen** component in the `.html` file you want to display the login screen.

```html
    <body>
        <login-screen />
    </body>
```

4. Next, create a another `.html` file to display the conversation screen.  Remember to include the `index.js` in the body of the file like you need in step 3.

5.  Include the **conversation-container** component in the body of the `.html` file you want to display the conversation screen.

```html
    <body>
      <conversation-container />
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
