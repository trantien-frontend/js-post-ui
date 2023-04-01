import postApi from './api/postApi';
import { initPostForm, toast } from './utils';
import { ImageSource } from './Constant/constant.js';

function removeUneseFiels(formValues) {
  const payload = { ...formValues };
  const imageSource = payload.imageSource;

  if (imageSource === ImageSource.PICSUM) delete payload.image;
  else delete payload.imageUrl;

  delete payload.imageSource;

  if (!formValues.id) delete payload.id;

  return payload;
}

function jsonToFormData(jsonObject) {
  const fomrData = new FormData();

  for (const key in jsonObject) {
    fomrData.set(key, jsonObject[key]);
  }

  return fomrData;
}

async function handelPostFormSubmit(formValues) {
  try {
    const payload = removeUneseFiels(formValues);
    const formData = jsonToFormData(payload);

    const currentData = formValues.id
      ? await postApi.updateFormData(formData)
      : await postApi.addFormData(formData);

    toast.success('Save post Successfully!');
    console.log(currentData);
    // setTimeout(() => {
    //   window.location.assign(`/post-detail.html?id=${currentData.id}`);
    // }, 3000);
  } catch (erorr) {
    toast.erorr(`Error: ${erorr.message}`);
  }
}

(async () => {
  try {
    const searchParans = new URLSearchParams(window.location.search);
    const postId = searchParans.get('id');

    let defaultParams = postId
      ? await postApi.getById(postId)
      : {
          title: '',
          author: '',
          description: '',
          imageUrl: '',
        };

    initPostForm({
      idElementForm: 'postForm',
      defaultValue: defaultParams,
      onSubmit: (formValues) => handelPostFormSubmit(formValues),
    });
  } catch (error) {
    console.log('error: ', error);
  }
})();
