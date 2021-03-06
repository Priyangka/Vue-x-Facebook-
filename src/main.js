import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import "./index.css";
import { CometChat } from "@cometchat-pro/chat";
import { cometChat } from "./app.config";


import VueNativeSock from "vue-native-websocket-vue3";

router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  const user = JSON.parse(localStorage.getItem("user"));

  if (requiresAuth && !user) {
    console.log("You are not authorized to access this area.");
    next("login");
  } else {
    next();
  }
});

const appID = cometChat.APP_ID;
const region = cometChat.APP_REGION;
const appSetting = new CometChat.AppSettingsBuilder()
  .subscribePresenceForAllUsers()
  .setRegion(region)
  .build();

CometChat.init(appID, appSetting)
  .then(() => {
    console.log("Initialization completed successfully");
    // You can now call login function.
    createApp(App)
      .use(router)
      .use(VueNativeSock, "wss://localhost:6868")
      .mount("#app");
  })
  .catch(error => {
    console.log("Initialization failed with error:", error);
  });
