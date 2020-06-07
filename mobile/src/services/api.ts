import axios from "axios";

const api = axios.create({
  baseURL: `http://${process.env.IP_ADDRESS}:${process.env.PORT}`,
});

export default api;
