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
