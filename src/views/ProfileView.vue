<template>
  <main class="container profile-container py-5">
    <h1 class="text-center mb-5 fw-bold">Hồ Sơ Cá Nhân</h1>
    <form
      v-if="profileForm"
      @submit.prevent="handleProfileUpdate"
      class="profile-form-container"
    >
      <div class="row g-lg-5">
        <div class="col-lg-4 text-center profile-sidebar">
          <div
            class="profile-avatar-wrapper mx-auto mb-3"
            @click="triggerAvatarUpload"
          >
            <img :src="avatarPreview" alt="Avatar" class="profile-avatar" />
            <div
              class="edit-avatar-overlay rounded-circle d-flex justify-content-center align-items-center"
            >
              <i class="fas fa-camera fa-2x"></i>
            </div>
            <input
              type="file"
              id="avatarUpload"
              class="d-none"
              accept="image/*"
              @change="handleAvatarChange"
            />
          </div>
          <h4>{{ profileForm.displayName }}</h4>
          <p class="text-muted">{{ profileForm.email }}</p>
        </div>
        <div class="col-lg-8">
          <div
            v-if="message.text"
            :class="[
              'alert',
              message.type === 'success' ? 'alert-success' : 'alert-danger',
            ]"
          >
            {{ message.text }}
          </div>
          <div class="mb-3">
            <label for="displayName" class="form-label">Tên hiển thị</label>
            <input
              type="text"
              class="form-control"
              id="displayName"
              v-model="profileForm.displayName"
              required
            />
          </div>
          <div class="mb-3">
            <label for="email" class="form-label">Email</label>
            <input
              type="email"
              class="form-control"
              id="email"
              v-model="profileForm.email"
              readonly
              disabled
            />
          </div>
          <hr class="my-4" />
          <h5 class="mb-3">Đổi mật khẩu</h5>
          <div class="mb-3">
            <label for="currentPassword" class="form-label"
              >Mật khẩu hiện tại</label
            >
            <input
              type="password"
              class="form-control"
              id="currentPassword"
              v-model="passwordForm.current"
              placeholder="Nhập để thay đổi mật khẩu"
            />
          </div>
          <div class="mb-3">
            <label for="newPassword" class="form-label">Mật khẩu mới</label>
            <input
              type="password"
              class="form-control"
              id="newPassword"
              v-model="passwordForm.new"
            />
          </div>
          <div class="mb-3">
            <label for="confirmNewPassword" class="form-label"
              >Xác nhận mật khẩu mới</label
            >
            <input
              type="password"
              class="form-control"
              id="confirmNewPassword"
              v-model="passwordForm.confirm"
            />
          </div>
          <button
            type="submit"
            class="btn btn-primary"
            style="
              background-color: var(--color-primary-brown);
              border-color: var(--color-primary-brown);
            "
          >
            Lưu Thay Đổi
          </button>
        </div>
      </div>
    </form>
    <hr class="my-5" />
    <div class="row">
      <h3 class="mb-4 fw-bold">Bài viết của tôi</h3>
      <div v-if="userPosts.length > 0" class="list-group">
        <div
          v-for="post in userPosts"
          :key="post.id"
          class="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
        >
          <div>
            <h6 class="mb-1">{{ post.title }}</h6>
            <small class="text-muted"
              >Đăng ngày:
              {{ new Date(post.createdAt).toLocaleDateString("vi-VN") }}</small
            >
          </div>
          <div>
            <router-link
              :to="`/posts?view=editor&postId=${post.id}`"
              class="btn btn-sm btn-outline-primary me-2"
            >
              <i class="fas fa-edit"></i> Sửa
            </router-link>
            <button
              class="btn btn-sm btn-outline-danger"
              @click="deletePost(post.id)"
            >
              <i class="fas fa-trash"></i> Xóa
            </button>
          </div>
        </div>
      </div>
      <p v-else class="text-muted">Bạn chưa có bài viết nào.</p>
    </div>
  </main>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from "vue";
import { useAuthStore } from "@/stores/auth";

const authStore = useAuthStore();

const profileForm = ref(null);
const passwordForm = reactive({ current: "", new: "", confirm: "" });
const userPosts = ref([]);
const message = ref({ text: "", type: "" });
const newAvatarDataUrl = ref(null);

const avatarPreview = computed(() => {
  if (newAvatarDataUrl.value) {
    return newAvatarDataUrl.value;
  }
  if (profileForm.value?.avatarUrl) {
    return profileForm.value.avatarUrl;
  }
  if (profileForm.value?.displayName) {
    return `https://ui-avatars.com/api/?name=${profileForm.value.displayName
      .charAt(0)
      .toUpperCase()}&background=A47E53&color=fff&size=120`;
  }
  return ""; // Default or placeholder
});

onMounted(() => {
  if (authStore.currentUser) {
    // Tạo một bản sao để chỉnh sửa, tránh thay đổi trực tiếp store
    profileForm.value = { ...authStore.currentUser };
    if (!profileForm.value.displayName) {
      profileForm.value.displayName = profileForm.value.email.split("@")[0];
    }
    loadUserPosts();
  }
});

function loadUserPosts() {
  const allPosts = JSON.parse(localStorage.getItem("horizone_posts")) || [];
  userPosts.value = allPosts
    .filter((p) => p.authorEmail === authStore.currentUser.email)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

function triggerAvatarUpload() {
  document.getElementById("avatarUpload").click();
}

function handleAvatarChange(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    newAvatarDataUrl.value = e.target.result;
  };
  reader.readAsDataURL(file);
  const maxSizeInBytes = 1 * 1024 * 1024; // 1MB cho avatar là hợp lý
  if (file.size > maxSizeInBytes) {
    alert("Lỗi: Kích thước ảnh đại diện quá lớn! Vui lòng chọn ảnh dưới 1MB.");
    event.target.value = null;
    return;
  }
}

function handleProfileUpdate() {
  message.value = { text: "", type: "" };

  let users = JSON.parse(localStorage.getItem("horizone_users")) || [];
  const userIndex = users.findIndex(
    (u) => u.email === authStore.currentUser.email
  );

  if (userIndex === -1) {
    message.value = { text: "Lỗi: Không tìm thấy người dùng.", type: "error" };
    return;
  }

  let userToUpdate = users[userIndex];

  // Xử lý đổi mật khẩu
  if (passwordForm.current || passwordForm.new || passwordForm.confirm) {
    if (userToUpdate.password !== passwordForm.current) {
      message.value = {
        text: "Lỗi: Mật khẩu hiện tại không chính xác.",
        type: "error",
      };
      return;
    }
    if (passwordForm.new.length < 6) {
      message.value = {
        text: "Lỗi: Mật khẩu mới phải có ít nhất 6 ký tự.",
        type: "error",
      };
      return;
    }
    if (passwordForm.new !== passwordForm.confirm) {
      message.value = { text: "Lỗi: Mật khẩu mới không khớp.", type: "error" };
      return;
    }
    userToUpdate.password = passwordForm.new;
  }

  // Cập nhật thông tin
  userToUpdate.displayName = profileForm.value.displayName;
  if (newAvatarDataUrl.value) {
    userToUpdate.avatarUrl = newAvatarDataUrl.value;
  }

  // Lưu lại
  users[userIndex] = userToUpdate;
  localStorage.setItem("horizone_users", JSON.stringify(users));

  // Cập nhật store của Pinia
  authStore.currentUser = { ...userToUpdate };

  // Cập nhật lại tên tác giả trong các bài viết của họ
  let posts = JSON.parse(localStorage.getItem("horizone_posts")) || [];
  posts.forEach((post) => {
    if (post.authorEmail === authStore.currentUser.email) {
      post.authorName = userToUpdate.displayName;
    }
  });
  localStorage.setItem("horizone_posts", JSON.stringify(posts));

  message.value = { text: "Cập nhật hồ sơ thành công!", type: "success" };
  passwordForm.current = "";
  passwordForm.new = "";
  passwordForm.confirm = "";
}

function deletePost(postId) {
  if (
    confirm(
      "Bạn có chắc chắn muốn xóa bài viết này không? Hành động này không thể hoàn tác."
    )
  ) {
    let posts = JSON.parse(localStorage.getItem("horizone_posts")) || [];
    posts = posts.filter((p) => p.id !== postId);
    localStorage.setItem("horizone_posts", JSON.stringify(posts));
    loadUserPosts(); // Tải lại danh sách bài viết
  }
}
</script>

<style>
.profile-container {
  max-width: 800px;
  margin: 40px auto;
}
.profile-avatar-wrapper {
  position: relative;
  width: 120px;
  height: 120px;
}
.profile-avatar {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid var(--color-accent-tan);
}
.profile-avatar-wrapper:hover .edit-avatar-overlay {
  opacity: 1;
}
.edit-avatar-overlay {
  position: absolute;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  opacity: 0;
  transition: opacity 0.3s;
  cursor: pointer;
}
.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid var(--color-accent-tan);
}
</style>
