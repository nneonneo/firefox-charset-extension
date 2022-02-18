async function onHeadersReceived(details) {
  const config = await getConfigForURL(details.url);
  if(config === undefined || config.charset === "_default") {
    return {};
  }

  var headers = details.responseHeaders;
  var charsetSpec;
  if(config.charset === "_autodetect") {
    charsetSpec = "";
  } else {
    charsetSpec = "; charset=" + config.charset;
  }

  var foundContentType = false;
  for(var header of headers) {
    if(header.name.toLowerCase() === "content-type") {
      var oldValue = header.value;
      /* Actually parsing the Content-Type header is nontrivial, since quoted-strings can contain
      arbitrary escaped content, and multiple MIME types can be present. The following should
      work for most cases; file a bug if it doesn't. */
      var searchPattern = /;\s*charset=([^,;\s]+|"[^"]+")/g;
      if(searchPattern.test(header.value)) {
        header.value = header.value.replace(searchPattern, charsetSpec);
      } else {
        header.value = header.value + charsetSpec;
      }
      foundContentType = true;
      console.log(oldValue, header.value);
    }
  }

  if(!foundContentType) {
    /* application/x-unknown-content-type is a magic internal MIME type used by Firefox
       which is used when the Content-Type header is not set.
       Using this MIME type here allows Firefox to guess the MIME type as if Content-Type
       had not been specified at all, while still forcing it to use the selected charset. */
    headers.push({
      name: "Content-Type",
      value: "application/x-unknown-content-type" + charsetSpec
    });
  }

  return {
    responseHeaders: headers,
  }
}

browser.webRequest.onHeadersReceived.addListener(
  onHeadersReceived,
  {urls: ["<all_urls>"]},
  ["blocking", "responseHeaders"]
);
