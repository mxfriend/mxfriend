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
	jest

dist:
	tsc
