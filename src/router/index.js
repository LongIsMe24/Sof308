import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "Auth",
      component: () => import("@/views/AuthView.vue"),
    },
    {
      path: "/posts",
      name: "Posts",
      component: () => import("@/views/PostsView.vue"),
      meta: { requiresAuth: true },
    },
    {
      path: "/profile",
      name: "Profile",
      component: () => import("@/views/ProfileView.vue"),
      meta: { requiresAuth: true },
    },
  ],
});

// Import store một lần duy nhất bên ngoài guard
import { useAuthStore } from "@/stores/auth";

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();

  // Nếu store chưa được khởi tạo, hãy chạy hàm initializeAuth()
  // Điều này đảm bảo nó chỉ chạy một lần khi cần.
  if (!authStore.isInitialized) {
    await authStore.initializeAuth();
  }

  const isAuthenticated = authStore.isLoggedIn;

  if (to.name === 'Auth' && isAuthenticated) {
    // Nếu đã đăng nhập, chuyển hướng khỏi trang Auth
    next({ name: 'Posts' });
  } else if (to.meta.requiresAuth && !isAuthenticated) {
    // Nếu route yêu cầu đăng nhập và chưa đăng nhập, chuyển hướng tới trang Auth
    next({ name: 'Auth' });
  } else {
    // Cho phép điều hướng
    next();
  }
});

export default router;
