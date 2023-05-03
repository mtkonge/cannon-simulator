import { Cannonball } from "./Cannonball";
import { Graphics } from "./Graphics";
import { ObjectsAdderAndRemover } from "./ObjectAdderAndRemover";
import { SimulationObject } from "./SimulationObject";
import { Vector2d } from "./Vector2d";

export class Cannon implements SimulationObject {
    private button =
        document.querySelector<HTMLButtonElement>("#shoot-cannon")!;
    private buttonListener: () => any;

    constructor(
        private pos: Vector2d,
        private angle: number,
        private objects: ObjectsAdderAndRemover,
    ) {
        this.buttonListener = () => this.shoot();
        this.button.addEventListener("click", this.buttonListener);
    }

    update(deltaT: number): void {}

    render(graphics: Graphics): void {
        graphics.drawCannon((this.angle * Math.PI) / 180, this.pos);
    }

    destructor(): void {
        this.button.removeEventListener("click", this.buttonListener);
    }

    private shoot() {
        this.objects.add(
            new Cannonball(
                this.cannonballStartPosition(this.pos, this.angle, 16, 40),
                this.angle,
                6,
            ),
        );
    }

    private cannonballStartPosition(
        { x, y }: Vector2d,
        angle: number,
        baseRadius: number,
        barrelLength: number,
    ) {
        const radian = angle * Math.PI * (1 / 180);
        return new Vector2d(
            x + Math.sin(radian) * (baseRadius + barrelLength),
            y + Math.cos(radian) * (baseRadius + barrelLength),
        );
    }
}
