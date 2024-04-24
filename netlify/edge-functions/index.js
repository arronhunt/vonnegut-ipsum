function parseBoolean(value) {
  return value.toLowerCase() === "true";
}

export default async (request, context) => {
  const response = await context.next();
  const page = await response.text();

  // Get all the search params from the URL, and set defaults if they are not provided.
  // Booleans are extra tricky because they are strings in the URL.
  const url = new URL(request.url);

  const count = url.searchParams.get("count") || 5;
  const mode = url.searchParams.get("mode") || 3;
  const nsfw = url.searchParams.get("nsfw")
    ? parseBoolean(url.searchParams.get("nsfw"))
    : false;
  const pilgrim_mode = url.searchParams.get("pilgrim_mode")
    ? parseBoolean(url.searchParams.get("pilgrim_mode"))
    : true;
  const theme = url.searchParams.get("theme") || "breakfast";

  // Fetch the text from the API, pass along the search params.
  // the ?z=0 does nothing other than make the string concat easier.
  let { text } = await fetch(
    [
      `${url.origin}/.netlify/functions/api?z=0`,
      `count=${count}`,
      `mode=${mode}`,
      `nsfw=${nsfw}`,
      `pilgrim_mode=${pilgrim_mode}`,
    ].join("&")
  ).then((res) => res.json());

  // Replace \n with <p> tags to make the text appear correctly
  var formatted_text = text.replace(/\\n/g, "</p><p>");

  // Match the string {{MODE_N_SELECTED}} where N is the mode value.
  let find_selected = new RegExp(`{{MODE_${mode}_SELECTED}}`, "g");

  // Match the string {{MODE_N_SELECTED}} where N is NOT the mode value.
  let find_not_selected = new RegExp(`{{MODE_(?!${mode})\\d+_SELECTED}}`, "g");

  const newPage = page
    .replace(
      /<!-- output -->([\s\S]*?)<!-- \/output -->/g,
      `<p>${formatted_text}</p>`
    )
    .replace("{{COUNT_VALUE}}", count)
    .replace(find_selected, "selected")
    .replace(find_not_selected, "")
    .replace("{{NSFW_VALUE}}", nsfw ? "checked" : "")
    .replace("{{THEME_VALUE}}", `data-theme="${theme}"`)
    .replace("{{HOST}}", url.origin);

  return new Response(newPage, response);
};

export const config = { path: "/" };
