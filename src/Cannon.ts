import { CannonProfile } from "./CannonProfile";
import { Cannonball } from "./Cannonball";
import { Graphics } from "./Graphics";
import { ObjectsAdderAndRemover } from "./ObjectAdderAndRemover";
import { SimulationObject } from "./SimulationObject";
import { Radians } from "./units";
import { Vector2d } from "./Vector2d";

export class Cannon implements SimulationObject {
    private button =
        document.querySelector<HTMLButtonElement>("#shoot-cannon")!;
    private buttonListener: () => any;

    constructor(
        private pos: Vector2d,
        private objects: ObjectsAdderAndRemover,
        private profile: CannonProfile,
    ) {
        this.buttonListener = () => this.shoot();
        this.button.addEventListener("click", this.buttonListener);
    }

    update(_deltaT: number): void { }

    render(graphics: Graphics): void {
        graphics.drawCannon(this.pos, this.profile);
    }

    destructor(): void {
        this.button.removeEventListener("click", this.buttonListener);
    }

    private shoot() {
        this.objects.add(
            new Cannonball(
                this.cannonballStartPosition(this.pos, this.profile.angle(), 0, this.profile.barrelLength()),
                this.profile.angle(),
                6,
            ),
        );
    }

    private cannonballStartPosition(
        { x, y }: Vector2d,
        angle: Radians,
        wheelRadius: number,
        barrelLength: number,
    ) {
        return new Vector2d(
            x + Math.sin(angle) * (wheelRadius + barrelLength),
            y + Math.cos(angle) * (wheelRadius + barrelLength),
        );
    }
}
