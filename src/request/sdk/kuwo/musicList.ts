import { get, post } from '../../http'
import { ElMessage } from 'element-plus'

const BASE_URL = "/api/";

export const recommendMusicListReq = async (rn = 1, pn = 5) => {
    const res: any = await get(BASE_URL + 'kuwo/rec_gedan', {
        rn: rn,
        pn: pn
    });
    console.log(res)
};

// 按分类获取歌单信息
export const tagMusicListReq = async (id = 1265, rn = 20, pn = 1) => {
    const res: any = await get(BASE_URL + '/kuwo/playList/getTagPlayList', {
        id: id,
        rn: rn,
        pn: pn
    });

    if (res && res.code == 200) {
        let data = res.data.data;
        return data;
    } else {
        ElMessage.error("获取分类歌单列表失败");
        return [];
    }
};

// 获取指定歌单音乐
export const getMusicListReq = async (pid: string, rn = 30, pn = 1) => {
    const res: any = await get(BASE_URL + 'kuwo/musicList', {
        pid: pid,
        rn: rn,
        pn: pn
    });

    if (res && res.code == 200) {
        return res.data;
    } else {
        ElMessage.error("获取歌单音乐列表失败");
        return {};
    }

};