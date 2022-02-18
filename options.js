const checkAutoReload = document.getElementById("auto-reload");

async function initSettings() {
  checkAutoReload.checked = await getAutoreloadSetting();
}

initSettings();
checkAutoReload.addEventListener("change", async (e) => {
  await setAutoreloadSetting(e.target.checked);
});
