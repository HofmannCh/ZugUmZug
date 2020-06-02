import axios from 'axios'
import Vue from 'vue'
import { AuthModule } from "@/stores/modules/AuthModule";
const api = axios.create({
    baseURL: process.env.VUE_APP_API_BASE_URL ?? "https://api-zuz.hofi.dev/",
    timeout: 5000,
    headers: {
        'Content-Type': 'application/json'
    },
    withCredentials: true,
    transformResponse: [(res): any => {
        const data = JSON.parse(res);
        if (data?.success == false) {
            Vue.toasted.show(data.data.message, { type: "error" });
        }
        return data;
    }]
});

// api.interceptors.request.use(conf => {
//     return conf;
// })

api.interceptors.response.use(conf => conf, conf => {
    const status: number = conf.response.status;
    switch (status) {
        case 401: // Unauthorized
        case 403: // Forbidden
        case 423: // Locked
            // console.error("Authorization falied with status: " + status);
            AuthModule.Logout();
            break;
    }

    return conf;
});

export default api;