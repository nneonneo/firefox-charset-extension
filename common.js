async function getStorage(key) {
  var results = await browser.storage.local.get(key);
  return results[key];
}

async function setStorage(key, value) {
  if(value === undefined) {
    try {
      await browser.storage.local.remove(key);
    } catch(e) {
      /* not an error to delete a non-existent key */
    }
  } else {
    var obj = {};
    obj[key] = value;
    await browser.storage.local.set(obj);
  }
}

async function getConfigForURL(urlString) {
  var result;

  result = await getStorage("path-" + urlString);
  if(result !== undefined) {
    return {mode: "path", ...result};
  }

  return undefined;
}

async function setConfigForPath(urlString, config) {
  await setStorage("path-" + urlString, config);
}

async function getAutoreloadSetting() {
  const res = await getStorage("setting-autoreload");
  return (res !== undefined) ? res : true;
}

async function setAutoreloadSetting(value) {
  await setStorage("setting-autoreload", value);
}

async function getIconThemeSetting() {
  const res = await getStorage("setting-icon-theme");
  return (res !== undefined) ? res : "default";
}

async function setIconThemeSetting(value) {
  await setStorage("setting-icon-theme", value);
}

async function refreshIconTheme() {
  let iconTheme = await getIconThemeSetting();
  if (iconTheme === "default") {
    await browser.browserAction.setIcon({});
  } else {
    let iconPath = `icons/button-${iconTheme}.svg`;
    await browser.browserAction.setIcon({
      path: {
        "16": iconPath,
        "32": iconPath,
      }
    });
  }
}

refreshIconTheme();
