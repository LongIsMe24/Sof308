const DB_NAME = "HorizoneDB";
const DB_VERSION = 1;

let db;

function openDB() {
  return new Promise((resolve, reject) => {
    if (db) {
      return resolve(db);
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = (event) => {
      console.error("IndexedDB error:", event.target.error);
      reject("Error opening database.");
    };

    request.onsuccess = (event) => {
      db = event.target.result;
      resolve(db);
    };

    request.onupgradeneeded = (event) => {
      const tempDb = event.target.result;
      if (!tempDb.objectStoreNames.contains("users")) {
        tempDb.createObjectStore("users", { keyPath: "email" });
      }
      if (!tempDb.objectStoreNames.contains("posts")) {
        tempDb.createObjectStore("posts", { keyPath: "id" });
      }
      if (!tempDb.objectStoreNames.contains("comments")) {
        tempDb.createObjectStore("comments", { keyPath: "id" });
      }
    };
  });
}

async function addData(storeName, data) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, "readwrite");
    const store = transaction.objectStore(storeName);
    const request = store.put(data);

    request.onsuccess = () => resolve();
    request.onerror = (event) => reject("Error adding data: " + event.target.error);
  });
}

async function getAllData(storeName) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, "readonly");
    const store = transaction.objectStore(storeName);
    const request = store.getAll();

    request.onsuccess = () => resolve(request.result);
    request.onerror = (event) => reject("Error getting data: " + event.target.error);
  });
}

async function clearStore(storeName) {
    const db = await openDB();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(storeName, "readwrite");
        const store = transaction.objectStore(storeName);
        const request = store.clear();

        request.onsuccess = () => resolve();
        request.onerror = (event) => reject("Error clearing store: " + event.target.error);
    });
}

async function deleteData(storeName, key) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, "readwrite");
    const store = transaction.objectStore(storeName);
    const request = store.delete(key);

    request.onsuccess = () => resolve();
    request.onerror = (event) => reject("Error deleting data: " + event.target.error);
  });
}

export { openDB, addData, getAllData, clearStore, deleteData };
