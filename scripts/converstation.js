// Login route
// $.ajax({
//   url: 'http://localhost:8080/wool/v1/auth/login',
//   type: 'POST',
//   dataType: 'json',
//   contentType: 'application/json',
//   data: JSON.stringify({ user: 'user', password: 'user', tokenExpiration: 0 }),
//   success: function (res) {
//     console.log(res);
//   },
// });

let token =
  'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbiIsImlhdCI6MTY3MDU5MzY0M30.ah2z-MwS40ykLo5Yoy7gAJihSGOqH9IIFDQrfb9S_SwlUS6M7Vn8RQYbabj79tp7Xe6AKBXpNrjU9w7vnNELcQ';

let data = {
  dialogueName: 'basic',
  language: 'en',
  timeZone: 'Europe/Amsterdam',
};

$.ajax({
  url: 'http://localhost:8080/wool/v1/dialogue/start',
  type: 'POST',
  dataType: 'json',
  data: data,
  headers: {
    'X-Auth-Token':
      'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbiIsImlhdCI6MTY3MDU5MzY0M30.ah2z-MwS40ykLo5Yoy7gAJihSGOqH9IIFDQrfb9S_SwlUS6M7Vn8RQYbabj79tp7Xe6AKBXpNrjU9w7vnNELcQ',
  },
  success: function (res) {
    console.log(res);
  },
  error: function (err) {
    console.log(err);
  },
});
