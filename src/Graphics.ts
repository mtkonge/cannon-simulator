import { CannonProfile } from "./CannonProfile";
import { Vector2d } from "./Vector2d";

export class Graphics {
    private canvas: HTMLCanvasElement;
    private context: CanvasRenderingContext2D;
    constructor() {
        this.canvas = document.querySelector<HTMLCanvasElement>("#canvas")!;
        this.context = this.canvas.getContext("2d")!;
    }

    private reverseY(value: number) {
        return this.canvas.height - value - 1;
    }

    public clearCanvas() {
        this.context.fillStyle = "white";
        this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.context.strokeStyle = "#CCCCCC";
        this.drawGrid();
    }

    public drawLine(fromPos: Vector2d, toPos: Vector2d) {
        this.context.beginPath();
        this.context.moveTo(fromPos.x, this.reverseY(fromPos.y));
        this.context.lineTo(toPos.x, this.reverseY(toPos.y));
        this.context.stroke();
    }

    public drawCircle(x: number, y: number, r: number) {
        this.context.fillStyle = "black";
        this.context.beginPath();
        this.context.arc(x, this.reverseY(y), r, 0, 2 * Math.PI);
        this.context.fill();
    }

    public drawGrid() {
        const spacePerLine = 50;

        for (let i = 1; i < this.canvas.height / spacePerLine; i++) {
            this.context.font = "20px Arial";
            this.context.fillStyle = "black";
            this.context.textAlign = "center";
            this.context.textBaseline = "middle";
            this.context.fillText(
                i.toString(),
                spacePerLine * i,
                this.reverseY(spacePerLine / 2),
            );
            this.context.fillText(
                i.toString(),
                spacePerLine / 2,
                this.reverseY(spacePerLine * i),
            );

            this.drawLine(
                new Vector2d(spacePerLine * i, 0),
                new Vector2d(spacePerLine * i, this.canvas.width),
            );
            this.drawLine(
                new Vector2d(0, spacePerLine * i),
                new Vector2d(this.canvas.height, spacePerLine * i),
            );
        }
    }
    public drawCannonWheel(profile: CannonProfile, pos: Vector2d) {
        const wheelRadius = profile.wheelRadius();

        this.context.save();
        this.context.strokeStyle = "#634133";
        this.context.fillStyle = "#9F5C41";
        this.context.lineWidth = 4;
        this.context.translate(pos.x, this.reverseY(pos.y));

        for (let i = 0; i < 4; i++) {
            this.context.beginPath()
            this.context.rect(-wheelRadius, -2, wheelRadius * 2, 4);
            this.context.rotate(Math.PI * 0.25);
            this.context.fill();
        }

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
        this.context.translate(pos.x, this.reverseY(pos.y));
        this.context.rotate(angle);
        this.context.rect(-barrelWidth * 0.5, -barrelLength, barrelWidth, barrelLength);
        this.context.arc(0, 0, 10, Math.PI - 0, Math.PI - 2 * Math.PI);
        this.context.fill();
        this.context.restore();
    }

    public drawCannon(pos: Vector2d, cannonProfile: CannonProfile) {
        this.drawCannonBarrel(cannonProfile, pos);
        this.drawCannonWheel(cannonProfile, pos);
    }
}
