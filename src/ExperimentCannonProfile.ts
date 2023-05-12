import { CannonProfile } from "./CannonProfile";
import { Radians, degreesToRadians } from "./units";

export class ExperimentCannonProfile implements CannonProfile {
    barrelWidth(): number {
        return 20;
    }
    wheelRadius(): number {
        return 16;
    }
    barrelLength(): number {
        return 50;
    }
    angle(): Radians {
        return degreesToRadians(45);
    }
}