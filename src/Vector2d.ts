export class Vector2d<T extends number = number> {
    constructor(public x: number, public y: number) { }

    public clone() {
        return new Vector2d<T>(this.x, this.y);
    }

    public add(other: Vector2d<T>) {
        this.x += other.x;
        this.y += other.y;
        return this;
    }

    public subtract(other: Vector2d<T>) {
        this.x -= other.x;
        this.y -= other.y;
        return this;
    }

    public multiply(other: Vector2d<T>) {
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

    public raiseComponents(exponent: number) {
        this.x ** exponent;
        this.y ** exponent;
        return this;
    }

    public reverse() {
        this.x * -1;
        this.y * -1;
        return this;
    }
}

export const v2 = (x: number, y: number): Vector2d => new Vector2d(x, y);

