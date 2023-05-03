export function degreesToRadians(number: Degree): Radian {
    return number * Math.PI / 180;
}

export type Degree = number;
export type Radian = number;
