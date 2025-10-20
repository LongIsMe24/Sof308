import { defineStore } from 'pinia';
import { ref } from 'vue';

export const usePostStore = defineStore('post', () => {
  const searchQuery = ref('');

  function setSearchQuery(query) {
    searchQuery.value = query;
  }

  return { searchQuery, setSearchQuery };
});
