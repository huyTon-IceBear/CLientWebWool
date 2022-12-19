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

const TYPE = {
  TEXT: "TEXT",
  INPUT: "INPUT",
  ACTION: "ACTION"
}

let node;

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
    // node = JSON.stringify(result);
    node = {
      dialogue: result['dialogue'],
      node: result['node'],
      speaker: result['speaker'],
      loggedDialogueId: result['loggedDialogueId'],
      loggedInteractionIndex: result['loggedInteractionIndex'],
      mainText: result['statement']['segments'][0]['text'],
      replies: $.each(result['replies'], function (i, reply) {
          return {
            replyId: reply['replyId'],
            endsDialogue: reply['endsDialogue'],
            statement: {
              segments: $.each(reply['statement']['segments'], function (j, segment) {
                let type = segment['segmentType']
                if (type === "TEXT") {
                  return {
                    segmentType: TYPE.TEXT,
                    text: segment['text']
                  }
                } else if (type === "INPUT") {
                  return {
                    segmentType: TYPE.INPUT,
                    inputType: segment['inputType'],
                    variableName: segment['variableName']
                  }
                } else {
                  return {
                    replyId: segment['replyId'],
                    statement: segment['statement'],
                  }
                }
              })
            }
          }
      })
    };
    console.log(node);

    $(".text").append("<h2>" + node.speaker + "</h2>" + "<p>" + node.mainText + "</p>")

    let appendString = "";
    let textOnly = true;
    $.each(node.replies, function (i, reply) {
      let tempString = "";
      appendString += "<p> ";
      console.log("i=" + i);
      $.each(reply.statement.segments, function (j, segment) {
        console.log("j=" + j);
        if (segment.segmentType === TYPE.TEXT) {
          tempString += segment.text;
        } else if (segment.segmentType === TYPE.INPUT) {
          tempString += `<input type="text" id=${segment.variableName}>`;
          textOnly = false;
          // $(".text").append("<input>" + node.item.text + "</input> <br>")
        }
      });
      if (textOnly) {
        appendString += `<button type="button" class="button" id=${reply.replyId}>${tempString}</button>`;
      } else if (!textOnly) {
        appendString += tempString + `<input type="submit" class="button" id=${reply.replyId} value="Send">`
      }
      appendString += "</p> ";
      $(".text").append(appendString)
      /* TODO: fix extra random item */
    });

    // $(".text").html("<h2>" + node.speaker + "</h2> <br>");
  },
  error: function (err) {
    console.log(err);
  },
});
