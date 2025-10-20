<template>
  <main class="content-area container py-5">
    <!-- Chế độ xem danh sách bài viết -->
    <section v-if="state.currentView === 'list'" class="blog-section">
      <div
        class="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-5"
      >
        <h1 class="mb-3 mb-md-0 fw-bold">Tất Cả Bài Viết</h1>
        <button
          @click="navigateTo('editor', null)"
          class="btn btn-action rounded-pill px-4 py-2"
        >
          <i class="fas fa-plus me-2"></i>Tạo Bài Viết Mới
        </button>
      </div>

      <div v-if="filteredPosts.length > 0" class="row g-4 blog-grid">
        <div
          v-for="post in filteredPosts"
          :key="post.id"
          class="col-md-6 col-lg-4 d-flex"
        >
          <div
            class="card blog-card h-100 w-100"
            @click="navigateTo('detail', post.id)"
          >
            <img
              :src="
                post.imageUrl ||
                'https://images.unsplash.com/photo-1473625247510-8ceb1760943f?q=80&w=1470'
              "
              class="card-img-top blog-card-img"
              :alt="post.title"
            />
            <div class="card-body d-flex flex-column p-4">
              <a
                href="#"
                @click.prevent="navigateTo('detail', post.id)"
                class="blog-card-title text-decoration-none my-2"
                >{{ post.title }}</a
              >
              <p class="card-text small text-muted flex-grow-1">
                {{ post.content.substring(0, 100) }}...
              </p>
              <div class="d-flex align-items-center mt-4 pt-2 border-top">
                <img
                  :src="getAuthorAvatar(post)"
                  class="user-avatar me-2"
                  alt="Author Avatar"
                />
                <div class="small">
                  <div class="fw-bold">{{ post.authorName }}</div>
                  <div class="text-muted">
                    {{ new Date(post.createdAt).toLocaleDateString("vi-VN") }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-else class="text-center py-5">
        <p v-if="searchQuery" class="text-muted">
          Không tìm thấy bài viết nào phù hợp với tìm kiếm của bạn.
        </p>
        <p v-else class="text-muted">
          Chưa có bài viết nào. Hãy là người đầu tiên tạo bài viết!
        </p>
      </div>
    </section>

    <!-- Chế độ xem chi tiết bài viết -->
    <section
      v-else-if="state.currentView === 'detail' && currentPost"
      class="post-detail-section"
    >
      <div class="container" style="max-width: 800px; text-align: left">
        <a
          href="#"
          @click.prevent="navigateTo('list')"
          class="text-decoration-none text-muted mb-4 d-inline-block"
          >&larr; Quay lại Tất cả bài viết</a
        >

        <div class="post-header mb-4">
          <h1 class="post-title mb-3">{{ currentPost.title }}</h1>
          <div class="d-flex align-items-center">
            <img
              :src="getAuthorAvatar(currentPost)"
              class="user-avatar me-3"
              alt="Author Avatar"
            />
            <div>
              <div class="fw-bold">{{ currentPost.authorName }}</div>
              <div class="text-muted small">
                Đăng ngày:
                {{
                  new Date(currentPost.createdAt).toLocaleDateString("vi-VN")
                }}
              </div>
            </div>
            <div
              v-if="
                currentUser && currentUser.email === currentPost.authorEmail
              "
              class="ms-auto"
            >
              <button
                @click="navigateTo('editor', currentPost.id)"
                class="btn btn-sm btn-outline-secondary"
              >
                Chỉnh sửa
              </button>
            </div>
          </div>
        </div>

        <img
          :src="
            currentPost.imageUrl ||
            'https://images.unsplash.com/photo-1473625247510-8ceb1760943f?q=80&w=1470'
          "
          class="img-fluid rounded mb-4 post-main-image"
          :alt="currentPost.title"
        />
        <div
          class="post-content"
          v-html="currentPost.content.replace(/\n/g, '<br>')"
        ></div>

        <hr class="my-5" />

        <!-- Khu vực bình luận -->
        <div class="comments-section">
          <h3 class="mb-4">Bình luận ({{ comments.length }})</h3>
          <div id="comment-list" class="mb-5">
            <p v-if="comments.length === 0" class="text-muted border-top pt-4">
              Chưa có bình luận nào.
            </p>
            <div
              v-for="comment in comments"
              :key="comment.id"
              class="comment-item"
            >
              <div class="d-flex">
                <div class="flex-shrink-0">
                  <img
                    :src="getAuthorAvatar(comment)"
                    class="user-avatar"
                    alt="Avatar"
                  />
                </div>
                <div class="ms-3 flex-grow-1">
                  <div
                    class="d-flex justify-content-between align-items-center"
                  >
                    <span class="fw-bold comment-author">{{
                      comment.authorName
                    }}</span>
                    <span class="text-muted small">{{
                      new Date(comment.createdAt).toLocaleString("vi-VN")
                    }}</span>
                  </div>
                  <p class="mt-2 mb-0">{{ comment.content }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Form thêm bình luận -->
          <div v-if="currentUser" class="card add-comment-form">
            <div class="card-body">
              <h5 class="card-title mb-3">Để lại bình luận</h5>
              <form @submit.prevent="addComment">
                <div class="mb-3">
                  <textarea
                    v-model="newCommentContent"
                    class="form-control"
                    rows="4"
                    placeholder="Viết bình luận của bạn..."
                    required
                  ></textarea>
                </div>
                <button type="submit" class="btn btn-action">
                  Gửi bình luận
                </button>
              </form>
            </div>
          </div>
          <div v-else class="alert alert-light text-center">
            Vui lòng
            <router-link :to="{ name: 'Auth', query: { mode: 'login' } }"
              >đăng nhập</router-link
            >
            để để lại bình luận.
          </div>
        </div>
      </div>
    </section>

    <!-- Chế độ xem trình soạn thảo -->
    <section v-else-if="state.currentView === 'editor'" class="editor-view">
      <div class="container" style="max-width: 800px">
        <!-- 1. Kiểm tra đăng nhập trước tiên -->
        <div v-if="!currentUser" class="alert alert-danger text-center my-5">
          Vui lòng
          <router-link :to="{ name: 'Auth', query: { mode: 'login' } }"
            >đăng nhập</router-link
          >
          để tạo bài viết mới.
        </div>

        <!-- 2. Nếu là chế độ sửa, kiểm tra quyền -->
        <div
          v-else-if="
            isEditMode &&
            (!currentPost || currentPost.authorEmail !== currentUser.email)
          "
          class="alert alert-danger text-center my-5"
        >
          Bạn không có quyền chỉnh sửa bài viết này hoặc bài viết không tồn tại.
        </div>

        <!-- 3. Nếu đã đăng nhập và có quyền (hoặc đang tạo mới), hiển thị form -->
        <form v-else @submit.prevent="savePost" class="editor-form">
          <h1 class="mb-4 fw-bold">
            {{ isEditMode ? "Chỉnh Sửa Bài Viết" : "Tạo Bài Viết Mới" }}
          </h1>
          <div class="mb-4">
            <label for="postTitle" class="form-label">Tiêu đề</label>
            <input
              type="text"
              class="form-control form-control-lg"
              id="postTitle"
              v-model="postForm.title"
              required
            />
          </div>
          <div class="mb-4">
            <label for="postImageFile" class="form-label">{{
              isEditMode ? "Thay đổi ảnh bìa (tùy chọn)" : "Ảnh Bìa"
            }}</label>
            <div v-if="isEditMode && postForm.imageUrl" class="mb-2">
              <img
                :src="postForm.imageUrl"
                class="img-fluid rounded"
                style="max-height: 200px"
                alt="Ảnh bìa hiện tại"
              />
            </div>
            <input
              type="file"
              class="form-control"
              id="postImageFile"
              accept="image/*"
              @change="handleImageUpload"
            />
          </div>
          <div class="mb-4">
            <label for="postContent" class="form-label">Nội dung</label>
            <textarea
              class="form-control"
              id="postContent"
              rows="12"
              v-model="postForm.content"
              required
            ></textarea>
          </div>
          <div class="d-flex gap-2">
            <button type="submit" class="btn btn-action btn-lg">
              {{ isEditMode ? "Lưu Thay Đổi" : "Đăng Bài" }}
            </button>
            <button
              type="button"
              class="btn btn-secondary btn-lg"
              @click="navigateTo('list')"
            >
              Hủy
            </button>
          </div>
        </form>
      </div>
    </section>

    <!-- Fallback khi không tìm thấy bài viết hoặc đang tải -->
    <div
      v-else-if="state.currentView === 'detail' && !currentPost"
      class="text-center p-5"
    >
      <div class="spinner-border" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
      <p class="mt-3 text-muted">Đang tải bài viết...</p>
    </div>
    <div v-else class="alert alert-danger text-center my-5">
      Có lỗi xảy ra hoặc bài viết không tồn tại.
    </div>
  </main>
</template>

<script setup>
import { ref, reactive, onMounted, computed, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import { usePostStore } from "@/stores/post";

// --- STATE MANAGEMENT ---
const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const postStore = usePostStore();

const state = reactive({
  currentView: "list", // 'list', 'detail', 'editor'
  currentPostId: null,
});

const posts = ref([]);
const allUsers = ref([]);
const comments = ref([]);
const newCommentContent = ref("");

const postForm = reactive({
  title: "",
  content: "",
  imageUrl: null,
  imageFile: null,
});

// --- COMPUTED PROPERTIES ---
const currentUser = computed(() => authStore.currentUser);
const searchQuery = computed(() => postStore.searchQuery);
const isEditMode = computed(
  () => state.currentPostId && state.currentView === "editor"
);

const filteredPosts = computed(() => {
  if (!searchQuery.value) {
    return posts.value;
  }
  return posts.value.filter(
    (post) =>
      post.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      post.content.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

const currentPost = computed(() => {
  if (state.currentPostId) {
    return posts.value.find(
      (p) => String(p.id) === String(state.currentPostId)
    );
  }
  return null;
});

// --- DATA LOADING & WATCHERS ---
onMounted(() => {
  authStore.initializeAuth();
  loadDataFromStorage();
  updateStateFromUrl();
});

watch(
  () => route.query,
  () => {
    updateStateFromUrl();
  },
  { deep: true, immediate: true }
);

watch(
  [() => state.currentView, currentPost],
  ([newView, newPost]) => {
    if (newView === "detail" && newPost) {
      loadComments(newPost.id);
    }
    if (newView === "editor" && newPost) {
      postForm.title = newPost.title;
      postForm.content = newPost.content;
      postForm.imageUrl = newPost.imageUrl;
      postForm.imageFile = null;
    }
  },
  { immediate: true }
);

function loadDataFromStorage() {
  posts.value = JSON.parse(localStorage.getItem("horizone_posts")) || [];
  posts.value.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  allUsers.value = JSON.parse(localStorage.getItem("horizone_users")) || [];
}

function updateStateFromUrl() {
  const { view, postId } = route.query;
  state.currentView = view || "list";
  state.currentPostId = postId || null;

  if (state.currentView === "editor" && !state.currentPostId) {
    resetPostForm();
  }
}

// ---NAVIGATION ---
function navigateTo(view, postId = null) {
  const query = {};
  if (view && view !== "list") query.view = view;
  if (postId) query.postId = postId;

  router.push({ name: "Posts", query });
}

// --- HELPERS ---
function getAuthorAvatar(item) {
  if (!item || !item.authorEmail) {
    return `https://ui-avatars.com/api/?name=?&background=6F4E37&color=fff&size=40`;
  }
  const authorDetails =
    allUsers.value.find((u) => u.email === item.authorEmail) || {};
  return (
    authorDetails.avatarUrl ||
    `https://ui-avatars.com/api/?name=${(item.authorName || "?")
      .charAt(0)
      .toUpperCase()}&background=6F4E37&color=fff&size=40`
  );
}

function resetPostForm() {
  postForm.title = "";
  postForm.content = "";
  postForm.imageUrl = null;
  postForm.imageFile = null;
}

// --- COMMENTS ---
function loadComments(postId) {
  const allComments =
    JSON.parse(localStorage.getItem("horizone_comments")) || [];
  comments.value = allComments
    .filter((c) => String(c.postId) === String(postId))
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

function addComment() {
  if (!currentUser.value) {
    alert("Vui lòng đăng nhập để bình luận.");
    return;
  }
  const content = newCommentContent.value.trim();
  if (!content) return;

  const userDetails =
    allUsers.value.find((u) => u.email === currentUser.value.email) || {};

  const newComment = {
    id: "comment_" + Date.now(),
    postId: state.currentPostId,
    content: content,
    authorEmail: currentUser.value.email,
    authorName: userDetails.name || currentUser.value.email.split("@")[0],
    createdAt: new Date().toISOString(),
  };

  const allComments =
    JSON.parse(localStorage.getItem("horizone_comments")) || [];
  allComments.push(newComment);
  localStorage.setItem("horizone_comments", JSON.stringify(allComments));

  newCommentContent.value = "";
  loadComments(state.currentPostId);
}

// --- POSTS ---
function handleImageUpload(event) {
  const file = event.target.files[0];
  if (!file) {
    return;
  }

  // --- BẮT ĐẦU PHẦN SỬA LỖI ---
  // Giới hạn kích thước file, ví dụ: 2MB
  const maxSizeInBytes = 2 * 1024 * 1024; // 2MB
  if (file.size > maxSizeInBytes) {
    alert(
      "Lỗi: Kích thước ảnh quá lớn! Vui lòng chọn ảnh có dung lượng dưới 2MB."
    );
    // Xóa file đã chọn để người dùng không gửi được file lớn này
    event.target.value = null;
    return;
  }
  // --- KẾT THÚC PHẦN SỬA LỖI ---

  postForm.imageFile = file;
  // Optional: Show a preview
  const reader = new FileReader();
  reader.onload = (e) => {
    postForm.imageUrl = e.target.result;
  };
  reader.readAsDataURL(file);
}

async function savePost() {
  if (!currentUser.value) {
    alert("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
    return;
  }

  let imageUrlToSave = isEditMode.value ? currentPost.value.imageUrl : null;

  if (postForm.imageFile) {
    const readFileAsBase64 = (file) => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
        reader.readAsDataURL(file);
      });
    };
    try {
      imageUrlToSave = await readFileAsBase64(postForm.imageFile);
    } catch (error) {
      console.error("Lỗi khi đọc file ảnh:", error);
      alert("Đã xảy ra lỗi khi tải ảnh lên. Vui lòng thử lại.");
      return;
    }
  }

  const allPosts = JSON.parse(localStorage.getItem("horizone_posts")) || [];

  if (isEditMode.value) {
    const postIndex = allPosts.findIndex(
      (p) => String(p.id) === String(state.currentPostId)
    );
    if (postIndex > -1) {
      allPosts[postIndex] = {
        ...allPosts[postIndex],
        title: postForm.title,
        content: postForm.content,
        imageUrl: imageUrlToSave,
        updatedAt: new Date().toISOString(),
      };
      localStorage.setItem("horizone_posts", JSON.stringify(allPosts));
      loadDataFromStorage();
      alert("Cập nhật bài viết thành công!");
      navigateTo("detail", state.currentPostId);
    }
  } else {
    const userDetails =
      allUsers.value.find((u) => u.email === currentUser.value.email) || {};
    const newPost = {
      id: Date.now(),
      title: postForm.title,
      imageUrl: imageUrlToSave,
      content: postForm.content,
      authorEmail: currentUser.value.email,
      authorName: userDetails.name || currentUser.value.email.split("@")[0],
      createdAt: new Date().toISOString(),
    };
    allPosts.push(newPost);
    localStorage.setItem("horizone_posts", JSON.stringify(allPosts));
    loadDataFromStorage();
    alert("Đăng bài viết thành công!");
    navigateTo("detail", newPost.id);
  }
}
</script>

<style>
/* GENERAL & TYPOGRAPHY */
.content-area {
  color: #333;
}

/* BLOG LIST & CARD STYLES */
.blog-card {
  border: none;
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  cursor: pointer;
  display: flex;
  flex-direction: column;
}
.blog-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 35px rgba(0, 0, 0, 0.15);
}
.blog-card-img {
  height: 220px;
  width: 100%;
  object-fit: cover;
}
.blog-card-title {
  font-size: 1.25rem;
  font-weight: 700;
  line-height: 1.4;
  color: var(--color-text-dark);
}
.blog-card-title:hover {
  color: var(--color-primary-brown);
}
.blog-card .user-avatar {
  width: 40px;
  height: 40px;
}

/* POST DETAIL */
.post-detail-section .user-avatar {
  width: 50px;
  height: 50px;
}
.post-title {
  font-size: 2.5rem;
  font-weight: 700;
  line-height: 1.3;
}
.post-main-image {
  max-height: 450px;
  object-fit: cover;
  width: 100%;
}
.post-content {
  font-size: 1.1rem;
  line-height: 1.8;
  color: #444;
  text-align: left;
}
.post-content h1,
.post-content h2,
.post-content h3 {
  margin-top: 2.5rem;
  margin-bottom: 1.5rem;
  font-weight: 700;
}

/* COMMENTS SECTION */
.comments-section h3 {
  font-weight: 700;
}
.comment-item {
  padding: 1.5rem 0;
  border-bottom: 1px solid var(--color-border-light);
}
.comment-item:last-child {
  border-bottom: none;
}
.comment-author {
  color: var(--color-text-dark);
}
.comments-section .user-avatar {
  width: 45px;
  height: 45px;
}
.comments-section p {
  text-align: left;
}
.add-comment-form {
  border-radius: 10px;
  border-color: var(--color-border-light);
  box-shadow: none;
}

/* EDITOR */
.editor-form .form-label {
  font-weight: 600;
  margin-bottom: 0.5rem;
}
.btn-action {
  background-color: var(--color-primary-brown);
  color: var(--color-white);
  border: none;
  transition: background-color 0.3s ease;
}
.btn-action:hover {
  background-color: var(--color-accent-tan);
  color: var(--color-white);
}
.editor-form .form-control {
  border-radius: 8px;
  padding: 0.75rem 1rem;
}
.editor-form .form-control:focus {
  box-shadow: 0 0 0 3px var(--color-primary-brown-light);
  border-color: var(--color-primary-brown);
}
.editor-form textarea {
  min-height: 250px;
}

/* SHARED */
.user-avatar {
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid var(--color-border-light);
}
</style>
