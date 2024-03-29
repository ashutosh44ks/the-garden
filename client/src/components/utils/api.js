import axios from "axios";
import jwt_decode from "jwt-decode";

const api = axios.create({
  baseURL: process.env.REACT_APP_BASE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

const refreshToken = async () => {
  const refreshToken = JSON.parse(localStorage.getItem("logged")).refreshToken;
  try {
    const { data } = await axios.post(
      `${process.env.REACT_APP_BASE_API_URL}/api/auth/refresh_token`,
      {
        token: refreshToken,
      }
    );
    localStorage.setItem("logged", JSON.stringify(data));
  } catch (e) {
    console.log(e);
    localStorage.removeItem("logged");
  }
};

// Add a request interceptor
api.interceptors.request.use(
  async function (config) {
    // Do something before request is sent
    if (!localStorage.getItem("logged")) return config;
    const { exp } = jwt_decode(
      JSON.parse(localStorage.getItem("logged")).accessToken
    );
    if (exp < Date.now() / 1000) await refreshToken();
    Object.assign(config.headers, {
      Authorization:
        "Bearer " + JSON.parse(localStorage.getItem("logged")).accessToken,
    });
    return config;
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error);
  }
);

// Add a response interceptor
// axios.interceptors.response.use(function (response) {
//   // Do something with response data
//   return response;
// }, function (error) {
//   // Do something with response error
//   return Promise.reject(error);
// });

export default api;
