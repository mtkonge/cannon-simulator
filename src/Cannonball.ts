import { Graphics } from "./Graphics";
import { SimulationObject } from "./SimulationObject";
import { Radians } from "./units";
import { Vector2d } from "./Vector2d";
import { acceleration, gravityForce } from "./physics";

export class Cannonball implements SimulationObject {
    private mass = 1;

    private velocity: Vector2d;

    constructor(private pos: Vector2d, angle: Radians, force: number) {
        this.velocity = new Vector2d(
            Math.sin(angle) * force,
            Math.cos(angle) * force,
        );
    }

    public update(deltaT: number): void {
        this.velocity.add(acceleration([gravityForce(this.mass)], this.mass).extend(deltaT));
        this.pos.add(this.velocity);
    }

    public render(graphics: Graphics): void {
        graphics.drawCircle(this.pos.x, this.pos.y, 10);
    }
}
