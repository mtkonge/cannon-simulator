import { Graphics } from "./Graphics";
import { SimulationObject } from "./SimulationObject";
import { Radian } from "./Unit";
import { Vector2d } from "./Vector2d";

export class Cannonball implements SimulationObject {
    private mass = 1;

    private velocity: Vector2d;

    constructor(private pos: Vector2d, angle: Radian, force: number) {
        this.velocity = new Vector2d(
            Math.sin(angle) * force,
            Math.cos(angle) * force,
        );
    }

    public update(deltaT: number): void {
        const gravityForce = new Vector2d(0, -9.82 * this.mass);
        const acceleration = gravityForce.clone().divideComponents(this.mass);
        this.velocity.add(acceleration.clone().extend(deltaT));
        this.pos.add(this.velocity);
    }

    public render(graphics: Graphics): void {
        graphics.drawCircle(this.pos.x, this.pos.y, 10);
    }
}
