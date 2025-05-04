// src/services/jsonFileService.js

/**
 * This service provides a way to save data to your local JSON file.
 * It works with a small local server that needs to run alongside your React app.
 */
//JSONFILE SERVICE
const API_URL = "http://localhost:3001/api"; // Adjust port if needed

// Save data to the JSON file
export const saveToJsonFile = async (data) => {
  try {
    const response = await fetch(`${API_URL}/saveJson`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();
    return result.success;
  } catch (error) {
    console.error("Error saving to JSON file:", error);
    return false;
  }
};

// Load data from the JSON file
export const loadFromJsonFile = async () => {
  try {
    const response = await fetch(`${API_URL}/loadJson`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error loading from JSON file:", error);
    return null;
  }
};
