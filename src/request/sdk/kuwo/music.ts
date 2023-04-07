import { ElMessage } from 'element-plus'
import { get } from '../../http'
import { asyncPoolAll } from '../../async'

const BASE_URL = "/api//";

function urlReq(mid: string, type = 'convert_url3', br = '320kmp3') {
    return get(BASE_URL + 'kuwo/url', { mid: mid, type: type, br: br });
}

function infoReq(mid: string) {
    return get(BASE_URL + 'kuwo/musicInfo', { mid: mid });
}

export const musicsUrlsReq = async (mids: string | Array<string>) => {
    if (typeof (mids) == 'string') {
        mids = [mids];
    }

    const results: any = await asyncPoolAll(10, mids, urlReq);

    let data: any = {};
    for (let r of results) {
        if (r && r.code == 200) {
            data[r.mid] = r.data.url;
        } else {
            data[r.mid] = '';
        }
    }

    return data;
};

function emptyInfo(mid: string) {
    return {
        rid: mid,
        mid: mid,
        songmid: mid,
        name: '',
        artist: '',
        album: '',
        songTimeMinutes: '',
        isListenFee: false,
        pic: ''
    }
}

export const getMusicsInfoReq = async (mids: string | Array<string>) => {
    if (typeof (mids) == 'string') {
        mids = [mids];
    }

    let results: any = await asyncPoolAll(10, mids, infoReq);

    let data: any = {};
    let retryMids: Array<string> = [];
    for (let r of results) {
        if (r && r.code == 200) {
            data[r.mid] = r.data;
        } else {
            retryMids.push(r.mid);
        }
    }

    // retry
    results = await asyncPoolAll(10, retryMids, infoReq);
    for (let r of results) {
        if (r && r.code == 200) {
            data[r.mid] = r.data;
        } else {
            data[r.mid] = emptyInfo(r.mid);
        }
    }

    return data;
};

export const ping = async () => {
    let res = await get('/api/kuwo/banner', {})
    console.log(res)
};