import { Modal, Upload, Button, Tooltip } from 'ant-design-vue'

import 'ant-design-vue/dist/antd.css';
import { App } from 'vue';


export default function (app: App) {
  // app.config.globalProperties.$message = message
  // app.config.globalProperties.$notification = notification

  app.use(Modal)
    .use(Upload)
    .use(Button)
    .use(Tooltip)
  // .component("AIcon", Fonts)
}
