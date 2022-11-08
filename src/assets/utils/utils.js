export const formatInterval = (interval) => {
    let t = Math.floor(interval)
    let minutes = Math.floor(t / 60)
    let seconds = t % 60
    return minutes.toString().padStart(2, '0') + ':' + seconds.toString().padStart(2, '0')
};