export const server =
  process.env.REACT_APP_ENV === 'production'
    ? 'http://localhost:8085'
    : process.env.REACT_APP_ENV === 'staging'
    ? 'http://localhost:8085'
    : 'http://localhost:8085';

export const webAPIUrl = 'http://localhost:8085';

export const authSettings = {
  domain: 'bobjac.auth0.com',
  client_id: 'W9tVSOmiQX2qN1oR6RkTpd0jjN5YZHbL',
  redirect_uri: window.location.origin + '/signin-callback',
  scope: 'read:datasets',
  audience: 'https://qanda',
};
