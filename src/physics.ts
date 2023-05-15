import { Vector2d } from "./Vector2d";
import { KilosPerMeters3, Meters2, MetersPerSeconds, Newton } from "./units";

export function sphereCrossSectionalArea(radius: number) {
    return Math.PI * radius ** 2;
}

export const sphereDragCoefficient = 0.5;
// approximate air density at 0c
export const airDensity = 1.3 as KilosPerMeters3;

export function dragForce(dragCoefficient: number, fluidDensity: KilosPerMeters3, area: Meters2, deltaVelocity: Vector2d<MetersPerSeconds>): Vector2d<Newton> {
    return deltaVelocity.clone().raiseComponents(2).extend(-0.5 * dragCoefficient * fluidDensity * area);
}

export function gravityForce(mass: number): Vector2d {
    const gravityConstant = 9.82;
    return new Vector2d(0, -gravityConstant * mass);
}

export function acceleration(forces: Vector2d[], mass: number): Vector2d {
    return forces.reduce((sum, force) => sum.add(force), new Vector2d(0, 0)).divideComponents(mass);
}

