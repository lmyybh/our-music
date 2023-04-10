const fields = ['songmid', 'name', 'artist', 'album', 'songTimeMinutes', 'isListenFee', 'pic']

function formatData(data: any) {
    let info = new Map();
    info.set('songmid', '' + data.rid)
    info.set('name', data.name)
    info.set('artist', data.artist)
    info.set('album', data.album)
    info.set('songTimeMinutes', data.songTimeMinutes)
    info.set('isListenFee', data.isListenFee)
    info.set('pic', data.pic)
    return info;
}

class MusicList {
    map: Map<string, Map<string, any>>;
    list: Array<string>;
    constructor() {
        this.map = new Map();
        let emptyValue = new Map();
        for (let f of fields) {
            if (f == "isListenFee") {
                emptyValue.set(f, false);
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
            if (f == "isListenFee") {
                emptyValue.set(f, false);
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
    find(songmid: string) {
        return this.list.indexOf(songmid)
    }
    insert(index: number, data: any) {
        const songmid = data.rid + '';
        // 查询是否存在
        let idx = this.find(songmid);

        // 插入指定位置
        this.list.splice(index, 0, songmid);

        // 如果存在，删除原先的值
        if (idx >= 0) {
            this.list.splice(idx, 1);
        } else {
            this.map.set(songmid, formatData(data));
        }
        // 返回插入后的位置 （有可能删除了靠前的元素，所以不一定是 index）
        return this.find(songmid);
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
        const newSongmid = data.rid + '';
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
    getInfoBySongmid(songmid: string) {
        if (!this.map.has(songmid)) {
            return {}
        } else {
            let data: any = this.map.get(songmid)
            return Object.fromEntries(data)
        }
    }
    getAllSongs() {
        let data: any = [];
        for (let i = 1; i < this.list.length; i++) {
            let info = this.getInfo(i);
            info.id = i;
            data[i - 1] = info;
        }
        return data;
    }
}

export default MusicList;
