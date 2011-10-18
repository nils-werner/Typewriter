#
# Makefile for Palm WebOS Enyo
#
#

PACKAGE = de.obsessivemedia.webos.typewriterbeta
DEVICE = tcp

.PHONY: web

package: %.ipk

usb: DEVICE = usb
usb: install

clean:
	rm -rf *.ipk
	- palm-install -d $(DEVICE) -r $(PACKAGE)

install: package
	palm-install -d $(DEVICE) *.ipk
	
launch:
	palm-launch -d $(DEVICE) $(PACKAGE)
	
log: launch
	palm-log -d $(DEVICE) -f $(PACKAGE)
	
web:
	chromium-browser --disable-web-security --allow-file-access-from-files application/index.html &> /dev/null &
	
help:
	chromium-browser --disable-web-security --allow-file-access-from-files /opt/PalmSDK/Current/share/documentation/api/index.html &> /dev/null &
	
debug:
	palm-log -d $(DEVICE) --system-log-level info
	
production:
	palm-log -d $(DEVICE) --system-log-level error
	
examples:
	nautilus /opt/PalmSDK/Current/share/samplecode/enyo/
	
%.ipk:
	rm -rf *.ipk
	palm-package package application services/dropbox
