import { CannonProfile } from "./CannonProfile";
import { Cannonball } from "./Cannonball";
import { Graphics } from "./Graphics";
import { ObjectsAdderAndRemover } from "./ObjectAdderAndRemover";
import { SimulationObject } from "./SimulationObject";
import { Radians } from "./units";
import { Vector2d, v2 } from "./Vector2d";
import { AirResistanceInputListener } from "./AirResistanceInputListener";
import { Input } from "./Input";
import { gravityAcceleration } from "./physics";

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
        private input: Input,
    ) {
        this.buttonListener = () => this.shoot();
        this.button.addEventListener("click", this.buttonListener);
    }

    update(_deltaT: number): void {

    }

    render(graphics: Graphics): void {
        document.querySelector<HTMLSpanElement>("#cannon-angle-info")!.innerText = (-this.profile.angle() / Math.PI * 180 + 90).toFixed(0) + "°";
        graphics.drawCannon(this.pos, this.profile);
        const startPosition =
            this.cannonballStartPosition(this.pos, this.profile.angle(), this.profile.barrelLength());
        graphics.drawCircle(startPosition.x, startPosition.y, 0.005, "green");
        if (this.input.showMeasured()) {
            graphics.drawCannonStats(this.pos, this.profile.angle(), this.startSpeed())
        } else if (this.input.showCalculated()) {
            graphics.drawCannonStats(this.pos, this.profile.angle(), this.startSpeed())

            const angle = this.profile.angle();
            const height = this.profile.height();
            const startSpeed = this.startSpeed()!;
            const acceleration = gravityAcceleration;
            const startSpeedY = startSpeed * Math.sin(angle)
            // y = 1/2 * a * t^2 + V_0y * t - h
            // 0 = 1/2 * -acceleration * t^2 + startSpeedY * t - height 
            //
            const a = 0.5 * acceleration
            const b = startSpeedY;
            const c = -height;
            const d = b ** 2 - 4 * a * c;
            if (d < 0)
                throw false;
            const time = (-b + Math.sqrt(d)) / 2 * a;
            const startSpeedX = startSpeed * Math.cos(angle);
            const x = startSpeedX * time;
            // v_y = -g * t + v_0y
            // 0 = v_y
            // 0 = -g * t_top + v0_y
            // 0 = -acceleration * t_top + startSpeedY
            // -startSpeedY = -acceleration * t_top
            // t_top = -startSpeedY / -acceleration
            const topTime = startSpeedY / acceleration;
            const topY = 1 / 2 * acceleration * topTime ** 2 + startSpeedY * topTime - height;
            const topX = startSpeedX * time;

            graphics.drawTopPointStats(v2(topY, topX), topTime)
            graphics.drawEndPointStats(v2(x, 0), v2(topY, topX), time)
        }
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
                this.airResistanceInput,
                this.input,
            ),
        );
    }

    private cannonballStartPosition(
        { x, y }: Vector2d,
        _angle: Radians,
        _barrelLength: number,
    ) {
        // return new Vector2d(
        //     x + Math.sin(angle) * barrelLength,
        //     y + Math.cos(angle) * barrelLength,
        // );
        return v2(x, y)
    }
}
