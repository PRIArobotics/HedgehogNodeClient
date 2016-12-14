import "babel-polyfill";

let io = require('../protocol/proto/io_pb');

export class DigitalRequest {
    public port: number;

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
    public port: number;
    public value: boolean;

    constructor(port: number, value: boolean) {
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
