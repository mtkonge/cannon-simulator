import { Graphics } from "./Graphics";
import { ObjectsAdderAndRemover } from "./ObjectAdderAndRemover";
import { SimulationObject } from "./SimulationObject";

export class Objects implements ObjectsAdderAndRemover {
    private addQueue: SimulationObject[] = [];
    private objects: SimulationObject[] = [];

    constructor() { }

    public add(object: SimulationObject) {
        this.addQueue.push(object);
    }

    public flushAddQueue() {
        this.addQueue.forEach((v) => this.objects.push(v));
        this.addQueue = [];
    }

    public remove(object: SimulationObject) {
        this.addQueue = this.addQueue.filter(
            (existingObject) => existingObject !== object,
        );
        this.objects = this.objects.filter(
            (existingObject) => existingObject !== object,
        );
        object.destructor ? object.destructor() : undefined;
    }

    public removeWhere(predicate: (o: SimulationObject) => boolean) {
        const objects = [...this.objects]
        for (const o of objects)
            if (predicate(o))
                this.remove(o);
    }

    public update(deltaT: number) {
        this.flushAddQueue();
        for (const object of this.objects) {
            if (object.update) {
                object.update(deltaT);
            }
        }
    }

    public render(graphics: Graphics) {
        this.flushAddQueue();
        for (const object of this.objects) {
            object.render(graphics);
        }
    }
}
