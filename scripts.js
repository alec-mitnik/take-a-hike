"use strict";

let game;

window.addEventListener('DOMContentLoaded', init);
window.addEventListener('pageshow', init);

function init() {
  if (document.readyState === "loading") {
    return;
  }

  document.getElementById('history-log-emoji').innerHTML = HISTORY_LOG_EMOJI;

  if (localStorageAvailable()) {
    document.getElementById('title-message').classList.remove('storage-failed');
    const loadedGameData = localStorage.getItem("game");

    if (loadedGameData) {
      document.getElementById('clear-data-button-wrapper').classList.add('has-data');

      game = new Game(JSON.parse(loadedGameData, (_key, value) => {
        if (typeof value === 'object' && value != null) {
          if (value.dataType === 'Map') {
            return new Map(value.value);
          }
        }

        return value;
      }));

      if (game.gameActive) {
        document.getElementById('start-buttons').classList.add('hike-in-progress');
      }
    } else {
      game = new Game();
    }
  } else {
    game = new Game();
    document.getElementById('title-message').classList.add('storage-failed');
  }
}

// This fires when the entire page, including all resources like images and stylesheets, has fully loaded
window.addEventListener('load', () => {
  document.getElementById('title-screen').inert = false;
});

function localStorageAvailable() {
  let storage;

  try {
    storage = window["localStorage"];
    const x = "__storage_test__";
    storage.setItem(x, x);
    storage.removeItem(x);
    return true;
  } catch (e) {
    return (
      e instanceof DOMException &&
      e.name === "QuotaExceededError" &&
      // acknowledge QuotaExceededError only if there's something already stored
      storage &&
      storage.length !== 0
    );
  }
}

function randomDraw(deck, removesFromDeck) {
  const randomIndex = Math.floor(Math.random() * deck.length);
  const drawResult = removesFromDeck ? deck.splice(randomIndex, 1)[0] : deck[randomIndex];
  return drawResult;
}

function wrapInBadge(text) {
  return `<span class="badge">${text}</span>`;
}

function updateCssVar(varName, value) {
  document.documentElement.style.setProperty(varName, value);
}

function callItADay() {
  const endButtonWrapper = document.getElementById('end-button-wrapper');
  endButtonWrapper.classList.add('confirm');

  const confirmEndButton = document.getElementById('confirm-end-button');
  confirmEndButton.focus();
}

function startFreshHike() {
  const startButtonsWrapper = document.getElementById('start-buttons');
  startButtonsWrapper.classList.add('confirm');

  const confirmAbandonButton = document.getElementById('confirm-abandon-button');
  confirmAbandonButton.focus();
}

function clearAllDataConfirm() {
  const clearDataButtonWrapper = document.getElementById('clear-data-button-wrapper');
  clearDataButtonWrapper.classList.add('confirm');

  const confirmClearDataButton = document.getElementById('confirm-clear-data-button');
  confirmClearDataButton.focus();
}

function clearAllData() {
  localStorage.clear();
  location.reload();
}

function splitEmojiString(emojiString) {
  return [...new Intl.Segmenter().segment(emojiString)].map(x => x.segment);
}

const supportsLatestEmojis = (function() {
  let checked = false;
  let supports = false;

  return function() {
    if (checked === false) {
      checked = true;

      // Create an element to test rendering
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      context.font = '16px Arial';

      // Combo emoji rendering as a brown mushroom only supported since 2023
      const brownMushroomWidth = context.measureText('🍄‍🟫').width;
      const mushroomWidth = context.measureText('🍄').width;

      supports = brownMushroomWidth < mushroomWidth * 1.5;
    }

    return supports;
  };
})();

// WITH PROGRESS PERSISTING, NEED TO CONSIDER BACKWARD COMPATIBILITY FOR ALL UPDATES!

// TODO - 🪦(fallback: ⚰️)🥀↔️🧶🐚💎🫙🥤🍃🍂🍁🐌🐞🦗🐛🦋🐝🦨🐿️🦌🦔🐁🦎🐍🐢🌳🌲🌿🎒
// Move scripts into separate module files
// Sound effects
// Sort items?
// Indicate berry streak?
// Make into a progressive web app?
// Shore/mountain locales?
// Graves/shrines for secret bouquet codes or to adjust encounter chances?
// String combines with 3+ shells to make a necklace?
// Collect sea glass in a jar?
// Chipmunk - give a nut in exchange for something random?  Two rocks, two clovers, three berries, two cherries, two fruits, a bag?
// Refer to stars as "inspiration," which lets you "buy" blank or templated canvases for Color Bloom Art Maker?
// Unlock new starting items (by achieving related memory?):
// - 🍫 Snackbar (default)
// - 📙 Mushroom Encyclopedia - see the effects of mushrooms on pickup rather than on consume, and mushrooms recover +1 stamina
// - 🗑️ Litter Bag - takes up no capacity, and holds up to 3 trash pieces for free (buttons to fill/empty)
// - 👓 Binoculars - takes up no capacity, can use 1 stamina to see farther, and bird encounters recover (+)1 stamina
// - 🧺 Flower Basket - takes up no capacity, holds up to 2 flowers/bouquets for free, and using ribbons takes -2 stamina
// - ⛏️ Shovel - can dig in empty spaces (once each?) to find nothing, a rock, a turd, a mushroom, a parcel, trash, a bag, or a special find (fossil?) that recovers stamina from excitement, can shoo away bugs, too dirty for nuts?
// - 🔦 Flashlight - has limited charges (4?), can use a charge to reroll path options or give (up to 1) extra chance time selection
// - 🔋 Battery - can be used up to recharge Flashlight or potentially other tools?
// Make it possible to still collect these items on a run, like with Snackbar, so give them effects that stack?
// Cute/heartfelt thank-you cards for completing quests?

// Emojis dated after 2019 need fallbacks
const MUSHROOM_EMOJI = supportsLatestEmojis() ? '🍄‍🟫' : '🍄';
const BERRY_EMOJI = supportsLatestEmojis() ? '🫐' : '🍓';
const DARK_BIRD_EMOJI = supportsLatestEmojis() ? '🐦‍⬛' : '🦉';
const ROCK_EMOJI = supportsLatestEmojis() ? '🪨' : '🗿';
const CREEPY_CRAWLY_EMOJI = supportsLatestEmojis() ? '🪳' : '🕷️';
const PURPLE_FLOWER_EMOJI = supportsLatestEmojis() ? '🪻' : '🍇';
const HISTORY_LOG_EMOJI = supportsLatestEmojis() ? '🪶' : '📜';
const TRADING_POST_EMOJI = supportsLatestEmojis() ? '🪧' : '🚩';

const parcelOptions = [
  {
    id: "litter",
    emoji: "🍾🍬",
    description: "Blech, it's just trash!",
    content: ["bottle", "wrapper"],
    chance: 5,
  },
  {
    id: "snack",
    emoji: `🌰${BERRY_EMOJI}`,
    description: "Was this someone's snack?",
    content: ["nut", "berry"],
    chance: 4,
  },
  {
    id: "zilch",
    emoji: "",
    description: "Empty.",
    content: [],
    chance: 2,
  },
  {
    id: "material",
    emoji: "🎗️",
    description: `Got a nice ribbon.  <span class="no-wrap" role="img" aria-label="Surprised face">:O</span>`,
    content: ["ribbon"],
    chance: 2,
  },
  {
    id: "bar",
    emoji: "🍫",
    description: "Score!",
    content: ["snackbar"],
    chance: 2,
  },
  {
    id: "capacity",
    emoji: "👜",
    description: "An empty but usable bag, sweet!",
    content: ["bag"],
    chance: 1,
  },
];

// ID -> parcel option
const parcelOptionsMap = new Map(parcelOptions.map(parcelOption => [parcelOption.id, parcelOption]));

const parcelDeck = [];

for (const parcelOption of parcelOptions) {
  for (let i = 0; i < parcelOption.chance; i++) {
    parcelDeck.push(parcelOption.id);
  }
}

const mushroomSideEffects = [
  {
    id: "nothing",
    emoji: "😊",
    description: "Tastes nice!",
    chance: 8,
  },
  {
    id: "queasy",
    emoji: "🤢",
    description: "I feel a little queasy...",
    chance: 6,
    onEffect(player) {
      player.setQueasyCounter(player.queasyCounter + 5);
      game.updateStaminaDisplay();
    },
  },
  {
    id: "yucky",
    emoji: "😖",
    description: "Yuck, nasty!",
    chance: 4,
    onEffect(player) {
      player.loseStamina(5);
    },
  },
  {
    id: "toxic",
    emoji: "😰",
    description: "I feel weaker...",
    chance: 2,
    onEffect(player) {
      player.loseMaxStamina(2);
    },
  },
  // {
  //   id: "whoa",
  //   description: "Whoa man...",
  //   chance: 1,
  //   onEffect(player) {
  //     player.increaseHighPathSizeCounter(10);
  //   },
  // },
  // {
  //   id: "blurry",
  //   description: "My vision's getting blurry...",
  //   chance: 2,
  //   onEffect(player) {
  //     player.increaseLowVisionCounter(20);
  //   },
  // },
];

// ID -> mushroom side effect
const mushroomSideEffectsMap = new Map(mushroomSideEffects.map(mushroomSideEffect => [mushroomSideEffect.id, mushroomSideEffect]));

const mushroomSideEffectsDeck = [];

for (const mushroomSideEffect of mushroomSideEffects) {
  for (let i = 0; i < mushroomSideEffect.chance; i++) {
    mushroomSideEffectsDeck.push(mushroomSideEffect.id);
  }
}

function deepFreeze(obj) {
  const propNames = Object.getOwnPropertyNames(obj);

  for (const name of propNames) {
    const descriptor = Object.getOwnPropertyDescriptor(obj, name);

    // Skip getters/setters and functions to prevent immediate evaluation
    if (descriptor.get || descriptor.set || typeof descriptor.value === 'function') {
      continue;
    }

    const value = descriptor.value;

    if (value && typeof value === "object") {
      deepFreeze(value);
    }
  }

  return Object.freeze(obj);
}

function deepCopy(obj) {
  const copy = {};

  // First pass: copy all non-function properties
  for (const key in obj) {
    const descriptor = Object.getOwnPropertyDescriptor(obj, key);

    if (descriptor.get || descriptor.set) {
      // Handle getters/setters without evaluating them
      Object.defineProperty(copy, key, {
        get: descriptor.get?.bind(copy),
        set: descriptor.set?.bind(copy),
        enumerable: descriptor.enumerable,
        configurable: descriptor.configurable
      });
    } else if (typeof descriptor.value !== 'function') {
      const value = descriptor.value;

      if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        // Use structuredClone for deep cloning objects (safer than JSON)
        copy[key] = structuredClone(value);
      } else if (Array.isArray(value)) {
        // Clone arrays
        copy[key] = [...value];
      } else {
        // Copy primitive values
        copy[key] = value;
      }
    }
  }

  // Second pass: bind functions after all properties are copied
  for (const key in obj) {
    const descriptor = Object.getOwnPropertyDescriptor(obj, key);

    if (typeof descriptor.value === 'function') {
      // Create a new function that properly references the copy's properties
      const originalFunction = descriptor.value;
      copy[key] = function(...args) {
        return originalFunction.apply(copy, args);
      };
    }
  }

  return copy;
}

// Path Options
const pathOptions = deepFreeze([
  {
    id: "blank",
    emoji: "",
    name: "&#x200B;",
    getFullName() { return this.name; },
    tags: [],
    description: "Represents a path option with nothing on it.  If I see this description, it's a bug!",
    chance: 15,
    onPick() {
      // Gain nothing
      return true;
    },
  },
  {
    id: "bag",
    emoji: "👜",
    name: "Bag",
    getFullName() { return `${getEmojiMarkup(this.emoji)} ${this.name}`; },
    tags: ["treasure", "tool"],
    description: "Nice, I can carry more with this!",
    chance: 0,
    capacityWeight: 0,
    onPick(player) {
      player.capacity++;
      return false;
    },
    onDispose(player) {
      player.capacity--;

      if (player.environment === "receptacle") {
        player.actionMessage = `I put the ${wrapInBadge(this.getFullName())} into the receptacle.  I Hope I know what I'm doing...`;
        return true;
      }

      player.actionMessage += "  I Hope I know what I'm doing...";
      return false;
    },
  },
  {
    id: "shamrock",
    emoji: "☘️",
    name: "Clover Patch",
    getFullName() { return `${getEmojiMarkup(this.emoji)} ${this.name}`; },
    tags: ["grows"],
    getDescription() {
      return `A great place to find a <span class="no-wrap">${wrapInBadge(game.pathOptionsMap.get('clover').getFullName())}.</span>`;
    },
    chance: 0,
    specialConditions: [
      {
        id: "keep-looking",
        description: "I can keep trying to find one at the cost of stamina.",
      },
    ],
    onPick(player) {
      player.actionMessage = this.chanceTimeActionMessage;

      game.chanceTime.initiate(this.id, `Try to find a <span class="no-wrap">${wrapInBadge(game.pathOptionsMap.get('clover').getFullName())}!</span>`, 4, 5,
          ["🍀","🍀","🍀","☘️","☘️","☘️","☘️","☘️","☘️","☘️","☘️","☘️","☘️","☘️","☘️","☘️"], this.chanceTimeCallback.bind(this));

      game.guidebook.notesMap.get("clover").seen = true;

      return true;
    },
    chanceTimeActionMessage: `A patch of clovers!  Let's see if I can find any lucky ones...`,
    chanceTimeCallback(selections) {
      const foundLuckyClovers = selections.filter(emoji => emoji === "🍀").length;

        switch (foundLuckyClovers) {
          case 0: {
            game.player.actionMessage = `${this.chanceTimeActionMessage}\nMaybe next time.`;
            break;
          }
          case 1: {
            game.player.actionMessage = `${this.chanceTimeActionMessage}\nI found one, yay!`;
            break;
          }
          case 2: {
            game.player.actionMessage = `${this.chanceTimeActionMessage}\nAw yeah, double trouble!`;
            break;
          }
          case 3: {
            game.player.actionMessage = `${this.chanceTimeActionMessage}\nWow, three?  Jackpot!`;
            break;
          }
          default: {
            game.player.actionMessage = `${this.chanceTimeActionMessage}\nWow, ${foundLuckyClovers}?  Jackpot!`;
            break;
          }
        }

        for (let i = 0; i < foundLuckyClovers; i++) {
          game.player.encounterPathOptionById("clover");
        }

        game.updateMessagesDisplay(true);
    },
  },
  {
    id: "clover",
    emoji: "🍀",
    name: "Lucky Clover",
    getFullName() { return `${getEmojiMarkup(this.emoji)} ${this.name}`; },
    tags: [],
    description: "A serendipitous find!",
    chance: 0,
    specialConditions: [
      {
        id: "reroll",
        description: "Grants me another chance when trying my luck.",
      }
    ],
    onPick(player) {
      setTimeout(() => game.album.memoriesMap.get("hoarder-of-fortune").checkAchieved(player));
      return false;
    },
    onDispose(player) {
      player.actionMessage += "  Guess I'll make my own luck...";
      return false;
    },
  },
  {
    id: "snackbar",
    emoji: "🍫",
    name: "Snack Bar",
    getFullName() { return `${getEmojiMarkup(this.emoji)} ${this.name}`; },
    tags: ["consumable", "trashable"],
    description: "Eat to recover 5 stamina.",
    chance: 0,
    specialConditions: [
      {
        id: "waste",
        get description() {
          return `Leaves me with a ${wrapInBadge(pathOptionsReferenceMap.get("wrapper").getFullName())} when consumed.`;
        },
      },
    ],
    onConsume(player) {
      player.recoverStamina(5);
      player.encounterPathOptionById("wrapper");
      player.actionMessage = `Ate the <span class="no-wrap">${wrapInBadge(this.getFullName())}.</span>  That hit the spot!`;

      game.guidebook.notesMap.get(this.id).specialConditions.get("waste").encountered = true;
      return true;
    },
    onDispose(player) {
      if (player.environment === "receptacle") {
        player.actionMessage = `Put the ${wrapInBadge(this.getFullName())} into the receptacle.  What a waste...`;
        return true;
      }

      player.actionMessage += "  What a waste...";
      return false;
    },
  },
  {
    id: "lunch",
    emoji: "🧰",
    name: `Packed Lunch`,
    getFullName() { return `${getEmojiMarkup(this.emoji)} ${this.name}`; },
    tags: ["treasure", "consumable"],
    description: "Eat to recover 10 stamina and free up the bag to carry something else.",
    chance: 0,
    capacityWeight: 0,
    specialConditions: [
      {
        id: "waste",
        get description() {
          return `Leaves me with <span class="no-wrap">${wrapInBadge(pathOptionsReferenceMap.get("bag").getFullName())
              },</span> <span class="no-wrap">${wrapInBadge(pathOptionsReferenceMap.get("wrapper").getFullName())
              },</span> and ${wrapInBadge(pathOptionsReferenceMap.get("bottle").getFullName())} when consumed.`;
        },
      },
    ],
    onConsume(player) {
      player.recoverStamina(10);
      player.encounterPathOptionById("bag");
      player.encounterPathOptionById("wrapper");
      player.encounterPathOptionById("bottle");
      player.actionMessage = `Ate the <span class="no-wrap">${wrapInBadge(this.getFullName())}.</span>  Delicious!`;

      game.guidebook.notesMap.get(this.id).specialConditions.get("waste").encountered = true;
      return true;
    },
    onDispose(player) {
      if (player.environment === "receptacle") {
        player.actionMessage = `Put the ${wrapInBadge(this.getFullName())} into the receptacle.  <span class="no-wrap" role="img" aria-label="Broken heart">&lt;/3</span>`;
        return true;
      }

      player.actionMessage += '  <span class="no-wrap" role="img" aria-label="Broken heart">&lt;/3</span>';
      return false;
    },
  },
  {
    id: "parcel",
    emoji: "📦",
    name: "Abandoned Parcel",
    getFullName() { return `${getEmojiMarkup(this.emoji)} ${this.name}`; },
    tags: ["chest"],
    description: "Ooh, what could be inside?",
    chance: 3,
    get specialConditions() {
      return parcelOptions.map(parcelOption => {
        return {
          ...parcelOption,
          get description() {
            return `Possibility: ${parcelOption.content.length ?
                `${parcelOption.content.map((contentId, index) => {
                  return `<span class="no-wrap">${wrapInBadge(pathOptionsReferenceMap.get(contentId).getFullName())}${
                      index < parcelOption.content.length - 1 && parcelOption.content.length > 2 ? "," : ""}</span>${
                      index < parcelOption.content.length - 1 ? " " : ""}${
                      index === parcelOption.content.length - 2 ? "and " : ""}`;
                }).join("")}.`
                : parcelOption.description}`;
          }
        }
      });
    },
    onPick(player) {
      player.actionMessage = this.chanceTimeActionMessage;

      game.chanceTime.initiate(this.id, `Discover what's inside the <span class="no-wrap">${wrapInBadge(this.getFullName())}!</span>`,
          4, 1, parcelDeck.map(optionId => parcelOptionsMap.get(optionId).emoji),
          this.chanceTimeCallback.bind(this), true, this.chanceTimeShroudedFunction.bind(this));

      return true;
    },
    chanceTimeActionMessage: "Ooh, what could be inside the parcel?\nLet's see...",
    chanceTimeCallback(selections) {
      const parcelContents = parcelOptions.find(option => option.emoji === selections[0]);
      game.player.actionMessage = `${this.chanceTimeActionMessage}\n${parcelContents.description}`;

      for (const resultId of parcelContents.content) {
        game.player.encounterPathOptionById(resultId);
      }

      game.guidebook.notesMap.get(this.id).specialConditions.get(parcelContents.id).encountered = true;

      if (parcelContents.id === "capacity") {
        game.album.memoriesMap.get("bonus-bag").checkAchieved(game.player);
      }

      game.updateMessagesDisplay(true);
    },
    chanceTimeShroudedFunction(option) {
      const parcelContents = parcelOptions.find(parcelOption => parcelOption.emoji === option);
      return game.guidebook.notesMap.get(this.id).specialConditions.get(parcelContents.id).encountered !== true;
    }
  },
  {
    id: "robin",
    emoji: "🐦",
    name: "Bright Bird",
    getFullName() { return `${getEmojiMarkup(this.emoji)} ${this.name}`; },
    tags: ["bird"],
    description: 'Normally just flies away...  <span class="no-wrap" role="img" aria-label="Sad face">:(</span>',
    chance: 1,
    specialConditions: [
      {
        id: "feed",
        get description() {
          return `I can feed it a ${wrapInBadge(pathOptionsReferenceMap.get("berry").getFullName())} if I have one!`;
        }
      },
      {
        id: "cure",
        description: "I'm so excited by getting to feed it that it cures my queasiness!",
      },
    ],
    onPick(player) {
      const berryIndex = player.heldItems.findIndex(heldItem => heldItem.id === "berry");

      if (berryIndex >= 0) {
        const berryItem = player.heldItems[berryIndex];
        player.heldItems.splice(berryIndex, 1);

        game.guidebook.notesMap.get(this.id).specialConditions.get("feed").encountered = true;
        game.album.memoriesMap.get("bird-feeder").checkAchieved(player);

        if (player.queasyCounter > 0) {
          game.guidebook.notesMap.get(this.id).specialConditions.get("cure").encountered = true;
          game.album.memoriesMap.get("wild-remedy").checkAchieved(player);
        }

        player.setQueasyCounter(0);
        player.actionMessage = `I got to feed a ${wrapInBadge(berryItem.getFullName())} to the <span class="no-wrap">${wrapInBadge(this.getFullName())}!</span>  Feeling great.  <span class="no-wrap" role="img" aria-label="Elated face">:D</span>`;
      } else {
        player.actionMessage = 'Aw, the bird flew away.  <span class="no-wrap" role="img" aria-label="Sad face">:(</span>';
      }

      return true;
    },
  },
  {
    id: "blackbird",
    emoji: DARK_BIRD_EMOJI,
    name: "Dark Bird",
    getFullName() { return `${getEmojiMarkup(this.emoji)} ${this.name}`; },
    tags: ["bird"],
    description: 'Normally just flies away...  <span class="no-wrap" role="img" aria-label="Sad face">:(</span>',
    chance: 1,
    specialConditions: [
      {
        id: "feed",
        get description() {
          return `I can feed it a ${wrapInBadge(pathOptionsReferenceMap.get("nut").getFullName())} if I have one!`;
        }
      },
      {
        id: "cure",
        description: "I'm so excited by getting to feed it that it cures my queasiness!",
      },
    ],
    onPick(player) {
      const nutIndex = player.heldItems.findIndex(heldItem => heldItem.id === "nut");

      if (nutIndex >= 0) {
        const nutItem = player.heldItems[nutIndex];
        player.heldItems.splice(nutIndex, 1);

        game.guidebook.notesMap.get(this.id).specialConditions.get("feed").encountered = true;
        game.album.memoriesMap.get("bird-feeder").checkAchieved(player);

        if (player.queasyCounter > 0) {
          game.guidebook.notesMap.get(this.id).specialConditions.get("cure").encountered = true;
          game.album.memoriesMap.get("wild-remedy").checkAchieved(player);
        }

        player.setQueasyCounter(0);
        player.actionMessage = `I got to feed a ${wrapInBadge(nutItem.getFullName())} to the <span class="no-wrap">${wrapInBadge(this.getFullName())}!</span>  Feeling great.  <span class="no-wrap" role="img" aria-label="Elated face">:D</span>`;
      } else {
        player.actionMessage = 'Aw, the bird flew away.  <span class="no-wrap" role="img" aria-label="Sad face">:(</span>';
      }

      return true;
    },
  },
  {
    id: "bottle",
    emoji: "🍾",
    name: "Discarded Bottle",
    getFullName() { return `${getEmojiMarkup(this.emoji)} ${this.name}`; },
    tags: ["obstacle", "trash", "trashable"],
    description: "Ugh.  Bring it to a receptacle to dispose of it properly.",
    chance: 4,
    onDispose(player) {
      if (player.environment === "receptacle") {
        game.pathOptionsMap.get(this.id).negativeModifier++;
        game.pathOptionsMap.get("blank").positiveModifier++;
        game.guidebook.notesMap.get("receptacle").specialConditions.get("clean").encountered = true;
        player.actionMessage = `Put the ${wrapInBadge(this.getFullName())} into the receptacle.  The woods are a little bit cleaner now.  <span class="no-wrap" role="img" aria-label="Smiley face">:)</span>`;

        game.album.memoriesMap.get("good-samaritan").checkAchieved(player);
        return true;
      }

      return false;
    },
  },
  {
    id: "wrapper",
    emoji: "🍬",
    name: "Discarded Wrapper",
    getFullName() { return `${getEmojiMarkup(this.emoji)} ${this.name}`; },
    tags: ["obstacle", "trash", "trashable"],
    description: "Gross.  Bring it to a receptacle to dispose of it properly.",
    chance: 4,
    onDispose(player) {
      if (player.environment === "receptacle") {
        game.pathOptionsMap.get(this.id).negativeModifier++;
        game.pathOptionsMap.get("blank").positiveModifier++;
        game.guidebook.notesMap.get("receptacle").specialConditions.get("clean").encountered = true;
        player.actionMessage = `Put the ${wrapInBadge(this.getFullName())} into the receptacle.  The woods are a little bit cleaner now.  <span class="no-wrap" role="img" aria-label="Smiley face">:)</span>`;

        game.album.memoriesMap.get("good-samaritan").checkAchieved(player);
        return true;
      }

      return false;
    },
  },
  {
    id: "receptacle",
    emoji: "🚮",
    name: "Trash Receptacle",
    getFullName() { return `${getEmojiMarkup(this.emoji)} ${this.name}`; },
    tags: ["environment"],
    get description() {
      return `There is a ${wrapInBadge(this.getFullName())} available.`;
    },
    chance: 2,
    specialConditions: [
      {
        id: "clean",
        description: "More and more trash will appear in the woods over time, but I can reduce the amount whenever I use this to dispose of some.",
      },
    ],
    onPick() {
      return true;
    },
  },
  {
    id: "mushroom",
    emoji: MUSHROOM_EMOJI,
    name: "Mushroom",
    getFullName() { return `${getEmojiMarkup(this.emoji)} ${this.name}`; },
    tags: ["consumable"],
    description: "Eat to recover 4 stamina, but may have side effects.",
    chance: 6,
    get specialConditions() {
      return mushroomSideEffects.map(sideEffect => {
        return {
          ...sideEffect,
          get description() {
            return `Possibility: ${sideEffect.description}`;
          }
        }
      });
    },
    onConsume(player) {
      player.actionMessage = this.getChanceTimeActionMessage();

      game.chanceTime.initiate(this.id, `Discover the effects of the <span class="no-wrap">${wrapInBadge(this.getFullName())}!</span>`, 5, 1,
          mushroomSideEffectsDeck.map(sideEffectId => mushroomSideEffectsMap.get(sideEffectId).emoji),
          this.chanceTimeCallback.bind(this), false, this.chanceTimeShroudedFunction.bind(this));

      return true;
    },
    getChanceTimeActionMessage() {
      return `Ate the <span class="no-wrap">${wrapInBadge(this.getFullName())}...</span>`;
    },
    chanceTimeCallback(selections) {
      const sideEffectData = mushroomSideEffects.find(sideEffect => sideEffect.emoji === selections[0]);
      game.player.actionMessage = `${this.getChanceTimeActionMessage()}  ${sideEffectData.description}`;

      game.player.recoverStamina(4);

      if (sideEffectData.onEffect) {
        sideEffectData.onEffect(game.player);
      }

      game.guidebook.notesMap.get(this.id).specialConditions.get(sideEffectData.id).encountered = true;
      game.updateMessagesDisplay(true);
    },
    chanceTimeShroudedFunction(option) {
      const sideEffectData = mushroomSideEffects.find(sideEffect => sideEffect.emoji === option);
      return game.guidebook.notesMap.get(this.id).specialConditions.get(sideEffectData.id).encountered !== true;
    }
  },
  {
    id: "berry",
    emoji: BERRY_EMOJI,
    name: "Berry",
    getFullName() { return `${getEmojiMarkup(this.emoji)} ${this.name}`; },
    tags: ["consumable"],
    description: "Eat to recover stamina.  The more in one go, the better!",
    chance: 12,
    specialConditions: [
      {
        id: "first",
        description: "The first one does nothing for me.  I need to follow it up with more before consuming anything else.",
      },
      {
        id: "fill",
        description: "I keep craving and recovering more until I finally have my fill after 6 in a row.",
      },
    ],
    onConsume(player) {
      player.recoverStamina(player.berryStreak);

      player.berryStreak = (player.berryStreak + 1) % 6;

      player.actionMessage = `Ate the <span class="no-wrap">${wrapInBadge(this.getFullName())}.</span>  ${
          (player.berryStreak > 0) ? `I crave more!` : `Yummy!`}`;

      game.guidebook.notesMap.get("berry").specialConditions.get("first").encountered = true;
      game.album.memoriesMap.get("berry-bonanza").checkAchieved(player);

      return true;
    },
  },
  {
    id: "cherry",
    emoji: "🍒",
    name: "Cherry",
    getFullName() { return `${getEmojiMarkup(this.emoji)} ${this.name}`; },
    tags: ["consumable"],
    description: "Eat to recover 3 stamina, but has to be done in pairs.",
    chance: 5,
    onConsume(player) {
      if (player.heldItems.filter(heldItem => heldItem.id === "cherry").length >= 2) {
        player.recoverStamina(6);

        setTimeout(() => {
          const cherryIndex = player.heldItems.findIndex(heldItem => heldItem.id === "cherry");
          player.heldItems.splice(cherryIndex, 1);
          game.updateHeldItemsDisplay();
          game.updatePathDisplay();
          game.updateMessagesDisplay(true);
        });

        player.actionMessage = `Ate the ${wrapInBadge(this.getFullName())} along with another, just as it was meant to be.  Ah...`;
        return true;
      }

      player.actionMessage = `I need another ${wrapInBadge(this.getFullName())} to eat with this.  It's the rules!  <span class="no-wrap" role="img" aria-label="Angry face">&gt;:(</span>`;
      return false;
    },
  },
  {
    id: "tangerine",
    emoji: "🍊",
    name: "Fruit",
    getFullName() { return `${getEmojiMarkup(this.emoji)} ${this.name}`; },
    tags: ["consumable"],
    description: "Eat to recover 7 stamina, but takes a while to peel.",
    startingStepsLeftToPeel: 14,
    stepsLeftToPeel: 15, // Add one for initial step on pickup
    chance: 2,
    specialConditions: [
      {
        id: "juggle",
        description: `If I ever hold three at once, I'll attempt to juggle them.  <span class="no-wrap" role="img" aria-label="Mischievous face">&gt;:D</span>`,
      },
      {
        id: "drop",
        description: 'Possibility: I drop any that I fail to catch...  <span class="no-wrap" role="img" aria-label="Sad face">:(</span>',
      },
      {
        id: "success",
        description: `Possibility: If I catch all three, I get so pumped that I instantly peel and eat them!  <span class="no-wrap" role="img" aria-label="Mischievous face with tongue sticking out">&gt;:P</span>`,
      },
    ],
    onPick(player) {
      const heldNonFruit = player.heldItems.filter(item => item.id !== "tangerine");
      const numHeldFruit = 1 + player.heldItems.length - heldNonFruit.length;

      if (numHeldFruit >= 3) {
        player.actionMessage = this.getChanceTimeActionMessage();
        game.guidebook.notesMap.get(this.id).specialConditions.get("juggle").encountered = true;

        game.chanceTime.initiate(this.id, `Attempt to juggle by catching all three <span class="no-wrap">${wrapInBadge(this.getFullName())}!</span>`,
            3, 3, ["🍊","🍊","🍊","🍊","🍊","🍊","❌","❌","❌"], this.chanceTimeCallback.bind(this));

        return false;
      } else if (numHeldFruit === 2) {
        player.actionMessage = `All I need is a third ${wrapInBadge(this.getFullName())} and I can try to juggle them!  <span class="no-wrap" role="img" aria-label="Mischievous face">&gt;:D</span>`;
      }

      return false;
    },
    getChanceTimeActionMessage() {
      return `That's three <span class="no-wrap">${wrapInBadge(this.getFullName())}!</span>  Commencing juggle attempt...`;
    },
    chanceTimeCallback(selections) {
      const nonFruitSelections = selections.filter(selection => selection !== "🍊");

      if (nonFruitSelections.length === 0) {
        // Success
        game.player.actionMessage = `${this.getChanceTimeActionMessage()}\nI did it!  That got me so pumped that I instantly peeled and ate them all.  <span class="no-wrap" role="img" aria-label="Mischievous face with tongue sticking out">&gt;:P</span>`;
        game.player.recoverStamina(7 * 3);
        game.guidebook.notesMap.get(this.id).specialConditions.get("success").encountered = true;
        game.album.memoriesMap.get("fruitful-finesse").checkAchieved(game.player);

        const heldNonFruit = game.player.heldItems.filter(item => item.id !== "tangerine");
        game.player.heldItems = heldNonFruit;
      } else {
        // Failure
        let amount = "some";
        if (nonFruitSelections.length === 1) {
          amount = "one";
        } else if (nonFruitSelections.length >= 3) {
          amount = "them all";
        }

        game.player.actionMessage = `${this.getChanceTimeActionMessage()}\nOh shoot, I dropped ${amount}!  <span class="no-wrap" role="img" aria-label="Sad face">:(</span>`;
        game.guidebook.notesMap.get(this.id).specialConditions.get("drop").encountered = true;

        const heldFruit = game.player.heldItems.filter(item => item.id === "tangerine");

        for (let i = 0; i < nonFruitSelections.length; i++) {
          const randomFruit = randomDraw(heldFruit, true);
          game.player.heldItems.splice(game.player.heldItems.indexOf(randomFruit), 1);
        }
      }

      game.updateMessagesDisplay(true);
    },
    onConsume(player) {
      if (this.stepsLeftToPeel <= 0) {
        player.recoverStamina(7);
        player.actionMessage = `Ate the <span class="no-wrap">${wrapInBadge(this.name)}.</span>  It took some work, but it was worth it.  <span class="no-wrap" role="img" aria-label="Face with tongue sticking out">:P</span>`;
        return true;
      }

      player.actionMessage = `I won't be done peeling this ${wrapInBadge(this.getFullName())} for another ${this.stepsLeftToPeel} step${this.stepsLeftToPeel !== 1 ? "s" : ""}.`;
      return false;
    },
  },
  {
    id: "nut",
    emoji: "🌰",
    name: "Nut",
    getFullName() { return `${getEmojiMarkup(this.emoji)} ${this.name}`; },
    tags: ["consumable"],
    description: "Eat to gain 1 max stamina.  Requires something to break the shell.",
    chance: 10,
    specialConditions: [
      {
        id: "rock",
        get description() {
          return `I can use a ${wrapInBadge(pathOptionsReferenceMap.get("rock").getFullName())} for this!`;
        }
      },
    ],
    onConsume(player) {
      if (player.heldItems.some(heldItem => heldItem.id === "rock")) {
        player.gainMaxStamina(1);
        player.actionMessage = `Ate the ${wrapInBadge(this.getFullName())} by breaking the shell with a <span class="no-wrap">${wrapInBadge(pathOptionsReferenceMap.get("rock").getFullName())}.</span>  I feel stronger!`;

        game.guidebook.notesMap.get(this.id).specialConditions.get("rock").encountered = true;
        game.guidebook.notesMap.get("rock").specialConditions.get("nut").encountered = true;
        return true;
      }

      const withText = player.heldItems.some(heldItem => heldItem.id === "bottle") ? `nothing but a flimsy ${wrapInBadge(pathOptionsReferenceMap.get("bottle").getFullName())}` : "my bare hands";

      player.actionMessage = `I can't crack open the ${wrapInBadge(this.getFullName())} with <span class="no-wrap">${withText}.</span>  <span class="no-wrap" role="img" aria-label="Sad face">:(</span>`;
      return false;
    },
  },
  {
    id: "rock",
    emoji: ROCK_EMOJI,
    name: "Rock",
    getFullName() { return `${getEmojiMarkup(this.emoji)} ${this.name}`; },
    tags: ["tool"],
    description: "A nice hefty rock.  Hard to carry, though...",
    chance: 3,
    capacityWeight: 2,
    specialConditions: [
      {
        id: "nut",
        get description() {
          return `Holding this allows me to break the shell of a <span class="no-wrap">${wrapInBadge(pathOptionsReferenceMap.get("nut").getFullName())}.</span>`;
        }
      },
      {
        id: "bug",
        description: "More and more bugs will appear in the woods over time, but I can reduce the amount whenever I use this to shoo one away.",
      },
    ],
    onPick(player) {
      setTimeout(() => game.album.memoriesMap.get("rock-collector").checkAchieved(player));
      setTimeout(() => game.album.memoriesMap.get("rock-maniac").checkAchieved(player));

      return false;
    },
    onDispose(player) {
      player.actionMessage += "  I feel lighter already.";
      return false;
    }
  },
  {
    id: "mosquito",
    emoji: "🦟",
    name: "Nasty Nuisance",
    getFullName() { return `${getEmojiMarkup(this.emoji)} ${this.name}`; },
    tags: ["obstacle", "bug"],
    description: "Nope!  No thanks.  I'll just run past it until I can't see it anymore.",
    chance: 0,
    specialConditions: [
      {
        id: "shoo",
        get description() {
          return `I'll shoo it away instead if I have a ${wrapInBadge(pathOptionsReferenceMap.get("rock").getFullName())} I can use up.  Good riddance!`;
        },
      },
    ],
    onPick(player) {
      const rockIndex = player.heldItems.findIndex(heldItem => heldItem.id === "rock");

      if (rockIndex >= 0) {
        const rockItem = player.heldItems[rockIndex];
        rockItem.onDispose(player);
        player.heldItems.splice(rockIndex, 1);
        player.actionMessage = `Shooed the ${wrapInBadge(this.getFullName())} away with a <span class="no-wrap">${wrapInBadge(rockItem.getFullName())}.</span>  Good riddance!`;

        game.pathOptionsMap.get(this.id).negativeModifier++;
        game.pathOptionsMap.get("blank").positiveModifier++;
        game.guidebook.notesMap.get(this.id).specialConditions.get("shoo").encountered = true;
        game.guidebook.notesMap.get("rock").specialConditions.get("bug").encountered = true;
        game.album.memoriesMap.get("bug-banisher").checkAchieved(player);
      } else {
        for (let i = 0; i < game.pathVisibility - 1; i++) {
          game.takePathStep();
        }

        player.actionMessage = "Gah, a bug!  Managed to run passed it.";
      }

      return true;
    },
  },
  {
    id: "roach",
    emoji: CREEPY_CRAWLY_EMOJI,
    name: "Creepy Crawly",
    getFullName() { return `${getEmojiMarkup(this.emoji)} ${this.name}`; },
    tags: ["obstacle", "bug"],
    description: "Nope!  No thanks.  I'll just run past it until I can't see it anymore.",
    chance: 0,
    specialConditions: [
      {
        id: "shoo",
        get description() {
          return `I'll shoo it away instead if I have a ${wrapInBadge(pathOptionsReferenceMap.get("rock").getFullName())} I can use up.  Good riddance!`;
        },
      },
    ],
    onPick(player) {
      const rockIndex = player.heldItems.findIndex(heldItem => heldItem.id === "rock");

      if (rockIndex >= 0) {
        const rockItem = player.heldItems[rockIndex];
        rockItem.onDispose(player);
        player.heldItems.splice(rockIndex, 1);
        player.actionMessage = `Shooed the ${wrapInBadge(this.getFullName())} away with a <span class="no-wrap">${wrapInBadge(rockItem.getFullName())}.</span>  Good riddance!`;

        game.pathOptionsMap.get(this.id).negativeModifier++;
        game.pathOptionsMap.get("blank").positiveModifier++;
        game.guidebook.notesMap.get(this.id).specialConditions.get("shoo").encountered = true;
        game.guidebook.notesMap.get("rock").specialConditions.get("bug").encountered = true;
        game.album.memoriesMap.get("bug-banisher").checkAchieved(player);
      } else {
        for (let i = 0; i < game.pathVisibility - 1; i++) {
          game.takePathStep();
        }

        player.actionMessage = "Gah, a bug!  Managed to run passed it.";
      }

      return true;
    },
  },
  {
    id: "tracks",
    emoji: "🐾",
    name: "Animal Tracks",
    getFullName() { return `${getEmojiMarkup(this.emoji)} ${this.name}`; },
    tags: ["tracking"],
    description: "Ooh, if I follow them all, what might they lead to?",
    chance: 1,
    onPick(player) {
      player.trackCounter = -player.trackCounter;
      player.trackCounter++;
      player.actionMessage = this.getChanceTimeActionMessage();

      if (player.trackCounter >= player.trackPathLength) {
        const chanceOptions = ["🐾","🐾","🐾","🐾","🐾","❌","❌","❌","❌"];
        game.chanceTime.initiate(this.id, `Attempt to follow at least three <span class="no-wrap">${wrapInBadge(this.getFullName())}!</span>`,
            3, 5, chanceOptions, this.chanceTimeCallback.bind(this));
      }

      return true;
    },
    getChanceTimeActionMessage() {
      let actionMessage = "Ooh, animal tracks!  I wonder what they'll lead to if I keep following them...";

      if (Math.abs(game.player.trackCounter) >= game.player.trackPathLength) {
        actionMessage += "  Oh!";
      }

      return actionMessage;
    },
    chanceTimeCallback(selections) {
      const tracksSelections = selections.filter(selection => selection === "🐾");
      let tracksOptionId;

      if (tracksSelections.length >= 3) {
        // Success
        game.player.actionMessage = `${this.getChanceTimeActionMessage()}\nI see it in the distance, wow!`;
        game.player.trackPathLength = tracksSelections.length - 1;
        tracksOptionId = "bunny";
        game.guidebook.notesMap.get(this.id).specialConditions.get("sighting").encountered = true;
      } else {
        // Failure
        game.player.actionMessage = `${this.getChanceTimeActionMessage()}\nI see it in the distance, ew...`;
        game.player.trackPathLength = 5 - tracksSelections.length;
        tracksOptionId = "turd";
        game.guidebook.notesMap.get(this.id).specialConditions.get("bust").encountered = true;
      }

      game.player.trackCounter = 0;
      let replacedTracks = false;

      for (let i = 0; i < game.pathStepOptions[0].length && replacedTracks !== true; i++) {
        for (let j = 0; j < game.pathStepOptions[i][0].length && replacedTracks !== true; j++) {
          if (game.pathStepOptions[i][j] === this.id) {
            game.pathStepOptions[i][j] = tracksOptionId;
            replacedTracks = true;
          }
        }
      }

      game.updateMessagesDisplay(true);
    },
    specialConditions: [
      {
        id: "sighting",
        get description() {
          return `Possibility: <span class="no-wrap">${wrapInBadge(pathOptionsReferenceMap.get("bunny").getFullName())}!</span>  <span class="no-wrap" role="img" aria-label="Heart">&lt;3</span>`;
        },
      },
      {
        id: "bust",
        get description() {
          return `Possibility: <span class="no-wrap">${wrapInBadge(pathOptionsReferenceMap.get("turd").getFullName())}.</span>  <span class="no-wrap" role="img" aria-label="Unimpressed face">:/</span>`;
        },
      },
    ],
  },
  {
    id: "bunny",
    emoji: "🐇",
    name: "Bunny",
    getFullName() { return `${getEmojiMarkup(this.emoji)} ${this.name}`; },
    tags: ["tracking"],
    description: `So cute.  Makes my day!  <span class="no-wrap" role="img" aria-label="Heart">&lt;3</span>`,
    chance: -1,
    specialConditions: [
      {
        id: "cure",
        get description() {
          return `Seeing it not only recovers some stamina, but also cures my queasiness!`;
        },
      },
    ],
    onPick(player) {
      player.actionMessage = `Whoa, a <span class="no-wrap">${wrapInBadge(this.getFullName())}!</span>  So cute.  My day is made!  <span class="no-wrap" role="img" aria-label="Heart">&lt;3</span>`;
      player.recoverStamina(2 * player.trackPathLength);
      player.trackPathLength = 0;
      game.album.memoriesMap.get("special-sighting").checkAchieved(player);

      if (player.queasyCounter > 0) {
        player.setQueasyCounter(0);
        game.guidebook.notesMap.get(this.id).specialConditions.get("cure").encountered = true;
        game.album.memoriesMap.get("wild-remedy").checkAchieved(player);
      }

      return true;
    },
  },
  {
    id: "turd",
    emoji: "💩",
    name: "Turd",
    getFullName() { return `${getEmojiMarkup(this.emoji)} ${this.name}`; },
    tags: ["tracking"],
    description: "Ew.  Makes me feel queasy...",
    chance: -1,
    onPick(player) {
      // Counts down immediately after pick
      player.setQueasyCounter(player.queasyCounter + 2 * player.trackPathLength);
      player.trackPathLength = 0;
      player.actionMessage = "Ew, something defecated here!  I lost my appetite...";

      game.album.memoriesMap.get("insatiable-curiosity").checkAchieved(player);
      return true;
    },
  },
  {
    id: "bouquet",
    emoji: "💐",
    name: "Bouquet",
    getFullName() { return `${getEmojiMarkup(this.emoji)} ${this.name}`; },
    tags: ["trashable"],
    // Use a regular function rather than a getter so that it recalculates on each access
    // and survives copying the object with the spread operator
    getDescription(forGuidebook = false) {
      return `A lovely bouquet of ${forGuidebook === false && this.flowers.length ? `${this.flowers.length} flowers:\n${
      this.flowers.map(flower => pathOptionsReferenceMap.get(flower).emoji).join("")
      }\n\n` : "flowers.  "}Much easier to carry.`
    },
    flowers: [],
    chance: 0,
    onPick(player) {
      setTimeout(() => game.album.memoriesMap.get("balanced-bouquet").checkAchieved(player));
      setTimeout(() => game.album.memoriesMap.get("favorite-flower").checkAchieved(player));
      setTimeout(() => game.album.memoriesMap.get("fixated-florist").checkAchieved(player));
      return false;
    },
    onDispose(player) {
      if (player.environment === "receptacle") {
        player.actionMessage = `Put the ${wrapInBadge(this.getFullName())} into the receptacle.  <i lang="fr">C'est la vie...</i>`;
        return true;
      }

      player.actionMessage += `  <i lang="fr">C'est la vie...</i>`;
      return false;
    },
  },
  {
    id: "ribbon",
    emoji: "🎗️",
    name: "Ribbon",
    getFullName() { return `${getEmojiMarkup(this.emoji)} ${this.name}`; },
    tags: ["tool", "trashable"],
    description: "With some effort, I can use this to turn all my flowers into a bouquet.",
    chance: 1,
    onConsume(player) {
      const heldFlowers = player.heldItems.filter(heldItem => heldItem.tags.includes("flower"));

      if (heldFlowers.length > 1) {
        const nonFlowers = player.heldItems.filter(heldItem => heldItem.tags.includes("flower") === false);
        player.heldItems = nonFlowers;

        const bouquet = deepCopy(pathOptionsReferenceMap.get("bouquet"));
        bouquet.flowers = heldFlowers.map(heldItem => heldItem.id);
        player.encounterPathOption(bouquet);

        player.actionMessage = `Used the ${wrapInBadge(this.getFullName())} to make a ${wrapInBadge(pathOptionsReferenceMap.get("bouquet").getFullName())} out of all my flowers.  <span class="no-wrap" role="img" aria-label="Smiley face">:)</span>`;
        player.loseStamina(heldFlowers.length);
        return true;
      }

      player.actionMessage = `I need at least two flowers to make a bouquet.`;
      return false;
    },
    onDispose(player) {
      if (player.environment === "receptacle") {
        player.actionMessage = `Put the ${wrapInBadge(this.getFullName())} into the receptacle.  <i lang="fr">C'est la vie...</i>`;
        return true;
      }

      player.actionMessage += `  <i lang="fr">C'est la vie...</i>`;
      return false;
    },
  },
  {
    id: "rose",
    emoji: "🌹",
    name: "Red Flower",
    getFullName() { return `${getEmojiMarkup(this.emoji)} ${this.name}`; },
    tags: ["flower", "grows"],
    description: "Collectable.  Smells nice!",
    chance: 2,
    onPick(player) {
      setTimeout(() => game.album.memoriesMap.get("flower-finder").checkAchieved(player));
      setTimeout(() => game.album.memoriesMap.get("flower-power").checkAchieved(player));
      setTimeout(() => game.album.memoriesMap.get("flower-frenzy").checkAchieved(player));
      return false;
    },
  },
  {
    id: "hyacinth",
    emoji: `${PURPLE_FLOWER_EMOJI}`,
    name: "Purple Flower",
    getFullName() { return `${getEmojiMarkup(this.emoji)} ${this.name}`; },
    tags: ["flower", "grows"],
    description: "Collectable.  So vibrant!",
    chance: 2,
    onPick(player) {
      setTimeout(() => game.album.memoriesMap.get("flower-finder").checkAchieved(player));
      setTimeout(() => game.album.memoriesMap.get("flower-power").checkAchieved(player));
      setTimeout(() => game.album.memoriesMap.get("flower-frenzy").checkAchieved(player));
      return false;
    },
  },
  {
    id: "tulip",
    emoji: "🌷",
    name: "Pink Flower",
    getFullName() { return `${getEmojiMarkup(this.emoji)} ${this.name}`; },
    tags: ["flower", "grows"],
    description: "Collectable.  Soft petals!",
    chance: 2,
    onPick(player) {
      setTimeout(() => game.album.memoriesMap.get("flower-finder").checkAchieved(player));
      setTimeout(() => game.album.memoriesMap.get("flower-power").checkAchieved(player));
      setTimeout(() => game.album.memoriesMap.get("flower-frenzy").checkAchieved(player));
      return false;
    },
  },
  {
    id: "daisy",
    emoji: "🌼",
    name: "Pale Flower",
    getFullName() { return `${getEmojiMarkup(this.emoji)} ${this.name}`; },
    tags: ["flower", "grows"],
    description: "Collectable.  Cheerful!",
    chance: 2,
    onPick(player) {
      setTimeout(() => game.album.memoriesMap.get("flower-finder").checkAchieved(player));
      setTimeout(() => game.album.memoriesMap.get("flower-power").checkAchieved(player));
      setTimeout(() => game.album.memoriesMap.get("flower-frenzy").checkAchieved(player));
      return false;
    },
  },
  {
    id: "trading-post",
    emoji: `${TRADING_POST_EMOJI}`,
    name: "Trading Post",
    getFullName() { return `${getEmojiMarkup(this.emoji)} ${this.name}`; },
    tags: ["environment", "trading"],
    getDescription(forGuidebook = false) {
      const offerMarkup = tradeOffersMap.get(game.nextTradeOfferId)?.getEmojisMarkup();
      const requestMarkup = tradeRequestsMap.get(game.nextTradeRequestId)?.getEmojisMarkup();

      return forGuidebook ? `A spot for trading items.` : `There is a ${wrapInBadge(this.getFullName())
          } available, offering ${offerMarkup} in exchange for ${requestMarkup}.`;
    },
    chance: 1,
    onPick() {
      game.guidebook.notesMap.get("trading-post").specialConditions.get(game.nextTradeRequestId).encountered = true;
      game.guidebook.notesMap.get("trading-post").specialConditions.get(game.nextTradeOfferId).encountered = true;
      return true;
    },
    get specialConditions() {
      return [...tradeRequests.map(tradeRequest => {
        return {
          ...tradeRequest,
          get description() {
            return `Possible request: ${tradeRequest.getEmojisMarkup()}.`;
          }
        }
      }), ...tradeOffers.map(tradeOffer => {
        return {
          ...tradeOffer,
          get description() {
            return `Possible offer: ${tradeOffer.getEmojisMarkup()}.`;
          }
        }
      })]
    },
  },
  {
    id: "flyer",
    emoji: "📰",
    name: "Flyer",
    getFullName() { return `${getEmojiMarkup(this.emoji)} ${this.name}`; },
    tags: ["environment", "trading"],
    getDescription(forGuidebook = false) {
      return forGuidebook === false ? `There is a ${wrapInBadge(this.getFullName())
          } showing that someone wants to trade up ahead, offering ${
          tradeOffersMap.get(game.nextTradeOfferId)?.getEmojisMarkup()} in exchange for ${
          tradeRequestsMap.get(game.nextTradeRequestId)?.getEmojisMarkup()}.`
          : `Shows what someone wants to trade at the next <span class="no-wrap">${
          wrapInBadge(pathOptionsReferenceMap.get("trading-post").getFullName())}.</span>`;
    },
    chance: 2,
    onPick() {
      game.guidebook.notesMap.get("trading-post").specialConditions.get(game.nextTradeRequestId).encountered = true;
      game.guidebook.notesMap.get("trading-post").specialConditions.get(game.nextTradeOfferId).encountered = true;
      return true;
    },
  },
]);

// Create immutable reference map from the frozen array.
// Objects are already frozen, so we can use them directly.
const pathOptionsReferenceMap = Object.freeze(new Map(pathOptions.map(pathOption => [pathOption.id, pathOption])));
const pathOptionsEmojiMap = Object.freeze(new Map(pathOptions.map(pathOption => [pathOption.emoji, pathOption])));

function getEmojiMarkup(emoji, labeled = false, overridingLabel = undefined) {
  return `<span role="img" ${
    labeled ? `aria-label="${overridingLabel ??
        pathOptionsEmojiMap.get(emoji)?.name ?? supplementalEmojiLabels[emoji]}"` : `aria-hidden="true" style="pointer-events: none;"`
  }>${emoji}</span>`
}

function getWrappedEmojis(emojiString) {
  const splitEmojis = splitEmojiString(emojiString);
  const emojiLabel = splitEmojis.map(emoji => pathOptionsEmojiMap.get(emoji)?.name ?? supplementalEmojiLabels[emoji]).join(", ");
  const emojiMarkup = splitEmojis.map(emoji => getEmojiMarkup(emoji)).join("");
  const badgeMarkup = wrapInBadge(emojiMarkup);
  const noWrapMarkup = `<span class="no-wrap" role="img" aria-label="${emojiLabel}">${badgeMarkup}</span>`;
  return noWrapMarkup;
}

const tradeRequests = [
  {
    id: "fruit-salad",
    emojis: `${BERRY_EMOJI}🍒🍊`,
    getEmojisMarkup: function() {
      return getWrappedEmojis(this.emojis);
    },
    items: ["berry", "cherry", "tangerine"],
  },
  {
    id: "mushroom-feast",
    emojis: `${MUSHROOM_EMOJI}${MUSHROOM_EMOJI}${MUSHROOM_EMOJI}`,
    getEmojisMarkup: function() {
      return getWrappedEmojis(this.emojis);
    },
    items: ["mushroom", "mushroom", "mushroom"],
  },
  {
    id: "ribbons",
    emojis: `🎗️🎗️`,
    getEmojisMarkup: function() {
      return getWrappedEmojis(this.emojis);
    },
    items: ["ribbon", "ribbon"],
  },
  {
    id: "rocks",
    emojis: `🪨🪨`,
    getEmojisMarkup: function() {
      return getWrappedEmojis(this.emojis);
    },
    items: ["rock", "rock"],
  },
  {
    id: "trash",
    emojis: `🍬🍾🍬🍾`,
    getEmojisMarkup: function() {
      return getWrappedEmojis(this.emojis);
    },
    items: ["wrapper", "bottle", "wrapper", "bottle"],
  },
];

// ID -> trade request
const tradeRequestsMap = new Map(tradeRequests.map(tradeRequest => [tradeRequest.id, tradeRequest]));

const tradeOffers = [
  {
    id: "clover-bunch",
    emojis: `🍀🍀🍀`,
    getEmojisMarkup: function() {
      return getWrappedEmojis(this.emojis);
    },
    items: ["clover", "clover", "clover"],
  },
  {
    id: "extra-lunch",
    emojis: `🧰`,
    getEmojisMarkup: function() {
      return getWrappedEmojis(this.emojis);
    },
    items: ["lunch"],
  },
  {
    id: "pale-flowers",
    emojis: `🌼🌼🌼🌼`,
    getEmojisMarkup: function() {
      return getWrappedEmojis(this.emojis);
    },
    items: ["daisy", "daisy", "daisy", "daisy"],
  },
  {
    id: "red-flowers",
    emojis: `🌹🌹🌹🌹`,
    getEmojisMarkup: function() {
      return getWrappedEmojis(this.emojis);
    },
    items: ["rose", "rose", "rose", "rose"],
  },
  {
    id: "pink-flowers",
    emojis: `🌷🌷🌷🌷`,
    getEmojisMarkup: function() {
      return getWrappedEmojis(this.emojis);
    },
    items: ["tulip", "tulip", "tulip", "tulip"],
  },
  {
    id: "purple-flowers",
    emojis: `${PURPLE_FLOWER_EMOJI}${PURPLE_FLOWER_EMOJI}${PURPLE_FLOWER_EMOJI}${PURPLE_FLOWER_EMOJI}`,
    getEmojisMarkup: function() {
      return getWrappedEmojis(this.emojis);
    },
    items: ["hyacinth", "hyacinth", "hyacinth", "hyacinth"],
  },
];

// ID -> trade offer
const tradeOffersMap = new Map(tradeOffers.map(tradeOffer => [tradeOffer.id, tradeOffer]));

class ChanceTime {
  awaitingSelection;
  callerId;
  message;
  startingOptions;
  selectedOptions;
  selectionsToMake;
  cols;
  callback;
  smallIcons;

  constructor(loadedChanceTime = {}) {
    this.awaitingSelection = loadedChanceTime.awaitingSelection ?? false;
    this.callerId = loadedChanceTime.callerId ?? "";
    this.message = loadedChanceTime.message ?? "";
    this.startingOptions = loadedChanceTime.startingOptions ?? [];
    this.selectedOptions = loadedChanceTime.selectedOptions ?? [];
    this.selectionsToMake = loadedChanceTime.selectionsToMake ?? 1;
    this.cols = loadedChanceTime.cols ?? 3;
    this.callback = pathOptionsReferenceMap.get(loadedChanceTime.callerId)?.chanceTimeCallback ?? (() => {});
    this.smallIcons = loadedChanceTime.smallIcons ?? false;
    this.shroudedFunction = pathOptionsReferenceMap.get(loadedChanceTime.callerId)?.chanceTimeShroudedFunction ?? (() => false);
  }

  show() {
    const chanceTimeDisplay = document.getElementById("chance-time-display");
    chanceTimeDisplay.showModal();

    const chanceTimeContent = document.getElementById("chance-time-content");
    chanceTimeContent.scrollTop = 0;
  }

  hide() {
    const chanceTimeDisplay = document.getElementById("chance-time-display");
    chanceTimeDisplay.close();
  }

  // Cols should not exceed 5
  initiate(callerId, message, cols, selectionsToMake, startingOptions, callback,
      smallIcons = false, shroudedFunction = () => false, isLoadedFromSave = false) {
    if (game.gameActive !== true) {
      return;
    }

    this.callerId = callerId;
    this.shroudedFunction = shroudedFunction;
    this.smallIcons = smallIcons;
    this.callback = callback;
    this.cols = cols;
    updateCssVar('--chance-time-cols', cols);
    this.selectionsToMake = selectionsToMake;
    this.startingOptions = startingOptions;

    let loadedOptions = [];

    if (isLoadedFromSave) {
      loadedOptions = [...this.selectedOptions];
    }

    const loadedOptionsCheckboxes = [];
    this.selectedOptions = [];

    const chanceTimeMessage = document.getElementById("chance-time-message");
    chanceTimeMessage.innerHTML = message;
    this.message = message;

    this.updateChanceTimeProgress(selectionsToMake === 1);

    const chanceTimeDoneButton = document.getElementById("chance-time-done");
    chanceTimeDoneButton.style.display = "none";
    const chanceTimeTryAgain = document.getElementById("chance-time-try-again");
    chanceTimeTryAgain.style.display = "none";
    const chanceTimeKeepLooking = document.getElementById("chance-time-keep-looking");
    chanceTimeKeepLooking.style.display = "none";

    const chanceTimeGrid = document.getElementById("chance-time-grid");

    // Important to use instead of `innerHTML = ""` for proper event listener cleanup
    chanceTimeGrid.replaceChildren();

    let optionsToPopulate = [...this.startingOptions];

    while (optionsToPopulate.length) {
      const option = randomDraw(optionsToPopulate, true);
      const ordinal = this.startingOptions.length - optionsToPopulate.length;

      let optionLabel = splitEmojiString(option).map(emoji => pathOptionsEmojiMap.get(emoji)?.name ?? supplementalEmojiLabels[emoji] ?? emoji).join(", ");

      if (optionLabel === pathOptionsReferenceMap.get("shamrock").name) {
        optionLabel = "Regular Clover";
      }

      const optionElement = document.createElement("label");
      optionElement.classList.add("checkbox-button");

      const optionSpan = document.createElement("span");
      const nestedSpan = document.createElement("span");

      const optionCheckbox = document.createElement("input");
      optionCheckbox.type = "checkbox";
      optionCheckbox.ariaLabel = `Chance Time option ${ordinal} of ${this.startingOptions.length}`;
      optionCheckbox.name = `option${ordinal}`;
      optionCheckbox.onclick = () => {
        optionSpan.ariaHidden = false;

        optionCheckbox.disabled = true;
        this.selectedOptions.push(option);

        optionElement.tabIndex="0";
        optionElement.focus();

        const allSelectionsMade = this.selectedOptions.length >= this.selectionsToMake;
        this.updateChanceTimeProgress(allSelectionsMade);

        if (allSelectionsMade) {
          chanceTimeDoneButton.style.display = null;

          if (startingOptions.includes("🍀")) {
            if (game.player.stamina > 1 && !this.selectedOptions.includes("🍀")) {
              chanceTimeKeepLooking.style.display = null;
            }
          } else {
            if (game.player.heldItems.some(heldItem => heldItem.id === "clover")) {
              chanceTimeTryAgain.style.display = null;
            }
          }

          for (const checkboxButton of chanceTimeGrid.querySelectorAll(".checkbox-button")) {
            const otherCheckbox = checkboxButton.querySelector("input");
            otherCheckbox.disabled = true;

            const otherNestedSpan = checkboxButton.querySelector(".nested");
            const otherSpan = checkboxButton.querySelector("&> span");
            otherSpan.ariaHidden = false;

            if (this.selectedOptions.some(selectedOption => selectedOption === otherNestedSpan.innerHTML)) {
              otherNestedSpan.classList.remove("shrouded");
            } else if (otherNestedSpan.classList.contains("shrouded")) {
              otherSpan.ariaLabel = "Undiscovered Possibility";
            }
          }
        }

        game.saveData();
      };
      optionElement.appendChild(optionCheckbox);

      const loadedOptionIndex = loadedOptions.indexOf(option);

      if (loadedOptionIndex > -1) {
        loadedOptionsCheckboxes.push(optionCheckbox);
        loadedOptions.splice(loadedOptionIndex, 1);
      }

      nestedSpan.innerHTML = option;
      nestedSpan.classList.add("nested");
      nestedSpan.ariaHidden = true;

      if (shroudedFunction(option)) {
        nestedSpan.classList.add("shrouded");
      }

      if (smallIcons) {
        nestedSpan.style.fontSize = "50%";
      }

      optionSpan.role = "img";
      optionSpan.ariaLabel = optionLabel;
      optionSpan.ariaHidden = true;
      optionSpan.appendChild(nestedSpan)
      optionElement.appendChild(optionSpan);

      chanceTimeGrid.appendChild(optionElement);
    }

    const chanceTimeButton = document.getElementById("chance-time-button");
    chanceTimeButton.style.display = "inline-flex";
    chanceTimeButton.focus();
    this.awaitingSelection = true;
    game.updateHeldItemsDisplay();

    for (const checkbox of loadedOptionsCheckboxes) {
      checkbox.click();
    }
  }

  done() {
    const chanceTimeButton = document.getElementById("chance-time-button");
    chanceTimeButton.style.display = null;
    this.awaitingSelection = false;

    this.hide();
    this.callback(this.selectedOptions);

    game.updatePathDisplay()
    game.updateHeldItemsDisplay();
  }

  tryAgain() {
    const cloverIndex = game.player.heldItems.findIndex(heldItem => heldItem.id === "clover");
    game.player.heldItems.splice(cloverIndex, 1);
    game.guidebook.notesMap.get("clover").specialConditions.get("reroll").encountered = true;
    // Will call game.updateHeldItemsDisplay() to disable their buttons
    this.initiate(this.callerId, this.message, this.cols, this.selectionsToMake, this.startingOptions,
        this.callback, this.smallIcons, this.shroudedFunction);
  }

  keepLooking() {
    game.player.loseStamina(1);
    game.guidebook.notesMap.get("shamrock").specialConditions.get("keep-looking").encountered = true;
    this.initiate(this.callerId, this.message, this.cols, this.selectionsToMake, this.startingOptions,
        this.callback, this.smallIcons, this.shroudedFunction);
  }

  updateChanceTimeProgress(hide) {
    const chanceTimeProgress = document.getElementById("chance-time-progress");
    chanceTimeProgress.style.display = hide ? "none" : null;

    if (hide !== true) {
      document.getElementById("chance-time-progress__total").innerText = this.selectedOptions.length;
      document.getElementById("chance-time-progress__goal").innerText = this.selectionsToMake;
    }
  }
}

class HistoryLog {
  log;

  constructor(loadedHistoryLog = {}) {
    this.log = loadedHistoryLog.log ?? [];
  }

  replaceLastLogEntry(message) {
    if (this.log.length) {
      this.log[this.log.length - 1] = message;
    } else {
      this.addLogEntry(message);
    }
  }

  addLogEntry(message) {
    this.log.push(message);
  }

  show() {
    const historyLogList = document.getElementById("history-log-list");
    historyLogList.innerHTML = "";

    for (const logEntry of this.log) {
      const entryListItem = document.createElement("li");
      entryListItem.innerHTML = `<span>${logEntry}</span>`;
      entryListItem.tabIndex = 0;
      historyLogList.appendChild(entryListItem);
    }

    const historyLogDisplay = document.getElementById("history-log-display");
    historyLogDisplay.showModal();

    const historyLogContent = document.getElementById("history-log-content");
    historyLogContent.scrollTop = historyLogContent.scrollHeight;
  }

  hide() {
    const historyLogDisplay = document.getElementById("history-log-display");
    historyLogDisplay.close();
  }
}

class Guidebook {
  notesMap;

  constructor(loadedGuidebook = {}) {
    this.notesMap = new Map(pathOptionsReferenceMap.values().filter(pathOption => pathOption.id !== "blank").map(pathOption => [pathOption.id, {
      encountered: false,
      seen: false,
      ...loadedGuidebook.notesMap?.get(pathOption.id),
      ...pathOption,
      specialConditions: new Map(pathOption.specialConditions ?
          pathOption.specialConditions.map(condition => [condition.id, {
            encountered: false,
            seen: false,
            ...loadedGuidebook.notesMap?.get(pathOption.id)?.specialConditions?.get(condition.id),
            ...condition,
          }])
          : null),
    }]));
  }

  getSortedNotes() {
    return [...this.notesMap.values()].sort((a, b) => {
      if (a.encountered === b.encountered) {
        if (a.seen === b.seen) {
          return b.chance - a.chance;
        }

        if (a.seen) {
          return -1;
        }

        return 1;
      } else if (a.encountered) {
        return -1;
      }

      return 1;
    });
  }

  show() {
    game.everOpenedGuidebook = true;

    // Recreate the entire scroll container just to reset the scroll position, since scrollTo is inconsistent in Safari
    const oldGuidebookContent = document.getElementById("guidebook-content");
    const guidebookContentParent = oldGuidebookContent.parentElement;
    guidebookContentParent.removeChild(oldGuidebookContent);

    // <div id="guidebook-content" class="panel-content"></div>
    const guidebookContent = document.createElement("dl");
    guidebookContent.id = "guidebook-content";
    guidebookContent.ariaLabelledByElements = [document.getElementById("guidebook-title")];
    guidebookContent.classList.add("panel-content");
    guidebookContentParent.appendChild(guidebookContent);

    const sortedNotes = this.getSortedNotes();

    for (const note of sortedNotes) {
      const noteDiv = document.createElement("div");
      noteDiv.tabIndex = 0;
      noteDiv.classList.add("guidebook-note");

      if (note.seen === false && note.encountered === false) {
        noteDiv.classList.add("not-seen");
      }

      const noteName = document.createElement("dt");
      noteName.classList.add("guidebook-note-name");
      const nameObscured = note.encountered === false && note.seen === false && note.chance <= 0;
      noteName.innerHTML = nameObscured ? "???" : note.getFullName();

      if (nameObscured) {
        noteName.role = "img";
        noteName.ariaLabel = "Undiscovered Encounter";
      }

      noteDiv.appendChild(noteName);

      const noteDescription = document.createElement("dd");
      noteDescription.innerHTML = note.encountered ? (note.getDescription ? note.getDescription(true) : note.description) : "???";

      if (!note.encountered) {
        noteDescription.role = "img";
        noteDescription.ariaLabel = "Undiscovered Insights";
      }

      noteDiv.appendChild(noteDescription);

      for (const specialCondition of note.specialConditions.values()) {
        const conditionDescription = document.createElement("dd");
        conditionDescription.innerHTML = specialCondition.encountered ? specialCondition.description : "???";

        if (!specialCondition.encountered) {
          conditionDescription.role = "img";
          conditionDescription.ariaLabel = "Undiscovered Insights";
        }

        noteDiv.appendChild(conditionDescription);
      }

      guidebookContent.appendChild(noteDiv);
    }

    const guidebookDisplay = document.getElementById("guidebook-display");
    guidebookDisplay.showModal();
  }

  hide() {
    const guidebookDisplay = document.getElementById("guidebook-display");
    guidebookDisplay.close();
  }
}

function notifyAchievement(achievement, player) {
  document.getElementById("memories-button").classList.add("notify");
  game.album.memoriesMap.get("memory-maker").checkAchieved(player);

  // Doesn't work if message already updated, and don't want to update again because that would cause a repeated history log entry
  // player.actionMessage += `${player.actionMessage.length ? "\n\n" : ""}Made a special memory: ${achievement.name}!`;

  announceForScreenReader(`Made a special memory: ${achievement.name}!`);
}

// Keep divisible by 6 so that you always have a full row at the end
const achievements = [
  {
    id: "bonus-bag",
    emojiHint: "📦👜",
    difficulty: 2,
    name: "Bonus Bag",
    imageName: "bonus-bag.jpg",
    imageAlt: "Photo of a woven bag hanging from a fence, a little beat up but still functional",
    description: "Found a nice extra bag to use",
    achieved: false,
    checkAchieved(player) {
      if (this.achieved === false) {
        this.achieved = true;
        notifyAchievement(this, player);

        return true;
      }

      return false;
    },
  },
  {
    id: "berry-bonanza",
    emojiHint: `${BERRY_EMOJI}${BERRY_EMOJI}${BERRY_EMOJI}${BERRY_EMOJI}${BERRY_EMOJI}${BERRY_EMOJI}`,
    difficulty: 2,
    name: "Berry Bonanza",
    imageName: "berry-bonanza.jpg",
    imageAlt: "Photo of a cluster of bright blue berries growing on a branch, ripe and ready to eat",
    description: "Ate my fill of berries",
    achieved: false,
    checkAchieved(player) {
      if (this.achieved === false) {
        if (player.berryStreak === 0) {
          this.achieved = true;
          game.guidebook.notesMap.get("berry").specialConditions.get("fill").encountered = true;
          notifyAchievement(this, player);

          return true;
        }
      }

      return false;
    },
  },
  {
    id: "hoarder-of-fortune",
    emojiHint: `🍀🍀🍀🍀`,
    difficulty: 4,
    name: "Hoarder of Fortune",
    imageName: "hoarder-of-fortune.jpg",
    imageAlt: "Photo of a patch of bright green clovers growing on an old, mossy tree trunk",
    description: "Held 4 lucky clovers at once",
    achieved: false,
    checkAchieved(player) {
      if (this.achieved === false) {
        if (player.heldItems.filter(item => item.id === "clover").length >= 4) {
          this.achieved = true;
          notifyAchievement(this, player);

          return true;
        }
      }

      return false;
    },
  },
  {
    id: "fruitful-finesse",
    emojiHint: `🍊🍊🍊`,
    difficulty: 3,
    name: "Fruitful Finesse",
    imageName: "fruitful-finesse.jpg",
    imageAlt: "Photo of a few citrus fruits, bright orange, with one pealed and ready for eating",
    description: "Successfully juggled some fruit",
    achieved: false,
    checkAchieved(player) {
      if (this.achieved === false) {
        this.achieved = true;
        notifyAchievement(this, player);

        return true;
      }

      return false;
    },
  },
  // Note that this assumes nuts will be the only way to raise max stamina
  {
    id: "nut-nut",
    emojiHint: "🌰🌰🌰🌰🌰",
    difficulty: 2,
    name: "Nut Nut",
    imageName: "nut-nut.jpg",
    imageAlt: "Photo of a couple of growing tree nuts surrounded by bright green leaves, basking in sunlight",
    description: "Ate enough nuts to raise my max stamina to 25",
    achieved: false,
    checkAchieved(player) {
      if (this.achieved === false) {
        if (player.maxStamina >= 25) {
          this.achieved = true;
          notifyAchievement(this, player);

          return true;
        }
      }

      return false;
    },
  },
  {
    id: "super-nut-nut",
    emojiHint: "🌰🌰🌰🌰🌰🌰🌰🌰🌰🌰",
    difficulty: 4,
    name: "Super Nut Nut",
    imageName: "super-nut-nut.jpg",
    imageAlt: "Photo of multiple growing tree nuts hanging from branches, surrounded by green leaves in sun",
    description: "Ate enough nuts to raise my max stamina to 30",
    achieved: false,
    checkAchieved(player) {
      if (this.achieved === false) {
        if (player.maxStamina >= 30) {
          this.achieved = true;
          notifyAchievement(this, player);

          return true;
        }
      }

      return false;
    },
  },
  {
    id: "bird-feeder",
    emojiHint: `🐦${BERRY_EMOJI}🌰${DARK_BIRD_EMOJI}`,
    difficulty: 1,
    name: "Bird Feeder",
    imageName: "bird-feeder.jpg",
    imageAlt: "Photo of a tan-colored crested bird with a ripe red berry in its mouth",
    description: "Got to feed a bird",
    achieved: false,
    checkAchieved(player) {
      if (this.achieved === false) {
        this.achieved = true;
        notifyAchievement(this, player);

        return true;
      }

      return false;
    },
  },
  {
    id: "special-sighting",
    emojiHint: "🐾🐾🐾💗",
    difficulty: 2,
    name: "Special Sighting",
    imageName: "special-sighting.jpg",
    imageAlt: "Photo of a fluffy white rabbit sitting on a lush green forest floor",
    description: "Spotted a bunny by following all of its tracks",
    achieved: false,
    checkAchieved(player) {
      if (this.achieved === false) {
        this.achieved = true;
        notifyAchievement(this, player);

        return true;
      }

      return false;
    },
  },
  {
    id: "insatiable-curiosity",
    emojiHint: "🐾🤢",
    difficulty: 1,
    name: "Insatiable Curiosity",
    imageName: "insatiable-curiosity.jpg",
    imageAlt: "Photo of a painted model poop emoji placed on the ground, giving a great big smile",
    description: "Just couldn't help myself",
    achieved: false,
    checkAchieved(player) {
      if (this.achieved === false) {
        this.achieved = true;
        notifyAchievement(this, player);

        return true;
      }

      return false;
    },
  },
  {
    id: "wild-remedy",
    emojiHint: "🤢💗😊",
    difficulty: 4,
    name: "Wild Remedy",
    imageName: "wild-remedy.jpg",
    imageAlt: "Photo of a small, red-breasted bird perched on a branch, surrounded with soft, warm light",
    description: "Recovered from queasiness by having an exciting encounter",
    achieved: false,
    checkAchieved(player) {
      if (this.achieved === false) {
        this.achieved = true;
        notifyAchievement(this, player);

        return true;
      }

      return false;
    },
  },
  {
    id: "rock-collector",
    emojiHint: `${ROCK_EMOJI}${ROCK_EMOJI}${ROCK_EMOJI}`,
    difficulty: 3,
    name: "Rock Collector",
    imageName: "rock-collector.jpg",
    imageAlt: "Photo of a small tower of rocks in the woods, carefully stacked upon a much larger rock",
    description: "Held 3 rocks at once",
    achieved: false,
    checkAchieved(player) {
      if (this.achieved === false) {
        if (player.heldItems.filter(item => item.id === "rock").length >= 3) {
          this.achieved = true;
          notifyAchievement(this, player);

          return true;
        }
      }

      return false;
    },
  },
  {
    id: "rock-maniac",
    emojiHint: `${ROCK_EMOJI}${ROCK_EMOJI}${ROCK_EMOJI}${ROCK_EMOJI}`,
    difficulty: 5,
    name: "Rock Maniac",
    imageName: "rock-maniac.jpg",
    imageAlt: "Photo of a collection of rocks on a mossy stump, with some neatly stacked into a small tower",
    description: "Held 4 rocks at once",
    achieved: false,
    checkAchieved(player) {
      if (this.achieved === false) {
        if (player.heldItems.filter(item => item.id === "rock").length >= 4) {
          this.achieved = true;
          notifyAchievement(this, player);

          return true;
        }
      }

      return false;
    },
  },
  {
    id: "good-samaritan",
    emojiHint: "🍾🍬🍾🍬🍾🍬🚮",
    difficulty: 3,
    name: "Good Samaritan",
    imageName: "good-samaritan.jpg",
    imageAlt: "Photo of a clean, picturesque forest with tall trees bathed in warm sunlight",
    description: "Disposed of 6+ pieces of trash properly and made the woods a little cleaner",
    achieved: false,
    checkAchieved(player) {
      if (this.achieved === false) {
        const wrapperModifier = game.pathOptionsMap.get("wrapper").negativeModifier;
        const bottleModifier = game.pathOptionsMap.get("bottle").negativeModifier;

        if (wrapperModifier + bottleModifier >= 6) {
          this.achieved = true;
          notifyAchievement(this, player);

          return true;
        }
      }

      return false;
    },
  },
  {
    id: "bug-banisher",
    emojiHint: `${ROCK_EMOJI}${CREEPY_CRAWLY_EMOJI}${ROCK_EMOJI}🦟${ROCK_EMOJI}${CREEPY_CRAWLY_EMOJI}`,
    difficulty: 4,
    name: "Bug Banisher",
    imageName: "bug-banisher.jpg",
    imageAlt: "Photo of peaceful forest clearing surrounded by tall trees and a bright sun peaking through from above",
    description: "Shooed 3 bugs away and made the woods a little more pleasant",
    achieved: false,
    checkAchieved(player) {
      if (this.achieved === false) {
        const roachModifier = game.pathOptionsMap.get("roach").negativeModifier;
        const mosquitoModifier = game.pathOptionsMap.get("mosquito").negativeModifier;

        if (roachModifier + mosquitoModifier >= 3) {
          this.achieved = true;
          notifyAchievement(this, player);

          return true;
        }
      }

      return false;
    },
  },
  {
    id: "flower-finder",
    emojiHint: `🌹${PURPLE_FLOWER_EMOJI}🌷🌼`,
    difficulty: 1,
    name: "Flower Finder",
    imageName: "flower-finder.jpg",
    imageAlt: "Photo of a colorful variety of different wildflowers all growing together",
    description: "Held all flower types at once",
    achieved: false,
    checkAchieved(player) {
      if (this.achieved === false) {
        let heldFlowerTypes = new Set(player.heldItems.filter(item => item.tags.includes("flower")).map(flower => flower.id));
        const bouquetFlowers = player.heldItems.filter(item => item.id === "bouquet").map(bouquet => bouquet.flowers).flat();

        for (const bouquetFlower of bouquetFlowers) {
          heldFlowerTypes.add(bouquetFlower);
        }

        const totalPossibleFlowerTypes = pathOptions.filter(item => item.tags.includes("flower")).length;

        if (heldFlowerTypes.size >= totalPossibleFlowerTypes) {
          this.achieved = true;
          notifyAchievement(this, player);

          return true;
        }
      }

      return false;
    },
  },
  {
    id: "balanced-bouquet",
    emojiHint: `💐🌹${PURPLE_FLOWER_EMOJI}🌷🌼`,
    difficulty: 2,
    name: "Balanced Bouquet",
    imageName: "balanced-bouquet.jpg",
    imageAlt: "Photo of a colorful variety of different flowers gathered into a bouquet",
    description: "Made a bouquet out of the same number of every flower type",
    achieved: false,
    checkAchieved(player) {
      if (this.achieved === false) {
        const heldBouquets = player.heldItems.filter(item => item.id === "bouquet");
        const possibleFlowerTypes = pathOptions.filter(item => item.tags.includes("flower"));

        for (const bouquet of heldBouquets) {
          const bouquetFlowerTypes = new Set(bouquet.flowers);

          if (bouquetFlowerTypes.size === possibleFlowerTypes.length
              && bouquet.flowers.length % bouquetFlowerTypes.size === 0) {
            const flowersPerType = bouquet.flowers.length / bouquetFlowerTypes.size;
            let bouquetAchieves = true;

            for (const flowerType of possibleFlowerTypes) {
              if (bouquet.flowers.filter(flowerId => flowerId === flowerType.id).length !== flowersPerType) {
                bouquetAchieves = false;
                break;
              }
            }

            if (bouquetAchieves) {
              this.achieved = true;
              notifyAchievement(this, player);

              return true;
            }
          }
        }
      }

      return false;
    },
  },
  {
    id: "favorite-flower",
    emojiHint: `💐${PURPLE_FLOWER_EMOJI}${PURPLE_FLOWER_EMOJI}${PURPLE_FLOWER_EMOJI}`,
    difficulty: 3,
    name: "Favorite Flower",
    imageName: "favorite-flower.jpg",
    imageAlt: "Photo of a small bunch of vivid purple-blue flowers gathered into a bouquet",
    description: "Made a bouquet of 3 or more of the all the same flower type",
    achieved: false,
    checkAchieved(player) {
      if (this.achieved === false) {
        const heldBouquets = player.heldItems.filter(item => item.id === "bouquet");

        for (const bouquet of heldBouquets) {
          const bouquetFlowerTypes = new Set(bouquet.flowers);

          if (bouquet.flowers.length >= 3 && bouquetFlowerTypes.size === 1) {
            this.achieved = true;
            notifyAchievement(this, player);

            return true;
          }
        }
      }

      return false;
    },
  },
  {
    id: "fixated-florist",
    emojiHint: "💐🌼🌼🌼🌼🌼",
    difficulty: 5,
    name: "Fixated Florist",
    imageName: "fixated-florist.jpg",
    imageAlt: "Photo of a large bunch of flowers with white petals and yellow centers",
    description: "Made a bouquet of 5 or more of the all the same flower type",
    achieved: false,
    checkAchieved(player) {
      if (this.achieved === false) {
        const heldBouquets = player.heldItems.filter(item => item.id === "bouquet");

        for (const bouquet of heldBouquets) {
          const bouquetFlowerTypes = new Set(bouquet.flowers);

          if (bouquet.flowers.length >= 5 && bouquetFlowerTypes.size === 1) {
            this.achieved = true;
            notifyAchievement(this, player);

            return true;
          }
        }
      }

      return false;
    },
  },
  {
    id: "flower-power",
    emojiHint: `🌹🌹${PURPLE_FLOWER_EMOJI}🌷${PURPLE_FLOWER_EMOJI}🌼🌹`,
    difficulty: 3,
    name: "Flower Power",
    imageName: "flower-power.jpg",
    imageAlt: "Photo of a basket of flowers in a variety of types and colors, with a big yellow one in the center",
    description: "Held a total of 7 flowers at once",
    achieved: false,
    checkAchieved(player) {
      if (this.achieved === false) {
        const heldFlowerIds = player.heldItems.filter(item => item.tags.includes("flower")).map(flower => flower.id);
        const bouquetFlowerIds = player.heldItems.filter(item => item.id === "bouquet").map(bouquet => bouquet.flowers).flat();

        const totalFlowers = heldFlowerIds.length + bouquetFlowerIds.length;

        if (totalFlowers >= 7) {
          this.achieved = true;
          notifyAchievement(this, player);

          return true;
        }
      }

      return false;
    },
  },
  {
    id: "flower-frenzy",
    emojiHint: `🌹🌹${PURPLE_FLOWER_EMOJI}🌷${PURPLE_FLOWER_EMOJI}🌼🌹🌼🌼🌷${PURPLE_FLOWER_EMOJI}`,
    difficulty: 5,
    name: "Flower Frenzy",
    imageName: "flower-frenzy.jpg",
    imageAlt: "Photo of a large bag of gathered flowers of different types and colors",
    description: "Held a total of 11 flowers at once",
    achieved: false,
    checkAchieved(player) {
      if (this.achieved === false) {
        const heldFlowerIds = player.heldItems.filter(item => item.tags.includes("flower")).map(flower => flower.id);
        const bouquetFlowerIds = player.heldItems.filter(item => item.id === "bouquet").map(bouquet => bouquet.flowers).flat();

        const totalFlowers = heldFlowerIds.length + bouquetFlowerIds.length;

        if (totalFlowers >= 11) {
          this.achieved = true;
          notifyAchievement(this, player);

          return true;
        }
      }

      return false;
    },
  },
  {
    id: "trusty-trader",
    emojiHint: `📰${TRADING_POST_EMOJI}`,
    difficulty: 2,
    name: "Trusty Trader",
    imageName: "trusty-trader.jpg",
    imageAlt: "Photo of person in silhouette kneeling down before a small body of water in the woods, covered in fog",
    description: "Successfully completed a trade",
    achieved: false,
    checkAchieved(player) {
      if (this.achieved === false) {
        this.achieved = true;
        notifyAchievement(this, player);

        return true;
      }

      return false;
    },
  },
  {
    id: "memory-maker",
    emojiHint: `📷📷📷📷📷📷📷📷`,
    difficulty: 5,
    name: "Memory Maker",
    imageName: "memory-maker.jpg",
    imageAlt: "Photo of a mountainous, forested area from a high vantage point, under a cloudy, breathtaking sky",
    description: "Made 8+ special memories",
    achieved: false,
    checkAchieved(player) {
      if (this.achieved === false) {
        if (game.album.getAchievedMemories().length >= 8) {
          this.achieved = true;
          notifyAchievement(this, player);
          return true;
        }
      }

      return false;
    },
  },
];

const supplementalEmojiLabels = {
  "💗": "Heart",
  "📷": "Camera",
  "❌": "Miss",
  "😊": "Joyous Face",
  "🤢": "Queasy Face",
  "😖": "Disgusted Face",
  "😰": "Drained Face",
  "🥵": "Exhausted Face",
  "😐": "Tired Face",
  "🙂": "Smiling Face",
  "😩": "Done Face",
}

class Album {
  memoriesMap;

  constructor(loadedAlbum = {}) {
    this.memoriesMap = new Map(achievements.map(achievement => {
      return [achievement.id, {...achievement, ...loadedAlbum.memoriesMap?.get(achievement.id)}];
    }));
  }

  getAchievedMemories() {
    return [...this.memoriesMap.values()].filter(achievement => achievement.achieved);
  }

  getSortedMemories() {
    return [...this.memoriesMap.values()].sort((a, b) => {
      if (a.achieved === b.achieved) {
        return a.difficulty - b.difficulty;
      } else if (a.achieved) {
        return -1;
      }

      return 1;
    });
  }

  show() {
    game.everOpenedAlbum = true;

    const memoriesButton = document.getElementById("memories-button");
    memoriesButton.classList.remove("notify");

    // Recreate the entire scroll container just to reset the scroll position, since scrollTo is inconsistent in Safari
    const oldAlbumContent = document.getElementById("album-content");
    const albumContentParent = oldAlbumContent.parentElement;
    albumContentParent.removeChild(oldAlbumContent);

    // <div id="album-content" class="panel-content"></div>
    const albumContent = document.createElement("dl");
    albumContent.id = "album-content";
    albumContent.ariaLabelledByElements = [document.getElementById("album-title")];
    albumContent.classList.add("panel-content");
    albumContentParent.appendChild(albumContent);

    const sortedMemories = this.getSortedMemories();

    for (const memory of sortedMemories) {
      const memoryDiv = document.createElement("div");
      memoryDiv.tabIndex = 0;
      memoryDiv.classList.add("album-memory");

      if (memory.achieved === false) {
        memoryDiv.classList.add("not-achieved");
      }

      const memoryHeader = document.createElement("dt");
      memoryHeader.classList.add("album-memory__header");
      memoryDiv.appendChild(memoryHeader);

      const memoryText = document.createElement("span");
      memoryText.innerHTML = memory.name;
      memoryHeader.appendChild(memoryText);

      const difficultyRating = document.createElement("span");
      difficultyRating.innerHTML = "⭐".repeat(memory.difficulty);
      difficultyRating.role = "img";
      difficultyRating.ariaLabel = `${memory.difficulty} star${memory.difficulty === 1 ? "" : "s"}`;
      memoryHeader.appendChild(difficultyRating);

      const memoryDescription = document.createElement("dd");
      memoryDescription.classList.add("album-memory__description");
      memoryDescription.innerHTML = memory.achieved ? memory.description : "???";

      if (!memory.achieved) {
        memoryDescription.ariaHidden = true;
      }

      memoryDiv.appendChild(memoryDescription);

      const memoryContent = document.createElement("div");
      memoryContent.classList.add("album-memory__content");
      const hintToUnlockText = `Hint to unlock: ${splitEmojiString(memory.emojiHint).map(emoji => {
        return pathOptionsEmojiMap.get(emoji)?.name ?? supplementalEmojiLabels[emoji] ?? emoji;
      }).join(", ")}.`;

      if (memory.achieved && memory.imageName) {
        const memoryImage = document.createElement("img");
        memoryImage.src = `images/memories/${memory.imageName}`;
        memoryImage.alt = memory.imageAlt;
        memoryImage.draggable = false;
        memoryContent.appendChild(memoryImage);
      } else {
        const memoryHint = document.createElement("dd");
        memoryHint.innerHTML = memory.emojiHint;
        memoryHint.role = "img";
        memoryHint.ariaLabel = hintToUnlockText;
        memoryContent.appendChild(memoryHint);
      }

      memoryDiv.appendChild(memoryContent);
      memoryDiv.role = "img";
      // memoryDiv.ariaLabel = `${memory.name}.`;
      memoryDiv.ariaDescription =
          `${memory.name}. ${difficultyRating.ariaLabel}.${memory.achieved ? ` ${memory.description}.` : ''}${memory.achieved && memory.imageName ? ` ${memory.imageAlt}` : ` ${hintToUnlockText}`}`;

      albumContent.appendChild(memoryDiv);
    }

    const albumDisplay = document.getElementById("album-display");
    albumDisplay.showModal();
  }

  hide() {
    const albumDisplay = document.getElementById("album-display");
    albumDisplay.close();
  }
}

class Player {
  maxStamina;
  stamina;
  capacity;
  heldItems;
  environment;
  actionMessage;
  berryStreak;
  queasyCounter;
  trackCounter;
  trackPathLength;

  constructor(loadedPlayer = {}) {
    this.maxStamina = loadedPlayer.maxStamina ?? 20;
    this.stamina = loadedPlayer.stamina ?? this.maxStamina;
    this.capacity = loadedPlayer.capacity ?? 6;
    this.heldItems = this.loadHeldItems(loadedPlayer.heldItems ?? []);
    this.environment = loadedPlayer.environment ?? null;
    this.actionMessage = loadedPlayer.actionMessage ?? "";
    this.berryStreak = loadedPlayer.berryStreak ?? 0;
    this.queasyCounter = loadedPlayer.queasyCounter ?? 0;
    this.trackCounter = loadedPlayer.trackCounter ?? 0;
    this.trackPathLength = loadedPlayer.trackPathLength ?? 0;
  }

  loadHeldItems(heldItemsData) {
    return heldItemsData.map(heldItemData => {
      const heldItemTemplate = pathOptionsReferenceMap.get(heldItemData.id);
      return {
        ...heldItemTemplate,
        ...heldItemData,
      }
    });
  }

  getHeldItemsCapacityWeight() {
    return this.heldItems.reduce((totalWeight, heldItem) => totalWeight + (heldItem.capacityWeight ?? 1), 0);
  }

  setQueasyCounter(queasyCounter) {
    this.queasyCounter = queasyCounter;
    updateCssVar('--queasy-count-dashes', `"${'_ '.repeat(this.queasyCounter).trim()}"`);
    updateCssVar('--queasy-count-alt', this.queasyCounter ? `"Queasy for ${this.queasyCounter} more step${this.queasyCounter === 1 ? "" : "s"}"` : `""`);
  }

  gainMaxStamina(amount) {
    this.maxStamina += amount;
    game.updateStaminaDisplay();

    game.album.memoriesMap.get("nut-nut").checkAchieved(this);
    game.album.memoriesMap.get("super-nut-nut").checkAchieved(this);
  }

  loseMaxStamina(amount) {
    this.maxStamina -= amount;
    this.stamina = Math.min(this.stamina, this.maxStamina);
    game.updateStaminaDisplay();

    if (this.stamina <= 0) {
      game.gameOver();
    }
  }

  recoverStamina(amount) {
    this.stamina = Math.min(this.stamina + amount, this.maxStamina);
    game.updateStaminaDisplay();
  }

  loseStamina(amount) {
    this.stamina = Math.max(this.stamina - amount, 0);
    game.updateStaminaDisplay();

    if (this.stamina <= 0) {
      game.gameOver();
    }
  }

  selectPathOption(pathOptionId) {
    // If passing a trading post, determine the next trade
    if (this.environment === "trading-post") {
      game.determineNextTrade();
    }

    this.environment = null;
    this.actionMessage = "";

    announceForScreenReader('Took a step.');

    this.encounterPathOptionById(pathOptionId);

    game.takePathStep();
  }

  encounterPathOptionById(optionId) {
    this.encounterPathOption(deepCopy(pathOptionsReferenceMap.get(optionId)));
  }

  encounterPathOption(option) {
    if (option.id === "blank") {
      return;
    }

    if (option.tags.includes("environment")) {
      this.environment = option.id;
    }

    // Returns true if replacing default behavior
    if (option.onPick == null || !option.onPick(this)) {
      this.heldItems.push(option);
    }

    game.guidebook.notesMap.get(option.id).encountered = true;
  }

  disposeItem(heldItemIndex) {
    const heldItem = this.heldItems.splice(heldItemIndex, 1)[0];
    this.actionMessage = `Tossed the <span class="no-wrap">${wrapInBadge(heldItem.getFullName())}!</span>`;

    // Returns true if replacing default behavior
    if (heldItem.onDispose == null || !heldItem.onDispose(this)) {
      this.loseStamina(1);
    }

    game.updatePathDisplay();
    game.updateMessagesDisplay();
    game.updateHeldItemsDisplay();
  }

  consumeItem(heldItemIndex) {
    const heldItem = this.heldItems[heldItemIndex];

    if (heldItem.tags.includes("consumable") && this.queasyCounter > 0) {
      this.actionMessage = `I feel too queasy to eat anything.  I need to walk it off for ${this.queasyCounter} more step${this.queasyCounter !== 1 ? "s" : ""}.`;
      game.updateMessagesDisplay();
      return;
    }

    // Returns true if consume succeeded
    if (heldItem.onConsume && heldItem.onConsume(this)) {
      this.heldItems.splice(this.heldItems.indexOf(heldItem), 1);

      if (heldItem.tags.includes("consumable") && heldItem.id !== "berry") {
        this.berryStreak = 0;
      }

      game.updatePathDisplay();
      game.updateMessagesDisplay();
      game.updateHeldItemsDisplay();
    } else {
      game.updateMessagesDisplay();
    }
  }
}

class Game {
  pathOptionsMap;
  player;
  album;
  historyLog;
  guidebook;
  chanceTime;
  gameActive;
  pathDeck;
  pathStepOptions;
  pathSize;
  pathVisibility;
  stepCount;
  iterationsCount;
  nextTradeRequestId;
  nextTradeOfferId;
  scrollModeManual;
  everOpenedGuidebook;
  everOpenedAlbum;

  constructor(loadedGame = {}) {
    this.pathOptionsMap = new Map(pathOptions.map(pathOption => {
      return [pathOption.id, {...deepCopy(pathOption), ...(loadedGame?.gameActive ? loadedGame.pathOptionsMap?.get(pathOption.id) : [])}];
    }));
    this.player = new Player(loadedGame.player);
    this.album = new Album(loadedGame.album);
    this.historyLog = new HistoryLog(loadedGame.historyLog);
    this.guidebook = new Guidebook(loadedGame.guidebook);
    this.chanceTime = new ChanceTime(loadedGame.chanceTime);
    this.gameActive = loadedGame.gameActive ?? false;
    this.pathDeck = loadedGame.pathDeck ?? [];
    this.pathStepOptions = loadedGame.pathStepOptions ?? [];
    this.pathSize = loadedGame.pathSize ?? 3;
    this.pathVisibility = loadedGame.pathVisibility ?? 3;
    this.iterationsCount = loadedGame.iterationsCount ?? 0;
    this.stepCount = loadedGame.stepCount ?? 0;
    this.scrollModeManual = loadedGame.scrollModeManual ?? false;
    this.everOpenedGuidebook = loadedGame.everOpenedGuidebook ?? false;
    this.everOpenedAlbum = loadedGame.everOpenedAlbum ?? false;
    this.nextTradeRequestId = loadedGame.nextTradeRequestId;
    this.nextTradeOfferId = loadedGame.nextTradeOfferId;
  }

  saveData() {
    if (localStorageAvailable()) {
      localStorage.setItem("game", JSON.stringify(this, (_key, value) => {
        if (value instanceof Map) {
          return {
            dataType: 'Map',
            value: Array.from(value.entries()),
          };
        } else {
          return value;
        }
      }));
    }
  }

  startGame() {
    // TODO - album needs to reset so long as it's used for assessing the hike, but would be nice for it to persist...
    this.album = new Album();
    this.historyLog = new HistoryLog();

    this.pathOptionsMap = new Map(pathOptions.map(pathOption => [pathOption.id, deepCopy(pathOption)]));

    this.player = new Player();
    this.player.encounterPathOptionById("lunch");
    this.player.encounterPathOptionById("snackbar");

    this.gameActive = true;
    this.pathDeck = [];
    this.pathStepOptions = [];

    this.pathSize = 3;
    updateCssVar('--path-size', 3);

    this.pathVisibility = 3;
    updateCssVar('--path-visibility', 3);

    this.determineNextTrade();

    for (const pathOption of this.pathOptionsMap.values()) {
      pathOption.negativeModifier = 0;
      pathOption.positiveModifier = 0;
    }

    this.iterationsCount = 0;
    this.stepCount = 0;
    this.addToPathDeck();

    for (let i = 0; i < this.pathVisibility; i++) {
      this.addToPathStepOptions();
    }

    this.player.actionMessage = 'Time to take a hike!  <span class="no-wrap" role="img" aria-label="Smiley face">:)</span>';

    this.updateDisplaysForStartOrLoad();
  }

  updateDisplaysForStartOrLoad(forLoad = false) {
    updateCssVar('--path-size', 3);
    updateCssVar('--path-visibility', 3);

    this.updateMessagesDisplay(forLoad);
    this.updatePathDisplay();
    this.updateHeldItemsDisplay();
    this.updateStaminaDisplay();

    const titleScreen = document.getElementById('title-screen');
    titleScreen.style.display = "none";

    const hikeWrapper = document.getElementById('hike-wrapper');
    hikeWrapper.style.display = "flex";

    document.body.scrollTop = 0;

    const restartButton = document.getElementById('restart-button');
    restartButton.style.display = "none";

    const endButtonWrapper = document.getElementById('end-button-wrapper');
    endButtonWrapper.style.display = null;

    const messagesDisplay = document.getElementById('messages');
    messagesDisplay.focus();

    document.getElementById('scroll-mode-checkbox').checked = this.scrollModeManual;

    if (forLoad) {
      this.player.setQueasyCounter(this.player.queasyCounter);

      if (this.chanceTime.awaitingSelection) {
        this.chanceTime.initiate(
          this.chanceTime.callerId,
          this.chanceTime.message,
          this.chanceTime.cols,
          this.chanceTime.selectionsToMake,
          this.chanceTime.startingOptions,
          this.chanceTime.callback.bind(this.pathOptionsMap.get(this.chanceTime.callerId)),
          this.chanceTime.smallIcons,
          this.chanceTime.shroudedFunction.bind(this.pathOptionsMap.get(this.chanceTime.callerId)),
          true,
        );
      }
    }
  }

  gameOver() {
    if (this.gameActive) {
      this.updateMessagesDisplay(false, true);
      this.gameActive = false;
      this.updatePathDisplay();
      this.updateHeldItemsDisplay();

      const restartButton = document.getElementById('restart-button');
      restartButton.style.display = null;

      const endButtonWrapper = document.getElementById('end-button-wrapper');
      endButtonWrapper.style.display = "none";
    }
  }

  determineNextTrade() {
    this.nextTradeRequestId = randomDraw(tradeRequests, false).id;
    this.nextTradeOfferId = randomDraw(tradeOffers, false).id;
  }

  tradeItems() {
    const tradeRequest = tradeRequestsMap.get(this.nextTradeRequestId);
    const tradeOffer = tradeOffersMap.get(this.nextTradeOfferId);

    const originalHeldItems = [...this.player.heldItems];
    let tradedWrapperCount = 0;
    let tradedBottleCount = 0;

    for (const requestedItemId of tradeRequest.items) {
      // Use last index to trade away the least-peeled fruit
      const heldItemIndex = this.player.heldItems.findLastIndex(heldItem => heldItem.id === requestedItemId);

      if (heldItemIndex === -1) {
        this.player.heldItems = originalHeldItems;
        this.player.actionMessage = "I don't have all the requested items for the trade, unfortunately.";
        this.updateMessagesDisplay();
        return;
      }

      const heldItem = this.player.heldItems[heldItemIndex];

      if (heldItem.id === "wrapper") {
        tradedWrapperCount++;
      } else if (heldItem.id === "bottle") {
        tradedBottleCount++;
      }

      this.player.heldItems.splice(heldItemIndex, 1);
    }

    for (let i = 0; i < tradedWrapperCount; i++) {
      this.pathOptionsMap.get("wrapper").negativeModifier++;
      this.pathOptionsMap.get("blank").positiveModifier++;
    }

    for (let i = 0; i < tradedBottleCount; i++) {
      this.pathOptionsMap.get("bottle").negativeModifier++;
      this.pathOptionsMap.get("blank").positiveModifier++;
    }

    game.album.memoriesMap.get("good-samaritan").checkAchieved(this.player);

    for (const offeredItemId of tradeOffer.items) {
      this.player.encounterPathOptionById(offeredItemId);
    }

    this.player.actionMessage =
        `Traded ${wrapInBadge(tradeRequest.getEmojisMarkup())} for <span class="no-wrap">${wrapInBadge(tradeOffer.getEmojisMarkup())}!</span>`;
    this.player.environment = null;

    this.album.memoriesMap.get("trusty-trader").checkAchieved(this.player);

    this.determineNextTrade();
    this.updateHeldItemsDisplay();
    this.updateMessagesDisplay();
  }

  updateStaminaDisplay() {
    this.saveData();

    const staminaCountDisplay = document.getElementById('stamina-count');
    const staminaStatus = document.getElementById('stamina-status');
    staminaCountDisplay.innerText = `${this.player.stamina}/${this.player.maxStamina}`;

    if (this.player.queasyCounter > 0) {
      staminaStatus.classList.add('queasy');
    } else {
      staminaStatus.classList.remove('queasy');
    }

    if (this.player.stamina === 0) {
      staminaCountDisplay.classList.add('low');
      staminaStatus.innerHTML = getEmojiMarkup('😩', true);
    } else if (this.player.stamina <= 5) {
      staminaCountDisplay.classList.add('low');
      staminaStatus.innerHTML = getEmojiMarkup(this.player.queasyCounter > 0 ? '🤢' : '🥵', true); // 😰
    } else {
      staminaCountDisplay.classList.remove('low');

      if (this.player.queasyCounter > 0) {
        staminaStatus.innerHTML = getEmojiMarkup('🤢', true);
      } else if (this.player.stamina <= 10) {
        staminaStatus.innerHTML = getEmojiMarkup('😐', true); // 😐🫤😓
      } else if (this.player.stamina <= 15) {
        staminaStatus.innerHTML = getEmojiMarkup('🙂', true);
      } else {
        staminaStatus.innerHTML = getEmojiMarkup('😊', true);
      }
    }
  }

  updateMessagesDisplay(replaceLastLogEntry = false, gameOver = false) {
    if (!this.gameActive) {
      return;
    }

    this.saveData();

    const endButtonWrapper = document.getElementById('end-button-wrapper');
    endButtonWrapper.classList.remove('confirm');

    const messagesDisplay = document.getElementById('messages');

    if (gameOver) {
      let totalFlowers = this.player.heldItems.filter(item => item.tags.includes("flower")).length;
      const bouquets = this.player.heldItems.filter(item => item.id === "bouquet");
      totalFlowers = bouquets.reduce((total, bouquet) => total + bouquet.flowers.length, totalFlowers);

      const achievedMemories = game.album.getAchievedMemories();
      const totalAchievementDifficulty = achievedMemories.reduce((total, memory) => total + memory.difficulty, 0);
      const starsMessage = totalAchievementDifficulty === 0 ? "" : `\n<span role="img" aria-label="${
          totalAchievementDifficulty} star${totalAchievementDifficulty === 1 ? "" : "s"} in all.">${
          "⭐".repeat(totalAchievementDifficulty).split("⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐").map(tenStars => tenStars.length ? tenStars : "⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐").join("\n")
      }</span>`;

      let didNotOpenMessage = "";

      if (game.everOpenedGuidebook === false) {
        if (game.everOpenedAlbum === false) {
          didNotOpenMessage = `<p>I should really take a look at that ${wrapInBadge("📷 Memories")} album,\nand it might be worth using the ${
              wrapInBadge("📒 Guidebook")} next time, too.</p>`;
        } else {
          didNotOpenMessage = `<p>It might be worth using the ${wrapInBadge("📒 Guidebook")} next time.</p>`;
        }
      } else if (game.everOpenedAlbum === false) {
        didNotOpenMessage = `<p>I should really take a look at that ${wrapInBadge("📷 Memories")} album.</p>`;
      }

      let finalMessage = 'That was a nice hike.  <span class="no-wrap" role="img" aria-label="Smiley face">:)</span>';

      if (totalAchievementDifficulty <= 5) {
        finalMessage = "I didn't do much of note.  There's still more to try!";
      } else if (totalAchievementDifficulty >= 15) {
        finalMessage = `Wow, that was a hike to remember!  <span class="no-wrap" role="img" aria-label="Elated face">:D</span>`;
      } else if (this.iterationsCount < 2) {
        finalMessage = "I didn't walk very far.  There's still more to see!";
      }

      messagesDisplay.innerHTML = `<p>I'm beat.  Time to go home.</p><p>I took a total of ${this.stepCount} step${this.stepCount !== 1 ? "s" : ""} and made ${
          achievedMemories.length} special memor${achievedMemories.length !== 1 ? "ies" : "y"}.${starsMessage}</p><p>${finalMessage}</p>${didNotOpenMessage}`;
    } else {
      const messages = [];

      if (this.player.actionMessage) {
        messages.push(this.player.actionMessage);
      }

      if (this.player.environment && this.chanceTime.awaitingSelection !== true) {
        const environmentOption = this.pathOptionsMap.get(this.player.environment);

        if (environmentOption) {
          messages.push(environmentOption.getDescription ? environmentOption.getDescription() : environmentOption.description);
        }
      }

      if (this.player.getHeldItemsCapacityWeight() > this.player.capacity && this.chanceTime.awaitingSelection !== true) {
        messages.push("I have too many things to carry with me.")
      }

      messagesDisplay.innerHTML = messages.map(message => `<p>${message}</p>`).join('');
    }

    if (messagesDisplay.innerHTML.length) {
      if (replaceLastLogEntry) {
        this.historyLog.replaceLastLogEntry(messagesDisplay.innerHTML);
      } else {
        this.historyLog.addLogEntry(messagesDisplay.innerHTML);
      }

      // Ensure messages get read and prevent the focus from getting lost as elements get removed
      messagesDisplay.focus();
    }
  }

  updateHeldItemsDisplay() {
    this.saveData();

    const heldItemsThumbnails = document.querySelector('#held-items-thumbnails>span');

    const heldItemsDisplay = document.getElementById('held-items');
    const scrollLeft = heldItemsDisplay.scrollLeft;
    const scrolledToEnd = scrollLeft > 1 && scrollLeft + heldItemsDisplay.clientWidth + 1 >= heldItemsDisplay.scrollWidth;
    let capacityCounter = 0;

    // Important to use instead of `innerHTML = ""` for proper event listener cleanup
    heldItemsThumbnails.replaceChildren();
    heldItemsDisplay.replaceChildren();

    for (let i = 0; i < this.player.heldItems.length; i++) {
      const heldItem = this.player.heldItems[i];
      const itemDisplay = document.createElement('div');
      itemDisplay.tabIndex = 0;
      itemDisplay.classList.add('held-item');

      const itemBackgroundDecoration = document.createElement('div');
      itemBackgroundDecoration.classList.add('item-background-decoration');
      itemDisplay.appendChild(itemBackgroundDecoration);

      const itemName = document.createElement('dt');
      itemName.classList.add('item-name');
      itemName.innerHTML = heldItem.getFullName();
      itemDisplay.appendChild(itemName);

      const itemDescription = document.createElement('dd');
      itemDescription.classList.add('item-description');
      itemDescription.innerHTML = heldItem.getDescription ? heldItem.getDescription() : heldItem.description;
      itemDisplay.appendChild(itemDescription);

      if (heldItem.id === "tangerine") {
        const progressBar = document.createElement('div');
        progressBar.classList.add('item-progress-bar');
        const progressBarFill = document.createElement('div');
        progressBar.appendChild(progressBarFill);

        const progressValue = Math.min(100, Math.max(0, Math.round(100 * (heldItem.startingStepsLeftToPeel - heldItem.stepsLeftToPeel) / heldItem.startingStepsLeftToPeel)));
        progressBarFill.style.width = `${progressValue}%`;

        if (progressValue >= 100) {
          progressBarFill.classList.add('filled');
        }

        itemDisplay.appendChild(progressBar);
      }

      const itemButtons = document.createElement('div');
      itemButtons.classList.add('item-buttons');
      itemDisplay.appendChild(itemButtons);

      const capacityWeightDisplay = document.createElement('div');
      capacityWeightDisplay.classList.add('item-capacity-weight');
      itemDisplay.appendChild(capacityWeightDisplay);

      for (let i = 0; i < (heldItem.capacityWeight ?? 1); i++) {
        const capacityIcon = document.createElement('div');
        capacityIcon.innerText = "✊";
        capacityIcon.ariaHidden = true;
        capacityCounter++;

        if (capacityCounter > this.player.capacity) {
          capacityIcon.classList.add('notify');
        }

        capacityWeightDisplay.appendChild(capacityIcon);
      }

      const capacityWeight = capacityWeightDisplay.childElementCount;
      capacityWeightDisplay.ariaLabel = `This item takes up ${capacityWeight} capacity slot${capacityWeight !== 1 ? "s" : ""}.`;

      let itemThumbnail = document.createElement('span');
      heldItemsThumbnails.appendChild(itemThumbnail);
      itemThumbnail.outerHTML = getEmojiMarkup(heldItem.emoji, true);
      itemThumbnail = heldItemsThumbnails.lastElementChild;

      if (capacityCounter > this.player.capacity) {
        itemThumbnail.classList.add('notify');
      }

      if (this.player.environment === "trading-post") {
        const tradeRequest = tradeRequestsMap.get(game.nextTradeRequestId);

        if (tradeRequest.items.includes(heldItem.id)) {
          const tradeButton = document.createElement('button');
          tradeButton.type = "button";
          tradeButton.disabled = this.gameActive === false || this.chanceTime.awaitingSelection;
          tradeButton.innerHTML = getEmojiMarkup(TRADING_POST_EMOJI);
          tradeButton.ariaLabel = "Trade";
          tradeButton.onclick = () => {
            game.tradeItems();
          };

          itemButtons.appendChild(tradeButton);
        }
      }

      if (heldItem.onConsume) {
        const consumeButton = document.createElement('button');
        consumeButton.type = "button";
        consumeButton.disabled = this.gameActive === false || this.chanceTime.awaitingSelection;
        consumeButton.innerText = heldItem.tags.includes("consumable") ? "Consume" : "Use";
        consumeButton.style.flexGrow = 3;
        consumeButton.onclick = () => {
          this.player.consumeItem(i);
        };
        itemButtons.appendChild(consumeButton);
      }

      if (heldItem.tags.includes("treasure") === false) {
        const disposeButton = document.createElement('button');
        disposeButton.type = "button";
        disposeButton.disabled = this.gameActive === false || this.chanceTime.awaitingSelection;
        // Need to keep track of exceptions
        disposeButton.innerHTML = this.player.environment === "receptacle" && heldItem.tags.includes("trashable") ? getEmojiMarkup("🚮") : getEmojiMarkup("X", true, "Dispose");
        disposeButton.ariaLabel = "Dispose";
        disposeButton.onclick = () => {
          this.player.disposeItem(i);
        };

        itemButtons.appendChild(disposeButton);
      }

      heldItemsDisplay.appendChild(itemDisplay);
    }

    for (let i = this.player.getHeldItemsCapacityWeight(); i < this.player.capacity; i++) {
      const emptyCapacitySpace = document.createElement('div');
      emptyCapacitySpace.ariaLabel = "Empty capacity slot";
      emptyCapacitySpace.tabIndex = 0;
      emptyCapacitySpace.classList.add('empty-capacity-space');
      heldItemsDisplay.appendChild(emptyCapacitySpace);

      const emptyCapacityThumbnail = document.createElement('span');
      emptyCapacityThumbnail.classList.add('empty-space');
      heldItemsThumbnails.appendChild(emptyCapacityThumbnail);
    }

    heldItemsDisplay.scrollLeft = scrolledToEnd ?
        heldItemsDisplay.scrollWidth - heldItemsDisplay.clientWidth : scrollLeft;
  }

  updatePathDisplay() {
    this.saveData();

    const pathDisplay = document.getElementById('path');
    const focusedIndex = [...pathDisplay.children].indexOf(document.activeElement);

    // Important to use instead of `innerHTML = ""` for proper event listener cleanup
    pathDisplay.replaceChildren();

    for (let i = 0; i < this.pathStepOptions.length; i++) {
      for (const stepOptionId of this.pathStepOptions[i]) {
        const stepOption = this.pathOptionsMap.get(stepOptionId);
        const optionDisplay = document.createElement('button');
        optionDisplay.type = "button";
        optionDisplay.innerHTML = stepOption.getFullName();

        if (stepOptionId === "tracks" && -this.player.trackCounter >= this.player.trackPathLength) {
          optionDisplay.innerHTML = "❔❔❔";
        }

        optionDisplay.classList.add('path-option');
        optionDisplay.disabled = this.player.getHeldItemsCapacityWeight() > this.player.capacity
            || i > 0 || this.gameActive === false || this.chanceTime.awaitingSelection;
        optionDisplay.onclick = () => {
          this.player.selectPathOption(stepOption.id);
        };

        pathDisplay.insertBefore(optionDisplay, pathDisplay.firstChild);

        if (stepOptionId !== "blank") {
          this.guidebook.notesMap.get(stepOptionId).seen = true;
        } else {
          optionDisplay.ariaLabel = "Nothing here";
        }
      }
    }

    if (focusedIndex >= 0) {
      pathDisplay.children[focusedIndex].focus();
    }
  }

  addToPathDeck() {
    for (const pathOption of this.pathOptionsMap.values()) {
      for (let i = 0; i < (pathOption.chance + pathOption.positiveModifier - pathOption.negativeModifier); i++) {
        this.pathDeck.push(pathOption.id);
      }
    }
  }

  drawFromPathDeck() {
    if (this.pathDeck.length < 20) {
      game.iterationsCount++;

      for (const pathOption of this.pathOptionsMap.values()) {
        if (pathOption.tags.includes("obstacle")) {
          pathOption.positiveModifier += game.iterationsCount;
          this.pathOptionsMap.get("blank").negativeModifier += game.iterationsCount;
        } else if (pathOption.tags.includes("grows")) {
          pathOption.positiveModifier++;
        }
      }

      this.addToPathDeck();
    }

    const pathOptionId = randomDraw(this.pathDeck, true);
    return pathOptionId;
  }

  takePathStep() {
    // If passing a trading post, determine the next trade
    if (this.player.environment !== "trading-post"
        && this.pathStepOptions[0].some(pathOptionId => pathOptionId === "trading-post")) {
      game.determineNextTrade();
    }

    this.pathStepOptions.splice(0, 1);
    this.addToPathStepOptions();
    this.updatePathDisplay();
    // this.player.berryStreak = 0;

    this.stepCount++;

    if (this.player.queasyCounter > 0) {
      this.player.setQueasyCounter(this.player.queasyCounter - 1);
    }

    // Updates the stamina display
    this.player.loseStamina(1);

    const heldFruit = this.player.heldItems.filter(item => item.id === "tangerine");

    for (const fruit of heldFruit) {
      if (fruit.stepsLeftToPeel > 0) {
        fruit.stepsLeftToPeel--;
      }
    }

    this.updateMessagesDisplay();
    this.updateHeldItemsDisplay();
  }

  addToPathStepOptions() {
    const stepOptions = [];

    let randomIndexForTracks = -1;

    if (this.player.trackCounter > 0) {
      randomIndexForTracks = Math.floor(Math.random() * this.pathSize);
    }

    for (let i = 0; i < this.pathSize; i++) {
      if (randomIndexForTracks === i) {
        this.player.trackCounter = -this.player.trackCounter;
        stepOptions.push("tracks");
        continue;
      }

      const shownPathOptions = [...stepOptions, ...this.pathStepOptions.flat()];
      let pathOptionId;

      do {
        pathOptionId = this.drawFromPathDeck();
      } while (
        (
          // Prevent drawing new tracks if already tracking or showing any tracking options
          pathOptionId === "tracks" && (randomIndexForTracks >= 0
              || shownPathOptions.some(optionId => this.pathOptionsMap.get(optionId).tags.includes("tracking")))
        ) || (
          // Prevent drawing new trading path options if trading or already showing any
          this.pathOptionsMap.get(pathOptionId).tags.includes("trading") && (this.player.environment === "trading-post"
              || shownPathOptions.some(optionId => this.pathOptionsMap.get(optionId).tags.includes("trading")))
        )
      );

      if (pathOptionId === "tracks") {
        this.player.trackCounter = 0;
        this.player.trackPathLength = Math.floor(Math.random() * 3) + 2;
      }

      stepOptions.push(pathOptionId);
    }

    this.pathStepOptions.push(stepOptions);
  }
}

function onHeldItemsThumbnailsClick(event) {
  heldItemsThumbnailsMoveHandler(event.currentTarget, event.target);
}

function onHeldItemsThumbnailsTouchMove(event) {
  if (event.touches.length === 1) {
    const touch = event.touches[0];
    const target = document.elementFromPoint(touch.clientX, touch.clientY);
    heldItemsThumbnailsMoveHandler(event.currentTarget, target);
    event.preventDefault();
  }
}

function onHeldItemsThumbnailsMouseMove(event) {
  if (game.scrollModeManual && event.buttons !== 1) {
    // Require left mouse button
    return;
  }

  heldItemsThumbnailsMoveHandler(event.currentTarget, event.target);
}

function heldItemsThumbnailsMoveHandler(currentTarget, target) {
  if (!target || !currentTarget || target === currentTarget) {
    return;
  }

  const spanTarget = target.closest('span');
  const itemIndex = [...currentTarget.children].indexOf(spanTarget);

  if (itemIndex < 0 || itemIndex >= currentTarget.childElementCount) {
    return;
  }

  const heldItemsDisplay = document.getElementById('held-items');
  const xPadding = 10;
  const containerRect = heldItemsDisplay.getBoundingClientRect();
  const containerLeft = containerRect.left + xPadding;
  const containerRight = containerRect.right - xPadding;
  const itemRect = heldItemsDisplay.children[itemIndex].getBoundingClientRect();

  if (itemRect.left < containerLeft) {
    smoothScrollX(heldItemsDisplay, heldItemsDisplay.scrollLeft - (containerLeft - itemRect.left));
  } else if (itemRect.right > containerRight) {
    smoothScrollX(heldItemsDisplay, heldItemsDisplay.scrollLeft + (itemRect.right - containerRight));
  }
}

function onHeldItemsMouseMove(event) {
  if (!game.scrollModeManual && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    const rect = event.currentTarget.getBoundingClientRect();

    // Avoid scrolling for the bottom of the container where the item buttons are
    const rootFontSize = parseFloat(getComputedStyle(document.documentElement).fontSize);
    const topPadding = rootFontSize * 2.5;
    const topMargin = rootFontSize * 1.25;
    const topOffset = topPadding + topMargin;
    const bottomPadding = 10;

    if (event.clientY - rect.top > (event.currentTarget.clientHeight - (topOffset + bottomPadding)) * 0.6 + topOffset
        || event.clientY - rect.top < topMargin) {
      return;
    }

    const rectLeft = rect.left + rect.width * 0.2;
    const rectWidth = rect.width * 0.6;
    const mouseX = Math.max(0, Math.min(event.clientX - rectLeft, rectWidth));
    const mouseRatio = mouseX / rectWidth;

    const maxScrollLeft = event.currentTarget.scrollWidth - event.currentTarget.clientWidth;
    // event.currentTarget.scrollLeft = mouseRatio * maxScrollLeft;
    smoothScrollX(event.currentTarget, mouseRatio * maxScrollLeft);
  }
}

function onHeldItemsMouseWheel(event) {
  if (game.scrollModeManual) {
    event.currentTarget.scrollLeft += event.deltaY;
    event.preventDefault();
  }
}

let smoothScrollAnimationId = null;

function smoothScrollX(element, targetX) {
  function scrollStep() {
    cancelAnimationFrame(smoothScrollAnimationId);

    if (Math.abs(element.scrollLeft - targetX) < 5) {
      element.scrollLeft = targetX;
      smoothScrollAnimationId = null;
      return;
    }

    const delta = (targetX - element.scrollLeft) * 0.25;
    const sign = Math.sign(delta);
    const absDelta = Math.ceil(Math.abs(delta));

    element.scrollLeft += sign * Math.max(absDelta, 4);
    smoothScrollAnimationId = requestAnimationFrame(scrollStep);
  }

  cancelAnimationFrame(smoothScrollAnimationId);
  smoothScrollAnimationId = requestAnimationFrame(scrollStep);
}

function announceForScreenReader(announcement) {
  const announcer = document.getElementById('sr-announcements');
  announcer.innerHTML = announcement;

  setTimeout(() => announcer.innerHTML = '');
}
