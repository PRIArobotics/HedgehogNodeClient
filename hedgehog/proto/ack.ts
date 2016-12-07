import "babel-polyfill";

let ack: any = require('../protocol/proto/ack_pb');

export class Acknowledgement {
    public static AcknowledgementCode = ack.AcknowledgementCode;

    private code: number;
    private message: string;

    constructor(code: number = ack.AcknowledgementCode.OK, message: string) {
        this.code = code;
        this.message = message;
    }

    public parse() {
        let acknowledgement = new ack.Acknowledgement();
        acknowledgement.setCode(this.code);
        acknowledgement.setMessage(this.message);

        return acknowledgement;
    }
}
