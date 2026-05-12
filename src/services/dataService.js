export const dataService = {
  get: (key, defaultValue) => {
    try {
      const item = localStorage.getItem(key);
      if (item) {
        const parsed = JSON.parse(item);
        if (parsed.expiry && Date.now() > parsed.expiry) {
          localStorage.removeItem(key);
          return defaultValue;
        }
        return parsed.value;
      }
      return defaultValue;
    } catch (e) {
      console.error("Error reading from localStorage", e);
      return defaultValue;
    }
  },

  set: (key, value, expiryDays = null) => {
    try {
      const item = {
        value,
        expiry: expiryDays ? Date.now() + expiryDays * 24 * 60 * 60 * 1000 : null
      };
      localStorage.setItem(key, JSON.stringify(item));
    } catch (e) {
      console.error("Error saving to localStorage", e);
    }
  },

  remove: (key) => {
    try {
      localStorage.removeItem(key);
    } catch (e) {}
  }
};
