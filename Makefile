src = $(wildcard icons/*) $(wildcard *.js) $(wildcard *.html) $(wildcard *.css)
extension.zip: $(src)
	zip $@ $^