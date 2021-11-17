import request from './axios.js'
export function upload(data) {
    return request({
        url: `/upload`,
        method: 'post',
        data
    })
}


export function getMusiuc() {
    return request({
        url: `/upload`,
        method: 'get',
    })
}