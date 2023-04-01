export function renderPagination(idElementPagination, pagination) {
  const ulPagination = document.getElementById(idElementPagination);
  if (!pagination || !ulPagination) return;

  const { _page, _limit, _totalRows } = pagination;

  // calc totalPage
  const totalPage = Math.ceil(_totalRows / _limit);

  // set data pagination
  ulPagination.dataset.page = _page;
  ulPagination.dataset.totalPage = totalPage;

  // add disabled for prev/next button
  if (_page <= 1) ulPagination.firstElementChild?.classList.add('disabled');
  else ulPagination.firstElementChild?.classList.remove('disabled');

  if (_page >= totalPage) ulPagination.lastElementChild?.classList.add('disabled');
  else ulPagination.lastElementChild?.classList.remove('disabled');
}

export function initPagination({ idElementPagination, defaultParam, onChange }) {
  const ulPagination = document.getElementById(idElementPagination);
  if (!ulPagination) return;

  const prev = ulPagination.firstElementChild?.firstElementChild;
  if (prev) {
    prev.addEventListener('click', (e) => {
      e.preventDefault();

      const page = Number.parseInt(ulPagination.dataset.page) || 0;

      if (page > 1) onChange(page - 1);
    });
  }

  const next = ulPagination.lastElementChild?.lastElementChild;

  if (next) {
    next.addEventListener('click', (e) => {
      e.preventDefault();

      const page = Number.parseInt(ulPagination.dataset.page) || 0;

      const totalPage = ulPagination.dataset.totalPage;

      if (page < totalPage) onChange(page + 1);
    });
  }
}
