import { get, post } from './http.js'

export const searchReq = async (key, pageNo = 1, pageSize = 20, t = 0) => {
    const res = await post('search', {
        key: key,
        pageNo: pageNo,
        pageSize: pageSize,
        t: t
    });
    if (res) {
        return res.data.list;
    } else {
        return;
    }

};

export const refreshReq = async () => {
    const res = await get('/user/refresh');
    console.log(res);
};

export const songReq = async (songmids) => {
    if (songmids instanceof Array) {
        songmids = songmids.join(',')
    }
    const res = await get('/song/urls', {
        id: songmids
    });
    if (res) {
        return res.data;
    } else {
        return;
    }
};

export const songInfoReq = async (songmid) => {
    const res = await get('/song', {
        songmid: songmid
    });
    if (res) {
        return res.data;
    } else {
        return;
    }
};

export const albumInfoReq = async (albummid) => {
    const res = await get('/album', {
        albummid: albummid
    });
    console.log('res', res)
    if (res) {
        return res.data;
    } else {
        return;
    }
};