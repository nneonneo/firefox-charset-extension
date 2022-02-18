src = $(wildcard icons/*) $(wildcard *.js) $(wildcard *.json) $(wildcard *.html)
extension.zip: $(src)
	zip $@ $^