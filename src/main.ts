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
    private pos = new Vector2d(10, 300);
    private mass = 1;
    private velocity = new Vector2d(2, -2);

    public update(deltaT: number): void {
        const gravityForce = new Vector2d(0, 1);
        const acceleration = gravityForce.clone().divideComponents(this.mass);
        this.velocity.add(acceleration.clone().extend(deltaT));
        this.pos.add(this.velocity);
    }

    public render(graphics: Graphics): void {
        graphics.drawCircle(this.pos.x, this.pos.y, 20);
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
        this.context.fillStyle = "skyblue";
        this.context.fillRect(0, 0, canvas.width, canvas.height);
        this.context.fillStyle = "black";
    }

    public drawCircle(x: number, y: number, r: number) {
        this.context.beginPath();
        this.context.arc(x, y, r, 0, 2 * Math.PI);
        this.context.fill();
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
