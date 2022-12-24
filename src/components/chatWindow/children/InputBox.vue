<template>
  <div class="input-box" tabindex="1" @drop.prevent="dropFile" @dragover.prevent>
    <!-- chat-input -->
    <chat-input class="chat-input-cmp" ref="chatInput" @sendMsg="sendMsg" @uploadFile="uploadFile"></chat-input>
    <!-- bottom-bar -->
    <div class="bottom-bar">
      <div class="send" @click="proxy.$refs.chatInput.sendMsg()">发送</div>
    </div>
  </div>
</template>

<script lang="ts">
import { guid } from '@/utils/utils';
import ChatInput from '@/components/ChatInput.vue';

import Pubsub from 'pubsub-js';
import { useStore } from 'vuex';
import { message } from 'ant-design-vue';
import { ComponentInternalInstance, getCurrentInstance } from 'vue';

import { FileInfo, InputChatItem } from '@/type';

export default {
  components: { ChatInput },
  name: 'input-box',
  setup() {
    const store = useStore();
    const { proxy } = getCurrentInstance() as ComponentInternalInstance;

    // methods
    // 发送消息的回调
    // type 0:文字
    const sendMsg = (content: string , type = 0, fileInfo?: FileInfo) => {
      let chatItem: InputChatItem = {
        content,
        receiverId: store.state.currentSession.receiverId,
        uuid: guid(),
        type,
        sessionId: store.state.currentSession.sessionId,
        fileInfo,
        // 临时时间戳，在信息发送成功后会改为发送成功的时间
        updatedAt: new Date().getTime(),
      };
      store.state.socket?.emit('chat', chatItem);

      let temp: InputChatItem = {
        ...chatItem,
        senderId: store.state.userInfo.id,
        status: 'loading',
        updatedAt: new Date().getTime(),
      };
      Pubsub.publish('sendMsg', chatItem);
    };

    return {
      sendMsg,
      proxy,
      message,
    };
  },
};
</script>

<style scoped>
.input-box {
  /* background-color: #f5f5f5; */
  background-color: #ffffff;
  height: 230px;
  transition: 0.1s all ease;
  border-top: 1px solid rgb(233, 233, 233);
}

.input-box:focus-within {
  background-color: #fff;
  outline: none;
  box-shadow: 0 -5px 10px rgba(0, 0, 0, 0.01);
}

.bar-left > *,
.bar-right > * {
  margin: 0 7px;
}

.bottom-bar {
  text-align: right;
  padding: 3px 22px;
}

.send {
  display: inline-block;
  padding: 3px 14px;
  background: #e9e9e9;
  color: white;
  font-size: 20px;
  border-radius: 3px;
  transition: 0.1s all ease;
  cursor: pointer;
  border: 1px solid #e0e0e0;
  margin-top: 70px;
}

.send:hover {
  /* background-color: #129611; */
  background-color: #3fa7e4;
  color: white;
}
</style>
