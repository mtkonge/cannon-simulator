
/** ° */
export type Degrees = number;
/** rad */
export type Radians = number;
/** m */
export type Meters = number;
/** m^2 */
export type Meters2 = number;
/** m^3 */
export type Meters3 = number;
/** s */
export type Seconds = number;
/** m / s */
export type MetersPerSeconds = number;
/** m / s^2 */
export type MetersPerSeconds2 = number;
/** kg */
export type Kilogram = number;
/** kg / m^3 */
export type KilogramPerMeters3 = number;
/** N */
export type Newton = number;

export type Pixels = number;
export type PixelsPerMeter = number;

export function degreesToRadians(number: Degrees): Radians {
    return number * Math.PI / 180;
}

