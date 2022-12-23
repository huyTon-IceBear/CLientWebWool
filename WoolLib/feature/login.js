export async function Login(object) {
  return await $.ajax({
    url: "http://localhost:8080/wool/v1/auth/login",
    type: "POST",
    dataType: "json",
    contentType: "application/json",
    data: JSON.stringify(object),
  });
}

export async function Start(token) {
  return new Promise((resolve, reject) => {
    $.ajax({
      url: "http://localhost:8080/wool/v1/dialogue/start",
      type: "POST",
      dataType: "json",
      data: {
        dialogueName: "basic",
        language: "en",
        timeZone: "Europe/Lisbon",
      },
      headers: { "X-Auth-Token": token },
      success: function (res) {
        resolve(res);
      },
      error: function (err) {
        reject(err);
      },
    });
  });
}

// return $.ajax({
//   url: "http://localhost:8080/wool/v1/dialogue/start",
//   type: "POST",
//   dataType: "json",
//   data: {
//     dialogueName: "basic",
//     language: "en",
//     timeZone: "Europe/Lisbon",
//   },
//   headers: { "X-Auth-Token": token },
// });
