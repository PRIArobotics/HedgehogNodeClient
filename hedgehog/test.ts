import {HedgehogClient} from "./client/hedgehogClient";
import {MotorState} from "./proto/motor";
/**
 * Created by tfellner on 30.11.16.
 */


let hedgehogClient: HedgehogClient = new HedgehogClient('tcp://192.168.43.4:10789');

console.log('Sending motor start 1000,1000');
hedgehogClient.move(0, 1000);
hedgehogClient.move(1, 1000);

setTimeout(() => {

    hedgehogClient.setServo(0, true, 100);
    console.log('Sending motor 250,250');
    hedgehogClient.move(0, 250);
    hedgehogClient.move(1, 250);

    setTimeout(() => {

        console.log('Sending motor 1,1');
        hedgehogClient.move(0, 1);
        hedgehogClient.move(1, 1);
        hedgehogClient.getAnalog(0).then((val) => {
            console.log('sensor val: ', val);
            setTimeout(() => {

                console.log('Sending motor stop NOT WORKING..?');
                hedgehogClient.move(0, 1, MotorState.BREAK);
                hedgehogClient.move(1, 1, MotorState.BREAK);

                setTimeout(() => {
                    hedgehogClient.close();
                }, 500);
            }, 1000);
        });
    }, 1000);
}, 1000);