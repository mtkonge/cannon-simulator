import { CannonProfile } from "./CannonProfile";
import { Input } from "./Input";
import { Transformation } from "./Transformation";
import { Vector2d, v2 } from "./Vector2d";
import { Meters, MetersPerSeconds, Pixels, Radians, Seconds } from "./units";
import { Ref, clamp } from "./utils";

export class Graphics {
    private canvas: HTMLCanvasElement;
    private context: CanvasRenderingContext2D;
    private tm: Transformation;

    public constructor(input: Input) {
        this.canvas = document.querySelector<HTMLCanvasElement>("#canvas")!;
        this.context = this.canvas.getContext("2d")!;
        this.tm = new Transformation(
            v2(this.canvas.width, this.canvas.height),
            input,
        );
    }

    public transformation(): Ref<Transformation> {
        return this.tm;
    }

    private x(value: Meters): Pixels {
        return this.tm.simulationToScreenX(value);
    }

    private y(value: Meters): Pixels {
        return this.tm.simulationToScreenY(value);
    }

    public drawLineRaw(
        fromPos: Vector2d,
        toPos: Vector2d,
        options?: { strokeStyle?: string; lineWidth?: number },
    ) {
        if (options) {
            if (options.strokeStyle)
                this.context.strokeStyle = options.strokeStyle;
            if (options.lineWidth) this.context.lineWidth = options.lineWidth;
        }
        this.context.beginPath();
        this.context.moveTo(fromPos.x, fromPos.y);
        this.context.lineTo(toPos.x, toPos.y);
        this.context.stroke();
    }

    public drawLineRawNoPath(fromPos: Vector2d, toPos: Vector2d) {
        this.context.moveTo(fromPos.x, fromPos.y);
        this.context.lineTo(toPos.x, toPos.y);
    }

    public drawCircleRaw(
        x: number,
        y: number,
        radius: number,
        fillStyle: string,
    ) {
        this.context.fillStyle = fillStyle;
        this.context.beginPath();
        this.context.arc(x, y, radius, 0, 2 * Math.PI,);
        this.context.fill();
    }

    public drawCircle(
        x: number,
        y: number,
        radius: number,
        fillStyle: string,
    ) {
        this.drawCircleRaw(this.x(x), this.y(y), this.tm.screenScale(radius), fillStyle);
    }

    public drawCircleRawNoPath(x: number, y: number, radius: number) {
        this.context.arc(x, y, radius, 0, 2 * Math.PI);
    }

    public clear() {
        this.context.fillStyle = "white";
        this.context.beginPath();
        this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    private static readonly gridBreakpoints = [0.01, 0.02, 0.05, 0.1, 0.2, 0.5, 1, 2, 5, 10, 20, 50, 100, 200, 500, 1000, 2000, 5000] as const;
    private static readonly gridUnits = [
        { maxSpace: 0.01, suffix: "mm", disExp: 3 },
        { maxSpace: 1, suffix: "cm", disExp: 2 },
        { maxSpace: 1000, suffix: "m", disExp: 0 },
        { maxSpace: Infinity, suffix: "km", disExp: -3 },
    ] as const;

    public drawGrid() {
        const screenCapacity: Meters = Math.max(
            this.tm.screenToSimulationX(this.canvas.width) -
            this.tm.screenToSimulationX(0),
            this.tm.screenToSimulationY(this.canvas.height) -
            this.tm.screenToSimulationY(0),
        );

        const lineSpace = (() => {
            for (const breakpoint of Graphics.gridBreakpoints)
                if (screenCapacity < breakpoint)
                    return breakpoint / 10;
            return 1000;
        })()

        for (const unit of Graphics.gridUnits) {
            if (lineSpace < unit.maxSpace) {
                this.drawGridSpecificFactor(lineSpace, unit.suffix, unit.disExp);
                break;
            }
        }

        this.drawLineRaw(v2(this.x(0), 0), v2(this.x(0), this.canvas.height), {
            strokeStyle: "#000",
            lineWidth: 2,
        });
        this.drawLineRaw(v2(0, this.y(0)), v2(this.canvas.width, this.y(0)), {
            strokeStyle: "#000",
            lineWidth: 2,
        });
    }

    public drawGridSpecificFactor(
        lineSpace: number,
        suffix: string,
        disExp: number,
    ) {
        const gridZeroThreshold = 0.000001;

        const textPaddingX = 40;
        const textPaddingY = 20;

        this.context.strokeStyle = "#aaa";
        this.context.lineWidth = 1;

        this.context.beginPath();

        const startX =
            Math.ceil(this.tm.screenToSimulationX(0) / lineSpace) *
            lineSpace -
            lineSpace;
        const endX =
            Math.floor(
                this.tm.screenToSimulationX(this.canvas.width) /
                lineSpace,
            ) *
            lineSpace +
            lineSpace;
        for (let x = startX; x <= endX; x += lineSpace) {
            this.drawLineRawNoPath(
                v2(this.x(x), 0),
                v2(this.x(x), this.canvas.height),
            );
            if (x > gridZeroThreshold || x < -gridZeroThreshold) this.drawGridSpecificFactorYText(x, textPaddingY, disExp, suffix);
        }

        const startY =
            Math.floor(
                this.tm.screenToSimulationY(this.canvas.height) /
                lineSpace,
            ) *
            lineSpace +
            lineSpace;
        const endY =
            Math.ceil(this.tm.screenToSimulationY(0) / lineSpace) *
            lineSpace -
            lineSpace;
        for (let y = startY; y <= endY; y += lineSpace) {
            this.drawLineRawNoPath(
                v2(0, this.y(y)),
                v2(this.canvas.width, this.y(y)),
            );
            if (y > gridZeroThreshold || y < -gridZeroThreshold)
                this.drawGridSpecificFactorXText(y, textPaddingX, disExp, suffix);
        }

        this.context.stroke();
    }

    private drawGridSpecificFactorYText(
        x: number,
        padding: number,
        disExp: number,
        suffix: string,
    ) {
        const textY =
            clamp(this.y(0), padding * 2, this.canvas.height) - padding;
        const text = `${Math.round(x * 10 ** disExp)} ${suffix}`;
        this.drawTextRaw(v2(this.x(x), textY), text, {});
    }

    private drawGridSpecificFactorXText(
        y: number,
        padding: number,
        disExp: number,
        suffix: string,
    ) {
        const textX =
            clamp(this.x(0), 0, this.canvas.width - padding * 2) + padding;
        const text = `${Math.round(y * 10 ** disExp)} ${suffix}`;
        this.drawTextRaw(v2(textX, this.y(y)), text, {});
    }

    private drawTextRaw(pos: Vector2d, text: string, options: { font?: string, fillStyle?: string, textAlign?: "left" | "right" | "center" | "start" | "end", textBaseline?: "top" | "hanging" | "middle" | "alphabetic" | "ideographic" | "bottom" }) {
        this.context.font = options.font ?? "20px Arial";
        this.context.fillStyle = options.fillStyle ?? "#666";
        this.context.textAlign = options.textAlign ?? "center";
        this.context.textBaseline = options.textBaseline ?? "middle";
        this.context.fillText(text, pos.x, pos.y);
    }

    public drawCannonWheel(profile: CannonProfile, pos: Vector2d) {
        const wheelRadius = this.tm.screenScale(
            profile.wheelRadius(),
        );
        const offsetX = profile.barrelLength() * Math.cos(profile.angle() + Math.PI * 0.5);
        const offsetY = profile.barrelLength() * Math.sin(profile.angle() + Math.PI * 0.5);

        this.context.save();
        this.context.fillStyle = "#9F5C41";
        // originally 3 pixels
        this.context.lineWidth = this.tm.screenScale(0.003);
        this.context.translate(this.x(pos.x), this.y(pos.y));

        this.context.beginPath();
        this.context.translate(this.tm.screenScale(offsetX), this.tm.screenScale(offsetY));
        const spokeWidth = this.tm.screenScale(0.003)
        for (let i = 0; i < 4; i++) {
            // originally 4 pixels
            this.context.rect(-wheelRadius, -2 - spokeWidth / 2, wheelRadius * 2, spokeWidth);
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
        const barrelLength = this.tm.screenScale(
            profile.barrelLength(),
        );
        const barrelWidth = this.tm.screenScale(
            profile.barrelWidth(),
        );
        this.context.save();
        this.context.beginPath();
        this.context.fillStyle = "black";
        this.context.translate(this.x(pos.x), this.y(pos.y));
        this.context.rotate(angle);
        this.context.rect(
            -barrelWidth * 0.5,
            0,
            barrelWidth,
            barrelLength,
        );
        this.context.arc(
            0,
            barrelLength,
            barrelWidth / 2,
            Math.PI - 0,
            Math.PI - 2 * Math.PI,
        );
        this.context.fill();
        this.context.restore();
    }

    public drawCannon(pos: Vector2d, cannonProfile: CannonProfile) {
        this.drawCannonBarrel(cannonProfile, pos);
        this.drawCannonWheel(cannonProfile, pos);
    }

    public drawCannonball(pos: Vector2d<Meters>, radius: Meters) {
        this.drawCircle(pos.x, pos.y, radius, "red");
    }

    public drawCannonballFixed(pos: Vector2d<Meters>) {
        this.drawCircleRaw(this.x(pos.x), this.y(pos.y), 10, "red");
    }

    public drawPreviousCannonballPositions(positions: Vector2d[]) {
        let prev: Vector2d | null = null;
        this.context.strokeStyle = "grey";
        this.context.lineWidth = 2;
        this.context.beginPath();
        for (const { x, y } of positions) {
            if (prev)
                this.drawLineRawNoPath(
                    v2(this.x(x), this.y(y)),
                    v2(this.x(prev.x), this.y(prev.y)),
                );
            prev = v2(x, y);
        }
        this.context.stroke();

        this.context.fillStyle = "blue";
        this.context.beginPath();
        for (const { x, y } of positions) {
            this.context.moveTo(this.x(x), this.y(y));
            this.drawCircleRawNoPath(
                this.x(x),
                this.y(y),
                this.tm.screenScale(0.005),
            );
        }
        this.context.fill();
    }

    public drawTopPointStats(pos: Vector2d<Meters>, time: Seconds) {
        const color = "#d76a03"
        this.drawLineRaw(v2(this.x(0), this.y(pos.y)), v2(this.x(pos.x), this.y(pos.y)), {
            strokeStyle: color,
            lineWidth: 2,
        })
        this.drawLineRaw(v2(this.x(pos.x), this.y(pos.y)), v2(this.x(pos.x), this.y(pos.y) - 15), {
            strokeStyle: color,
            lineWidth: 2,
        })
        this.drawTextRaw(v2(this.x(pos.x) + 10, this.y(pos.y) - 15), `(${pos.x.toFixed(3)} m, ${pos.y.toFixed(3)} m)`, { fillStyle: color, textAlign: "left" })
        this.drawTextRaw(v2(this.x(pos.x) + 10, this.y(pos.y) - 35), `${time.toFixed(3)} s`, { fillStyle: color, textAlign: "left" })
    }

    public drawEndPointStats(pos: Vector2d<Meters>, topPos: Vector2d<Meters>, time: Seconds) {
        const color = "#bf3100";
        this.drawLineRaw(v2(this.x(topPos.x), this.y(topPos.y)), v2(this.x(pos.x), this.y(topPos.y)), {
            strokeStyle: color,
            lineWidth: 2,
        })
        this.drawLineRaw(v2(this.x(pos.x), this.y(topPos.y)), v2(this.x(pos.x), this.y(pos.y)), {
            strokeStyle: color,
            lineWidth: 2,
        })
        this.drawLineRaw(v2(this.x(pos.x), this.y(pos.y)), v2(this.x(pos.x) + 15, this.y(pos.y)), {
            strokeStyle: color,
            lineWidth: 2,
        })
        this.drawTextRaw(v2(this.x(pos.x) + 10, this.y(pos.y) + 35), `${pos.x.toFixed(3)} m`, { fillStyle: color, textAlign: "left" })
        this.drawTextRaw(v2(this.x(pos.x) + 10, this.y(pos.y) + 15), `${time.toFixed(3)} s`, { fillStyle: color, textAlign: "left" })
    }

    public drawCannonStats(pos: Vector2d<Meters>, angle: Radians, startSpeed: MetersPerSeconds | null) {
        const color = "#bf3100";
        this.context.strokeStyle = color;
        this.context.lineWidth = 2;
        this.context.beginPath();
        this.drawLineRawNoPath(v2(this.x(pos.x), this.y(pos.y)), v2(this.x(pos.x) + 100, this.y(pos.y)))
        this.context.moveTo(this.x(pos.x), this.y(pos.y))
        this.context.arc(this.x(pos.x), this.y(pos.y), 100, Math.PI * 1.5 + angle - Math.PI * 2, 0)
        this.context.stroke();
        this.drawTextRaw(v2(this.x(pos.x) + 100, this.y(pos.y) + 15), `${(-angle / Math.PI * 180 + 90).toFixed(1)}°`, { fillStyle: color, textAlign: "left" })
        if (startSpeed)
            this.drawTextRaw(v2(this.x(pos.x) + 100, this.y(pos.y) + 35), `${startSpeed.toFixed(1)} m/s`, { fillStyle: color, textAlign: "left" })
    }
}
