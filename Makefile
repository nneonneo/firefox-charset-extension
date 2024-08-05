src = $(wildcard icons/*) $(wildcard *.js) $(wildcard *.html) $(wildcard *.css) manifest.json
extension.zip: $(src)
	$(RM) $@
	zip $@ $^
