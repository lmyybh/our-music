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
    const res = await post('/song/urls', {
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

export const getCookieReq = async (id) => {
    const res = await get('/user/getCookie', {
        id: id
    });
    console.log(res);
};

export const viewCookieReq = async () => {
    const res = await get('/user/cookie');
    console.log(res);
};

export const getDailyRecommondPlayListReq = async () => {
    const res = await get('/recommend/daily');
    console.log(res);
    if (res) {
        return res.data;
    } else {
        return;
    }
};

export const getSonglistReq = async (pageSize = 20, pageNo = 1, sort = 5, category = 10000000) => {
    const res = await get('/songlist/list', {
        pageSize, pageNo, sort, category
    });
    if (res) {
        return res.data;
    } else {
        return;
    }
};

export const getSonglistInfoReq = async (id) => {
    const res = await get('/songlist', { id });
    if (res) {
        return res.data;
    } else {
        return {};
    }
};