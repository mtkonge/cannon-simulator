import { Graphics } from "./Graphics";

export interface SimulationObject {
    update?(deltaT: number): void;
    render(graphics: Graphics): void;
    destructor?(): void;
}
