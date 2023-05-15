export type Degrees = number;
export type Radians = number;
export type Meters = number;
export type Meters2 = number;
export type Meters3 = number;
export type Seconds = number;
export type MetersPerSeconds = number;
export type KilosPerMeters3 = number;
export type Newton = number;

export function degreesToRadians(number: Degrees): Radians {
    return number * Math.PI / 180;
}

