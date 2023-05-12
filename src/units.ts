export type Degrees = number;
export type Radians = number;

export function degreesToRadians(number: Degrees): Radians {
    return number * Math.PI / 180;
}

