const { parse } = require('url');
const scrapper = require('./lib/scrapper.js');

module.exports = async request => {
  const { query } = parse(request.url, true);

  // if the username is not defined
  if (!query.username) {
    const error = new ReferenceError('You must query for a specific username.');
    error.statusCode = 400;
    throw error;
  }

  return await scrapper(query.username);
};
