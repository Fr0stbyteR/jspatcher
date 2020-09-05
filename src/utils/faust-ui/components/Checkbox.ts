import { Button } from "./Button";
import "./Checkbox.scss";

export class Checkbox extends Button {
    className = "checkbox";

    handlePointerDown = () => {
        this.setValue(1 - this.state.value);
    };
    handlePointerUp = () => {
    };
}
