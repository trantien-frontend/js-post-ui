import postApi from './api/postApi';
import { initPostForm, toast } from './utils';

async function handelPostFormSubmit(formValues) {
  try {
    const currentData = formValues.id
      ? await postApi.update(formValues)
      : await postApi.add(formValues);

    toast.success('Save post Successfully!');

    setTimeout(() => {
      window.location.assign(`/post-detail.html?id=${currentData.id}`);
    }, 3000);
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
