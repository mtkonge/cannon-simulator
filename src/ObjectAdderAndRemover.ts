import { SimulationObject } from "./SimulationObject";

export interface ObjectsAdderAndRemover {
    add(object: SimulationObject): void;
    remove(object: SimulationObject): void;
}
