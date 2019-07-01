const fs = require("fs");

function random(min, max) {
  return min + Math.random() * (max - min);
}

function pickElement(array) {
  return array[Math.floor(random(0, array.length))];
}

const chainData = {};

let texts = fs.readdirSync("bot/stuff");
texts.forEach(function(stuff) {
  const text = fs.readFileSync("bot/stuff/" + stuff, "utf-8");

  const allWords = text
    .toLowerCase()
    .split(/[^a-zA-Zа-яА-Я0-9]+/)
    .filter(word => word.length > 0);

  let prevWord;

  allWords.forEach(word => {
    if (prevWord != null) {
      if (!(stuff in chainData)) chainData[stuff] = {};
      if (!(prevWord in chainData[stuff])) chainData[stuff][prevWord] = {};
      if (!(word in chainData[stuff][prevWord]))
        chainData[stuff][prevWord][word] = 0;
      chainData[stuff][prevWord][word] += 1;
    }
    prevWord = word;
  });
});

function getStory(stuff, MIN_WORDS, MAX_WORDS) {
  const uniqueWords = Object.keys(chainData[stuff]);
  const wordCount = random(MIN_WORDS, MAX_WORDS);

  let message = [];

  let word = pickElement(uniqueWords);
  for (let i = 0; i < wordCount; i++) {
    const nextWordWeights = chainData[stuff][word];
    const nextWords = [];

    message.push(word);

    Object.keys(nextWordWeights).forEach(nextWord => {
      const weight = nextWordWeights[nextWord];
      for (let j = 0; j < weight; j++) nextWords.push(nextWord);
    });
    const nextWord = pickElement(nextWords);
    word = nextWord;
  }
  return message;
}

module.exports = { getStory };
