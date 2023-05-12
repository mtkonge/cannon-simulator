import { Radians } from "./units";

export interface CannonProfile {
    wheelRadius(): number;
    barrelLength(): number;
    barrelWidth(): number;
    angle(): Radians;
}
