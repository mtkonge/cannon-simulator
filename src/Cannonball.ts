import { Graphics } from "./Graphics";
import { SimulationObject } from "./SimulationObject";
import { Radians } from "./units";
import { Vector2d } from "./Vector2d";
import { acceleration, atmosphericPressure, dragForce, gravityForce, sphereCrossSectionalArea, sphereDragCoefficient } from "./physics";

export class Cannonball implements SimulationObject {
    private mass = 1;
    private velocity: Vector2d;

    private printamount = 0;

    constructor(private pos: Vector2d, angle: Radians, force: number) {
        this.velocity = new Vector2d(
            Math.sin(angle) * force,
            Math.cos(angle) * force,
        );
        console.log(this.velocity);
    }

    public update(deltaT: number): void {
        if (this.printamount < 100) {
            console.log(gravityForce(this.mass),
                dragForce(
                    sphereDragCoefficient,
                    atmosphericPressure,
                    sphereCrossSectionalArea(10),
                    this.velocity.clone(),
                ),
            )
            this.printamount++;
        }
        this.velocity.add(acceleration([
            gravityForce(this.mass),
            dragForce(
                sphereDragCoefficient,
                atmosphericPressure,
                sphereCrossSectionalArea(10),
                this.velocity.clone(),
            ),
        ], this.mass).extend(deltaT));
        this.pos.add(this.velocity);
    }

    public render(graphics: Graphics): void {
        graphics.drawCircle(this.pos.x, this.pos.y, 10);
    }
}
