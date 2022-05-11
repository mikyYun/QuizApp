const generateRandomString = function () {
  const str = Math.random().toString(36).slice(7);
  return str;
};

const urlsForUser = function (id, urlDB) {
  let userURLs = {}; //shortURL, longURL, userID
  for (const url in urlDB) {
    if (urlDB[url]["userID"] === id) {
      userURLs[url] = urlDB[url]; //we need key-value pair.
      //key: url   //value: urlDB[url]
    }
  }
  // console.log("OBJECT", userURLs);
  return userURLs;
};

module.exports = {
  generateRandomString,
  urlsForUser
};
