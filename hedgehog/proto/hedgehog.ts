
import "babel-polyfill";

let hedgehog = require('../protocol/proto/hedgehog_pb');
let io = require('../protocol/proto/io_pb');
let motor = require('../protocol/proto/motor_pb');


export class Message {

    public message: any;

    constructor(message: any) {
        this.message = message;
    }

    public parse(): any {
        let hedgehogMessage = new hedgehog.HedgehogMessage();

        if (this.message instanceof io.DigitalRequest) hedgehogMessage.setDigitalRequest(this.message);
        if (this.message instanceof motor.MotorAction) hedgehogMessage.setMotorAction(this.message);

        return hedgehogMessage;
    }

    public serialize(message): Uint8Array {
        return message.serializeBinary();
    }
}
