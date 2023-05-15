import { Graphics } from "./Graphics";
import { SimulationObject } from "./SimulationObject";
import { MetersPerSeconds, Radians } from "./units";
import { Vector2d } from "./Vector2d";
import { acceleration, airDensity, dragForce, gravityForce, sphereCrossSectionalArea, sphereDragCoefficient } from "./physics";

export class Cannonball implements SimulationObject {
    private mass = 100;
    private velocity: Vector2d;

    private printamount = 0;

    constructor(private pos: Vector2d, angle: Radians, startSpeed: MetersPerSeconds) {
        this.velocity = new Vector2d(
            Math.sin(angle) * startSpeed,
            Math.cos(angle) * startSpeed,
        );
    }

    public update(deltaT: number): void {
        const drag = dragForce(
            sphereDragCoefficient,
            airDensity,
            sphereCrossSectionalArea(10),
            this.velocity.clone(),
        );
        if (this.printamount < 100) {
            console.log(gravityForce(this.mass),
                drag
            )
            this.printamount++;
        }
        this.velocity.add(acceleration([
            gravityForce(this.mass),
            drag
        ], this.mass).extend(deltaT));
        this.pos.add(this.velocity);
    }

    public render(graphics: Graphics): void {
        graphics.drawCircle(this.pos.x, this.pos.y, 10);
    }
}
