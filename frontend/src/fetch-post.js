import fetch from 'unfetch';

export function fetchPost(url, body) {
  return fetch(
    url,
    {
      method: 'POST',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })
    .then(resp => resp.json());
}
