export function request(url, config) {
  const { method = "GET", body } = config || {};
  const params = {
    method,
  };
  if (body) {
    const fd = new FormData();
    Object.entries(body).forEach(([key, value]) => {
      fd.append(key, value);
    });
    params.body = fd;
  }

  return fetch(url, params).then((res) => res.json());
}