import BaseObject from "./BaseObject";
import EmptyObject from "./EmptyObject";
import InvalidObject from "./InvalidObject";
import { Func, New } from "../importer/RemoteImporter";
import { comment } from "./index.jspatpkg";
import getIO from "../jsaw/index.jsdsppkg.main";

export default async () => ({
    BaseObject,
    EmptyObject,
    InvalidObject,
    func: Func,
    new: New,
    comment,
    ...await getIO()
});
