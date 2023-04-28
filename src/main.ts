import "./style.css";
const canvas = document.querySelector<HTMLCanvasElement>("#canvas")!;

interface SimulationObject {
    update(deltaT: number): void;
    render(graphics: Graphics): void;
}

class Vector2d {
    constructor(public x: number, public y: number) {}

    public clone() {
        return new Vector2d(this.x, this.y);
    }

    public multiply(other: Vector2d) {
        this.x *= other.x;
        this.y *= other.y;
        return this;
    }

    public extend(factor: number) {
        this.x *= factor;
        this.y *= factor;
        return this;
    }

    public divideComponents(divisor: number) {
        this.x /= divisor;
        this.y /= divisor;
        return this;
    }

    public add(other: Vector2d) {
        this.x += other.x;
        this.y += other.y;
        return this;
    }
}

class CannonBall implements SimulationObject {
    private pos = new Vector2d(67.5, 725);
    private mass = 1;
    private velocity = new Vector2d(2, -2);

    public update(deltaT: number): void {
        const gravityForce = new Vector2d(0, 1);
        const acceleration = gravityForce.clone().divideComponents(this.mass);
        this.velocity.add(acceleration.clone().extend(deltaT));
        this.pos.add(this.velocity);
    }

    public render(graphics: Graphics): void {
        graphics.drawCircle(this.pos.x, this.pos.y, 10);
    }
}

class Graphics {
    private canvas: HTMLCanvasElement;
    private context: CanvasRenderingContext2D;
    constructor() {
        this.canvas = document.querySelector<HTMLCanvasElement>("#canvas")!;
        this.context = this.canvas.getContext("2d")!;
    }

    public clearCanvas() {
        this.context.fillStyle = "white";
        this.context.fillRect(0, 0, canvas.width, canvas.height);
        this.context.strokeStyle = "#CCCCCC";
        this.drawGrid();
        this.drawCannon((50 * Math.PI) / 180);
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
        this.context.translate(50, 742);
        this.context.fillStyle = "black";
        this.context.rotate(angle);
        this.context.rect(-10, -40, 20, 40);
        this.context.fill();
        this.context.setTransform(1, 0, 0, 1, 0, 0);
        this.context.restore();
    }

    public drawCannon(angle: number) {
        this.drawCannonHalfCircle();
        this.drawCannonRectangle(angle);
    }
}

function main() {
    const graphics = new Graphics();
    graphics.clearCanvas();

    const simulationObjects: SimulationObject[] = [new CannonBall()];

    const loop = (before: number) => {
        const now = Date.now();
        const deltaT = (now - before) / 1000;

        for (const simulationObject of simulationObjects)
            simulationObject.update(deltaT);

        graphics.clearCanvas();
        for (const simulationObject of simulationObjects)
            simulationObject.render(graphics);

        requestAnimationFrame(() => loop(now));
    };
    loop(Date.now());
}

main();
