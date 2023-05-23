import { CannonProfile } from "./CannonProfile";
import { Input } from "./Input";
import { Transformation } from "./Transformation";
import { Vector2d, v2 } from "./Vector2d";
import { Ref } from "./utils";

export class Graphics {
    private canvas: HTMLCanvasElement;
    private context: CanvasRenderingContext2D;
    private transformation_: Transformation;

    public constructor(input: Input) {
        this.canvas = document.querySelector<HTMLCanvasElement>("#canvas")!;
        this.context = this.canvas.getContext("2d")!;
        this.transformation_ = new Transformation(this.canvas.height, input);
    }

    public transformation(): Ref<Transformation> {
        return this.transformation_;
    }

    private x(value: number): number {
        return this.transformation_.screenToSimulationX(value);
    }

    private y(value: number): number {
        return this.transformation_.simulationToScreenY(value);
    }

    public drawLine(fromPos: Vector2d, toPos: Vector2d) {
        this.context.beginPath();
        this.context.moveTo(fromPos.x, fromPos.y);
        this.context.lineTo(toPos.x, toPos.y);
        this.context.stroke();
    }

    public drawCircle(x: number, y: number, radius: number, fillStyle?: string) {
        this.context.fillStyle = fillStyle ?? "black";
        this.context.beginPath();
        this.context.arc(this.x(x), this.y(y), radius, 0, 2 * Math.PI);
        this.context.fill();
    }

    public clear() {
        this.context.fillStyle = "white";
        this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.context.strokeStyle = "#ccc";
    }

    public drawGrid() {
        const { x: offsetX, y: offsetY } = this.transformation_.translation;
        const spacing = 50 / this.transformation_.scale;
        this.drawLine(v2(0, 0), v2(0, 0));
        const correctionX = Math.floor(offsetX / spacing);
        const correctionY = Math.floor(offsetY / spacing);

        const gridLines = new Array(20).fill(0).map<[number, number]>((_v, i) => [spacing * (i + correctionX) - offsetX, spacing * (i - correctionY) + offsetY])
        this.drawRawGridLines(gridLines);
        const zeroLines: [number, number] = [-offsetX, this.canvas.height - 1 + offsetY]
        this.drawRawGridZeroLines(...zeroLines)
    }

    private drawRawGridLines(rawGridLines: [number, number][]) {
        this.context.lineWidth = 1;
        this.context.strokeStyle = "#ccc";
        this.context.beginPath();
        for (const [ix, iy] of rawGridLines) {
            this.context.moveTo(ix, 0);
            this.context.lineTo(ix, this.canvas.height);
            this.context.moveTo(0, iy);
            this.context.lineTo(this.canvas.width, iy);
        }
        this.context.stroke();
    }

    private drawRawGridZeroLines(zx: number, zy: number) {
        this.context.lineWidth = 2;
        this.context.strokeStyle = "#000";
        this.context.beginPath();
        this.context.moveTo(zx, 0);
        this.context.lineTo(zx, this.canvas.height);
        this.context.moveTo(0, zy);
        this.context.lineTo(this.canvas.width, zy);
        this.context.stroke();
    }

    public drawCannonWheel(profile: CannonProfile, pos: Vector2d) {
        const wheelRadius = profile.wheelRadius();

        this.context.save();
        this.context.fillStyle = "#9F5C41";
        this.context.lineWidth = 4;
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

        this.context.fillStyle = "#634133";
        this.context.beginPath();
        this.context.arc(0, 0, wheelRadius * 0.33, 0, 2 * Math.PI);
        this.context.fill();

        this.context.restore();
    }

    public drawCannonBarrel(profile: CannonProfile, pos: Vector2d) {
        const angle = profile.angle();
        const barrelLength = profile.barrelLength();
        const barrelWidth = profile.barrelWidth();
        this.context.save();
        this.context.beginPath();
        this.context.fillStyle = "black";
        this.context.translate(this.x(pos.x), this.y(pos.y));
        this.context.rotate(angle);
        this.context.rect(
            -barrelWidth * 0.5,
            -barrelLength,
            barrelWidth,
            barrelLength,
        );
        this.context.arc(0, 0, 10, Math.PI - 0, Math.PI - 2 * Math.PI);
        this.context.fill();
        this.context.restore();
    }

    public drawCannon(pos: Vector2d, cannonProfile: CannonProfile) {
        this.drawCannonBarrel(cannonProfile, pos);
        this.drawCannonWheel(cannonProfile, pos);
    }
}
