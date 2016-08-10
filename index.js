"use strict";

const stream = require("stream");
const pump = require("pump");
const eos = require("end-of-stream");



class Ubend extends stream.Transform {
    static pump() {
        var args = Array.prototype.slice.call(arguments);
        var input = args[0];
        // pump supports variadic args or an Array
        if (Array.isArray(input)) {
            input = input[0];
        }
        var output = pump.apply(null, args);
        return new Ubend(input, output);
    }

    constructor(input, output) {
        super({
            writableObjectMode: input._writableState.objectMode,
            readableObjectMode: output._readableState.objectMode,
            highWaterMark: input._writableState.highWaterMark
        });
        this._input = input;
        this._output = output;
        this._output.on("readable", this._gobbleOutput.bind(this));
        eos(this._output, this._onOutputEnd.bind(this));
    }

    end(chunk) {
        super.end(chunk);
        this._input.end(chunk);
    }

    _transform(chunk, encoding, next) {
        this._input.write(chunk, encoding, next);
    }

    _gobbleOutput() {
        var chunk = null;
        while ((chunk = this._output.read(1)) !== null) {
            this.push(chunk);
        }
    }

    _onOutputEnd(err) {
        if (err) {
            this.emit("error", err);
        }
        this.push(null);
    }
}

/**
 * Module API
 *
 * Example:
 *
 * const ubend = require("ubend");
 * const u1 = ubend(trx1, trx2, trx3);
 * u1 instanceof ubend.Stream
 */
function factory() {
    return Ubend.pump.apply(Ubend, arguments);
}
factory.Stream = Ubend;

module.exports = factory;
