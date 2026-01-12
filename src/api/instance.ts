// axios instance
import axios from "axios";

const instance = axios.create({
  baseURL: "http://52.79.215.19:8080",
  headers: {
    "Content-Type": "application/json",
  },
});

export default instance;

export const adminLogin = async () => {
  const response = await instance.post("/admin/login", {
    email: "test@test.com",
    password: "test",
  });
  return response.data;
};
