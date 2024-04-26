const sentences = [
  "Goodbye blue monday.",
  "We are healthy only to the extent that our ideas are humane.",
  "Science is magic that works.",
  "God bless you, Mr. Rosewater.",
  "Hello babies.",
  "Welcome to Earth.",
  "It's hot in the summer and cold in the winter.",
  "It's round and wet and crowded.",
  "On the outside, babies, you've got a hundred years here.",
  "There's only one rule that I know of, babies.",
  "If this isn't nice, I don't know what is.",
  "Everything was beautiful and nothing hurt.",
  "Killgore trout eating a tralfamadorian breakfast of champions.",
  "I have become unstuck in time.",
  "Slaughterhouse ice-nine karass with bokonon.",
  "Poo-tee-weet.",
  "Life is no way to treat an animal.",
  "Welcome to the monkey house.",
  "It is harder to be unhappy when you are eating.",
  "I was a victim of a series of accidents, as are we all.",
  "Wampeters, foma and granfalloons.",
  "I don't know what it is about Hoosiers.",
  "All this happened, more or less.",
  "But wherever you go there is always a Hoosier doing something very important there.",
  "The arts are not a way to make a living.",
  "They are a very human way of making life more bearable.",
];

const sentences_nsfw = [
  "God damn it, you've got to be kind.",
  "No damn cat. No damn cradle.",
  "Wide open beavers inside a hoosier cat's cradle.",
  "Ting-a-ling mother fucker.",
];

const special = ["So it goes."];

// Tuple for the min/max paragraph lengths
const paragraph_length = [5, 10];

// UTILS

// We want to shuffle the list each time to break up the monotonoy.
function shuffleArray(array) {
  return array.sort(() => Math.random() - 0.5);
}
// This will get a new array of length N
function getNResults(array, n) {
  return Array.from({ length: n }, (_, i) => array[i % array.length]);
}

// Turns a boolean string to a bool
function parseBoolean(value) {
  return value.toLowerCase() === "true";
}

// Get paragraphs will combine batches sentences of random lengths.
// It uses paragraph_length as a min and max for total sentence length.
function getParagraphs(parts, qty) {
  let results = [];
  for (let i = 0; i < qty; i++) {
    let count =
      Math.floor(
        Math.random() * (paragraph_length[1] - paragraph_length[0] + 1)
      ) + paragraph_length[0];
    results.push(getNResults(shuffleArray(parts), count).join(" "));
  }
  return results;
}

// This will attempt to get words that are as close to qty as possible.
// In some scenarios, this isn't possible, so it will undershoot.
function getWords(parts, qty) {
  let currentTotal = 0;
  let result = "";

  for (let i = 0; i < parts.length; i++) {
    let words = parts[i].split(" ");
    if (currentTotal + words.length <= qty) {
      result += parts[i] + " ";
      currentTotal += words.length;
    }
  }

  return result.trim();
}

function generate({ count, mode, nsfw, pilgrim_mode }) {
  // NSFW sentences are stored separately, so we will combine them here
  // if the NSFW flag is set to true. Otherwise, we will only use the
  // regular sentences.
  let parts = [...sentences, ...(nsfw ? sentences_nsfw : [])];

  // If pilgrim mode is on, we will add a special sentence to the end.
  // Only applies to sentences and paragraphs.
  let termminal = pilgrim_mode ? ` ${special[0]}` : "";
  let response = "";

  switch (mode) {
    // Words
    case 1:
      response = getWords(shuffleArray(parts), count);
      break;
    // Sentences
    case 2:
      response = getNResults(shuffleArray(parts), count).join(" ") + termminal;
      break;
    // Paragraphs
    case 3:
      response =
        getParagraphs(parts, count).join(`${termminal}\\n`) + termminal;
      break;
    default:
      response = "Something went wrong. So it goes.";
  }

  return response;
}

module.exports = generate;

// Return results in the terminal if being run in a node environment.
// Accepts arguments: --count, --mode, --nsfw, --pilgrim_mode
if (require.main === module) {
  const args = process.argv.slice(2);

  const count = args.find((arg) => arg.includes("--count="));
  const mode = args.find((arg) => arg.includes("--mode="));
  const nsfw = args.find((arg) => arg.includes("--nsfw="));
  const pilgrim_mode = args.find((arg) => arg.includes("--pilgrim="));

  process.stdout.write(
    generate({
      count: count ? parseInt(count.split("=")[1]) : 5,
      mode: mode ? parseInt(mode.split("=")[1]) : 3,
      nsfw: nsfw ? parseBoolean(nsfw.split("=")[1]) : false,
      pilgrim_mode: pilgrim_mode
        ? parseBoolean(pilgrim_mode.split("=")[1])
        : true,
    })
  );
}
