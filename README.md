## About

Mozilla removed the character encoding menu in Firefox in [Bug #1687635](https://bugzilla.mozilla.org/show_bug.cgi?id=1687635). Since then,
the only option for fixing a page of mojibake is to hope that "View -> Repair Text Encoding" works - and sometimes it doesn't. As an example,
[this x-mac-cyrillic test page](https://hsivonen.com/test/charset/unlabeled-legacy/ru-x-mac-cyrillic.htm), does not display correctly, and the "Repair Text Encoding"
option is not even available.

This extension restores the functionality of the character encoding menu. The character encoding can be overridden on a page-by-page basis, or for entire domains. The list of overrides can be edited in the add-on preferences. Overrides are applied by modifying the Content-Type header, which takes precedence over any meta tag.

Two special character encodings are provided: "Default" disables the override and uses whatever the page provides (similarly to "No override"), while "Autodetect"
removes any charset declaration from the Content-Type HTTP header, which may allow autodetection and/or repair to work.

## Installation

You can get the addon from [addons.mozilla.org](https://addons.mozilla.org/en-US/firefox/addon/override-text-encoding).

## Known Issues

This add-on conflicts with the LocalCDN add-on (https://github.com/nneonneo/firefox-charset-extension/issues/4#issuecomment-2816772276), as the LocalCDN add-on rewrites all pages into UTF-8. You will need to disable that add-on on pages where you need to use Override Text Encoding.

## License

This project is licensed under the Mozilla Public License 2.0.
