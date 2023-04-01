import { randomNumber, setFiledValue, setImageUrl, setTextContent } from './common';
import * as yup from 'yup';
import { ImageSource } from '../Constant/constant.js';

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

    imageSource: yup
      .string()
      .oneOf([ImageSource.PICSUM, ImageSource.UPLOAD], 'Please Select Image Source'),

    imageUrl: yup.string().when('imageSource', {
      is: ImageSource.PICSUM,
      then: (schema) => schema.required('Please Random BG').url('Please enter valid URL'),
    }),

    image: yup.mixed().when('imageSource', {
      is: ImageSource.UPLOAD,
      then: (schema) =>
        schema
          .test('Check-File', 'Please upload image file', (file) => {
            console.log(file.name);
            return file?.name;
          })
          .test('max-0.5mb', 'Please upload file image max 0.5mb', (file) => {
            const MAX_SIZE = 0.5 * 1024 * 1024;
            return file.size <= MAX_SIZE;
          }),
    }),
  });
}

function setFieldError(form, name, errorMessage) {
  const inputField = form.querySelector(`[name="${name}"]`);
  if (inputField) {
    inputField.setCustomValidity(errorMessage);
    setTextContent(inputField.parentElement, '.invalid-feedback', errorMessage);
  }
}

async function validatePostForm(formElement, formValues) {
  if (!formElement) return;

  try {
    // reset form
    const fieldList = ['title', 'author', 'imageUrl', 'image'];
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

  // valid form
  const isValid = formElement.checkValidity();
  if (!isValid) formElement.classList.add('was-validated');
  return isValid;
}

async function validateFormField(formElement, formValues, name) {
  try {
    setFieldError(formElement, name, '');

    const schema = getPostSchema();
    await schema.validateAt(name, formValues);
  } catch (erorr) {
    console.log(erorr.message);
    setFieldError(formElement, name, erorr.message);
    const inputField = formElement.querySelector(`[name=${name}]`);
    if (inputField && !inputField.checkValidity()) {
      inputField.parentElement.classList.add('was-validated');
    }
  }
}

function showLoadingSubmit(form) {
  const buttonSubmit = form.querySelector('[data-id="submit"]');
  if (buttonSubmit) {
    buttonSubmit.disabled = true;
    buttonSubmit.textContent = 'Saving...';
  }
}

function hideLoadingSubmit(form) {
  const buttonSubmit = form.querySelector('[data-id="submit"]');
  if (buttonSubmit) {
    buttonSubmit.disabled = false;
    buttonSubmit.textContent = 'Save';
  }
}

function initRamdomImage(form) {
  const buttonRandomImage = document.getElementById('postChangeImage');
  if (!buttonRandomImage) return;

  buttonRandomImage.addEventListener('click', () => {
    // random id image
    const randomIdImage = randomNumber(1000);
    // config url
    const imageUrl = `https://picsum.photos/id/${randomIdImage}/1368/400`;
    // set image
    setFiledValue(form, '#postImageUrl', imageUrl);
    setImageUrl(document, '#postHeroImage', imageUrl);
  });
}
function renderImageSource(form, selectedValue) {
  const controlList = form.querySelectorAll('[data-id="imageSource"]');
  if (!controlList) return;

  [...controlList].forEach((control) => {
    control.hidden = control.dataset.source !== selectedValue;
  });
}
function initRadioImageSource(form) {
  const radioList = form.querySelectorAll('[name="imageSource"]');
  if (!radioList) return;

  [...radioList].forEach((radio) => {
    radio.addEventListener('change', () => renderImageSource(form, radio.value));
  });
}

function initUploadImage(form) {
  const inputUpload = form.querySelector('[name="image"]');
  if (!inputUpload) return;

  inputUpload.addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImageUrl(document, '#postHeroImage', imageUrl);

      validateFormField(form, { imageSource: ImageSource.UPLOAD, image: file }, 'image');
    }
  });
}

function initChangeField(formElement) {
  ['title', 'author'].forEach((name) => {
    const inputField = formElement.querySelector(`[name=${[name]}]`);
    if (inputField) {
      inputField.addEventListener('input', (e) => {
        validateFormField(formElement, { [name]: e.target.value }, name);
      });
    }
  });
}

let isSubmiting = false;

export function initPostForm({ idElementForm, defaultValue, onSubmit }) {
  const form = document.getElementById(idElementForm);
  if (!form) return;

  setValueInputForm(form, defaultValue);
  initRamdomImage(form);
  initRadioImageSource(form);
  initUploadImage(form);
  initChangeField(form);

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    showLoadingSubmit(form);

    if (isSubmiting) {
      console.log('not clicked');
      return;
    }

    isSubmiting = true;

    const formValues = getFormsValues(form);
    formValues.id = defaultValue.id;

    const isValidatePostForm = await validatePostForm(form, formValues);
    if (isValidatePostForm) await onSubmit?.(formValues);

    hideLoadingSubmit(form);
    isSubmiting = false;
  });
}
