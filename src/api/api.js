// src/api/api.js
import axios from "axios";

const API = axios.create({
  baseURL: "https://company-form-server.onrender.com/api",  // ✅ Updated for Render server
});

export default API;
