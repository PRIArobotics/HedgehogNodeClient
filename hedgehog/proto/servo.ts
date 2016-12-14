import "babel-polyfill";

let servo: any = require('../protocol/proto/servo_pb');

export class Action {
    public port: number;
    public active: number;
    public position: number;

    constructor(port: number, active: number, position: number) {
        this.port = port;
        this.position = position;
        this.active = active;
    }

    public parse() {
        let action = new servo.Action();
        action.setPort(this.port);
        action.setPosition(this.position);
        action.setActive(this.active);

        return action;
    }
}
