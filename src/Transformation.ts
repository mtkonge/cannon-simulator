import { Input } from "./Input";
import { Vector2d, v2 } from "./Vector2d";
import { Meters } from "./units";
import { Pixels, PixelsPerMeter } from "./units";

export class Transformation {
    public middle: Vector2d<Pixels>;
    private scale: PixelsPerMeter = 1000;
    private readonly zoomSpeed = 1.1 as const;

    public constructor(private canvasSize: Vector2d, private input: Input) {
        this.middle = canvasSize.clone().divideComponents(2);
    }

    public update() {
        if (this.input.isDragging()) {
            this.middle.add(this.input.dragged().extend(-1));
        }
        if (this.input.scrolled()) {
            const scroll = this.input.scrolled();
            const scrollPos = this.input.scrolledPosition();

            const scaleOffsetFactor = (() => {
                if (scroll > 0 /* && this.scale > 47 */) {
                    this.scale /= this.zoomSpeed;
                    return (1 - this.zoomSpeed) / this.zoomSpeed;
                } else if (scroll < 0 /* && this.scale < 1331 */) {
                    this.scale *= this.zoomSpeed;
                    return this.zoomSpeed - 1;
                } else { return null }
            })()

            if (scaleOffsetFactor)
                this.middle = this.middle.clone().add(this.middle.clone()
                    .subtract(scrollPos)
                    .extend(scaleOffsetFactor))
        }
    }

    public screenScale(value: Meters): Pixels {
        return value * this.scale
    }

    public simulationScale(value: Pixels): Meters {
        return value * this.scale
    }

    public simulationToScreenX(value: Meters): Pixels {
        return this.middle.x + this.scale * value;
    }

    public simulationToScreenY(value: Meters): Pixels {
        return this.middle.y - this.scale * value;
    }

    public screenToSimulationX(value: Pixels): Meters {
        return (value - this.middle.x) / this.scale;
    }

    public screenToSimulationY(value: Pixels): Meters {
        return -(value - this.middle.y) / this.scale;
    }
}
