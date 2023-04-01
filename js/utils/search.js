function searchDebounce(callbackFn, wait) {
  let isTimeOut = null;
  return function (filterValue) {
    if (isTimeOut) {
      clearTimeout(isTimeOut);
    }
    isTimeOut = setTimeout(() => {
      callbackFn(filterValue);
    }, wait);
  };
}

export function initSearch({ idElementSearch, defaultParam, onChange }) {
  const searchInput = document.getElementById(idElementSearch);
  if (!searchInput) return;

  if (defaultParam && defaultParam.get('title_like')) {
    searchInput.value = defaultParam.get('title_like');
    console.log(defaultParam.get('title_like'));
  }

  // add event for search
  const debounce = searchDebounce(onChange, 500);
  // lodash debounce
  // const searchDebounce = debounce(() => {}, 500);
  searchInput.addEventListener('input', (e) => debounce(e.target.value));
}
