# Ubend

[![Build Status](https://travis-ci.org/ynohat/ubend.svg?branch=master)](https://travis-ci.org/ynohat/ubend)

Wraps a NodeJS stream pipe chain in a Duplex stream.

Ubend is a light wrapper around [pump](https://github.com/mafintosh/pump/).

## The problem

I often write NodeJS transform streams that are designed to work together as a pipeline:

```javascript
function pipeline(handlers) {
    var first = transformer1();
    var second = transformer2();
    var third = transformer3();

    first.pipe(second).pipe(third)
        .on("data", handlers.onData)
        .on("error", handlers.onError)
        .on("end", handlers.onEnd);

    return first;
}

pipeline({
        onData: /* something smart */,
        onError: /* something smart */,
        onEnd: /* something smart */
    })
    .write("some super cool input data")
    .pipe(process.stdout);
```

This is nice because each intermediate stream can be tested and reused separately, but it is also cumbersome:

1. I need to keep a handle on (at least) `first`
2. I have no satisfying way of getting the data out of `third`
3. Error handling is a nightmare

What I really want is to be able to treat the entire pipeline as a Duplex stream with sane error handling built in.

## Installing

```bash
npm install --save ubend
```

## Usage

```javascript
const ubend = require("ubend");

function pipeline() {
    return ubend(
        transformer1(),
        transformer2(),
        transformer3()
    );
}

pipeline()
    .on("data", /* something smart */)
    .on("error", /* something smart */)
    .on("end", /* something smart */)
    .write("some super cool input data")
    .pipe(process.stdout);
```

Much more elegant.

> ubend is based on [pump](https://github.com/mafintosh/pump/) and has the exact same API, except that it returns a Duplex stream instead of returning the last stream in the pipeline.

Ubend ONLY works with Duplex streams, obviously, and is specifically intended for use with Transform streams.

## Roadmap

1. More tests
