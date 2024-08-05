const modeDisable = document.getElementById("mode-disable");
const modeEnableDomain = document.getElementById("mode-enable-domain");
const modeEnablePath = document.getElementById("mode-enable-path");
const selectCharset = document.getElementById("charset");
const curCharset = document.getElementById("cur-charset");

async function initCharsetSelect() {
  encodings.forEach((group) => {
    var optgroup = document.createElement("optgroup");
    optgroup.label = group.heading;
    group.encodings.forEach((encoding) => {
      var option = document.createElement("option");
      option.value = encoding.name;
      option.textContent = encoding.name;
      optgroup.appendChild(option);
    });
    selectCharset.appendChild(optgroup);
  });
}

var currentTabId = undefined;

async function getCurrentTab() {
  var tabs = await browser.tabs.query({currentWindow: true, active: true});
  return tabs[0];
}

async function updateCharsetDisplay(tab) {
  curCharset.innerText = "Current encoding: ";

  var results = await browser.tabs.executeScript(tab.id, {
    code: "document.characterSet;"
  });
  /* If the tab changed while we were waiting, abort the update */
  if(tab.id !== currentTabId) {
    return;
  }

  var charset = results[0];
  if(charset !== undefined) {
    curCharset.innerText = "Current encoding: " + charset;
  }
}

async function updateConfigDisplay(tab) {
  modeDisable.disabled = true;
  modeEnableDomain.disabled = true;
  modeEnablePath.disabled = true;
  selectCharset.disabled = true;

  if(tab.url === undefined) {
    return;
  }

  var config = await getConfigForURL(tab.url);
  /* If the tab changed while we were waiting, abort the update */
  if(tab.id !== currentTabId) {
    return;
  }

  modeDisable.disabled = false;
  modeEnableDomain.disabled = false;
  modeEnablePath.disabled = false;
  selectCharset.disabled = false;
  if(config === undefined) {
    modeDisable.checked = true;
    selectCharset.value = "_default";
  } else if(config.mode === "domain") {
    modeEnableDomain.checked = true;
    selectCharset.value = config.charset;
  } else if(config.mode === "path") {
    modeEnablePath.checked = true;
    selectCharset.value = config.charset;
  }
}

async function updatePanelDetails(tab) {
  await Promise.all([
    updateCharsetDisplay(tab),
    updateConfigDisplay(tab),
  ]);
}

async function initPanelDetails() {
  var tab = await getCurrentTab();
  if(tab !== undefined) {
    currentTabId = tab.id;
    await updatePanelDetails(tab);
  }
}

async function onTabActivated(activeInfo) {
  currentTabId = activeInfo.tabId;
  var tab = await browser.tabs.get(currentTabId);
  if(tab !== undefined) {
    await updatePanelDetails(tab);
  }
}

async function onTabUpdated(tabId, changeInfo, tab) {
  if(tabId === currentTabId) {
    await updatePanelDetails(tab);
  }
}

async function onModeDisable() {
  var tab = await getCurrentTab();
  if(tab !== undefined && tab.url !== undefined) {
    await setConfigForPath(tab.url, undefined);
    await setConfigForDomain(tab.url, undefined);
    if(await getAutoreloadSetting()) {
      await browser.tabs.reload(tab.id, {bypassCache: true});
    }
  }
}

async function onModeEnableDomain() {
  var tab = await getCurrentTab();
  var charsetSelect = document.getElementById("charset");
  var config = {charset: charsetSelect.value};
  if(tab !== undefined && tab.url !== undefined) {
    await setConfigForPath(tab.url, undefined);
    await setConfigForDomain(tab.url, config);
    if(await getAutoreloadSetting()) {
      await browser.tabs.reload(tab.id, {bypassCache: true});
    }
  }
}

async function onModeEnablePath() {
  var tab = await getCurrentTab();
  var charsetSelect = document.getElementById("charset");
  var config = {charset: charsetSelect.value};
  if(tab !== undefined && tab.url !== undefined) {
    await setConfigForPath(tab.url, config);
    if(await getAutoreloadSetting()) {
      await browser.tabs.reload(tab.id, {bypassCache: true});
    }
  }
}

async function onCharsetChange(event) {
  if(modeEnableDomain.checked) {
    await onModeEnableDomain();
    return;
  }

  if(modeDisable.checked) {
    /* Automatically enable override */
    modeEnablePath.checked = true;
  }
  await onModeEnablePath();
}

initCharsetSelect();
initPanelDetails();
browser.tabs.onActivated.addListener(onTabActivated);
browser.tabs.onUpdated.addListener(onTabUpdated, {
  properties: ["status", "url"]
});
modeDisable.addEventListener("change", onModeDisable);
modeEnableDomain.addEventListener("change", onModeEnableDomain);
modeEnablePath.addEventListener("change", onModeEnablePath);
selectCharset.addEventListener("change", onCharsetChange);
