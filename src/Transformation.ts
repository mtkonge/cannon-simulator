import { Input } from "./Input";
import { Vector2d } from "./Vector2d";

export class Transformation {
    public translation = new Vector2d(0, 0);
    public scale = 1;

    public constructor(private canvasHeight: number, private input: Input) { }

    public update() {
        if (this.input.isDragging()) {
            this.translation.add(this.input.dragged());
        }
        if (this.input.scrolled()) {
            const scroll = this.input.scrolled();
            if (scroll > 0) {
                this.scale *= 1.05;
            } else if (scroll < 0) {
                this.scale /= 1.05;
            }
        }
    }

    public simulationToScreenX(value: number): number {
        return value * this.scale + this.translation.x;
    }

    public simulationToScreenY(value: number): number {
        return (
            (this.canvasHeight - value - 1) * this.scale + this.translation.y
        );
    }

    public screenToSimulationX(value: number): number {
        return (value - this.translation.x) / this.scale;
    }

    public screenToSimulationY(value: number): number {
        return (
            (this.canvasHeight - this.translation.y) / this.scale + value + 1
        );
    }
}
