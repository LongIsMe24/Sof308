import { defineStore } from "pinia";
import { ref, computed } from "vue";

export const usePostStore = defineStore("post", () => {
  const searchQuery = ref("");
  const posts = ref([]);
  const currentPage = ref(1);
  const postsPerPage = 6;

  const totalPages = computed(() => {
    return Math.ceil(posts.value.length / postsPerPage);
  });

  const paginatedPosts = computed(() => {
    const startIndex = (currentPage.value - 1) * postsPerPage;
    const endIndex = startIndex + postsPerPage;
    return posts.value.slice(startIndex, endIndex);
  });

  function setSearchQuery(query) {
    searchQuery.value = query;
    currentPage.value = 1; // Reset to first page on new search
  }

  function fetchPosts() {
    const allPosts = JSON.parse(localStorage.getItem("horizone_posts")) || [];
    allPosts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    posts.value = allPosts;
  }

  function setCurrentPage(page) {
    if (page > 0 && page <= totalPages.value) {
      currentPage.value = page;
    }
  }

  return {
    searchQuery,
    posts,
    currentPage,
    postsPerPage,
    totalPages,
    paginatedPosts,
    setSearchQuery,
    fetchPosts,
    setCurrentPage,
  };
});
