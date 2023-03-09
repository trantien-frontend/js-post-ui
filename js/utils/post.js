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

  liElement.firstElementChild.firstElementChild.addEventListener('click', () => {
    window.location.assign(`/post-detail.html?id=${postItem.id}`);
  });

  return liElement;
}

export function renderPostList(idPostListElement, postList) {
  const ulElement = document.getElementById(idPostListElement);
  console.log(postList);
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
