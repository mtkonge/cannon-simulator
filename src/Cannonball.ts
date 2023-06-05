import { Graphics } from "./Graphics";
import { SimulationObject } from "./SimulationObject";
import { Kilogram, Meters, MetersPerSeconds, Radians, Seconds } from "./units";
import { Vector2d, v2, } from "./Vector2d";
import {
    acceleration,
    airDensity,
    dragForce,
    gravityForce,
    sphereCrossSectionalArea,
    sphereDragCoefficient,
} from "./physics";
import { AirResistanceInputListener } from "./AirResistanceInputListener";
import { Input } from "./Input";

export class Cannonball implements SimulationObject {
    private mass: Kilogram = 0.01;
    private radius: Meters = 0.01;
    private velocity: Vector2d;
    private accumulatedDeltaT = 0;
    private done = false;
    private mostToppestPoint: Vector2d;
    private mostToppestPointTime: Seconds = 0;

    private previousPositions: Vector2d[] = [];


    constructor(
        private pos: Vector2d,
        angle: Radians,
        startSpeed: MetersPerSeconds,
        private airResistanceInput: AirResistanceInputListener,
        private input: Input,
    ) {
        this.mostToppestPoint = pos.clone();
        this.velocity = new Vector2d(
            Math.sin(angle) * startSpeed,
            Math.cos(angle) * startSpeed,
        );
    }

    public update(deltaT: number): void {

        if (this.pos.y < 0) {
            if (!this.done) {
                this.previousPositions.push(this.pos.clone())
                this.done = true;
            }
            return
        }
        this.previousPositions.push(this.pos.clone())
        this.accumulatedDeltaT += deltaT;

        const drag = this.dragForce()
        this.velocity.add(
            acceleration([
                gravityForce(this.mass),
                drag,
            ], this.mass).extend(deltaT),
        );
        this.pos.add(this.velocity.clone().extend(deltaT));

        if (this.pos.y > this.mostToppestPoint.y) {
            this.mostToppestPoint = this.pos.clone();
            this.mostToppestPointTime = this.accumulatedDeltaT;
        }
    }

    private dragForce() {
        switch (this.airResistanceInput.mode()) {
            case "off":
                return v2(0, 0)
            case "realistic":
                return dragForce(
                    sphereDragCoefficient,
                    airDensity,
                    sphereCrossSectionalArea(this.radius),
                    this.velocity.clone(),
                );
            case "exaggerated": return dragForce(
                sphereDragCoefficient,
                airDensity,
                sphereCrossSectionalArea(this.radius * 10),
                this.velocity.clone(),
            );
        }
    }

    public render(graphics: Graphics): void {
        graphics.drawPreviousCannonballPositions(this.previousPositions)

        const touchdownPos = (() => {
            if (this.previousPositions.length < 2)
                return null;
            const { x: x1, y: y1 } = this.previousPositions.at(-2)!;
            const { x: x2, y: y2 } = this.previousPositions.at(-1)!;
            const a = (y2 - y1) / (x2 - x1);
            const b = y2 - a * x2;
            const x = -b / a;
            return v2(x, 0)
        })();

        if (this.done)
            graphics.drawCannonballFixed(touchdownPos ?? this.pos);
        if (this.input.showMeasured()) {
            graphics.drawTopPointStats(this.mostToppestPoint, this.mostToppestPointTime)
            if (this.done)
                graphics.drawEndPointStats(touchdownPos ?? this.pos, this.mostToppestPoint, this.accumulatedDeltaT)
        }
    }
}
