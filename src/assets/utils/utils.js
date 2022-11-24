export const formatInterval = (interval) => {
    let t = Math.floor(interval)
    let minutes = Math.floor(t / 60)
    let seconds = t % 60
    return minutes.toString().padStart(2, '0') + ':' + seconds.toString().padStart(2, '0')
};

export const getListenNumString = (listenNum) => {
    if (listenNum < 1e5) {
        return listenNum
    } else if (listenNum < 1e8) {
        return Math.ceil(listenNum / 1e4) + '万'
    } else {
        return Math.ceil(listenNum / 1e8) + '亿'
    }
};