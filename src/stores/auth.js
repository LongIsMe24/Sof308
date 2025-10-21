import { ref, computed } from "vue";
import { defineStore } from "pinia";
import router from "@/router";
import { addData, getAllData } from "@/utils/indexedDB";

export const useAuthStore = defineStore("auth", () => {
  const currentUser = ref(null);
  const isInitialized = ref(false);

  const isLoggedIn = computed(() => !!currentUser.value);

  async function initializeAuth() {
    if (isInitialized.value) return;

    await migrateUsersFromLocalStorage();

    const userSession = JSON.parse(
      sessionStorage.getItem("horizone_currentUser")
    );
    if (userSession && userSession.email) {
      const allUsers = await getAllData("users");
      const userDetails = allUsers.find((u) => u.email === userSession.email);
      if (userDetails) {
        currentUser.value = userDetails;
      }
    }
    isInitialized.value = true;
  }

  async function login(email, password) {
    const users = await getAllData("users");
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

  async function register(name, email, password) {
    const users = await getAllData("users");
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

    await addData("users", newUser);

    // Automatically log in the new user
    await login(email, password);

    return { success: true };
  }

  function logout() {
    sessionStorage.removeItem("horizone_currentUser");
    currentUser.value = null;
    router.push({ name: "Home" }).then(() => window.location.reload());
  }

  async function migrateUsersFromLocalStorage() {
    const oldUsers = JSON.parse(localStorage.getItem("horizone_users")) || [];
    if (oldUsers.length > 0) {
      try {
        const usersInDb = await getAllData("users");
        if (usersInDb.length === 0) {
          for (const user of oldUsers) {
            await addData("users", user);
          }
        }
        // Optional: Remove from localStorage after successful migration
        // localStorage.removeItem("horizone_users");
      } catch (error) {
        console.error("Failed to migrate users:", error);
      }
    }
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
