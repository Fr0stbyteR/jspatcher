import generateRemotedObject from "../base/generateRemotedObject";
import In from "./In";
import Out from "./Out";
import Param from "./Param";
import AudioIn from "./AudioIn";
import AudioOut from "./AudioOut";
import type BaseObject from "../base/BaseObject";

export default async () => ({
    in: generateRemotedObject(In as typeof BaseObject),
    out: generateRemotedObject(Out as typeof BaseObject),
    "param~": generateRemotedObject(Param as typeof BaseObject),
    "in~": generateRemotedObject(AudioIn as typeof BaseObject),
    "out~": generateRemotedObject(AudioOut as typeof BaseObject)
});
