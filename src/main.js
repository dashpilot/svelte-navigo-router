import "./app.css";
import App from "./App.svelte";

// document.getElementById("app").innerHTML = "";
const app = new App({
  target: document.getElementById("app"),
  hydrate: true,
});

export default app;
