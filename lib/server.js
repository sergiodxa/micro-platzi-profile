import { parse } from 'url';
import micro, { send } from 'micro';
import scrapper from './scrapper.js';

async function requestHandler(request, response) => {
  const { query } = parse(request.url, true);

  // if the username is not defined
  if (!query.username) {
    return send(response, 400, 'You must query for a specific username.');
  }

  return send(response, 200, await scrapper(query.username));
}

micro(requestHandler).listen(3000);
