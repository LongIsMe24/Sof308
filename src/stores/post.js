import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { addData, getAllData, deleteData } from "@/utils/indexedDB";

export const usePostStore = defineStore("post", () => {
  const searchQuery = ref("");
  const posts = ref([]);
  const currentPage = ref(1);
  const postsPerPage = 6;

  const totalPages = computed(() => {
    // If there are search results, paginated based on filtered length
    if (searchQuery.value) {
      const filtered = posts.value.filter(postFilter(searchQuery.value));
      return Math.ceil(filtered.length / postsPerPage);
    }
    return Math.ceil(posts.value.length / postsPerPage);
  });

  const paginatedPosts = computed(() => {
    let postsToPaginate = posts.value;
    if (searchQuery.value) {
      postsToPaginate = posts.value.filter(postFilter(searchQuery.value));
    }
    const startIndex = (currentPage.value - 1) * postsPerPage;
    const endIndex = startIndex + postsPerPage;
    return postsToPaginate.slice(startIndex, endIndex);
  });

  const postFilter = (query) => (post) => {
    const normalizedQuery = query.toLowerCase();
    return (
      post.title.toLowerCase().includes(normalizedQuery) ||
      post.content.toLowerCase().includes(normalizedQuery)
    );
  };

  function setSearchQuery(query) {
    searchQuery.value = query;
    currentPage.value = 1; // Reset to first page on new search
  }

  async function fetchPosts() {
    await migratePostsFromLocalStorage();
    const allPosts = await getAllData("posts");
    allPosts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    posts.value = allPosts;
  }

  async function migratePostsFromLocalStorage() {
    const oldPosts = JSON.parse(localStorage.getItem("horizone_posts")) || [];
    if (oldPosts.length > 0) {
      try {
        const postsInDb = await getAllData("posts");
        const postsInDbIds = new Set(postsInDb.map(p => p.id));
        for (const post of oldPosts) {
          if (!postsInDbIds.has(post.id)) {
            await addData("posts", post);
          }
        }
        // Optional: Clear after successful migration
        // if (postsInDb.length === 0) localStorage.removeItem("horizone_posts");
      } catch (error) {
        console.error("Failed to migrate posts:", error);
      }
    }
  }

  function setCurrentPage(page) {
    if (page > 0 && page <= totalPages.value) {
      currentPage.value = page;
    }
  }

  async function addPost(post) {
    await addData("posts", post);
    await fetchPosts(); // Refresh posts from DB
  }

  async function updatePost(post) {
    await addData("posts", post); // addData in indexedDB helper is put, so it updates if exists
    await fetchPosts();
  }

  async function deletePost(postId) {
    await deleteData("posts", postId);
    await fetchPosts();
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
    addPost,
    updatePost,
    deletePost,
  };
});
