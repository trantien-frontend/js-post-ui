import postApi from './api/postApi';
import { setTextContent } from './utils';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

// relative time day js
dayjs.extend(relativeTime);

// id="postHeroImage"
// id="postDetailTitle">
// id="postDetailAuthor"
// id="postDetailTimeSpan"
// id="goToEditPageLink"
// id="postDetailDescription"

function renderPostDetail(postData) {
  console.log(postData);
  if (!postData) return;
  setTextContent(document, '#postDetailTitle', postData.title);
  setTextContent(document, '#postDetailAuthor', postData.author);
  setTextContent(
    document,
    '#postDetailTimeSpan',
    ` - ${dayjs(postData.updatedAt).format('DD/MM/YYYY')}`
  );
  setTextContent(document, '#postDetailDescription', postData.description);

  const heroImageElement = document.getElementById('postHeroImage');

  if (heroImageElement) {
    heroImageElement.style.backgroundImage = `url(${postData.imageUrl})`;
    heroImageElement.addEventListener('error', () => {
      const tempURL = 'https://picsum.photos/id/14/1368/400';
      heroImageElement.style.backgroundImage = `url(${tempURL})`;
    });
  }

  const addEditButton = document.getElementById('goToEditPageLink');
  if (addEditButton) {
    addEditButton.href = `add-edit-post.html?id=${postData.id}`;
    addEditButton.innerHTML = `<i class="fas fa-edit"> </i> Edit post`;
  }
}
(async () => {
  // get post id from url
  // fetch post detail api
  // render post detail
  try {
    const url = new URLSearchParams(window.location.search);

    const postId = url.get('id');
    if (!postId) {
      alert('not params');
      return;
    }
    const postData = await postApi.getById(postId);
    renderPostDetail(postData);
  } catch (error) {
    console.log('error: ', error);
  }
})();
