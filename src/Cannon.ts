import { CannonProfile } from "./CannonProfile";
import { Cannonball } from "./Cannonball";
import { Graphics } from "./Graphics";
import { ObjectsAdderAndRemover } from "./ObjectAdderAndRemover";
import { SimulationObject } from "./SimulationObject";
import { Meters, MetersPerSeconds, MetersPerSeconds2, Seconds } from "./units";
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
            this.cannonballStartPosition(this.pos);
        graphics.drawCircle(startPosition.x, startPosition.y, 0.005, "green");
        if (this.input.showMeasured()) {
            graphics.drawCannonStats(this.pos, this.profile.angle(), this.startSpeed())
        } else if (this.input.showCalculated()) {
            graphics.drawCannonStats(this.pos, this.profile.angle(), this.startSpeed())

            const { top, topTime, end, endTime, acceleration, startSpeed, height } = this.calculateProjection();

            graphics.drawTopPointStats(top, topTime)
            graphics.drawEndPointStats(end, top, endTime)
            graphics.drawFunctionInInterval(v2(0, 0), 0, end.x, (x) => 0.5 * -acceleration * (x / startSpeed.x) ** 2 + (x / startSpeed.x) * startSpeed.y + height);
        }
    }

    private calculateProjection(): {
        end: Vector2d<Meters>,
        endTime: Seconds,
        top: Vector2d<Meters>,
        topTime: Seconds,
        startSpeed: Vector2d<MetersPerSeconds>,
        acceleration: MetersPerSeconds2,
        height: Meters,
    } {
        const angle = this.profile.angle();
        const height = this.profile.height();
        const startSpeed = this.startSpeed()!;
        const acceleration = gravityAcceleration;
        const startSpeedY = startSpeed * Math.sin(angle)
        const a = -0.5 * acceleration
        const b = startSpeedY;
        const c = height;
        const d = (b ** 2) - (4 * a * c);
        if (d < 0)
            throw false;
        const endTime = ((-b) - Math.sqrt(d)) / (2 * a);
        const startSpeedX = startSpeed * Math.cos(angle);
        const x = startSpeedX * endTime;
        const topTime = -b / (2 * a)
        const topX = startSpeedX * topTime;
        const topY = a * (topTime ** 2) + b * topTime + height;

        return {
            end: v2(x, 0),
            endTime,
            top: v2(topX, topY),
            topTime,
            startSpeed: v2(startSpeedX, startSpeedY),
            acceleration,
            height,
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
                this.cannonballStartPosition(this.pos),
                this.profile.angle(),
                startSpeed,
                this.airResistanceInput,
                this.input,
            ),
        );
    }

    private cannonballStartPosition(
        { x, y }: Vector2d,
    ) {
        return v2(x, y + this.profile.height())
    }
}
