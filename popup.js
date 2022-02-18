const modeDisable = document.getElementById("mode-disable");
const modeEnable = document.getElementById("mode-enable");
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
  modeEnable.disabled = true;
  modeDisable.disabled = true;
  selectCharset.disabled = true;

  if(tab.url === undefined) {
    return;
  }

  var config = await getConfigForURL(tab.url);
  /* If the tab changed while we were waiting, abort the update */
  if(tab.id !== currentTabId) {
    return;
  }

  modeEnable.disabled = false;
  modeDisable.disabled = false;
  selectCharset.disabled = false;
  if(config === undefined) {
    modeDisable.checked = true;
    selectCharset.value = "_default";
  } else {
    modeEnable.checked = true;
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
    await browser.tabs.reload(tab.id, {bypassCache: true});
  }
}

async function onModeEnable() {
  var tab = await getCurrentTab();
  var charsetSelect = document.getElementById("charset");
  var config = {charset: charsetSelect.value};
  if(tab !== undefined && tab.url !== undefined) {
    await setConfigForPath(tab.url, config);
    await browser.tabs.reload(tab.id, {bypassCache: true});
  }
}

async function onCharsetChange(event) {
  if(modeDisable.checked) {
    /* Automatically enable override */
    modeEnable.checked = true;
  }
  await onModeEnable();
}

initCharsetSelect();
initPanelDetails();
browser.tabs.onActivated.addListener(onTabActivated);
browser.tabs.onUpdated.addListener(onTabUpdated, {
  properties: ["status", "url"]
});
modeDisable.addEventListener("change", onModeDisable);
modeEnable.addEventListener("change", onModeEnable);
selectCharset.addEventListener("change", onCharsetChange);
