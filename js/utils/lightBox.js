function showModalLightBox(modalElement) {
  if (!window.bootstrap) return;

  const myModal = new bootstrap.Modal(modalElement);
  if (myModal) myModal.show();
}
export function registerLightBox({
  idElementModel,
  selectorImgModel,
  selectorButtonPrev,
  selectorButtonNext,
}) {
  const modalElement = document.getElementById(idElementModel);
  if (!modalElement) return;

  const imgModalElement = modalElement.querySelector(selectorImgModel);
  const buttonModalPrev = modalElement.querySelector(selectorButtonPrev);
  const buttonModalNext = modalElement.querySelector(selectorButtonNext);
  if (!imgModalElement || !buttonModalNext || !buttonModalPrev) return;

  let currentIndex = 0;
  let imgList = [];

  function showImgModelAtIndex(index) {
    console.log('Show: ', index);
    imgModalElement.src = imgList[index].src;
  }

  // click post-image ===> event delay
  document.addEventListener('click', (e) => {
    let targetCurrent = e.target;

    if (targetCurrent.tagName !== 'IMG' || !targetCurrent.dataset.album) return;

    imgList = document.querySelectorAll('[data-album=lightBox]');
    currentIndex = [...imgList].findIndex((img) => img === e.target);

    showImgModelAtIndex(currentIndex);
    showModalLightBox(modalElement);
  });

  buttonModalPrev.addEventListener('click', () => {
    currentIndex = (currentIndex - 1 + imgList.length) % imgList.length;
    showImgModelAtIndex(currentIndex);
  });

  buttonModalNext.addEventListener('click', () => {
    console.log('next');
    currentIndex = (currentIndex + 1) % imgList.length;
    showImgModelAtIndex(currentIndex);
  });
}

/**
 * 1 - 2 - 3
 * 0 - 1 - 2 : index
 * next :
 * index : 0 % 3 = 0
 *         1 % 3 = 1
 *         2 % 3 = 2
 *         3 % 3 = 0
 *
 * prev :  3 - 1 % 3 = 2
 * prev :  2 - 1 % 3 = 1
 * prev :  1 - 1 % 3 = 0
 * prev :  0 - 1 % 3 = 2
 *
 */
