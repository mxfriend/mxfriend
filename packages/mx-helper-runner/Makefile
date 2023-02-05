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
	tsc -p tsconfig.frontend.json
	parcel build --cache-dir var/cache/parcel --dist-dir dist/frontend --public-url / 'src/frontend/**/*.html'
