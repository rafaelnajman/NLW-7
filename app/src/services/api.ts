import axios from "axios";

export const api = axios.create({
  baseURL: "http://192.168.165.112:4000",
});
