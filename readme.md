[![Netlify Status](https://api.netlify.com/api/v1/badges/bdb5175e-97fc-4417-8867-c3daf114e4a3/deploy-status)](https://app.netlify.com/sites/vonnegut-ipsum/deploys)

# Kurt Vonnegut Ipsum

This is an open source project that generates lorem ipsum style text using prose from author Kurt Vonnegut.

## Why does this exist?

Allow me to quote Mr. Vonnegut

> “Practice any art, music, singing, dancing, acting, drawing, painting, sculpting, poetry, fiction, essays, reportage, no matter how well or badly, not to get money and fame, but to experience becoming, to find out what’s inside you, to make your soul grow.”

## Pilgrim Mode

Pilgrim mode will append "So it goes." to the end of each paragraph, in reference to Billy Pilgrim from Slaughterhouse-Five. This is ignored when generating using `word` mode. So it goes.

By default this mode is set to `true`

### Using the API

With default parameters:

```
curl {{HOST}}/api

{
  "text": "All this happened, more or less...",
  "count": 5,
  "mode": 3,
  "mode_name": "paragraphs",
  "nsfw": true,
  "pilgrim_mode": true
}
```

Sending parameters:

```
curl {{HOST}}/api?count=8&mode=1&nsfw=false

{
  "text": "Poo-tee-weet. Welcome to Earth. Hello babies.",
  "count": 8,
  "mode": 1,
  "mode_name": "words",
  "nsfw": false,
  "pilgrim_mode": true
}
```

### Using the node script

```js
import { generate } from "./lib/generate";

const output = generate({
  count: 5,
  mode: 2,
  nsfw: true,
  pilgrim_mode: true,
});

// Output: Hello babies. Goodbye blue monday. Science is magic that works. Poo-tee-weet. I don't know what it is about Hoosiers. So it goes.
```

### Using the terminal

```bash
$ node ./lib/generate.js --count=5 --mode=2
```

### Credits

Vonny Regular font by [Andy King](https://www.andykingartist.com/)
