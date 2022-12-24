<template>
  <div class="user-item">
    <div class="item-left-container">
      <div class="status">
        <loading scale="0.5" v-if="chat.status == 'loading'"></loading>
        <i class="iconfont icon-shuaxin" title="点击重发" v-else-if="chat.status == 'fail'" @click="resend"></i>
      </div>
      <div class="item-left">
        <!-- 文字信息 -->
        <div class="message-container" v-if="chat.type == 0">
          <pre class="message" v-html="content"></pre>
        </div>
      </div>
    </div>
    <div class="avatar"><img :src="store.state.userInfo.avatar" alt="" /></div>
  </div>
</template>

<script lang="ts">
import { transToTag } from '@/utils/utils'
import Loading from '@/components/Loading.vue'

import { computed, defineComponent, onBeforeUnmount, onMounted, PropType } from 'vue'

// import { Chat } from './chatItem'
import { useStore } from 'vuex'
import { ChatItem } from '@/type'

export default defineComponent({
  name: 'user-item',
  components: { Loading },
  props: {
    chat: {
      type: Object as PropType<ChatItem>,
      default: null,
    },
  },
  setup(props) {
    const store = useStore()
    const compute = {
      content: computed(() => transToTag(props.chat.content)),
      imgStyle: computed(() => {
        // 如果是blob开头, 说明是刚发送的图片
        if (/^blob:/.test(props.chat.content)) return ''
        let reg = /\??size=([0-9]{1,3}x[0-9]{1,3})&?/
        let arr = (props.chat.content.match(reg) as RegExpMatchArray)[1].split('x')
        return `width:${arr[0]}px;height:${arr[1]}px;`
      }),
      fileInfo: computed(() => {
        if (/^blob:/.test(props.chat.content)) return props.chat.fileInfo
        return JSON.parse(props.chat.others as unknown as string)
      }),
    }
    let timer: number | null = null

    // 生命周期
    onMounted(() => {
      createTimer()
    })

    onBeforeUnmount(() => {
      timer && clearTimeout(timer)
    })

    // methods
    // 点击重发的回调
    const resend = () => {
      let chatItem = {
        content: props.chat.file,
        receiverId: props.chat.receiverId,
        uuid: props.chat.uuid,
        type: props.chat.type,
        sessionId: props.chat.sessionId,
        fileInfo: props.chat.fileInfo,
      }
      store.state.socket?.emit('chat', chatItem)
      // 直接改props就报语法错了 这里赋值下再改
      let chat = props.chat
      chat.status = 'loading'
      createTimer()
    }

    // 设置超时的定时器
    const createTimer = () => {
      if (props.chat.status == 'loading') {
        timer = setTimeout(() => {
          if (props.chat.status == 'loading') {
            let chat = props.chat
            chat.status = 'fail'
          }
          timer = null
        }, 10000)
      }
    }


    return {
      resend,
      ...compute,
      store,
    }
  },
})
</script>

<style scoped>
.user-item {
  display: flex;
  justify-content: flex-end;
  margin: 15px 0;
}

.avatar {
  margin-left: 10px;
  width: 36px;
  height: 36px;
  min-width: 36px;
  border-radius: 50%;
  overflow: hidden;
}

.avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.message-container {
  position: relative;
  /* background-color: #9eea6a; */
  background-color: #3fa7e4;
  border-radius: 4px;
}

.message::selection {
  /* background-color: #3399ff; */
  background-color: rgba(255, 255, 255, 0.9);
  color: #279fdb;
}

.message {
  padding: 8px 13px;
  font-size: 14px;
  width: fit-content;
  font-family: 'Harmony Font';
  word-break: break-word;
  white-space: pre-wrap;
  text-align: left;
  margin: 0;
  color: rgba(255, 255, 255, 0.9);
}

.message-container::after {
  content: '';
  position: absolute;
  right: -2px;
  top: 7px;
  height: 4px;
  width: 4px;
  transform: rotateZ(45deg);
  background-color: inherit;
}

.message-container:hover {
  /* background-color: #98e165; */
  background-color: #279fdb;
}

.image {
  max-height: 200px;
  max-width: 200px;
  min-height: 50px;
  min-width: 50px;
}

.image img {
  max-height: 200px;
  max-width: 200px;
  min-height: 50px;
  min-width: 50px;
  border-radius: 5px;
  border: 1px solid #eee;
  object-fit: cover;
  width: 100%;
  cursor: pointer;
  background-color: #fff;
}

.item-left > div,
.avatar {
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.05);
}

.item-left-container {
  display: flex;
  align-items: center;
}

.icon-shuaxin {
  color: #e93b3b;
  font-size: 14px;
  margin: 0 10px;
}

.status {
  height: 37px;
  display: flex;
  align-items: center;
}

.icon-shipin {
  color: white;
  margin-right: 5px;
}
</style>
