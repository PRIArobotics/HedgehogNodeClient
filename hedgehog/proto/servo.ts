import "babel-polyfill";

let servo: any = require('../protocol/proto/servo_pb');

export class Action {
    public port: number;
    public active: boolean;
    public position: number;

    constructor(port: number, active: boolean, position: number) {
        this.port = port;
        this.position = position;
        this.active = active;
    }

    public parse() {
        let action = new servo.ServoAction();
        action.setPort(this.port);
        action.setPosition(this.position);
        action.setActive(this.active);

        return action;
    }
}
