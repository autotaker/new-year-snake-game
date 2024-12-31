import { createApp } from "vue";
import App from "./App.vue";
import { GesturePlugin } from "@vueuse/gesture";

// ここで Bulma を読み込む
import "bulma/bulma.scss";

createApp(App).use(GesturePlugin).mount("#app");
