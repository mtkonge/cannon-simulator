export class Vector2d {
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
