import { randomNumber, setFiledValue, setImageUrl, setTextContent } from './common';
import * as yup from 'yup';

const ImageSource = {
  PICSUM: 'picsum',
  UPLOAD: 'upload',
};

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

  console.log('New FormData: ', formValues);

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
    imageUrl: yup.string().required('Please Random ImageBg').url('Please enter valid URL'),
    // imageUrl: yup.string().when('imageSource', {
    //   is: ImageSource.PICSUM,
    //   then: yup.string().required('Please Random ImageBg').url('Please enter valid URL'),
    // }),
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
    const fieldList = ['title', 'author', 'imageUrl'];
    fieldList.forEach((field) => setFieldError(formElement, field, ''));

    const schema = getPostSchema();
    await schema.validate(formValues, { abortEarly: false });
  } catch (error) {
    const errorLog = {};

    console.log('Error Inner: ', error.inner);

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
