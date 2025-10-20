import { ref, computed } from "vue";
import { defineStore } from "pinia";
import router from "@/router";

export const useAuthStore = defineStore("auth", () => {
  const currentUser = ref(null);
  const isInitialized = ref(false);

  const isLoggedIn = computed(() => !!currentUser.value);

  function initializeAuth() {
    if (isInitialized.value) return;

    const userSession = JSON.parse(
      sessionStorage.getItem("horizone_currentUser")
    );
    if (userSession && userSession.email) {
      const allUsers = JSON.parse(localStorage.getItem("horizone_users")) || [];
      const userDetails = allUsers.find((u) => u.email === userSession.email);
      if (userDetails) {
        currentUser.value = userDetails;
      }
    }
    isInitialized.value = true;
  }

  function login(email, password) {
    const users = JSON.parse(localStorage.getItem("horizone_users")) || [];
    const user = users.find(
      (u) => u.email === email && u.password === password
    );
    if (user) {
      sessionStorage.setItem("horizone_currentUser", JSON.stringify({ email }));
      currentUser.value = user;
      return true;
    }
    return false;
  }

  function register(name, email, password) {
    const users = JSON.parse(localStorage.getItem("horizone_users")) || [];
    const userExists = users.some((u) => u.email === email);

    if (userExists) {
      return { success: false, message: "Email already exists." };
    }

    const newUser = {
      id: Date.now(),
      name,
      email,
      password, // Note: Storing passwords in plain text is insecure. This is for demonstration only.
      avatarUrl: `https://ui-avatars.com/api/?name=${name}&background=random&color=fff&size=150`,
    };

    users.push(newUser);
    localStorage.setItem("horizone_users", JSON.stringify(users));

    // Automatically log in the new user
    login(email, password);

    return { success: true };
  }

  function logout() {
    sessionStorage.removeItem("horizone_currentUser");
    currentUser.value = null;
    router.push({ name: "Home" }).then(() => window.location.reload());
  }

  return {
    currentUser,
    isLoggedIn,
    isInitialized,
    initializeAuth,
    login,
    register,
    logout,
  };
});
