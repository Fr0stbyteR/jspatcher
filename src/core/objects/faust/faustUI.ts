import { FaustUI } from "faust-ui/src/FaustUI";
import { TFaustUI } from "faust2webaudio/src/types";
import { Bang, BaseObject } from "../Base";
import { DOMUI, DOMUIState } from "../BaseUI";

export default class ui extends BaseObject<{}, { ui: TFaustUI }, [TFaustUI], [Record<string, number>]> {}
