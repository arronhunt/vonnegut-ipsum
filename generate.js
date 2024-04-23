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
];

const sentences_nsfw = [
  "God damn it, you've got to be kind.",
  "No damn cat. No damn cradle.",
  "Wide open beavers inside a hoosier cat’s cradle.",
  "Ting-a-ling mother fucker.",
];

const special = ["So it goes."];

// Tuple for the min/max paragraph lengths
const paragraph_length = [5, 10];

// UTILS
function shuffleArray(array) {
  return array.sort(() => Math.random() - 0.5);
}
function getNResults(array, n) {
  return Array.from({ length: n }, (_, i) => array[i % array.length]);
}
function getParagraphs(parts, qty) {
  let results = [];
  console.log({ qty, parts, results });
  for (let i = 0; i < qty; i++) {
    let count =
      Math.floor(
        Math.random() * (paragraph_length[1] - paragraph_length[0] + 1)
      ) + paragraph_length[0];
    results.push(getNResults(shuffleArray(parts), count).join(" "));
  }
  return results;
}

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

function generate({ qty, mode, nsfw, pilgrim_mode }) {
  let parts = [...sentences, ...(nsfw ? sentences_nsfw : [])];

  let termminal = pilgrim_mode ? ` ${special[0]}` : "";
  let response = "";

  switch (mode) {
    case 1:
      response = getWords(shuffleArray(parts), qty);
      break;
    case 2:
      response = getNResults(shuffleArray(parts), qty).join(" ") + termminal;
      break;
    case 3:
      response = getParagraphs(parts, qty).join(`${termminal}\n`) + termminal;
      break;
    default:
      response = "Invalid mode";
  }

  return response;
}

// console.log(generate({ qty: 3, mode: 3, nsfw: true, pilgrim_mode: true }));
