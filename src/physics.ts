import { Vector2d } from "./Vector2d";

export function gravityForce(mass: number): Vector2d {
    const gravityConstant = 9.82;
    return new Vector2d(0, -gravityConstant * mass);
}

export function acceleration(forces: Vector2d[], mass: number): Vector2d {
    return forces.reduce((sum, force) => sum.add(force), new Vector2d(0, 0)).divideComponents(mass);
}

