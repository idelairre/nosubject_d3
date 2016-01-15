MAKEFLAGS = -j1

BIN = node_modules/.bin

ISPARTA_CMD = $(BIN)/isparta cover
MOCHA_CMD = node_modules/mocha/bin/_mocha

.PHONY: test test-cov

start:
	BABEL_ENV=development babel-node index.js

test:
	BABEL_ENV=development babel-node $(MOCHA_CMD) test --compilers js:babel-register

test-cov:
	rm -rf coverage
	BABEL_ENV=development babel-node $(ISPARTA_CMD) --report lcov --report html $(MOCHA_CMD) -- test --compilers js:babel-register
