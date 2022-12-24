<template>
  <div class="chat-window" v-if="store.state.currentSession && store.state.currentSession.sessionId">
    <div class="chat-area">
      <div v-if="store.state.currentSession.type !== 2">
        <chat-dialog></chat-dialog>
        <input-box></input-box>
      </div>
    </div>
  </div>
  <div class="logo-page" v-else>
    <img :src="require('@/assets/img/logo.svg')" alt="" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@vue/runtime-core'
import { useStore } from 'vuex'
import ChatDialog from './children/chatDialog/ChatDialog.vue'
import InputBox from './children/InputBox.vue'
export default defineComponent({
  components: { InputBox, ChatDialog },
  name: 'chat-window',
  setup() {
    const store = useStore()

    return {
      store,
    }
  },
})
</script>

<style lang="less" scoped>
.chat-window {
  /* background-color: #f5f5f5; */
  background-color: #f9f9f9;
  display: flex;
}

.chat-area,
.video-area {
  flex: 1;
}

.logo-page img {
  margin-left: calc(50% - 65px);
  margin-top: calc(45vh - 65px);
  height: 130px;
  width: 130px;
}
</style>
