import BaseObject from "./BaseObject";
import { Func, New } from "../importer/RemotedImporter";
import getIO from "../jsaw/index.jsdsppkg.aw";

export default async () => ({
    BaseObject,
    EmptyObject: BaseObject,
    InvalidObject: BaseObject,
    func: Func,
    new: New,
    ...await getIO()
});
