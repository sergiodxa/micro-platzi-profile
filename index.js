const { parse } = require('url');
const scrapper = require('./lib/scrapper.js');

module.exports = async request => {
  const { query } = parse(request.url, true);

  // if the username is not defined
  if (!query.username) {
    const exampleUrl = 'https://micro-platzi-profile.now.sh?username=some-user-name';
    const error = new ReferenceError(
      `You must query for a specific username using a URL like ${exampleUrl}.`
    );
    error.statusCode = 400;
    throw error;
  }

  return await scrapper(query.username);
};
