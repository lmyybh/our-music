import cookies from 'vue-cookies'
import { get, post } from './http'
import { ElMessage } from 'element-plus'

const BASE_URL = "/api/";
const MAX_NUM = 50;

export const searchReq = async (key: string, pageNo = 1, pageSize = 20, t = 0) => {
    const res: any = await post(BASE_URL + 'search', {
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
    if (typeof (songmids) == 'string') {
        songmids = [songmids];
    }

    let promise = [];
    for (let i = 0; i < Math.ceil(songmids.length / MAX_NUM); i++) {
        let params = songmids.slice(i * MAX_NUM, (i + 1) * MAX_NUM).join(',');
        promise.push(post(BASE_URL + '/song/urls', { id: params }));
    }
    const promiseRes: Array<any> = await Promise.all(promise);

    let data = {};
    for (let r of promiseRes) {
        data = Object.assign(data, r.data);
    }

    return data;
};

export const songInfoReq = async (songmid: string) => {
    const res: any = await get(BASE_URL + '/song', {
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


export const songsInfoReq = async (songmids: Array<string>) => {
    const res: any = await get(BASE_URL + '/song/songs', {
        songmids: songmids
    });

    let data: any = {};
    if (res) {
        const resData = res.data;
        for (let mid of songmids) {
            let info = resData[mid].track_info;
            data[mid] = {
                songmid: mid,
                songname: info.name,
                singer: info.singer[0].name,
                singermid: info.singer[0].mid,
                albumname: info.album.name,
                albummid: info.album.mid,
                interval: info.interval,
                pay_play: info.pay.pay_play == 1
            }
        }
    }

    return data;
};

export const largeNumberSongsInfoReq = async (songmids: Array<string>) => {
    let songsData: any = {};
    let promise = [];
    for (let i = 0; i < Math.ceil(songmids.length / MAX_NUM); i++) {
        promise.push(songsInfoReq(songmids.slice(i * MAX_NUM, (i + 1) * MAX_NUM)))
    }
    const promiseData = await Promise.all(promise)
    for (let d of promiseData) {
        songsData = Object.assign(songsData, d)
    }
    return songsData;
};

export const getUserDetail = async () => {
    const res: any = await get(BASE_URL + '/user/detail', {
        id: cookies.get("uin")
    });
    if (res) {
        return res.data;
    } else {
        return {};
    }
}

export const getSonglistsReq = async (pageSize = 20, pageNo = 1, sort = 5, category = 10000000) => {
    const res: any = await get(BASE_URL + '/songlist/list', {
        pageSize, pageNo, sort, category
    });
    if (res) {
        return res.data.list;
    } else {
        return [];
    }
};

export const getSonglistInfoReq = async (id: string) => {
    const res: any = await get(BASE_URL + '/songlist', { id });
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

export const getUserSonglistsReq = async () => {
    const res: any = await get(BASE_URL + '/songlist/user', { id: cookies.get("uin") });

    if (res) {
        return res.data;
    } else {
        return [];
    }
};

export const getUserSonglistInfoReq = async (id: string) => {
    const res: any = await get(BASE_URL + '/songlist/map', { dirid: id });
    let data: any = {};
    if (!res || !res.data) {
        ElMessage.error("api:" + res.errMsg);
        return data;
    }

    // 获取歌曲信息
    data.songlist = [];
    let songmids = Object.keys(res.data.mid);
    songmids.sort();

    let songsData: any = {};
    let promise = [];
    for (let i = 0; i < Math.ceil(songmids.length / MAX_NUM); i++) {
        promise.push(songsInfoReq(songmids.slice(i * MAX_NUM, (i + 1) * MAX_NUM)))
    }
    const promiseData = await Promise.all(promise)

    for (let d of promiseData) {
        songsData = Object.assign(songsData, d)
    }

    if (songsData) {
        for (let i = 0; i < songmids.length; i++) {
            data.songlist[i] = songsData[songmids[i]];
        }
    }

    const detail = await getUserDetail();
    let nickname = 'unknown'
    if (detail) {
        nickname = detail.creator.nick;
    }

    // 获取歌单信息
    data.info = {};
    const songlists = await getUserSonglistsReq();
    if (songlists) {
        for (let info of songlists) {
            if (info.dirid == Number(id)) {
                data.info = {
                    logo: info.dirid != 201 ? info.diss_cover : 'http://y.qq.com/mediastyle/global/img/cover_like.png?max_age=2592000',
                    dissname: info.diss_name,
                    nickname: nickname,
                    ctime: undefined,
                    tags: [],
                    songnum: info.song_cnt,
                    visitnum: info.listen_num,
                    desc: '暂无',
                };
                break;
            }
        }
    }
    return data;
};

export const getCookiesReq = async (id: string) => {
    const res: any = await get(BASE_URL + '/user/getCookie', {
        id: id
    });
    const cookiesObj = res.data || {};
    if (Object.keys(cookiesObj).length <= 0) {
        ElMessage.error("QQ Api 服务器不存在 cookies，请先设置");
        return false;
    } else {
        Object.keys(cookiesObj).forEach((k) => {
            // 有些过大的cookie 对登录校验无用，但是会导致报错
            if (cookiesObj[k].length < 255) {
                cookies.set(k, cookiesObj[k], new Date(Date.now() + 86400000));
            }
        });
        ElMessage.success("获取 Cookies 成功");
        return true;
    }
};

export const setCookiesReq = async (cookiesStr: string) => {
    const res: any = await post(BASE_URL + '/user/setCookie', {
        data: cookiesStr
    });
    if (res && res.result == 100) {
        return true;
    } else {
        return false;
    }
};