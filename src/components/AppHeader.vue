<template>
  <header class="main-header">
    <router-link :to="{ name: 'Home' }" class="header-logo">Blong</router-link>

    <nav class="header-nav d-none d-lg-block me-auto">
      <ul>
        <li><router-link :to="{ name: 'Posts' }">Bài Viết</router-link></li>
      </ul>
    </nav>

    <div class="d-flex align-items-center me-3">
      <div class="search-bar d-none d-lg-block me-3">
        <i class="fas fa-search"></i>
        <input
          type="text"
          placeholder="Tìm kiếm bài viết..."
          v-model="searchQuery"
        />
      </div>

      <!-- Hiển thị khi chưa đăng nhập -->
      <div
        v-if="!auth.isLoggedIn"
        class="user-actions d-flex align-items-center gap-3"
      >
        <router-link
          :to="{ name: 'Auth', query: { mode: 'login' } }"
          class="btn btn-login text-decoration-none"
        >
          Log In
        </router-link>
        <router-link
          :to="{ name: 'Auth', query: { mode: 'signup' } }"
          class="btn btn-signup text-decoration-none d-none d-md-inline-flex"
          style="color: white"
        >
          Sign Up
        </router-link>
      </div>

      <!-- Hiển thị khi đã đăng nhập -->
      <div v-if="auth.isLoggedIn && auth.currentUser" class="user-actions">
        <div class="dropdown">
          <img
            :src="
              auth.currentUser.avatarUrl ||
              `https://ui-avatars.com/api/?name=${(
                auth.currentUser.name || auth.currentUser.email
              )
                .charAt(0)
                .toUpperCase()}&background=6F4E37&color=fff&size=40`
            "
            alt="Avatar"
            class="user-avatar dropdown-toggle"
            id="userDropdown"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          />
          <ul
            class="dropdown-menu dropdown-menu-end"
            aria-labelledby="userDropdown"
          >
            <li>
              <router-link :to="{ name: 'Profile' }" class="dropdown-item"
                >Hồ sơ cá nhân</router-link
              >
            </li>
            <li><hr class="dropdown-divider" /></li>
            <li>
              <a
                class="dropdown-item text-danger"
                href="#"
                @click.prevent="auth.logout"
                >Đăng Xuất</a
              >
            </li>
          </ul>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { useAuthStore } from "@/stores/auth";
import { usePostStore } from "@/stores/post";
import { ref, watch } from "vue";
import { useRouter } from "vue-router";

const auth = useAuthStore();
const postStore = usePostStore();
const searchQuery = ref(postStore.searchQuery);
const router = useRouter();

watch(searchQuery, (newValue) => {
  postStore.setSearchQuery(newValue);
  if (newValue && router.currentRoute.value.name !== "Posts") {
    router.push({ name: "Posts" });
  }
});
</script>

<style scoped>
.main-header {
  padding: 15px 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
}
.header-logo {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--color-primary-brown);
  margin-right: 20px;
}
.header-nav ul {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
}
.header-nav ul li a {
  color: var(--color-text-light);
  font-size: 0.9rem;
  margin: 0 12px;
  text-decoration: none;
  transition: color 0.2s;
}
.header-nav ul li a:hover {
  color: var(--color-primary-brown);
}
.search-bar {
  position: relative;
  margin-right: 20px;
  width: 250px;
}
.search-bar input {
  border: 1px solid var(--color-border-light);
  border-radius: 25px;
  padding: 8px 15px 8px 40px;
  font-size: 0.9rem;
  width: 100%;
  background-color: var(--color-bg-light);
}
.search-bar .fa-search {
  position: absolute;
  left: 15px;
  top: 50%;
  transform: translateY(-50%);
  color: #999;
}
.user-actions a {
  color: var(--color-text-dark);
  font-weight: 500;
}
.btn-signup {
  background-color: var(--color-primary-brown);
  color: var(--color-white);
  border-radius: 20px;
  padding: 8px 20px;
  font-weight: 500;
  transition: background-color 0.2s;
}
.btn-signup:hover {
  background-color: var(--color-accent-tan);
}
.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover; /* Đảm bảo ảnh không bị méo */
}
.user-avatar:hover {
  cursor: pointer;
}
</style>
