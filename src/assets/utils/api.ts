import { get, post } from './http'

export const searchReq = async (key: string, pageNo = 1, pageSize = 20, t = 0) => {
    const res: any = await post('search', {
        key: key,
        pageNo: pageNo,
        pageSize: pageSize,
        t: t
    });

    let data = [];
    if (res) {
        const resData = res.data.list;
        for (let i = 0; i < resData.length; i++) {
            data[i] = {
                songmid: resData[i].songmid,
                songname: resData[i].songname,
                singer: resData[i].singer[0].name,
                albumname: resData[i].albumname,
                albummid: resData[i].albummid,
                interval: resData[i].interval,
                pay_play: resData[i].pay.pay_play == 1
            }
        }
    }
    return data;
};

export const songsUrlsReq = async (songmids: string | Array<string>) => {
    if (songmids instanceof Array) {
        songmids = songmids.join(',')
    }
    const res: any = await post('/song/urls', {
        id: songmids
    });
    if (res) {
        return res.data;
    } else {
        return [];
    }
};

export const songInfoReq = async (songmid: string) => {
    const res: any = await get('/song', {
        songmid: songmid
    });

    let data: any = {};
    if (res) {
        const resData = res.data.track_info;
        data.songmid = songmid;
        data.songname = resData.name;
        data.singer = resData.singer[0].name;
        data.singermid = resData.singer[0].mid;
        data.albumname = resData.album.name;
        data.albummid = resData.album.mid;
        data.interval = resData.interval;
        data.pay_play = resData.pay.pay_play == 1;
    }

    return data;
};

export const getSongsInfoReq = async (songmids: Array<string>) => {
    let data = [];
    for (let i = 0; i < songmids.length; i++) {
        data[i] = await songInfoReq(songmids[i]);
    }
    return data;
};

export const getSongsInfoAndUrlReq = async (songmids: Array<string>) => {
    const urls = await songsUrlsReq(songmids);
    const infos = await getSongsInfoReq(songmids);
    let data = [];
    for (let i = 0; i < songmids.length; i++) {
        data[i] = infos[i];
        data[i].songurl = urls[i];
    }
    return data;
};

export const getCookieReq = async (id: string) => {
    const res = await get('/user/getCookie', {
        id: id
    });
    console.log(res);
};


export const getSonglistsReq = async (pageSize = 20, pageNo = 1, sort = 5, category = 10000000) => {
    const res: any = await get('/songlist/list', {
        pageSize, pageNo, sort, category
    });
    if (res) {
        return res.data.list;
    } else {
        return [];
    }
};

export const getSonglistInfoReq = async (id: string) => {
    const res: any = await get('/songlist', { id });
    let data: any = {};
    if (res) {
        let resData = res.data;
        data.songlist = [];
        for (let i = 0; i < resData.songlist.length; i++) {
            data.songlist[i] = {
                songmid: resData.songlist[i].songmid,
                songname: resData.songlist[i].songname,
                singer: resData.songlist[i].singer[0].name,
                albumname: resData.songlist[i].albumname,
                albummid: resData.songlist[i].albummid,
                interval: resData.songlist[i].interval,
                pay_play: resData.songlist[i].pay.payplay == 1
            };
        }
        delete resData.songlist;
        data.info = resData;
    }

    return data;
};