<template>
  <div class="page-container">
    <AppHeader />
    <main class="content-area">
      <RouterView />
    </main>
    <AppFooter />
  </div>
</template>

<script setup>
import { RouterView } from "vue-router";
import AppHeader from "./components/AppHeader.vue";
import AppFooter from "./components/AppFooter.vue";
</script>

<style scoped>
.content-area {
  /* Ví dụ: thêm padding để nội dung không dính vào header/footer */
  padding: 0 30px;
}
</style>
