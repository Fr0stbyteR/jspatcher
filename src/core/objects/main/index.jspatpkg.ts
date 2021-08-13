import In from "./In";
import Out from "./Out";
import AudioIn from "./AudioIn";
import AudioOut from "./AudioOut";

export default async () => ({
    in: In,
    out: Out,
    "in~": AudioIn,
    "out~": AudioOut
});
