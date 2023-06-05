import { CannonProfile } from "./CannonProfile";
import { Meters, Radians, degreesToRadians } from "./units";

export class ExperimentCannonProfile implements CannonProfile {
    private angleInput =
        document.querySelector<HTMLInputElement>("#cannon-angle")!;
    private heightInput =
        document.querySelector<HTMLInputElement>("#cannon-height")!;

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
        return degreesToRadians(parseInt(this.angleInput.value) - 90);
    }
    height(): Meters {
        return parseFloat(this.heightInput.value);
    }
}
