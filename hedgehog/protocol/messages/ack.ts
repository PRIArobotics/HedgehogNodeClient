import "babel-polyfill";

let hedgehog: any = require('../proto/hedgehog_pb');
let ack: any = require('../proto/ack_pb');
export let AcknowledgementCode = ack.AcknowledgementCode;


export class Acknowledgement {
    public code: number;
    public message: string;

    constructor(code: number = AcknowledgementCode.OK, message: string = '') {
        this.code = code;
        this.message = message;
    }

    public serialize(): Uint8Array {
        let msg = new ack.Acknowledgement();
        this._serialize(msg);
        let hedgehogMsg = new hedgehog.HedgehogMessage();
        hedgehogMsg.setAcknowledgement(msg);
        return hedgehogMsg.serializeBinary();
    }

    private _serialize(msg): void {
        msg.setCode(this.code);
        msg.setMessage(this.message);
    }

    public static parse(data: Uint8Array) {
        let hedgehogMsg = hedgehog.HedgehogMessage.deserializeBinary(data);
        return Acknowledgement._parse(hedgehogMsg.getAcknowledgement());
    }

    private static _parse(msg): Acknowledgement {
        let code = msg.getCode();
        let message = msg.getMessage();
        return new Acknowledgement(code, message);
    }
}
