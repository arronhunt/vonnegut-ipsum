const generate = require("../../../lib/generate");

function parseBoolean(value) {
  return value.toLowerCase() === "true";
}

function modeName(mode) {
  switch (mode) {
    case 1:
      return "words";
    case 2:
      return "sentences";
    case 3:
      return "paragraphs";
    default:
      return "unknown";
  }
}

// Docs on event and context https://docs.netlify.com/functions/build/#code-your-function-2
const handler = async (event) => {
  try {
    const count = parseInt(event.queryStringParameters.count) || 5;
    const mode = parseInt(event.queryStringParameters.mode) || 3;
    const nsfw = event.queryStringParameters.nsfw
      ? parseBoolean(event.queryStringParameters.nsfw)
      : true;
    const pilgrim_mode = event.queryStringParameters.pilgrim_mode
      ? parseBoolean(event.queryStringParameters.pilgrim_mode)
      : true;

    const value = generate({
      count,
      mode,
      nsfw,
      pilgrim_mode,
    });

    return {
      statusCode: 200,
      body: JSON.stringify({
        text: value,
        count,
        mode,
        mode_name: modeName(mode),
        nsfw,
        pilgrim_mode,
      }),
      headers: {
        "Content-Type": "application/json",
      },
      // // more keys you can return:
      // headers: { "headerName": "headerValue", ... },
      // isBase64Encoded: true,
    };
  } catch (error) {
    return { statusCode: 500, body: error.toString() };
  }
};

module.exports = { handler };
