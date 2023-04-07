import { get } from '../../http'

const BASE_URL = "/api/";

export const searchMusicsReq = async (key: string, rn = 30, pn = 1) => {
    const res: any = await get(BASE_URL + 'kuwo/search/searchMusicBykeyWord', {
        key: key,
        rn: rn,
        pn: pn
    });

    if (res && res.code == 200) {
        return res.data;
    }
    else {
        return {};
    }
};