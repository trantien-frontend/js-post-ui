import { setFiledValue, setImageUrl, setTextContent } from './common';
import * as yup from 'yup';

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
function getPostSchema() {
  return yup.object().shape({
    title: yup.string().required('please enter title'),
    author: yup
      .string()
      .required('please enter author')
      .test('at-least-to-words', 'at least to words', (value) => {
        return value.split(' ').filter((x) => !!x && x.length > 2).length >= 2;
      }),
    description: yup.string(),
  });
}

// function getTitleError(formElement) {
//   const inputTitle = formElement.querySelector('[name="title"]');
//   if (!inputTitle) return;

//   //   requied
//   if (inputTitle.validity.valueMissing) return 'case requied';
//   // has 3 words and least word has 3 character
//   if (inputTitle.value.split(' ').filter((x) => !!x && x.length > 2).length < 2)
//     return 'case words';

//   return '';
// }
function setFieldError(form, name, errorMessage) {
  const inputField = form.querySelector(`[name="${name}"]`);
  if (inputField) {
    inputField.setCustomValidity(errorMessage);
    setTextContent(inputField.parentElement, '.invalid-feedback', errorMessage);
  }
}

async function validatePostForm(formElement, formValues) {
  if (!formElement) return;

  // const listErrorMess = {
  //   title: getTitleError(formElement),
  // };

  // for (const errorMess in listErrorMess) {
  //   const inputTitleElement = formElement.querySelector(`[name=${errorMess}]`);
  //   if (inputTitleElement) {
  //     inputTitleElement.setCustomValidity(listErrorMess[errorMess]);
  //     setTextContent(
  //       inputTitleElement.parentElement,
  //       '.invalid-feedback',
  //       listErrorMess[errorMess]
  //     );
  //   }
  // }

  try {
    // reset form
    const fieldList = ['title', 'author'];
    fieldList.forEach((field) => setFieldError(formElement, field, ''));

    const schema = getPostSchema();
    await schema.validate(formValues, { abortEarly: false });
  } catch (error) {
    const errorLog = {};
    if (error.name === 'ValidationError' || Array.isArray(error.inner)) {
      for (const validationError of error.inner) {
        const name = validationError.path;

        if (errorLog[name]) continue;

        setFieldError(formElement, name, validationError.message);
        errorLog[name] = true;
      }
    }
  }

  const isValid = formElement.checkValidity();
  if (!isValid) formElement.classList.add('was-validated');
  return isValid;
}

export function initPostForm({ idElementForm, defaultValue, onSubmit }) {
  const form = document.getElementById(idElementForm);
  if (!form) return;

  setValueInputForm(form, defaultValue);

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const formValues = getFormsValues(form);

    if (!validatePostForm(form, formValues)) return;

    console.log('submited form');
  });
  //   onSubmit(defaultValue);
}
