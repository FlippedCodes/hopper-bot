module.exports.run = async (message) => {
  // debug protection
  // if (DEBUG) return;
  console.log(message);

};

module.exports.data = {
  name: 'messageCreate',
};
