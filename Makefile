.PHONY: default
default: build


node_modules:
	npm ci


.PHONY: common/clean
common/clean:
	cd packages/common && make clean

.PHONY: libmx32/clean libmxair/clean
libmx32/clean libmxair/clean : %/clean : common/clean
	cd packages/$* && make clean

.PHONY: mx-helpers/clean mx-utils/clean
mx-helpers/clean mx-utils/clean : %/clean : common/clean libmx32/clean libmxair/clean
	cd packages/$* && make clean

.PHONY: mx-emulator/clean mx-helper-runner/clean
mx-emulator/clean mx-helper-runner/clean : %/clean : common/clean libmx32/clean libmxair/clean mx-helpers/clean
	cd packages/$* && make clean

.PHONY: clean
clean: common/clean libmx32/clean libmxair/clean mx-helpers/clean mx-utils/clean mx-emulator/clean mx-helper-runner/clean


.PHONY: common/build
common/build: node_modules
	cd packages/common && make

.PHONY: libmx32/build libmxair/build
libmx32/build libmxair/build : %/build : node_modules common/build
	cd packages/$* && make

.PHONY: mx-helpers/build mx-utils/build
mx-helpers/build mx-utils/build : %/build : node_modules common/build libmx32/build libmxair/build
	cd packages/$* && make

.PHONY: mx-emulator/build mx-helper-runner/build
mx-emulator/build mx-helper-runner/build : %/build : node_modules common/build libmx32/build libmxair/build mx-helpers/build
	cd packages/$* && make

.PHONY: build
build: node_modules common/build libmx32/build libmxair/build mx-helpers/build mx-utils/build mx-emulator/build mx-helper-runner/build



.PHONY: common/rebuild
common/rebuild: node_modules
	cd packages/common && make rebuild

.PHONY: libmx32/rebuild libmxair/rebuild
libmx32/rebuild libmxair/rebuild : %/rebuild : node_modules common/build
	cd packages/$* && make rebuild

.PHONY: mx-helpers/rebuild mx-utils/rebuild
mx-helpers/rebuild mx-utils/rebuild : %/rebuild : node_modules common/build libmx32/build libmxair/build
	cd packages/$* && make rebuild

.PHONY: mx-emulator/rebuild mx-helper-runner/rebuild
mx-emulator/rebuild mx-helper-runner/rebuild : %/rebuild : node_modules common/build libmx32/build libmxair/build mx-helpers/build
	cd packages/$* && make rebuild



.PHONY: rebuild
rebuild: clean build
