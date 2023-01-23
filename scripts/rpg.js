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

let node;
let lastSpeaker;
let speakers = [];

$(document).ready(function () {
  startDialogue();
  //Necessary onclick for the finishing of the typewriter animation
  $(".textBox").click(function () {
    finish = true;
  });
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
      node = JSON.stringify(result);
      node = JSON.parse(node);
      console.log(node);

      lastSpeaker = node.speaker;
      speakers.push({name: node.speaker, speaking: true});

      renderHTML();
    },
    error: function (err) {
      console.log(err);

      $(".title").empty();
      $(".text").empty();
      $(".text").append("Something went wrong :(");
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
      node = JSON.stringify(result);
      node = JSON.parse(node)['value'];
      console.log(node);

      renderHTML();
    },
    error: function (err) {
      console.log(err);

      $(".title").empty();
      $(".text").empty();
      $(".text").append("Something went wrong :(");
    },
  })
}

let t = 0;
let split = false; //Splits the
let finish = false; // Finishes the animation if true

function typeWriter() {
  //The text that gets put into the div
  //The split is for the 2 different elements and gets dealt with in the loop
  let txt = node.speaker + "|" + node.statement.segments[0].text;
  // console.log(txt)
  //First it adds a h2 and paragraph to the existing div
  $(".title").append("<h2 id='name'></h2>" + "<p id='dialogue'></p>")

  //Then for every character it will add a character to the right element with a delay
  if (t < txt.length) {
    if (txt.charAt(t) === "|") {
      split = true;
      t++;
    }
    if (!split) {
      document.getElementById("name").innerHTML += txt.charAt(t);
    } else {
      document.getElementById("dialogue").innerHTML += txt.charAt(t);
    }
    t++;
    //If the user clicks somewhere in the div it will set the delay to 0 to speed the animation up
    if (!finish) {
      setTimeout(typeWriter, 25);
    } else {
      setTimeout(typeWriter, 0);
    }
  }
}

function renderHTML() {
  $(".title").empty();
  $(".text").empty();

  t = 0;
  split = false;
  finish = false;
  
  typeWriter();
  // Old static speaker name with text
  // $(".title").append("<h2 id='name'>" + node.speaker + "</h2>" + "<p id='dialogue'>" + node.statement.segments[0].text + "</p>");

  //Adds a speaker speaker into the speakers array if new
  //Code seems broken atm
  // if (!speakers.includes(node.speaker)) {
  //   for (let i = 0; i < speakers.length; i++) {
  //     speakers[i].speaking = false;
  //   }
  //   speakers.push({name: node.speaker, speaking: true});
  // }
  //
  // if (speakers[0].name === node.speaker) {
  //   $(".avatar").attr("src","/img/ricardo-cat.png");
  // } else {
  //   $(".avatar").attr("src","/img/cool-scrunch.png");
  // }
  //TODO: needs better logic

  let appendString = ""; //The string that gets appended
  let textOnly = true;
  let endsDialogue = false; //If the node ends the dialogue
  $.each(node.replies, function (i, reply) {
    let tempString = "";
    appendString = "<p> ";
    //Sets end dialogue to true
    if (reply.endsDialogue === true) {
      endsDialogue = true;
    }
    // console.log("i=" + i);
    if (reply.statement === null && !endsDialogue) {
      appendString += `<button type="button" class="button" id=${reply.replyId} onclick="continueDialogue(${reply.replyId})">CONTINUE</button>`;
    } else {
      //This loop checks each part of a reply (replies can come in different parts, often when a action or input is included)
      //And checks each part and adds something different to the temporary string
      $.each(reply.statement.segments, function (j, segment) {
        // console.log("j=" + j);
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
      });
      // console.log(tempString);
      //Depending on if the node is text only and doesn't end the conversation it will make different buttons with different functionality
      if (textOnly && !endsDialogue) {
        appendString += `<button type="button" class="button" id=${reply.replyId} onclick=continueDialogue(${reply.replyId})>${tempString}</button>`;
      } else if (!textOnly && !endsDialogue) {
        appendString += tempString + `<button class="button" id=${reply.replyId}>SEND</button>`
      } else if (endsDialogue) {
        appendString += `<button type="button" class="button" id=${reply.replyId} onclick=endDialogue()>${tempString}</button>`
      }
    }
    appendString += "</p> ";
    //Lastly appends the whole thing to the div
    $(".text").append(appendString);
  });
  lastSpeaker = node.speaker;
}

//Ends the node dialogue
function endDialogue() {
  $(".title").empty();
  $(".text").empty();

  t = 0;
  split = false;
  finish = false;

  typeWriter();
  // $(".title").append("<h2>" + node.speaker + "</h2>" + "<p>You have finished the dialogue</p>");
}

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