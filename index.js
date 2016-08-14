const { parse } = require('url');
const scrapper = require('./lib/scrapper.js');

module.exports = async request => {
  const { query } = parse(request.url, true);

  // if the username is not defined
  if (!query.username) {
    throw new ReferenceError('You must query for a specific username.');
  }

  return await scrapper(query.username);
};
