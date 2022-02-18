## About

Mozilla removed the character encoding menu in Firefox in [Bug #1687635](https://bugzilla.mozilla.org/show_bug.cgi?id=1687635). Since then,
the only option for fixing a page of mojibake is to hope that "View -> Repair Text Encoding" works - and sometimes it doesn't. As a (somewhat obscure) example,
[this x-mac-cyrillic test page](https://hsivonen.com/test/charset/unlabeled-legacy/ru-x-mac-cyrillic.htm), does not display correctly, and the "Repair Text Encoding"
option is not even available.

This extension restores the functionality of the character encoding menu. The character encoding can be overridden on a page-by-page basis. Overrides are saved
and applied to future loads of the same URL. Overrides are applied by modifying the Content-Type header, which takes precedence over any meta tag.

Two special character encodings are provided: "Default" disables the override and uses whatever the page provides (similarly to "No override"), while "Autodetect"
removes any charset declaration from the Content-Type HTTP header, which may allow autodetection and/or repair to work.

## Installation

At some point, this will be published to addons.mozilla.org. For now, it's in a development state, so you will have to install the addon in development mode
or bundle it yourself.

## License

This project is licensed under the Mozilla Public License 2.0.
