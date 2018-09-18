import fetch from 'unfetch';

export function fetchGet(url) {
  return fetch(
    url,
    {
      method: 'GET',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    .then(resp => resp.json());
}
