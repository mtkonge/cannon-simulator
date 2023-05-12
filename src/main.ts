import { Cannon } from "./Cannon";
import { ExperimentCannonProfile } from "./ExperimentCannonProfile";
import { Graphics } from "./Graphics";
import { Objects } from "./Objects";
import { Vector2d } from "./Vector2d";
import "./style.css";

function main() {
    const graphics = new Graphics();
    graphics.clearCanvas();

    const profile = new ExperimentCannonProfile();

    const simulationObjects = new Objects();
    simulationObjects.add(
        new Cannon(new Vector2d(50, 50), simulationObjects, profile),
    );
    simulationObjects.flushAddQueue();

    const simulationIteration = (before: number) => {
        const now = Date.now();
        const deltaT = (now - before) / 1000;

        simulationObjects.update(deltaT);

        graphics.clearCanvas();
        simulationObjects.render(graphics);

        requestAnimationFrame(() => simulationIteration(now));
    };
    simulationIteration(Date.now());
}

main();
