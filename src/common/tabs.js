export const getActiveTab = async function () {
  return new Promise((resolve, reject) => {
    try {
      chrome.tabs.query(
        { active: true, currentWindow: true },
        function (value) {
          resolve(value);
        }
      );
    } catch (ex) {
      reject(ex);
    }
  });
};

export const getStartTab = async function () {
  return new Promise((resolve, reject) => {
    try {
      chrome.tabs.query(
        {
          active: true,
        },
        function (value) {
          resolve(value);
        }
      );
    } catch (ex) {
      reject(ex);
    }
  });
};
