import { get, post } from './http.js'

export const searchReq = async (key, pageNo = 1, pageSize = 20, t = 0) => {
    const res = await post('search', {
        key: key,
        pageNo: pageNo,
        pageSize: pageSize,
        t: t
    });
    return res.data.list;
};

export const cookieReq = async () => {
    const res = await get('user/cookie');
    console.log(res);
};