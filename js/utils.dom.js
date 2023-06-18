const elementsCache = {};

export function getElement(id) {
  if (!elementsCache[id]) {
    elementsCache[id] = document.getElementById(id);
  }

  return elementsCache[id];
}

export function render(tagName, children, params) {
  const { className, attrs, text } = params || {};
  const $el = document.createElement(tagName);
  if (className) $el.classList.add(className);
  if (children) {
    children.forEach(($child) => $el.appendChild($child));
  }
  if (attrs) {
    Object.entries(attrs).forEach(([key, value]) => {
      $el.setAttribute(key, value);
    });
  }
  if (text) {
    $el.innerHTML = text;
  }
  return $el;
}

export function fromTemplate(templateId, data) {
  const template = document.getElementById(templateId);
  const $clone = template.content.cloneNode(true);

  Object.entries(data).forEach(([key, value]) => {
    const $texts = $clone.querySelectorAll(`[data-text='${key}']`);
    $texts.forEach(($node) => ($node.innerHTML = value));

    const $attrs = $clone.querySelectorAll(`[data-attr='${key}']`);
    $attrs.forEach(($node) => ($node.dataset[key] = value));
  });

  return $clone;
}

export function initDialog(dialog) {
  const close = dialog.querySelector(".dialog-close");
  const form = dialog.querySelector("form");
  close.addEventListener("click", () => {
    dialog.close();
    form.reset();
  });
}

export function setLoadingStatus(status) {
  document.body.classList.toggle('loading', status);
}