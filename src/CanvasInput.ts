import { Input } from "./Input";
import { Vector2d, v2 } from "./Vector2d";

export class CanvasInput implements Input {
    private scroll = 0;
    private scrollPosition = v2(0, 0)
    private dragging = false;
    private mouseDelta = v2(0, 0);
    private mousePosition!: Vector2d;

    constructor(canvas: HTMLCanvasElement) {
        canvas.addEventListener("wheel", (event: WheelEvent) => {
            if (event.deltaY > 0) {
                this.scroll += 1;
            } else if (event.deltaY < 0) {
                this.scroll -= 1;
            }
        });
        canvas.addEventListener("mousedown", (event: MouseEvent) => {
            this.dragging = true;
            this.mousePosition = v2(event.offsetX, event.offsetY);
        });
        canvas.addEventListener("mouseup", (_event: MouseEvent) => {
            this.dragging = false;
        });
        canvas.addEventListener("mousemove", (event: MouseEvent) => {
            this.scrollPosition = v2(event.offsetX, event.offsetY);
            if (!this.dragging) {
                return;
            }
            this.mouseDelta.x += this.mousePosition.x - event.offsetX;
            this.mouseDelta.y += this.mousePosition.y - event.offsetY;
            this.mousePosition = v2(event.offsetX, event.offsetY);
        });
    }
    scrolled(): number {
        return this.scroll;
    }
    scrolledPosition(): Vector2d {
        return this.scrollPosition
    }
    resetScroll(): void {
        this.scroll = 0;
    }
    isDragging(): boolean {
        return this.dragging;
    }
    dragged(): Vector2d<number> {
        return this.mouseDelta;
    }
    resetDrag(): void {
        this.mouseDelta = v2(0, 0);
    }
}
