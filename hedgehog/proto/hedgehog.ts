
import "babel-polyfill";

let hedgehog = require('../../protoLib/hedgehog_pb');


export default class Command {

    private message: any;

    constructor(message: any) {
        this.message = message;
    }

    public parse(): any {
        let hedgehogMessage = new hedgehog.HedgehogMessage();

        hedgehogMessage.setMotorAction(this.message);

        return hedgehogMessage;
    }

    public serialize(message): Uint8Array {
        return message.serializeBinary();
    }
}
