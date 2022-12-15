<script setup>
  import { useStore } from 'vuex'
  
  const props = defineProps({
    items: {
      type: Array,
      default: [],
    },
  })

  const store = useStore()

  function clickItem(callback) {
    callback()
    store.commit("menu/hideMenu")
  }
</script>

<template>
  <div id="float-menu">
    <ul class="menu-ul">
      <li
          v-for="(item, index) in items"
          :key="index"
          @click.stop="clickItem(item.callback)"
      >
        {{ item.name }}
      </li>
    </ul>
  </div>
</template>

<style lang="scss">
#float-menu {
  width: 200px;
  z-index: 10;
  background-color: white;
  
  border-radius: 5px;
  box-shadow: 0px 0px 30px rgba(0, 0, 0, 0.2);

  .menu-ul {
    width: auto;
    height: auto;
    list-style: none;
    font-size: 13px;
    text-align: left;
    padding: 5px 0;

    li {
      cursor: pointer;
      line-height: 30px;
      padding: 0 5px;
      color: #000;

      &:hover {
        background-color: #dddddd;
      }
    }
  }
}
</style>