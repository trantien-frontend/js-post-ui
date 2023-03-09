export function setTextContent(parentElement, querText, data) {
  if (!parentElement) return;
  const element = parentElement.querySelector(querText);
  if (!element) return;
  element.textContent = data;
}
