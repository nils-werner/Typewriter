#
# Makefile for Palm WebOS Enyo
#
#

PACKAGE = de.obsessive-media.webos.typewriter
DEVICE = tcp

.PHONY: web

web:
	chromium-browser --disable-web-security --allow-file-access-from-files index.html &> /dev/null &
	
help:
	chromium-browser --disable-web-security --allow-file-access-from-files ../Enyo/0.9/support/docs/api/index.html &> /dev/null &
	
	
%.ipk:
	rm -rf *.ipk
	palm-package .

package: %.ipk

clean:
	rm -rf *.ipk
	- palm-install -d $(DEVICE) -r $(PACKAGE)

install: package
	palm-install -d $(DEVICE) *.ipk
