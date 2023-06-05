
export class AirResistanceInputListener {
    private mode_: "off" | "realistic" | "exaggerated" = "off";

    public constructor() {
        document.querySelector<HTMLInputElement>("#drag-off")!
            .addEventListener("change", () => { this.mode_ = "off" })
        document.querySelector<HTMLInputElement>("#drag-realistic")!
            .addEventListener("change", () => { this.mode_ = "realistic" })
        document.querySelector<HTMLInputElement>("#drag-exaggerated")!
            .addEventListener("change", () => { this.mode_ = "exaggerated" })
    }

    public mode(): "off" | "realistic" | "exaggerated" { return this.mode_; }
}

