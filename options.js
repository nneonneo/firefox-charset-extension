const checkAutoReload = document.getElementById("auto-reload");
const radiosIconTheme = document.querySelectorAll('input[name="icon-theme"]');

function setCustomWarningVisibility(iconTheme) {
  const customWarning = document.getElementById("custom-warning");
  if(iconTheme === "custom") {
    customWarning.style.display = "block";
  } else {
    customWarning.style.display = "none";
  }
}

async function initSettings() {
  checkAutoReload.checked = await getAutoreloadSetting();
  let iconTheme = await getIconThemeSetting();
  document.getElementById("icon-theme-" + iconTheme).checked = true;
  setCustomWarningVisibility(iconTheme);
}

initSettings();
checkAutoReload.addEventListener("change", async (e) => {
  await setAutoreloadSetting(e.target.checked);
});
for(let el of radiosIconTheme) {
  el.addEventListener("change", async (e) => {
    console.log(e);
    await setIconThemeSetting(e.target.value);
    setCustomWarningVisibility(e.target.value);
    await refreshIconTheme();
  });
}
