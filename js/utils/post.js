import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { setTextContent } from './common.js';

// relative time day js
dayjs.extend(relativeTime);

function createPostItemInPostList(postItem) {
  if (!postItem) return;

  const templatePostItem = document.getElementById('postItemTemplate');
  if (!templatePostItem) return;

  const liElement = templatePostItem.content.cloneNode(true);
  if (!liElement) return;

  setTextContent(liElement, '[data-id="title"]', postItem.title);
  setTextContent(liElement, '[data-id="description"]', trunCateDesc(postItem.description, 100));
  setTextContent(liElement, '[data-id="author"]', postItem.author);
  setTextContent(liElement, '[data-id="timeSpan"]', ` - ${dayjs(postItem.createdAt).fromNow()}`);

  const liElementThumbnail = liElement.querySelector('[data-id="thumbnail"]');

  if (liElementThumbnail) {
    liElementThumbnail.src = postItem.imageUrl;
    liElementThumbnail.addEventListener('error', () => {
      liElementThumbnail.src = 'https://picsum.photos/id/14/1368/400';
    });
  }
  const liElementMenu = liElement.querySelector('[data-id="menu"]');

  const cardElement = liElement.firstElementChild;
  cardElement.addEventListener('click', (e) => {
    /**
     * case 1 : stopPropagation
     * case 2 : closest
     * case 3 :
     */
    if (liElementMenu && liElementMenu.contains(e.target)) return;
    window.location.assign(`/post-detail.html?id=${postItem.id}`);
  });

  const editButton = liElement.querySelector('[data-id=edit]');
  if (editButton) {
    editButton.addEventListener('click', () => {
      window.location.assign(`/add-edit-post.html?id=${postItem.id}`);
    });
  }

  const removeButton = liElement.querySelector('[data-id=remove]');
  if (removeButton) {
    removeButton.addEventListener('click', () => {
      const customEvent = new CustomEvent('post-remove', {
        bubbles: true,
        detail: postItem,
      });
      removeButton.dispatchEvent(customEvent);
    });
  } 

  return liElement;
}

export function renderPostList(idPostListElement, postList) {
  const ulElement = document.getElementById(idPostListElement);
  if (!Array.isArray(postList) || !ulElement) return;

  ulElement.textContent = '';

  postList.forEach((postItem) => {
    const liElement = createPostItemInPostList(postItem);
    ulElement.appendChild(liElement);
  });
}

function trunCateDesc(text, maxLength) {
  if (text <= maxLength) return text;
  const trunCateText = text.slice(text, maxLength - 1);
  return `${trunCateText}…`;
}
