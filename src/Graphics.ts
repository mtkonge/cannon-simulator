import { CannonProfile } from "./CannonProfile";
import { Vector2d } from "./Vector2d";

export class Graphics {
    private canvas: HTMLCanvasElement;
    private context: CanvasRenderingContext2D;
    private scalingFactor = 1;
    private offset: Vector2d = new Vector2d(0, 0);

    constructor() {
        this.canvas = document.querySelector<HTMLCanvasElement>("#canvas")!;
        this.context = this.canvas.getContext("2d")!;
    }

    private reverseY(value: number) {
        return this.canvas.height - value - 1;
    }

    private translateX(value: number): number {
        return value + this.offset.x;
    }

    private translateY(value: number): number {
        return value + this.offset.y;
    }

    private scale(value: number): number {
        return value * this.scalingFactor;
    }

    public clearCanvas() {
        this.context.fillStyle = "white";
        this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.context.strokeStyle = "#CCCCCC";
        this.drawGrid();
    }

    public drawLine(fromPos: Vector2d, toPos: Vector2d) {
        this.context.beginPath();
        this.context.moveTo(fromPos.x, (fromPos.y));
        this.context.lineTo(toPos.x, (toPos.y));
        this.context.stroke();
    }

    public drawCircle(x: number, y: number, r: number, fillStyle?: string) {
        if (!fillStyle) {
            this.context.fillStyle = "black";
        } else {
            this.context.fillStyle = fillStyle;
        }
        this.context.beginPath();
        this.context.arc(this.translateX(x), this.translateY(this.reverseY(y)), r, 0, 2 * Math.PI);
        this.context.fill();
    }

    private drawVerticalGridline(spacePerLine: number, idx: number, offsetX: number) {
        this.drawLine(
            new Vector2d(spacePerLine * idx + offsetX, 0),
            new Vector2d(spacePerLine * idx + offsetX, this.canvas.height),
        );
    }

    private drawHorizontalGridLine(spacePerLine: number, idx: number, offsetY: number) {
        this.drawLine(
            new Vector2d(0, spacePerLine * idx + offsetY),
            new Vector2d(this.canvas.width, spacePerLine * idx + offsetY),
        );
    }

    public drawGrid() {
        // TODO: make spacePerLine customizable or autoscale idk
        const spacePerLine = this.scale(50);
        const offsetX = this.offset.x % spacePerLine;
        const offsetY = this.offset.y % spacePerLine;

        this.drawVerticalGridline(spacePerLine, 0, offsetX);
        this.drawHorizontalGridLine(spacePerLine, 0, offsetY);

        for (let i = 0; i <= this.canvas.height / spacePerLine; i++) {
            this.drawVerticalGridline(spacePerLine, i, offsetX);
            this.drawHorizontalGridLine(spacePerLine, i, offsetY);
        }

        this.context.font = "20px Arial";
        this.context.fillStyle = "black";
        this.context.textAlign = "center";
        this.context.textBaseline = "middle";

        for (let i = -this.canvas.width / spacePerLine; i <= this.canvas.width / spacePerLine; i++) {
            const numberOffset = Math.floor(this.offset.x / spacePerLine);
            this.context.fillText(
                (i - numberOffset).toString(),
                spacePerLine * i + offsetX,
                this.reverseY(spacePerLine / 2 - offsetY),
            );
        }

        for (let i = -this.canvas.width / spacePerLine; i <= this.canvas.width / spacePerLine; i++) {
            const numberOffset = Math.ceil(this.offset.y / spacePerLine);
            this.context.fillText(
                (i + numberOffset).toString(),
                spacePerLine / 2 + offsetX,
                this.reverseY(spacePerLine * i - offsetY),
            );
        }
    }
    public drawCannonWheel(profile: CannonProfile, pos: Vector2d) {
        const wheelRadius = profile.wheelRadius();

        this.context.save();
        this.context.fillStyle = "#9F5C41";
        this.context.lineWidth = 4;
        this.context.translate(this.translateX(pos.x), this.translateY(this.reverseY(pos.y)));

        for (let i = 0; i < 4; i++) {
            this.context.beginPath()
            this.context.rect(-wheelRadius, -2, wheelRadius * 2, 4);
            this.context.rotate(Math.PI * 0.25);
            this.context.fill();
        }

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
        this.context.translate(this.translateX(pos.x), this.translateY(this.reverseY(pos.y)));
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
