#
# Makefile for Palm WebOS Enyo
#
#

PACKAGE = de.obsessive-media.webos.typewriter

.PHONY: web

web:
	chromium-browser --disable-web-security --allow-file-access-from-files index.html &
	
help:
	chromium-browser --disable-web-security --allow-file-access-from-files ../Enyo/0.9/support/docs/api/index.html &
