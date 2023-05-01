import { Graphics } from "./Graphics";
import { SimulationObject } from "./SimulationObject";
import { Vector2d } from "./Vector2d";

export class Cannonball implements SimulationObject {
    constructor(
        //x = cannon_x + Math.sin(angle) * (cannon_base_radius + cannon_length);
        //y = cannon_y - Math.cos(angle) * (cannon_base_radius + cannon_length
        private pos: Vector2d,
        private mass: number,
        private velocity: Vector2d,
    ) {}

    public update(deltaT: number): void {
        const gravityForce = new Vector2d(0, 1);
        const acceleration = gravityForce.clone().divideComponents(this.mass);
        this.velocity.add(acceleration.clone().extend(deltaT));
        this.pos.add(this.velocity);
    }

    public render(graphics: Graphics): void {
        graphics.drawCircle(this.pos.x, this.pos.y, 10);
    }
}
