// let localObj = {};

const saveObjectInLocalStorage = async function (obj) {
  return new Promise((resolve, reject) => {
    try {
      chrome.storage.local.set(obj, function () {
        resolve();
      });
    } catch (ex) {
      reject(ex);
    }
  });
};

// const updateCurrentMetrics = function (obj) {
//   console.log("update current metrics new val");
//   console.log(obj.currentMetrics);
//   console.log("update current metrics obj");
//   console.log(localObj);

//   if (
//     "currentMetrics" in obj &&
//     Object.keys(obj.currentMetrics.newValue).length != 0
//   ) {
//     localObj = obj.currentMetrics.newValue;
//   }
//   console.log("update current metrics obj after");
//   console.log(localObj);
// };

const getObjectFromLocalStorage = async function (key) {
  return new Promise((resolve, reject) => {
    try {
      // if (key == "currentMetrics" && Object.keys(localObj).length > 0) {
      //   console.log("local hit");
      //   console.log(localObj);
      //   resolve(localObj);
      // }
      chrome.storage.local.get(key, function (value) {
        resolve(value[key]);
      });
    } catch (ex) {
      reject(ex);
    }
  });
};

const commitIfActive = async function (obj) {
  const isActive = await getIsActive();
  if (isActive) {
    await saveObjectInLocalStorage(obj);
  }
};

const getIsActive = async () => await getObjectFromLocalStorage("isActive");
const getStack = async () => await getObjectFromLocalStorage("stack");
const getCurrentMetrics = async () =>
  await getObjectFromLocalStorage("currentMetrics");
const getContextSwitches = async () =>
  await getObjectFromLocalStorage("contextSwitches");

const addChoices = async (i = 1) => {
  const currentMetrics = await getObjectFromLocalStorage("currentMetrics");
  let { choices } = currentMetrics;
  await commitIfActive({
    currentMetrics: {
      ...currentMetrics,
      choices: choices + i,
    },
  });
};
const addConcepts = async (i = 1) => {
  const currentMetrics = await getObjectFromLocalStorage("currentMetrics");
  let { concepts } = currentMetrics;
  await commitIfActive({
    currentMetrics: {
      ...currentMetrics,
      concepts: concepts + i,
    },
  });
};

// const addClicks = async (i = 1) => {
//   console.log("called");
//   lock.acquire(
//     "storage",
//     async (done) => {
//       console.log("locked");
//       const currentMetrics = await getObjectFromLocalStorage("currentMetrics");
//       let { clicks } = currentMetrics;
//       await commitIfActive({
//         currentMetrics: {
//           ...currentMetrics,
//           clicks: clicks + i,
//         },
//       });
//       done();
//     },

//     () => {
//       console.log("lock released");
//     }
//   );
//   console.log("getting clicks");
// };

const addClicks = async (i = 1) => {
  const currentMetrics = await getObjectFromLocalStorage("currentMetrics");
  let { clicks } = currentMetrics;
  await commitIfActive({
    currentMetrics: {
      ...currentMetrics,
      clicks: clicks + i,
    },
  });
  console.log("getting clicks");
};

const addKeystrokes = async (i = 1) => {
  const currentMetrics = await getObjectFromLocalStorage("currentMetrics");
  let { keystrokes } = currentMetrics;
  await commitIfActive({
    currentMetrics: {
      ...currentMetrics,
      keystrokes: keystrokes + i,
    },
  });
};

export {
  getObjectFromLocalStorage,
  saveObjectInLocalStorage,
  commitIfActive,
  getIsActive,
  getStack,
  getCurrentMetrics,
  getContextSwitches,
  addClicks,
  addConcepts,
  addChoices,
  addKeystrokes,
};
