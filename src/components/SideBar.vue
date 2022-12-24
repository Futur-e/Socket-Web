<template>
  <div class="side-bar">
    <div class="side-bar-top">
      <div class="avatar">
        <img :src="store.state.userInfo && store.state.userInfo.avatar" alt="" @click="showDiv=!showDiv"/>
        <div class="menu" v-show="showDiv" @mouseleave="showDiv=false">
          <div class="menu-item" @click="logout" >退出登录</div>
          <div class="menu-item" @click="() => {
            if (proxy !== null) proxy.$refs.addFriendModal.visible = true}">
            添加好友
          </div>
        </div>
      </div>
      <div class="page">
        <div class="page-item" v-for="item in pageList" :key="item.path">
          <i
              class="iconfont"
              :class="`${item.icon} ${route.path.indexOf(item.path) !== -1 ? 'current-page' : ''}`"
              @click="router.push(item.path)"
          ></i>
          <div
              class="unread-num"
              v-if="item.path === '/chat'"
              v-show="store.state.totalUnread != 0"
              v-text="store.state.totalUnread <= 99 ? store.state.totalUnread : '···'"
          ></div>
        </div>
      </div>
    </div>
    <add-friend-modal ref="addFriendModal"></add-friend-modal>
  </div>
</template>

<script lang="ts">
import addFriendModal from './addFriendModal.vue'
import {reactive, toRefs} from '@vue/reactivity'
import {useStore} from 'vuex'
import {useRoute, useRouter} from 'vue-router'
import {ComponentInternalInstance, defineComponent, getCurrentInstance} from '@vue/runtime-core'
import {api_logout} from "@/api/user";
import {message} from "ant-design-vue";
import {Socket} from "socket.io-client";
import {ref} from "vue";

export default defineComponent({
  components: {addFriendModal},
  name: 'side-bar',
  // mixins: [sessionList],
  setup() {
    const showDiv = ref(false)
    const store = useStore()
    const route = useRoute()
    const router = useRouter()
    const {proxy} = getCurrentInstance() as ComponentInternalInstance
    const state = reactive({
      pageList: [
        {icon: 'icon-liaotian-fill', path: '/chat', name: 'Chat'},
        {icon: 'icon-haoyoutuijie', path: '/friend', name: 'Friend'},
      ],
    })

    // 点击退出登录的回调
    const logout = async () => {
      let res = await api_logout()
      if (res) {
        router.push('/login')
        message.info('退出登录成功!')
        // 断开websocket
        const socket = store.state.socket as Socket
        socket.disconnect()
        // socket = null
        store.commit('setSocket', null)
      }
    }

    return {
      ...toRefs(state),
      proxy,
      store,
      route,
      router,
      showDiv,
      logout
    }
  },
})
</script>

<style scoped>
.side-bar {
  /* background-color: #2e2e2e; */
  background: #f0f0f0;
  border-right: 1px solid #ddd;
  width: 50px;
  min-width: 50px;
  padding: 30px 0 15px 0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.avatar {
  margin-bottom: 25px;
  position: relative;
}

.avatar img {
  border-radius: 5px;
  width: 37px;
  height: 37px;
  object-fit: cover;
}

.iconfont {
  /* color: rgba(255, 255, 255, 0.8); */
  /* color: #3fa7e4; */
  color: #1d89f5;
  font-size: 22px;
  border-radius: 5px;
  padding: 7px;
}

.current-page {
  background-color: #d3d3d3;
}

.page-item {
  margin: 20px 0;
  transition: 0.1s transform ease-out;
  position: relative;
}

.bottom-item {
  margin: 15px 0;
  transition: 0.1s transform ease-out;
}

.bottom-item .iconfont:active {
  background-color: #d9dbdb;
}

/* .page-item:hover,
.bottom-item:hover {
  transform: scale(1.1);
} */

.unread-num {
  position: absolute;
  font-size: 12px;
  height: 16px;
  width: 16px;
  right: 5px;
  top: 0px;
  border-radius: 50%;
  color: white;
  background-color: #f3453c;
  line-height: 16px;
  text-align: center;
}

.menu {
  border: 1px solid #eee;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
  position: absolute;
  background-color: #fff;
  width: 120px;
  font-size: 12px;
  padding: 3px 0;
  left: 40px;
  bottom: 8px;
  border-radius: 5px;
  z-index: 1;
}

.menu-item {
  border-bottom: 1px solid #eee;
  padding: 4px 8px;
  cursor: pointer;
}

.menu-item:hover {
  /* background-color: #129611; */
  background-color: #2495ce;
  color: white;
}

</style>
