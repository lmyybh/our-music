const fields = ['songname', 'singer', 'songmid', 'songurl', 'albumname', 'interval', 'pay_play']

function formatData(data: any) {
    let info = new Map();
    for (let f of fields) {
        info.set(f, data[f]);
    }
    return info;
}

class MusicList {
    map: Map<string, Map<string, any>>;
    list: Array<string>;
    constructor() {
        this.map = new Map();
        let emptyValue = new Map();
        for (let f of fields) {
            if (f == "pay_play") {
                emptyValue.set(f, 0);
            } else {
                emptyValue.set(f, '');
            }
        }
        this.map.set('empty', emptyValue);
        this.list = ['empty'];
    }
    length() {
        return this.list.length;
    }
    clear() {
        this.map = new Map();
        let emptyValue = new Map();
        for (let f of fields) {
            if (f == "pay_play") {
                emptyValue.set(f, 0);
            } else {
                emptyValue.set(f, '');
            }
        }
        this.map.set('empty', emptyValue);
        this.list = ['empty'];
    }
    has(songmid: string) {
        return this.map.has(songmid);
    }
    insert(index: number, data: any) {
        const songmid = data.songmid;
        // 如果存在，返回之前的位置
        if (this.map.has(songmid)) {
            return this.list.indexOf(songmid);
        }

        // 不存在，插入指定位置
        this.list.splice(index, 0, songmid);
        this.map.set(songmid, formatData(data));
        return index;
    }
    append(data: any) {
        return this.insert(this.list.length, data);
    }
    remove(songmid: string) {
        if (!this.map.has(songmid)) {
            return;
        }
        this.map.delete(songmid);
        let index = this.list.indexOf(songmid);
        this.list.splice(index, 1);
    }
    replace(index: number, data: any) {
        const songmid = this.list[index];
        const newSongmid = data.songmid;
        this.map.delete(songmid);
        this.map.set(newSongmid, formatData(data));
        this.list[index] = newSongmid;
    }
    findNotInMapSongmids(songmids: Array<string>) {
        return songmids.filter((mid) => {
            return !this.map.has(mid);
        })
    }
    replaceAll(songmids: Array<string>, data: any) {
        let list = ['empty'];
        this.list = list.concat(songmids);
        let map = new Map();
        map.set('empty', this.map.get('empty'));
        for (let mid of songmids) {
            if (this.map.has(mid)) {
                map.set(mid, this.map.get(mid));
            } else {
                map.set(mid, formatData(data.get(mid)));
            }
        }
        this.map = map;
    }
    getSongmid(index: number) {
        return this.list[index]
    }
    getInfo(index: number) {
        let data: any = this.map.get(this.list[index])
        return Object.fromEntries(data)
    }
    findNextMusicIndex(index: number) {
        for (let i = index; i < this.list.length; i++) {
            let data: any = this.map.get(this.list[i])
            if (data.get('songurl')) {
                return i;
            }
        }
        return 0;
    }
    getAllSongs() {
        let data = [];
        for (let i = 1; i < this.list.length; i++) {
            let info = this.getInfo(i);
            info.id = i;
            data[i - 1] = info;
        }
        return data;
    }
}

export default MusicList;
