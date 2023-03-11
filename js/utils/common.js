export function setTextContent(parentElement, querText, data) {
  if (!parentElement) return;
  const element = parentElement.querySelector(querText);
  if (!element) return;
  element.textContent = data;
}

export function setFiledValue(parentElement, selectorElement, value) {
  if (!parentElement) return;

  const inputField = parentElement.querySelector(selectorElement);
  if (inputField) inputField.value = value;
}

export function setImageUrl(parentElement, selectorElement, urlImage) {
  if (!parentElement) return;

  const element = parentElement.querySelector(selectorElement);
  if (element) element.style.backgroundImage = `url(${urlImage})`;
}
