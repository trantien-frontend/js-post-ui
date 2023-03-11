import postApi from './api/postApi';
/**
 * id="postTitle"
id="postAuthor"
id="postChangeImage"
 */
function populateSelectedPostForm({ idElementForm, idElementTitle, idElementAuthor, idEle }) {}

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
  } catch (error) {
    console.log('error: ', error);
  }
})();
