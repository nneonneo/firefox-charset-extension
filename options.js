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

  let pathSettings = await getPathSettings();
  const pathTable = document.getElementById("path-overrides");
  pathTable.replaceChildren(table.firstElementChild);
  for (const [key, value] of Object.entries(pathSettings)) {
    let tr = document.createElement("tr");
    let td1 = document.createElement("td");
    td1.innerText = key;
    let td2 = document.createElement("td");
    td2.innerText = value?.charset;
    let td3 = document.createElement("td");
    let deleteButton = document.createElement("button");
    deleteButton.innerText = "Delete";
    deleteButton.addEventListener("click", async (e) => {
        await deleteConfigForPath(key);
    });
    td3.append(deleteButton);
    tr.append(td1, td2, td3);
    pathTable.append(tr);
  }
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
browser.storage.local.onChanged.addListener(async (e) => {
  await initSettings();
});

