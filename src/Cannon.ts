import { CannonProfile } from "./CannonProfile";
import { Cannonball } from "./Cannonball";
import { Graphics } from "./Graphics";
import { ObjectsAdderAndRemover } from "./ObjectAdderAndRemover";
import { SimulationObject } from "./SimulationObject";
import { Radians } from "./units";
import { Vector2d, v2 } from "./Vector2d";
import { AirResistanceInputListener } from "./AirResistanceInputListener";

export class Cannon implements SimulationObject {
    private button =
        document.querySelector<HTMLButtonElement>("#shoot-cannon")!;
    private startSpeedInput =
        document.querySelector<HTMLInputElement>("#cannon-speed")!;
    private buttonListener: () => any;
    private airResistanceInput = new AirResistanceInputListener()

    constructor(
        private pos: Vector2d,
        private objects: ObjectsAdderAndRemover,
        private profile: CannonProfile,
    ) {
        this.buttonListener = () => this.shoot();
        this.button.addEventListener("click", this.buttonListener);
    }

    update(_deltaT: number): void {
        document.querySelector<HTMLSpanElement>("#cannon-angle-info")!.innerText = (-this.profile.angle() / Math.PI * 180 + 90).toPrecision(3) + "°";

    }

    render(graphics: Graphics): void {
        graphics.drawCannon(this.pos, this.profile);
        const startPosition =
            this.cannonballStartPosition(this.pos, this.profile.angle(), this.profile.barrelLength());
        graphics.drawCircle(startPosition.x, startPosition.y, 0.005, "green");
    }

    destructor(): void {
        this.button.removeEventListener("click", this.buttonListener);
    }

    private startSpeed(): number | null {
        try {
            return parseFloat(this.startSpeedInput.value);
        } catch {
            return null;
        }
    }

    private shoot() {
        const startSpeed = this.startSpeed();
        if (startSpeed === null) {
            return;
        }

        this.objects.add(
            new Cannonball(
                this.cannonballStartPosition(this.pos, this.profile.angle(), this.profile.barrelLength()),
                this.profile.angle(),
                startSpeed,
                this.airResistanceInput
            ),
        );
    }

    private cannonballStartPosition(
        { x, y }: Vector2d,
        angle: Radians,
        barrelLength: number,
    ) {
        // return new Vector2d(
        //     x + Math.sin(angle) * barrelLength,
        //     y + Math.cos(angle) * barrelLength,
        // );
        return v2(x, y)
    }
}
