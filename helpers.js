const generateRandomString = function () {
  const str = Math.random().toString(36).slice(7);
  return str;
};

module.exports = {
  generateRandomString,
};
