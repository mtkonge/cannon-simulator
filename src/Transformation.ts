import { Input } from "./Input";
import { Vector2d, v2 } from "./Vector2d";

export class Transformation {
    public middle: Vector2d;
    /** pixels / meter */
    private scale = 100;

    private zoomSpeed = 1.1;

    public constructor(private canvasSize: Vector2d, private input: Input) {
        this.middle = canvasSize.clone().divideComponents(2);
    }

    public update() {
        if (this.input.isDragging()) {
            this.middle.add(this.input.dragged().extend(-1));
            console.log(this.middle)
        }
        if (this.input.scrolled()) {
            const scroll = this.input.scrolled();
            const scrollPos = this.input.scrolledPosition();
            console.log(scrollPos)
            if (scroll > 0) {
                this.scale /= this.zoomSpeed;
                this.middle = this.middle.clone()
            } else if (scroll < 0) {
                this.scale *= this.zoomSpeed;
            }
        }
    }

    public simulationToScreenX(value: number): number {
        return this.middle.x + this.scale * value;
    }

    public simulationToScreenY(value: number): number {
        return this.middle.y - this.scale * value;
    }

    public screenToSimulationX(value: number): number {
        return (value - this.middle.x) / this.scale
    }

    public screenToSimulationY(value: number): number {
        return (value - this.middle.y) / this.scale
    }
}
