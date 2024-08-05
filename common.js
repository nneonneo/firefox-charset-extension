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
  let result;
  let url = new URL(urlString);

  url.hash = "";
  result = await getStorage("path-" + url);
  if(result !== undefined) {
    return {mode: "path", ...result};
  }

  let domain = url.origin;
  result = await getStorage("domain-" + domain);
  if(result !== undefined) {
    return {mode: "domain", ...result};
  }

  return undefined;
}

async function getConfigs() {
  let result = {paths: [], domains: []};
  let storage = await browser.storage.local.get();
  for (const [key, value] of Object.entries(storage)) {
    if(key.startsWith("path-")) {
      result.paths[key.substr(5)] = value;
    } else if(key.startsWith("domain-")) {
      result.domains[key.substr(7)] = value;
    }
  }
  return result;
}

async function deleteConfig(type, name) {
  await setStorage(`${type}-${name}`, undefined);
}

async function setConfigForPath(urlString, config) {
  let url = new URL(urlString);
  url.hash = "";
  await setStorage("path-" + url, config);
}

async function setConfigForDomain(urlString, config) {
  let url = new URL(urlString);
  await setStorage("domain-" + url.origin, config);
}

/* UI settings */
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
