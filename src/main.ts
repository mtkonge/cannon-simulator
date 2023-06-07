import { Cannon } from "./Cannon";
import { Cannonball } from "./Cannonball";
import { CanvasInput } from "./CanvasInput";
import { ExperimentCannonProfile } from "./ExperimentCannonProfile";
import { Graphics } from "./Graphics";
import { Objects } from "./Objects";
import { Vector2d } from "./Vector2d";
import "./style.css";

function main() {
    const canvas = document.querySelector<HTMLCanvasElement>("#canvas")!;

    const input = new CanvasInput(canvas);
    const graphics = new Graphics(input);
    graphics.clear();

    const profile = new ExperimentCannonProfile();

    const simulationObjects = new Objects();
    simulationObjects.add(
        new Cannon(new Vector2d(0, 0), simulationObjects, profile, input),
    );
    simulationObjects.flushAddQueue();

    document.querySelector<HTMLButtonElement>("#delete-balls")?.addEventListener("click", () => {
        simulationObjects.removeWhere((o) => o instanceof Cannonball)
    })

    const simulationIteration = (before: number) => {
        const now = Date.now();
        const deltaT = (now - before) / 1000;

        simulationObjects.update(deltaT);

        graphics.transformation().update();

        graphics.clear();
        graphics.drawGrid();
        simulationObjects.render(graphics);

        input.resetDrag();
        input.resetScroll();

        requestAnimationFrame(() => simulationIteration(now));
    };
    simulationIteration(Date.now());
}

main();
