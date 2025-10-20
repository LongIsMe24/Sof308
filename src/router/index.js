import { createRouter, createWebHistory } from "vue-router";
import HomePage from "@/views/HomePage.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "Home",
      component: HomePage,
    },
    {
      path: "/posts",
      name: "Posts",
      // Lazy load component
      component: () => import("@/views/PostsView.vue"),
    },
    {
      path: "/profile",
      name: "Profile",
      component: () => import("@/views/ProfileView.vue"),
      meta: { requiresAuth: true },
    },
    {
      path: "/auth",
      name: "Auth",
      component: () => import("@/views/AuthView.vue"),
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
    authStore.initializeAuth();
  }

  if (to.meta.requiresAuth && !authStore.isLoggedIn) {
    next({ name: "Auth", query: { mode: "login" } }); // Redirect to login if auth is required and user is not logged in
  } else {
    next(); // Continue to the route
  }
});

export default router;
