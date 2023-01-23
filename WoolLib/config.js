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
};

export { config, route };
