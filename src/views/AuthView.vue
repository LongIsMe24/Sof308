<template>
  <div class="auth-container">
    <div class="text-center mb-4">
      <router-link
        :to="{ name: 'Home' }"
        class="h1 text-decoration-none"
        style="color: var(--color-primary-brown)"
      >
        Blong
      </router-link>
    </div>
    <h2 class="text-center">{{ isLoginMode ? "Đăng Nhập" : "Đăng Ký" }}</h2>

    <form @submit.prevent="handleAuthSubmit" class="mt-4">
      <div class="mb-3">
        <label for="authEmail" class="form-label">Email</label>
        <input
          type="email"
          class="form-control"
          v-model="form.email"
          required
        />
      </div>
      <div class="mb-3">
        <label for="authPassword" class="form-label">Mật khẩu</label>
        <input
          type="password"
          class="form-control"
          v-model="form.password"
          required
        />
      </div>
      <div v-if="!isLoginMode" class="mb-3">
        <label for="authConfirmPassword" class="form-label"
          >Xác nhận Mật khẩu</label
        >
        <input
          type="password"
          class="form-control"
          v-model="form.confirmPassword"
        />
      </div>
      <div
        v-if="message.text"
        :class="[
          'alert',
          message.type === 'success' ? 'alert-success' : 'alert-danger',
        ]"
      >
        {{ message.text }}
      </div>
      <button type="submit" class="btn btn-submit w-100">
        {{ isLoginMode ? "Đăng Nhập" : "Đăng Ký" }}
      </button>
    </form>
    <hr />
    <div class="text-center">
      <button class="btn btn-link" @click="toggleAuthMode">
        {{ isLoginMode ? "Chuyển sang Đăng Ký" : "Chuyển sang Đăng Nhập" }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();

const mode = ref("login");
const form = ref({
  email: "",
  password: "",
  confirmPassword: "",
});
const message = ref({ text: "", type: "" });

const isLoginMode = computed(() => mode.value === "login");

onMounted(() => {
  // Xóa phiên đăng nhập cũ khi vào trang auth
  if (authStore.isLoggedIn) {
    authStore.logout();
  }
  mode.value = route.query.mode || "login";
});

// Cập nhật chế độ khi query URL thay đổi
watch(
  () => route.query.mode,
  (newMode) => {
    mode.value = newMode || "login";
    message.value = { text: "", type: "" }; // Xóa thông báo khi chuyển chế độ
  }
);

function toggleAuthMode() {
  const newMode = isLoginMode.value ? "signup" : "login";
  router.push({ name: "Auth", query: { mode: newMode } });
}

function handleAuthSubmit() {
  message.value = { text: "", type: "" };
  const users = JSON.parse(localStorage.getItem("horizone_users")) || [];

  if (!isLoginMode.value) {
    // Chế độ Đăng ký
    if (form.value.password !== form.value.confirmPassword) {
      message.value = {
        text: "Lỗi: Mật khẩu xác nhận không khớp.",
        type: "error",
      };
      return;
    }
    if (users.find((user) => user.email === form.value.email)) {
      message.value = {
        text: "Lỗi: Email này đã được đăng ký.",
        type: "error",
      };
      return;
    }

    // Thêm người dùng mới
    users.push({
      email: form.value.email,
      password: form.value.password,
      displayName: form.value.email.split("@")[0],
    });
    localStorage.setItem("horizone_users", JSON.stringify(users));

    // Chuyển sang chế độ đăng nhập và báo thành công
    router.push({ name: "Auth", query: { mode: "login" } });
    // Tạm thời không hiển thị message thành công vì sẽ bị xóa ngay khi route thay đổi
    // Để hiển thị, cần dùng state management phức tạp hơn hoặc query params
  } else {
    // Chế độ Đăng nhập
    const success = authStore.login(form.value.email, form.value.password);
    if (success) {
      router.push({ name: "Posts" });
    } else {
      message.value = {
        text: "Lỗi: Email hoặc mật khẩu không chính xác.",
        type: "error",
      };
    }
  }
}
</script>

<style>
.auth-container {
  width: 100%;
  max-width: 400px;
  background-color: var(--color-white);
  padding: 40px;
  border-radius: 15px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  margin: 5vh auto;
}
.auth-container h1 {
  color: var(--color-primary-brown);
  font-weight: 700;
  margin-bottom: 20px;
}
.btn-submit {
  background-color: var(--color-primary-brown);
  border-color: var(--color-primary-brown);
  color: white;
}
.btn-submit:hover {
  background-color: #a47e53;
  border-color: #a47e53;
}
</style>
