import { Vector2d } from "./Vector2d";

export class Graphics {
    private canvas: HTMLCanvasElement;
    private context: CanvasRenderingContext2D;
    constructor() {
        this.canvas = document.querySelector<HTMLCanvasElement>("#canvas")!;
        this.context = this.canvas.getContext("2d")!;
    }

    public clearCanvas() {
        this.context.fillStyle = "white";
        this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.context.strokeStyle = "#CCCCCC";
        this.drawGrid();
        this.drawCannon((45 * Math.PI) / 180);
    }

    public drawLine(fromVec: Vector2d, toVec: Vector2d) {
        this.context.beginPath();
        this.context.moveTo(fromVec.x, fromVec.y);
        this.context.lineTo(toVec.x, toVec.y);
        this.context.stroke();
    }

    public drawCircle(x: number, y: number, r: number) {
        this.context.fillStyle = "black";
        this.context.beginPath();
        this.context.arc(x, y, r, 0, 2 * Math.PI);
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
                spacePerLine / 2,
            );
            this.context.fillText(
                i.toString(),
                spacePerLine / 2,
                spacePerLine * i,
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
    public drawCannonHalfCircle() {
        this.context.fillStyle = "black";
        this.context.beginPath();
        this.context.arc(50, 750, 16, Math.PI, 2 * Math.PI);
        this.context.fill();
    }

    public drawCannonRectangle(angle: number) {
        this.context.save();
        // we use sin/cos for x/y rather than cos/sin because the square is rotated
        const x = Math.sin(angle) * 21;
        const y = Math.cos(angle) * 21;
        this.context.translate(50 + x, 750 - y);
        this.context.fillStyle = "black";
        this.context.rotate(angle);
        this.context.rect(-10, -40, 20, 40);
        this.context.arc(0, 0, 10, 0, 2 * Math.PI);
        this.context.fill();
        this.context.restore();
    }

    public drawCannon(angle: number) {
        this.drawCannonHalfCircle();
        this.drawCannonRectangle(angle);
    }
}
