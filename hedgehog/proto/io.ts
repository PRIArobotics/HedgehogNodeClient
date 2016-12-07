import "babel-polyfill";

let io = require('../../hedgehog/protocol/proto/io_pb');


export default class StateAction {
    private port: number;
    private flags: any;

    constructor(port: number, flags: any) {
        if(flags & io.IOStateFlags.OUTPUT && flags & (io.IOStateFlags.PULLUP | io.IOStateFlags.PULLDOWN)) {
            throw new TypeError("only input ports can be set to pullup or pulldown");
        }

        if( !(flags & io.IOStateFlags.OUTPUT) && flags & io.IOStateFlags.LEVEL) {
            throw new TypeError("only output ports can be set to on");
        }

        if(flags & io.IOStateFlags.PULLUP && flags & io.IOStateFlags.PULLDOWN) {
            throw new TypeError("pullup and pulldown are mutually exclusive");
        }

        this.port = port;
        this.flags = flags;
    }

    public parse() {
        let stateAction = new io.StateAction();
        stateAction.setPort(this.port);
        stateAction.setFlags(this.flags);

        return stateAction;
    }

    public output(ioStateAction) {
        return (ioStateAction.flags & io.IOStateFlags.OUTPUT) !== 0;
    }

    public pullup(ioStateAction) {
        return (ioStateAction.flags & io.IOStateFlags.PULLUP) !== 0;
    }

    public pulldown(ioStateAction) {
        return (ioStateAction.flags & io.IOStateFlags.PULLDOWN) !== 0;
    }

    public level(ioStateAction) {
        return (ioStateAction.flags & io.IOStateFlags.LEVEL) !== 0;
    }
}
