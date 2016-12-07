
import "babel-polyfill";

let motor = require('../../hedgehog/protocol/proto/motor_pb');

export default class Action {
    private port: number;
    private state: number;
    private amount: number;
    private relative: number;
    private absolute: number;
    private reachedState: number;

    constructor(port: number, state: number, amount: number = 0, relative?: number,
                absolute?: number, reachedState: number = motor.MotorState.POWER) {

        console.log(reachedState);

        if(relative != null && absolute != null) {
            throw new TypeError("relative and absolute are mutually exclusive");
        }

        if( (relative == null || relative === undefined) &&
            (absolute == null || absolute === undefined)) {
            if(reachedState !== 0) {
                throw new TypeError(
                    "reached_state must be kept at its default value for non-positional motor commands");
            }
        }

        this.port = port;
        this.state = state;
        this.amount = amount;
        this.relative = relative;
        this.absolute = absolute;
        this.reachedState = reachedState;
    }

    public parse() {
        let action = new motor.MotorAction();

        action.setPort(this.port);
        action.setState(this.state);
        action.setAmount(this.amount);
        action.setReachedState(this.reachedState);

        if(this.relative != null) action.setRelative(this.relative);
        if(this.absolute != null) action.setAbsolute(this.absolute);

        return action;
    }
}

export class Request {
    private port: number;

    constructor(port: number) {
        this.port = port;
    }

    public parse() {
        let request = new motor.MotorRequest();
        request.setPort(this.port);

        return request;
    }
}

export class Update {
    private port: number;
    private velocity: number;
    private position: number;

    constructor(port: number, velocity: number, position: number) {
        this.port = port;
        this.velocity = velocity;
        this.position = position;
    }

    public parse() {
        let update = new motor.MotorUpdate();
        update.setPort(this.port);
        update.setVelocity(this.velocity);
        update.setPosition(this.position);

        return update;
    }
}

export class StateUpdate {
    private port: number;
    private state: number;

    constructor(port: number, state: number) {
        this.port = port;
        this.state = state;
    }

    public parse() {
        let stateUpdate = new motor.MotorStateUpdate();
        stateUpdate.setPort(this.port);
        stateUpdate.setState(this.state);

        return stateUpdate;
    }
}

export class SetPositionAction {
    private port: number;
    private position: number;

    constructor(port: number, position: number) {
        this.port = port;
        this.position = position;
    }

    public parse() {
        let setPositionAction = new motor.SetPositionAction();
        setPositionAction.setPort(this.port);
        setPositionAction.setState(this.position);

        return setPositionAction;
    }
}
