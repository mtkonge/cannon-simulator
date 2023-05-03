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

    public drawLine(fromVec: Vector2d, toVec: Vector2d) {
        this.context.beginPath();
        this.context.moveTo(fromVec.x, this.reverseY(fromVec.y));
        this.context.lineTo(toVec.x, this.reverseY(toVec.y));
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
    public drawCannonHalfCircle(pos: Vector2d) {
        this.context.fillStyle = "black";
        this.context.beginPath();
        this.context.arc(pos.x, this.reverseY(pos.y), 16, Math.PI, 2 * Math.PI);
        this.context.fill();
    }

    public drawCannonBarrel(angle: number, pos: Vector2d) {
        this.context.save();
        const x = Math.sin(angle) * 21;
        const y = Math.cos(angle) * 21;
        this.context.translate(pos.x + x, this.reverseY(pos.y + y));
        this.context.fillStyle = "black";
        this.context.rotate(angle);
        this.context.rect(-10, -40, 20, 40);
        this.context.arc(0, 0, 10, Math.PI - 0, Math.PI - 2 * Math.PI);
        this.context.fill();
        this.context.restore();
    }

    public drawCannon(angle: number, pos: Vector2d) {
        this.drawCannonHalfCircle(pos);
        this.drawCannonBarrel(angle, pos);
    }
}
