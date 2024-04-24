import React from "https://esm.sh/react";
import { renderToReadableStream } from "https://esm.sh/react-dom/server";

export default async function handler(req, context) {
  const stream = await renderToReadableStream(
    <html>
      <title>Hello</title>
      <body>
        <h1>Hello {context.geo.country?.name}</h1>
      </body>
    </html>
  );

  return new Response(stream, {
    status: 200,
    headers: { "Content-Type": "text/html" },
  });
}

export const config = {
  path: "/hello",
};
