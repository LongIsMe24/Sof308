<template>
  <main class="content-area">
    <!-- BÀI VIẾT NỔI BẬT -->
    <section class="featured-posts-section">
      <div class="container">
        <div class="text-center mb-5">
          <h2 class="fw-bold">Bài Viết Nổi Bật</h2>
          <p class="text-muted">
            Khám phá những câu chuyện, kinh nghiệm và điểm đến hấp dẫn nhất.
          </p>
        </div>
        <!-- Lưới hiển thị bài viết nổi bật, giờ được render bằng v-for -->
        <div v-if="featuredPosts.length > 0" class="row g-4">
          <div v-for="post in featuredPosts" :key="post.id" class="col-md-4">
            <div class="card post-card h-100 shadow-sm">
              <router-link :to="`/posts?postId=${post.id}`">
                <img
                  :src="
                    post.imageUrl ||
                    'https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=1470'
                  "
                  class="card-img-top post-card-img"
                  :alt="post.title"
                />
              </router-link>
              <div class="card-body">
                <router-link
                  :to="`/posts?postId=${post.id}`"
                  class="post-card-title text-decoration-none"
                  >{{ post.title }}</router-link
                >
              </div>
            </div>
          </div>
        </div>
        <div v-else class="text-center">
          <p>Chưa có bài viết nào.</p>
        </div>
      </div>
      <div class="text-center mt-5">
        <router-link
          :to="{ name: 'Posts' }"
          class="btn btn-outline-dark rounded-pill px-4 py-2"
        >
          Xem Tất Cả Bài Viết &rarr;
        </router-link>
      </div>
    </section>
  </main>
</template>

<script setup>
import { ref, onMounted } from "vue";

const featuredPosts = ref([]);

onMounted(() => {
  const allPosts = JSON.parse(localStorage.getItem("horizone_posts")) || [];
  if (allPosts.length > 0) {
    featuredPosts.value = allPosts
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 3);
  }
});
</script>
<style>
.featured-posts-section {
  padding: 50px 0;
}
.post-card {
  border: 1px solid var(--color-border-light);
  border-radius: 15px;
  transition: transform 0.3s, box-shadow 0.3s;
  overflow: hidden;
}
.post-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.08) !important;
}
.post-card-img {
  height: 200px;
  object-fit: cover;
}
.post-card-title {
  font-weight: 600;
  color: var(--color-text-dark);
  text-decoration: none;
}
.post-card-title:hover {
  color: var(--color-primary-brown);
}
</style>
