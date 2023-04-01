import postApi from './api/postApi.js';

import { initPagination, initSearch, renderPostList, renderPagination, toast } from './utils';

async function handllFilterChange(filterName, filterValue) {
  try {
    const url = new URL(window.location);

    if (filterName) url.searchParams.set(filterName, filterValue);

    if (filterName === 'title_like') url.searchParams.set('_page', 1);
    history.pushState({}, '', url);

    // call api
    const params = new URLSearchParams(url.search);
    const { data, pagination } = await postApi.getAll(params);

    // pre-render
    renderPostList('postList', data);
    renderPagination('postsPagination', pagination);
  } catch (error) {
    console.log('error: ', error);
  }
}

function registerPostDeleteEvent() {
  document.addEventListener('post-remove', async (e) => {
    try {
      const post = e.detail;
      const successMessage = `Remove Post Success ${post.title}`;
      if (window.confirm(successMessage)) {
        await postApi.remove(post.id);
        await handllFilterChange();
        toast.success(successMessage);
      }
    } catch (erorr) {
      const errorMessage = `remove failed ${erorr}`;
      toast.erorr(errorMessage);
    }
  });
}

(async () => {
  try {
    const url = new URL(window.location);

    if (!url.searchParams.get('_page')) url.searchParams.set('_page', 1);
    if (!url.searchParams.get('_limit')) url.searchParams.set('_limit', 9);

    history.pushState({}, '', url);

    const params = url.searchParams;

    registerPostDeleteEvent();

    initSearch({
      idElementSearch: 'searchInput',
      defaultParam: params,
      onChange: (value) => handllFilterChange('title_like', value),
    });

    initPagination({
      idElementPagination: 'postsPagination',
      defaultParams: params,
      onChange: (page) => handllFilterChange('_page', page),
    });

    const { data, pagination } = await postApi.getAll(params);

    renderPostList('postList', data);
    renderPagination('postsPagination', pagination);
  } catch (error) {
    console.log('Error', error);
  }
})();
