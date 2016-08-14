const { env } = require('jsdom');
const fetch = require('isomorphic-fetch');

/**
 * Promise wrapper for jsdom
 * @param  {string} html The HTML string to use for the DOM
 * @return {Object}      The `window` object
 */
function jsdomPromised(html) {
  return new Promise((resolve, reject) => {
    env(html, [], (error, window) => {
      if (error) {
        return reject(error);
      }

      return resolve(window);
    });
  });
}

/**
 * Get user info from the user Profile
 * @param  {string} username The user to scrap
 * @return {Object}          The scrapped data
 */
async function scrapper(username) {
  const url = `https://platzi.com/@${username}`;
  const response = await fetch(url);
  const html = await response.text();

  const window = await jsdomPromised(html);
  const { document } = window;

  const name = document.querySelector('.ProfileHeader-name').innerHTML;
  const description = document.querySelector('.ProfileHeader-description').innerHTML;
  const socialNetworks = Array
    .from(document.querySelectorAll('.ProfileHeader-socialBtn'))
    .map($socialBtn => {
      const link = $socialBtn.getAttribute('href');
      const type = link.indexOf('facebook') > -1 ? 'facebook' : 'twitter';

      return { type, link };
    });

  const link = document.querySelector('.ProfileHeader-link').getAttribute('href');
  const avatar = document.querySelector('.ProfileHeader-avatar > img').getAttribute('src');

  const points = Array
    .from(document.querySelectorAll('.ProfileHeader-points'))
    .map($point => {
      const amount = $point.querySelector('.ProfileHeader-number').innerHTML;
      const type = $point.querySelector('.ProfileHeader-type').innerHTML;

      return { amount, type };
    });

  const courses = Array
    .from(document.querySelectorAll('.Course'))
    .map($course => {
      const title = $course.querySelector('.Course-title').childNodes[1].data;
      const career = $course.querySelector('.Course-career').innerHTML;
      const percentage = $course.querySelector('.Course-percentage').childNodes[1].data;
      const badgeUrl = $course.querySelector('.Course-badge > img').getAttribute('src');

      return { title, career, percentage, badgeUrl };
    });

  return {
    url,
    user: {
      username,
      name,
      description,
      socialNetworks,
      link,
      avatar,
      points,
    },
    courses,
  };
}

module.exports = scrapper;
