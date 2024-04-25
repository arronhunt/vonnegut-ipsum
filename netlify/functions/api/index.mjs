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
const handler = async (req, context) => {
  try {
    const url = new URL(req.url);

    const count = parseInt(url.searchParams.get("count")) || 5;
    const mode = parseInt(url.searchParams.get("mode")) || 3;
    const nsfw = url.searchParams.get("nsfw")
      ? parseBoolean(url.searchParams.get("nsfw"))
      : true;
    const pilgrim_mode = url.searchParams.get("pilgrim_mode")
      ? parseBoolean(url.searchParams.get("pilgrim_mode"))
      : true;

    const value = generate({
      count,
      mode,
      nsfw,
      pilgrim_mode,
    });

    return new Response(
      JSON.stringify({
        text: value,
        count,
        mode,
        mode_name: modeName(mode),
        nsfw,
        pilgrim_mode,
      }),
      {
        statusCode: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ statusCode: 500, body: error.toString() })
    );
  }
};

export default handler;

export const config = {
  path: "/api",
};

// module.exports = {
//   handler,
//   config: {
//     path: "/foobar",
//   },
// };
