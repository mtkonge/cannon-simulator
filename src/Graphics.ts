import { CannonProfile } from "./CannonProfile";
import { Input } from "./Input";
import { Transformation } from "./Transformation";
import { Vector2d, v2 } from "./Vector2d";
import { Meters } from "./units";
import { Ref, clamp, range } from "./utils";

export class Graphics {
    private canvas: HTMLCanvasElement;
    private context: CanvasRenderingContext2D;
    private transformation_: Transformation;

    public constructor(input: Input) {
        this.canvas = document.querySelector<HTMLCanvasElement>("#canvas")!;
        this.context = this.canvas.getContext("2d")!;
        this.transformation_ = new Transformation(v2(this.canvas.width, this.canvas.height), input);
    }

    public transformation(): Ref<Transformation> {
        return this.transformation_;
    }

    private x(value: number): number {
        return this.transformation_.simulationToScreenX(value);
    }

    private y(value: number): number {
        return this.transformation_.simulationToScreenY(value);
    }

    public drawLineRaw(fromPos: Vector2d, toPos: Vector2d, options?: { strokeStyle?: string, lineWidth?: number }) {
        if (options) {
            if (options.strokeStyle)
                this.context.strokeStyle = options.strokeStyle;
            if (options.lineWidth)
                this.context.lineWidth = options.lineWidth;
        }
        this.context.beginPath();
        this.context.moveTo(fromPos.x, fromPos.y);
        this.context.lineTo(toPos.x, toPos.y);
        this.context.stroke();
    }

    public drawCircle(x: number, y: number, radius: number, fillStyle?: string) {
        this.context.fillStyle = fillStyle ?? "blue";
        this.context.beginPath();
        this.context.arc(this.x(x), this.y(y), radius, 0, 2 * Math.PI);
        this.context.fill();
    }

    public clear() {
        this.context.fillStyle = "white";
        this.context.beginPath();
        this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    public drawGrid() {
        const maxWidth = Math.max(
            this.transformation_.screenToSimulationX(this.canvas.width) - this.transformation_.screenToSimulationX(0),
            this.transformation_.screenToSimulationY(this.canvas.height) - this.transformation_.screenToSimulationY(0)
        )


        if (maxWidth < 0.01) {
            this.drawGridSpecificFactor(0.001, "mm", 3)
        } else if (maxWidth < 0.02) {
            this.drawGridSpecificFactor(0.002, "mm", 3)
        } else if (maxWidth < 0.05) {
            this.drawGridSpecificFactor(0.005, "mm", 3)
        } else if (maxWidth < 0.1) {
            this.drawGridSpecificFactor(0.01, "cm", 2)
        } else if (maxWidth < 0.2) {
            this.drawGridSpecificFactor(0.02, "cm", 2)
        } else if (maxWidth < 0.5) {
            this.drawGridSpecificFactor(0.05, "cm", 2)
        } else if (maxWidth < 1) {
            this.drawGridSpecificFactor(0.1, "cm", 2)
        } else if (maxWidth < 2) {
            this.drawGridSpecificFactor(0.2, "cm", 2)
        } else if (maxWidth < 5) {
            this.drawGridSpecificFactor(0.5, "cm", 2)
        } else if (maxWidth < 10) {
            this.drawGridSpecificFactor(1, "m", 0)
        } else if (maxWidth < 20) {
            this.drawGridSpecificFactor(2, "m", 0)
        } else if (maxWidth < 50) {
            this.drawGridSpecificFactor(5, "m", 0)
        } else if (maxWidth < 100) {
            this.drawGridSpecificFactor(10, "m", 0)
        } else if (maxWidth < 200) {
            this.drawGridSpecificFactor(20, "m", 0)
        } else if (maxWidth < 500) {
            this.drawGridSpecificFactor(50, "m", 0)
        } else if (maxWidth < 1000) {
            this.drawGridSpecificFactor(100, "m", 0)
        } else {
            this.drawGridSpecificFactor(200, "m", 0)
        }

        this.drawLineRaw(v2(this.x(0), 0), v2(this.x(0), this.canvas.height), { strokeStyle: "#000", lineWidth: 2 })
        this.drawLineRaw(v2(0, this.y(0)), v2(this.canvas.width, this.y(0)), { strokeStyle: "#000", lineWidth: 2 })
    }

    public drawGridSpecificFactor(factor: number, suffix: string, disExp: number) {

        let gridLineStartX = Math.floor(this.transformation_.screenToSimulationX(0))
        gridLineStartX += gridLineStartX % factor
        let gridLineStartY = Math.floor(this.transformation_.screenToSimulationY(0))
        gridLineStartY += gridLineStartY % factor
        for (let i = 0; i < 20; ++i) {

            const simulationX = i * factor + gridLineStartX;
            const x = this.x(simulationX)
            const simulationY = - gridLineStartY - i * factor
            const y = this.y(simulationY)


            this.drawLineRaw(v2(x, 0), v2(x, this.canvas.height), { strokeStyle: "#aaa", lineWidth: 1 })

            this.drawLineRaw(v2(0, y), v2(this.canvas.width, y), { strokeStyle: "#bbb", lineWidth: 1 })

            if ((i * factor) + gridLineStartX !== 0)
                this.drawTextRaw(v2(x, this.y(0)), `${Math.round((i * factor + gridLineStartX) * 10 ** disExp)}${suffix}`)
            if (-(i * factor) - gridLineStartY !== 0)
                this.drawTextRaw(v2(this.x(0), y), `${Math.round((-i * factor - gridLineStartY) * 10 ** disExp)}${suffix}`)
        }

    }

    private drawTextRaw(pos: Vector2d, text: string) {
        this.context.font = "20px Arial";
        this.context.fillStyle = "black";
        this.context.textAlign = "center";
        this.context.textBaseline = "middle";
        this.context.fillText(text, pos.x, pos.y);

    }

    public drawCannonWheel(profile: CannonProfile, pos: Vector2d) {
        const wheelRadius = this.transformation_.screenScale(profile.wheelRadius());

        this.context.save();
        this.context.fillStyle = "#9F5C41";
        this.context.lineWidth = 3;
        this.context.translate(this.x(pos.x), this.y(pos.y));

        this.context.beginPath();
        for (let i = 0; i < 4; i++) {
            this.context.rect(-wheelRadius, -2, wheelRadius * 2, 4);
            this.context.rotate(Math.PI * 0.25);
        }
        this.context.fill();

        this.context.strokeStyle = "#634133";
        this.context.beginPath();
        this.context.arc(0, 0, wheelRadius, 0, 2 * Math.PI);
        this.context.stroke();
        //
        this.context.fillStyle = "#634133";
        this.context.beginPath();
        this.context.arc(0, 0, wheelRadius * 0.33, 0, 2 * Math.PI);
        this.context.fill();

        this.context.restore();
    }

    public drawCannonBarrel(profile: CannonProfile, pos: Vector2d) {
        const angle = profile.angle();
        const barrelLength = this.transformation_.screenScale(profile.barrelLength());
        const barrelWidth = this.transformation_.screenScale(profile.barrelWidth());
        this.context.save();
        this.context.beginPath();
        this.context.fillStyle = "black";
        this.context.translate(this.x(pos.x), this.y(pos.y));
        this.context.rotate(angle);
        this.context.rect(
            (-barrelWidth * 0.5),
            (-barrelLength),
            barrelWidth,
            barrelLength,
        );
        this.context.arc(0, 0, barrelWidth / 2, Math.PI - 0, Math.PI - 2 * Math.PI);
        this.context.fill();
        this.context.restore();
    }

    public drawCannon(pos: Vector2d, cannonProfile: CannonProfile) {
        this.drawCannonBarrel(cannonProfile, pos);
        this.drawCannonWheel(cannonProfile, pos);
    }

    public drawCannonball(pos: Vector2d<Meters>, radius: Meters) {
        this.drawCircle(pos.x, pos.y, this.transformation_.screenScale(radius), "red")
    }
}
