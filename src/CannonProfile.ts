import { Meters, Radians } from "./units";

export interface CannonProfile {
    wheelRadius(): Meters;
    barrelLength(): Meters;
    barrelWidth(): Meters;
    angle(): Radians;
}
