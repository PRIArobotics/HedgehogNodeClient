import "babel-polyfill";

let io = require('../protocol/proto/io_pb');

export class AnalogRequest {
    public port: number;

    constructor(port: number) {
        this.port = port;
    }

    public parse() {
        let analogRequest = new io.AnalogRequest();
        analogRequest.setPort(this.port);

        return analogRequest;
    }
}

export class AnalogUpdate {
    public port: number;
    public value: number;

    constructor(port: number, value: number) {
        this.port = port;
        this.value = value;
    }

    public parse() {
        let analogUpdate = new io.AnalogUpdate();
        analogUpdate.setPort(this.port);
        analogUpdate.setValue(this.value);

        return analogUpdate;
    }
}
