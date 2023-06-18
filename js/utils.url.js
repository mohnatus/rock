const sp = new URLSearchParams(location.search.slice(1));

export function getUrlParam(paramName) {
  return sp.get(paramName);
}
