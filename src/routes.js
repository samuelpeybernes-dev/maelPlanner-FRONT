import Calendar from "./components/Calendar.vue";
import Login from "./components/login.vue";
import * as VueRouter from "vue-router";
import { user } from "./store/user.js";
const routes = [
  {
    path: "/",
    name: "Calendar",
    component: Calendar,
    meta: { requiredAuth: true },
  },
  { path: "/login", name: "Login", component: Login },
  { path: "/register", name: "Register", component: Login },
];

const router = VueRouter.createRouter({
  history: VueRouter.createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const userStore = user();
  const token = localStorage.getItem("token");
  const id = localStorage.getItem("_id");
  if (token && id) {
    userStore.user.auth = true;
  }
  if (!userStore.user.auth && to.name !== "Login" && to.meta.requiredAuth) {
    next({ name: "Login" });
  } else {
    next();
  }
});

export default router;
