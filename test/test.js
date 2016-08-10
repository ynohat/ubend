"use strict";

const through2 = require("through2");
const ubend = require("..");
const pump = require("pump");

describe("Ubend", function () {

    var streams;

    beforeEach("setup streams", function () {
        streams = [
            function (chunk, enc, cb) {
                this.push(Number(chunk) * 2);
                cb();
            },
            function (chunk, enc, cb) {
                this.push(Number(chunk) * 3);
                cb();
            }
        ].map(through2.obj);
    });

    it("should fail with < 2 streams", function () {
        ubend.should.throw(Error);
    });

    it("should work with an Array of streams", function (done) {
        ubend(streams)
            .on("data", function (result) {
                result.should.be.exactly(12);
            })
            .on("end", done)
            .end(2);
    });

    it("should work with variadic arguments", function (done) {
        ubend.apply(null, streams)
            .on("data", function (result) {
                result.should.be.exactly(12);
            })
            .on("end", done)
            .end(2);
    });

    it("should should accept a callback argument", function (done) {
        ubend(streams, done).end(2);
    });
});
