import axios from 'axios';
import _ from 'lodash';
import { ClearTokens, TokenType } from './Utilities';

function IsTokenError(error) {
    if (_.has(error, "response.data.code")) {
        if (_.has(error, "response.data.messages")) {
            return (error.response.data.code === "token_not_valid" && error.response.data.messages[0].token_type === "access");
        }
    }

    return false;
}

function AxiosClient() {
    let new_axios = axios.create({
        headers: {
            "Cache-Control": "no-cache",
            "Content-Type": "application/json"
        }
    });

    // IF ACCESS TOKENS EXIST, USE THEM FOR ALL API CALLS
    new_axios.interceptors.request.use((config) => {
        let access = localStorage.getItem("TEST-AUTH") || sessionStorage.getItem("TEST-AUTH");
        if (access != null) config.headers["Authorization"] = `Bearer ${access}`;
        
        return config;
    }, (error) => Promise.reject(error));

    // IF ACCESS TOKEN EXPIRES, RENEW
    new_axios.interceptors.response.use((response) => response, async (error) => {
        let config = error.config;

        if (IsTokenError(error)) {
            let refresh = localStorage.getItem("TEST-REFRESH") || sessionStorage.getItem("TEST-REFRESH");
            localStorage.removeItem("TEST-AUTH");
            sessionStorage.removeItem("TEST-AUTH");

            if (refresh != null) {
                let retval = null;

                try {
                    retval = await new_axios.post("/api/token/refresh", { refresh: refresh });
                }
                catch (refresh_error) {
                    ClearTokens();
                    location.href = `/auth/login?redirect=${encodeURI(location.pathname)}`;
                }

                if (_.has(retval, "data.access")) {
                    TokenType().setItem("TEST-AUTH", retval.data.access);

                    return new_axios(config);
                }
            }
        }
        
        return Promise.reject(error);
    });

    return new_axios;
}

export const Axios = globalThis.Axios || AxiosClient();
globalThis.Axios = Axios;