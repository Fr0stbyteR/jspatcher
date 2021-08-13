import BaseObject from "./BaseObject";
import EmptyObject from "./EmptyObject";
import InvalidObject from "./InvalidObject";
import { Func, New } from "../importer/RemoteImporter";
import getIO from "../jsaw/index.jsdsppkg.main";

export default async () => ({
    BaseObject,
    EmptyObject,
    InvalidObject,
    func: Func,
    new: New,
    ...await getIO()
});
