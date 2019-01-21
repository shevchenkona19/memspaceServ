import axios from "axios";
import Cookies from "js-cookie";

const request = (options = {}) => {
    return axios.request({
        url: SERVER_URL + options.url,
        method: options.method,
        headers: {
            authorization: "jwt " + Cookies.get("token")
        },
        data: options.method === "POST" || options.method === "PUT" ? options.data : undefined,
    }).then(res => {
        return res.data;
    }).catch(err => {
        return err;
    });
};

export const get = (url, options = {}) => {
    return request({
        method: "GET",
        url,
        ...options,
    })
};

export const post = (url, body, options = {}) => {
    return request({
        method: "POST",
        data: body,
        url,
        ...options
    })
};