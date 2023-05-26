import { Graphics } from "./Graphics";
import { SimulationObject } from "./SimulationObject";
import { MetersPerSeconds, Radians } from "./units";
import { Vector2d, } from "./Vector2d";
import {
    acceleration,
    airDensity,
    dragForce,
    gravityForce,
    sphereCrossSectionalArea,
    sphereDragCoefficient,
} from "./physics";

export class Cannonball implements SimulationObject {
    private mass = 0.01;
    private velocity: Vector2d;

    constructor(
        private pos: Vector2d,
        angle: Radians,
        startSpeed: MetersPerSeconds,
    ) {
        this.velocity = new Vector2d(
            Math.sin(angle) * startSpeed,
            Math.cos(angle) * startSpeed,
        );
    }

    public update(deltaT: number): void {
        const drag = dragForce(
            sphereDragCoefficient,
            airDensity,
            sphereCrossSectionalArea(0.01),
            this.velocity.clone(),
        );
        this.velocity.add(
            acceleration([gravityForce(this.mass), drag], this.mass).extend(
                deltaT,
            ),
        );
        this.pos.add(this.velocity);
    }

    public render(graphics: Graphics): void {
        graphics.drawCannonball(this.pos, 0.1);
    }
}
