import { Vector2d } from "./Vector2d";
import { Kilogram, KilogramPerMeters3, Meters2, MetersPerSeconds, Newton } from "./units";

export function sphereCrossSectionalArea(radius: number) {
    return Math.PI * radius ** 2;
}

export const sphereDragCoefficient = 0.5;

/** approximate air density at 0c */
export const airDensity = 1.3 as KilogramPerMeters3;

export function dragForce(dragCoefficient: number, fluidDensity: KilogramPerMeters3, area: Meters2, deltaVelocity: Vector2d<MetersPerSeconds>): Vector2d<Newton> {
    return deltaVelocity.clone().raiseComponents(2).extend(-0.5 * dragCoefficient * fluidDensity * area);
}

export const gravityAcceleration: MetersPerSeconds = 9.82;

export function gravityForce(mass: Kilogram): Vector2d<Newton> {
    return new Vector2d(0, -gravityAcceleration * mass);
}

export function acceleration(forces: Vector2d<Newton>[], mass: Kilogram): Vector2d<MetersPerSeconds> {
    return forces.reduce((sum, force) => sum.add(force), new Vector2d(0, 0)).divideComponents(mass);
}

