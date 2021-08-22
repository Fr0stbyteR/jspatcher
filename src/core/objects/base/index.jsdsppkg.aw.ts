import BaseObject from "./BaseObject";
import { Func, New } from "../importer/RemotedImporter";
import getIO from "../jsaw/index.jsdsppkg.aw";
import _comment from "./Comment";
import generateRemotedObject from "./generateRemotedObject";

export default async () => ({
    BaseObject,
    EmptyObject: BaseObject,
    InvalidObject: BaseObject,
    func: Func,
    new: New,
    comment: generateRemotedObject(_comment as typeof BaseObject),
    ...await getIO()
});
