import axios from "axios";

const base_url = "localhost:8080/";

export const api_interceptor = axios.create({
  baseURL: base_url,
  timeout: 1200000,
});
