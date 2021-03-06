import { createApp } from "vue";
import VueClickAway from "vue3-click-away";
// import  from 'element-plus'
import "element-plus/dist/index.css";
import { ElNotification, ElScrollbar } from "element-plus";
import Flutterwave from "flutterwave-vue-v3";
import mixins from "./mixins";
// import fullname from './mixins/fullname';
import App from "./App.vue";
import "nprogress/nprogress.css";
import WideBtn from "@/components/reusables_/WideBtn.vue";
import Empty from "@/components/reusables_/Empty.vue";
import ProfilePic from "@/components/reusables_/ProfilePic.vue";
import "./registerServiceWorker";
import router from "./router";
import store from "./store";
 import refresh from '@/services/refresh'

 refresh()
require("@/store/subscriber");

const app = createApp(App);
app.config.globalProperties.$notify = ElNotification;
app.component("WideBtn", WideBtn);
app.component("Empty", Empty);
app.component("ProfilePic", ProfilePic);
app.directive("error", {
  beforeMount: (el) => {
    const ele = el;
    ele.style.color = "red";
    ele.style.fontSize = `${12}px`;
  },
});
app
  .mixin(mixins)
  .use(Flutterwave, { publicKey: "FLWPUBK_TEST-21bb1d0b74fa71af51ec922925248216-X" })
  .use(ElScrollbar)
  .use(VueClickAway)
  .use(store)
  .use(router)
  .mount("#app");
