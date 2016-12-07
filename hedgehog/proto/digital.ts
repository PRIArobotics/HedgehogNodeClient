import "babel-polyfill";

let io = require('../protocol/proto/io_pb');

export class DigitalRequest {
    private port: number;

    constructor(port: number) {
        this.port = port;
    }

    public parse() {
        let digitalRequest = new io.DigitalRequest();
        digitalRequest.setPort(this.port);

        return digitalRequest;
    }
}

export class DigitalUpdate {
    private port: number;
    private value: number;

    constructor(port: number, value: number) {
        this.port = port;
        this.value = value;
    }

    public parse() {
        let digitalUpdate = new io.DigitalUpdate();
        digitalUpdate.setPort(this.port);
        digitalUpdate.setValue(this.value);

        return digitalUpdate;
    }
}
