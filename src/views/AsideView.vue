<script setup lang="ts">
</script>

<template>
    <div class="aside-view">
        <div class="list">
            <div class="menu-title">
                <span>创建的歌单</span>
                <el-icon color="#cfcfd1" :size="16" class="icon-button">
                    <i-ep-circle-plus-filled />
                </el-icon>
            </div>
            <el-menu>
                <el-menu-item index="1">
                    <el-icon :size="18">
                        <svg t="1667803318121" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2709" width="200" height="200"><path d="M502.538 793.068L810.045 485.58a176.476 176.476 0 1 0-249.569-249.57l-57.938 57.918-57.917-57.917A176.476 176.476 0 0 0 195.05 485.58l307.487 307.487z m28.98 86.896a40.96 40.96 0 0 1-57.938 0L137.114 543.498C36.209 442.593 36.209 279 137.114 178.074c100.925-100.905 264.52-100.905 365.424 0 100.926-100.905 264.52-100.905 365.425 0 100.925 100.925 100.925 264.52 0 365.424L531.517 879.985z" p-id="2710"></path></svg>
                    </el-icon>
                    <span>我喜欢的音乐</span>
                </el-menu-item>
            </el-menu>
        </div>
        <div class="music">
            <el-row align="middle" style="width: 100%; height:100%; margin: 0;">
                <el-col :span="6" class="cover">
                    <el-image style="width: 46px; height: 46px" fit="fill" src="https://p1.ssl.qhmsg.com/dr/270_500_/t0133657d086cb7510c.jpg?size=480x320"/>
                </el-col>
                <el-col :span="16" class="info">
                    <span class="music-name">夜曲</span>
                    <span class="author-name">周杰伦</span>
                </el-col>
                <el-col :span="2" class="icons">
                    <el-icon :size="14" color="#666666" class="icon-button">
                        <svg t="1667803318121" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2709" width="200" height="200"><path d="M502.538 793.068L810.045 485.58a176.476 176.476 0 1 0-249.569-249.57l-57.938 57.918-57.917-57.917A176.476 176.476 0 0 0 195.05 485.58l307.487 307.487z m28.98 86.896a40.96 40.96 0 0 1-57.938 0L137.114 543.498C36.209 442.593 36.209 279 137.114 178.074c100.925-100.905 264.52-100.905 365.424 0 100.926-100.905 264.52-100.905 365.425 0 100.925 100.925 100.925 264.52 0 365.424L531.517 879.985z" p-id="2710"></path></svg>
                    </el-icon>
                    <el-icon :size="14" color="#666666" class="icon-button">
                        <i-ep-delete/>
                    </el-icon>
                </el-col>
            </el-row>
        </div>
    </div>
</template>

<style lang="scss">
.aside-view {
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
}
.list {
    flex-grow: 1;
}
.menu-title {
    height: 30px;
    padding: 0 5px;
    display: flex;
    justify-content: space-between;
    align-items: center;

    span {
        font-size: small;
        font-weight: lighter;
        color: #7d7d7d;
    }
}
.el-menu-item {
    height: 30px;
    color: #5c5c5c;
    background-color: #f5f5f7;
}
.el-menu-item.is-active {
    color: black;
    background-color: #e6e7ea;
}
.icon-button:hover{
    cursor: pointer;
    color:#787777;
}
.music {
    height: 60px;
    border-top: 1px solid #d6d6d6;
}
.cover {
    display: flex;
    justify-content: center;
    align-items: center;
}
.info {
    height: 46px;
    display: flex;
    flex-direction: column;
    justify-content: space-around;

    .music-name {
        font-size: small;
        color: #333333;
    }

    .author-name {
        font-size: small;
        color: #666666;
    }
}
.icons {
    height: 46px;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
}
</style>