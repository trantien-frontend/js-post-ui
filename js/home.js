import postApi from "./api/postApi.js";

import {
  initPagination,
  initSearch,
  renderPostList,
  renderPagination,
} from "./utils";

async function handllFilterChange(filterName, filterValue) {
  try {
    const url = new URL(window.location);
    url.searchParams.set(filterName, filterValue);
    if (filterName === "title_like") url.searchParams.set("_page", 1);
    history.pushState({}, "", url);

    // call api
    const params = new URLSearchParams(url.search);
    const { data, pagination } = await postApi.getAll(params);

    // pre-render
    renderPostList("postList", data);
    renderPagination("postsPagination", pagination);
  } catch (error) {
    console.log("error: ", error);
  }
}

(async () => {
  try {
    const url = new URL(window.location);

    if (!url.searchParams.get("_page")) url.searchParams.set("_page", 1);
    if (!url.searchParams.get("_limit")) url.searchParams.set("_limit", 9);

    history.pushState({}, "", url);

    const params = url.searchParams;

    initSearch({
      idElementSearch: "searchInput",
      defaultParam: params,
      onChange: (value) => handllFilterChange("title_like", value),
    });

    initPagination({
      idElementPagination: "postsPagination",
      defaultParams: params,
      onChange: (page) => handllFilterChange("_page", page),
    });

    const { data, pagination } = await postApi.getAll(params);

    renderPostList("postList", data);
    renderPagination("postsPagination", pagination);
  } catch (error) {
    console.log("Error", error);
  }
})();
