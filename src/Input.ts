import { Vector2d } from "./Vector2d";

export interface Input {
    scrolled(): number;
    scrolledPosition(): Vector2d;
    resetScroll(): void;
    isDragging(): boolean;
    dragged(): Vector2d;
    resetDrag(): void;
}
