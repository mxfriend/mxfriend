PATH := ../../node_modules/.bin:$(PATH)
SHELL := env PATH=$(PATH) /bin/bash

.PHONY: default
default: dist

.PHONY: rebuild
rebuild: clean dist

.PHONY: clean
clean:
	rm -rf dist

.PHONY: tests
tests:
	jest --silent

dist:
	tsc
	chmod +x dist/enumGenerator.js
	chmod +x dist/forwarder.js
	chmod +x dist/scanner/cli.js
	chmod +x dist/repl.js
	chmod +x dist/showControl/cli.js
