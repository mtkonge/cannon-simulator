import { Vector2d } from "./Vector2d";

export class Transformation {
    private translation = new Vector2d(0, 0);
    private scale = 1;

    public constructor(private canvasHeight: number) { }

    public simulationToScreenX(value: number): number {
        return value * this.scale + this.translation.x;
    }

    public simulationToScreenY(value: number): number {
        return (this.canvasHeight - value - 1) * this.scale + this.translation.y;
    }

    public screenToSimulationX(value: number): number {
        return (value - this.translation.x) / this.scale;
    }

    public screenToSimulationY(value: number): number {
        return (((this.canvasHeight - this.translation.y) / this.scale) + value + 1)
    }
}

