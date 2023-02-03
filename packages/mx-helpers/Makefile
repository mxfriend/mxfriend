PATH := ../../node_modules/.bin:$(PATH)
SHELL := env PATH=$(PATH) /bin/bash

.PHONY: default
default: rebuild

.PHONY: rebuild
rebuild: clean backend frontend

.PHONY: clean
clean:
	rm -rf dist

.PHONY: tests
tests:
	jest

.PHONY: backend
backend:
	tsc

.PHONY: frontend
frontend:
	tsc -p tsconfig.frontend.json
	parcel build --cache-dir var/cache/parcel --dist-dir dist/frontend --public-url / 'src/frontend/**/*.html'
