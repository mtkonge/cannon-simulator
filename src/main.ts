import { Cannonball } from "./Cannonball";
import { Graphics } from "./Graphics";
import { SimulationObject } from "./SimulationObject";
import { Vector2d } from "./Vector2d";
import "./style.css";

function cannonballStartPosition(
    x: number,
    y: number,
    angle: number,
    baseRadius: number,
) {
    return new Vector2d(
        x + Math.sin(angle * Math.PI * (1 / 180)) * (baseRadius + angle),
        y - Math.cos(angle * Math.PI * (1 / 180)) * (baseRadius + angle),
    );
}

function main() {
    const graphics = new Graphics();
    graphics.clearCanvas();

    const simulationObjects: SimulationObject[] = [
        new Cannonball(
            cannonballStartPosition(50, 750, 45, 16),
            1,
            new Vector2d(2, -2),
        ),
    ];

    const loop = (before: number) => {
        const now = Date.now();
        const deltaT = (now - before) / 1000;

        for (const simulationObject of simulationObjects)
            simulationObject.update(deltaT);

        graphics.clearCanvas();
        for (const simulationObject of simulationObjects)
            simulationObject.render(graphics);

        requestAnimationFrame(() => loop(now));
    };
    loop(Date.now());
}

main();
