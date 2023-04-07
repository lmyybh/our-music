import { get, post } from './http'

const BASE_URL = "/server/"

export const checkTokenReq = async () => {
    try {
        const res: any = await get(BASE_URL + '/user/checkToken', {});
        return true;
    } catch (err) {
        return false;
    }
}

export const loginReq = async (username: string, password: string) => {
    try {
        const res: any = await post(BASE_URL + '/user/login', {
            username: username,
            password: password,
        });
        return res.data;
    } catch (err) {
        return "";
    }
};

export const logoutReq = async () => {
    try {
        await get(BASE_URL + '/user/logout', {});
        return true;
    } catch (err) {
        console.log(err);
        return false;
    }
};