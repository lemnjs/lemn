nodebin () {
  node node_modules/.bin/$1
}

build_dll () {
  nodebin webpack --config webpack.config.dll.js
}

build () {
  nodebin webpack $1
}

prepend_dll () {
  cat tmp/test/dll.js -
}

tape_run () {
  nodebin tape-run
}

smokestack () {
  nodebin tap-closer | nodebin smokestack
}

test () {
  NODE_ENV=test WEBPACK_STDOUT=1 build ${2:-.\/index.js} | prepend_dll | ${1:-tape_run}
}

$@
