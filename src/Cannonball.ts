import { Graphics } from "./Graphics";
import { SimulationObject } from "./SimulationObject";
import { Kilogram, Meters, MetersPerSeconds, Radians } from "./units";
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

export class Cannonball implements SimulationObject {
    private mass: Kilogram = 0.01;
    private radius: Meters = 0.01;
    private velocity: Vector2d;

    private previousPositions: Vector2d[] = [];


    constructor(
        private pos: Vector2d,
        angle: Radians,
        startSpeed: MetersPerSeconds,
        private airResistanceInput: AirResistanceInputListener
    ) {
        this.velocity = new Vector2d(
            Math.sin(angle) * startSpeed,
            Math.cos(angle) * startSpeed,
        );
    }

    public update(deltaT: number): void {
        this.previousPositions.push(this.pos.clone())

        if (this.pos.y < 0) {
            return
        }
        const drag = this.dragForce()
        this.velocity.add(
            acceleration([
                gravityForce(this.mass),
                drag,
            ], this.mass).extend(deltaT),
        );
        this.pos.add(this.velocity.clone().extend(deltaT));
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
        graphics.drawCannonball(this.pos, 0.01);
    }
}
