import { CannonProfile } from "./CannonProfile";
import { Meters, Radians, degreesToRadians } from "./units";

export class ExperimentCannonProfile implements CannonProfile {
    barrelWidth(): Meters {
        return 0.05;;
    }
    wheelRadius(): Meters {
        return 0.04;
    }
    barrelLength(): Meters {
        return 0.1;
    }
    angle(): Radians {
        const angleInput =
            document.querySelector<HTMLInputElement>("#cannon-angle")!;
        return degreesToRadians(parseInt(angleInput.value));
    }
}
