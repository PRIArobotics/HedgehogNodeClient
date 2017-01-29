
import "babel-polyfill";

let hedgehog = require('../protocol/proto/hedgehog_pb');
let ack = require('../protocol/proto/ack_pb');
let io = require('../protocol/proto/io_pb');
let motor = require('../protocol/proto/motor_pb');
let servo = require('../protocol/proto/servo_pb');
let process = require('../protocol/proto/process_pb');

export class Message {

    public message: any;

    constructor(message: any) {
        this.message = message;
    }

    public parse(): any {
        let hedgehogMessage = new hedgehog.HedgehogMessage();

        /* tslint:disable */
        if (this.message instanceof ack.Acknowledgement) hedgehogMessage.setAcknowledgement(this.message);
        if (this.message instanceof io.IOStateAction) hedgehogMessage.setIOStateAction(this.message);
        if (this.message instanceof io.AnalogRequest) hedgehogMessage.setAnalogRequest(this.message);
        if (this.message instanceof io.AnalogUpdate) hedgehogMessage.setAnalogUpdate(this.message);
        if (this.message instanceof io.DigitalRequest) hedgehogMessage.setDigitalRequest(this.message);
        if (this.message instanceof io.DigitalUpdate) hedgehogMessage.setDigitalUpdate(this.message);
        if (this.message instanceof motor.MotorAction) hedgehogMessage.setMotorAction(this.message);
        if (this.message instanceof motor.MotorRequest) hedgehogMessage.setMotorRequest(this.message);
        if (this.message instanceof motor.MotorUpdate) hedgehogMessage.setMotorUpdate(this.message);
        if (this.message instanceof motor.MotorStateUpdate) hedgehogMessage.setMotorStateUpdate(this.message);
        if (this.message instanceof motor.MotorSetPositionAction) hedgehogMessage.setMotorSetPositionAction(this.message);
        if (this.message instanceof servo.ServoAction) hedgehogMessage.setServoAction(this.message);
        if (this.message instanceof process.ProcessExecuteRequest) hedgehogMessage.setProcessExecuteRequest(this.message);
        if (this.message instanceof process.ProcessExecuteReply) hedgehogMessage.setProcessExecuteReply(this.message);
        if (this.message instanceof process.ProcessStreamAction) hedgehogMessage.setProcessStreamAction(this.message);
        if (this.message instanceof process.ProcessStreamUpdate) hedgehogMessage.setProcessStreamUpdate(this.message);
        if (this.message instanceof process.ProcessExitUpdate) hedgehogMessage.setProcessExitUpdate(this.message);

        return hedgehogMessage;
    }

    public serialize(message): Uint8Array {
        return message.serializeBinary();
    }
}
