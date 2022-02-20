import generateDefaultObject from "../base/generateDefaultObject";
import AWIn from "../jsaw/In";
import type BaseObject from "../base/BaseObject";

class In extends AWIn {
    protected thread: "AudioWorklet" | "main" = "main";
}

export default generateDefaultObject(In as typeof BaseObject);
