/**Provide configurations for user */
const config = {
  baseUrl: 'http://localhost:',
  port: 8080,
  redirectPath: '../../test.html',
  dialogueName: 'basic',
  language: 'en',
  timeZone: 'Europe/Lisbon',
};

/**Provide API route to connect with server */
const route = {
  login: '/wool/v1/auth/login',
  startDialogue: '/wool/v1/dialogue/start',
  processDialogue: '/wool/v1/dialogue/progress',
  backDialogue: '/wool/v1/dialogue/back',
  cancelDialogue: '/wool/v1/dialogue/cancel',
  continueDialogue: '/wool/v1/dialogue/continue',
};

export { config, route };
