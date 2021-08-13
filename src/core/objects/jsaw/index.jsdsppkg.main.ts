import generateRemoteObject from "../base/generateRemoteObject";
import In from "./In";
import Out from "./Out";
import Param from "./Param";
import AudioIn from "./AudioIn";
import AudioOut from "./AudioOut";
import type BaseObject from "../base/BaseObject";

export default async () => ({
    in: generateRemoteObject(In as typeof BaseObject),
    out: generateRemoteObject(Out as typeof BaseObject),
    "param~": generateRemoteObject(Param as typeof BaseObject),
    "in~": generateRemoteObject(AudioIn as typeof BaseObject),
    "out~": generateRemoteObject(AudioOut as typeof BaseObject)
});
