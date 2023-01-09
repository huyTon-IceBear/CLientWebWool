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

const token =
  'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbiIsImlhdCI6MTY3MDkzNTk0M30.AhChV8YNnP3k-TzRKmygQ9_FbITaPz1d36w1VbUlorkPrt060GNzKqH1XKNJ_4La2EsXPZbjIkrm116aIvtIbA';

const data = {
  dialogueName: 'basic',
  language: 'en',
  timeZone: 'Europe/Amsterdam',
};

let dateContinue = {
  loggedDialogueId: 0,
  loggedInteractionIndex: "",
  replyId: 0,
}

const TYPE = {
  TEXT: "TEXT",
  INPUT: "INPUT",
  ACTION: "ACTION"
}

let node;

$(document).ready(function () {
  startDialogue();
})

function startDialogue() {
  $.ajax({
    url: 'http://localhost:8080/wool/v1/dialogue/start',
    type: 'POST',
    dataType: 'json',
    data: data,
    headers: {
      'X-Auth-Token':
      token
    },
    success: function (result) {
      // node = {
      //   dialogue: result['dialogue'],
      //   node: result['node'],
      //   speaker: result['speaker'],
      //   loggedDialogueId: result['loggedDialogueId'],
      //   loggedInteractionIndex: result['loggedInteractionIndex'],
      //   mainText: result['statement']['segments'][0]['text'],
      //   replies: $.each(result['replies'], function (i, reply) {
      //     return {
      //       replyId: reply['replyId'],
      //       endsDialogue: reply['endDialogue'],
      //       statement: {
      //         segments: $.each(reply['statement']['segments'], function (j, segment) {
      //           let type = segment['segmentType']
      //           if (type === "TEXT") {
      //             return {
      //               segmentType: TYPE.TEXT,
      //               text: segment['text']
      //             }
      //           } else if (type === "INPUT") {
      //             return {
      //               segmentType: TYPE.INPUT,
      //               inputType: segment['inputType'],
      //               variableName: segment['variableName']
      //             }
      //           } else {
      //             return {
      //               replyId: segment['replyId'],
      //               statement: segment['statement'],
      //             }
      //           }
      //         })
      //       }
      //     }
      //   })
      // };
      node = JSON.stringify(result);
      node = JSON.parse(node);
      console.log(node);

      renderHTML();

      // $(".text").html("<h2>" + node.speaker + "</h2> <br>");
    },
    error: function (err) {
      console.log(err);
    },
  });
}

function continueDialogue(id) {
  dateContinue.loggedDialogueId = node.loggedDialogueId;
  dateContinue.loggedInteractionIndex = node.loggedInteractionIndex;
  dateContinue.replyId = parseInt(id);

  $.ajax({
    url: 'http://localhost:8080/wool/v1/dialogue/progress',
    type: 'POST',
    dataType: 'json',
    data: dateContinue,
    headers: {
      'X-Auth-Token':
      token
    },
    success: function (result) {
      $(".title").empty();
      $(".text").empty();

      node = JSON.stringify(result);
      node = JSON.parse(node)['value'];
      console.log(node);

      renderHTML();
    },
    error: function (err) {
      console.log(err);
    },
  })
}

function renderHTML() {
  //Speaker name with text
  $(".title").append("<h2>" + node.speaker + "</h2>" + "<p>" + node.statement.segments[0].text + "</p>")

  let appendString = "";
  let textOnly = true;
  let endsDialogue = false;
  $.each(node.replies, function (i, reply) {
    let tempString = "";
    appendString = "<p> ";
    if (reply.endsDialogue === true) {
      endsDialogue = true;
    }

    if (reply.statement === null && !endsDialogue) {
      appendString += `<button type="button" class="button" id=${reply.replyId} onclick="continueDialogue(${reply.replyId})">CONTINUE</button>`;
    } else {
      $.each(reply.statement.segments, function (j, segment) {
        console.log("j=" + j);
        switch (segment.segmentType) {
          case "TEXT":
            tempString += segment.text;
            break;
          case "INPUT":
            tempString += `<input type="text" id=${segment.variableName}>`;
            textOnly = false;
            break;
          case "ACTION":
            tempString += `<input type="text" id=${segment.variableName}>`;
            textOnly = false;
            break;
          default:
            tempString += "Something went wrong..."
            break;
        }
        // if (segment.segmentType === TYPE.TEXT) {
        //   tempString += segment.text;
        // } else if (segment.segmentType === TYPE.INPUT) {
        //   tempString += `<input type="text" id=${segment.variableName}>`;
        //   textOnly = false;
        //   // $(".text").append("<input>" + node.item.text + "</input> <br>")
        // }
      });
      console.log(tempString);
      if (textOnly && !endsDialogue) {
        appendString += `<button type="button" class="button" id=${reply.replyId} onclick=continueDialogue(${reply.replyId})>${tempString}</button>`;
      } else if (!textOnly && !endsDialogue) {
        appendString += tempString + `<button class="button" id=${reply.replyId}>SEND</button>`
      } else if (endsDialogue) {
        appendString += `<button type="button" class="button" id=${reply.replyId} onclick=endDialogue()>${tempString}</button>`
      }
    }
    appendString += "</p> ";
    $(".text").append(appendString);
  });
}

function endDialogue() {
  $(".text").empty();
  $(".text").append("<h2>" + node.speaker + "</h2>" + "<p>You have finished the dialogue</p>");
}