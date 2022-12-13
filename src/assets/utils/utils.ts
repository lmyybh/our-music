export const formatInterval = (interval: number) => {
    let t = Math.floor(interval)
    let minutes = Math.floor(t / 60)
    let seconds = t % 60
    return minutes.toString().padStart(2, '0') + ':' + seconds.toString().padStart(2, '0')
};

export const getListenNumString = (listenNum: number) => {
    if (listenNum < 1e5) {
        return listenNum
    } else if (listenNum < 1e8) {
        return Math.ceil(listenNum / 1e4) + '万'
    } else {
        return Math.ceil(listenNum / 1e8) + '亿'
    }
};

export const parseCookiesStr = (info: string) => {
    const re = /"cookie": ".*",/
    const res = re.exec(info)
    if (!res) {
        return ''
    } else {
        let cookies = res[0]
        cookies = cookies.slice(11, cookies.length - 2)
        return cookies
    }
};