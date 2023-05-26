
export class AirResistanceInputListener {
    private mode_: "off" | "realistic" | "exaggerated" = "off";

    public constructor() {
        console.log("bbing bong")
        document.querySelector<HTMLInputElement>("#drag-off")!
            .addEventListener("change", () => { console.log("off"); this.mode_ = "off" })
        document.querySelector<HTMLInputElement>("#drag-realistic")!
            .addEventListener("change", () => { console.log("re"); this.mode_ = "realistic" })
        document.querySelector<HTMLInputElement>("#drag-exaggerated")!
            .addEventListener("change", () => { console.log("ex"); this.mode_ = "exaggerated" })
    }

    public mode(): "off" | "realistic" | "exaggerated" { return this.mode_; }
}

