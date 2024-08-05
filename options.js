const checkAutoReload = document.getElementById("auto-reload");
const radiosIconTheme = document.querySelectorAll('input[name="icon-theme"]');

async function initSettings() {
  checkAutoReload.checked = await getAutoreloadSetting();
  let iconTheme = await getIconThemeSetting();
  document.getElementById("icon-theme-" + iconTheme).checked = true;
}

initSettings();
checkAutoReload.addEventListener("change", async (e) => {
  await setAutoreloadSetting(e.target.checked);
});
for(let el of radiosIconTheme) {
  el.addEventListener("change", async (e) => {
    await setIconThemeSetting(e.target.value);
    await refreshIconTheme();
  });
}
