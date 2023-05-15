import { Vector2d } from "./Vector2d";
import { Meters2, MetersPerSeconds, Newton, Pascal } from "./units";

export function sphereCrossSectionalArea(radius: number) {
    return Math.PI * radius ** 2;
}

export const sphereDragCoefficient = 0.5;
export const atmosphericPressure = 101800 as Pascal;

export function dragForce(dragCoefficient: number, pressure: Pascal, area: Meters2, deltaVelocity: Vector2d<MetersPerSeconds>): Vector2d<Newton> {
    // FIXME
    // TODO
    // NOTE dont gange med tryk
    return deltaVelocity.clone().raiseComponents(2).extend(1 / 2 * dragCoefficient * pressure * area);
}

export function gravityForce(mass: number): Vector2d {
    const gravityConstant = 9.82;
    return new Vector2d(0, -gravityConstant * mass);
}

export function acceleration(forces: Vector2d[], mass: number): Vector2d {
    return forces.reduce((sum, force) => sum.add(force), new Vector2d(0, 0)).divideComponents(mass);
}

