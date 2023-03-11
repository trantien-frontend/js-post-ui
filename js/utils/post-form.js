import { setFiledValue, setImageUrl } from './common';

function setValueInputForm(formElement, value) {
  if (!value) return;

  setFiledValue(formElement, '#postTitle', value.title);
  setFiledValue(formElement, '#postAuthor', value.author);
  setFiledValue(formElement, '#postDescription', value.description);
  setFiledValue(formElement, '#postImageUrl', value.imageUrl);
  setImageUrl(document, '#postHeroImage', value.imageUrl);
}

function getFormsValues(formElement) {
  const formValues = {};

  const formData = new FormData(formElement);
  for (const [key, value] of formData) {
    formValues[key] = value;
  }

  return formValues;
}

export function initPostForm({ idElementForm, defaultValue, onSubmit }) {
  const form = document.getElementById(idElementForm);
  if (!form) return;

  setValueInputForm(form, defaultValue);

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const formValues = getFormsValues(form);
  });
  //   onSubmit(defaultValue);
}
