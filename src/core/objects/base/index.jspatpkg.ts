import BaseObject from "./BaseObject";
import EmptyObject from "./EmptyObject";
import InvalidObject from "./InvalidObject";
import { Func, New } from "../importer/DefaultImporter";
import Listen from "./Listen";
import _comment from "./Comment";
import getIO from "../main/index.jspatpkg";
import CommentUI from "./CommentUI";

export class comment extends _comment {
    static UI = CommentUI;
}

export default async () => ({
    BaseObject,
    EmptyObject,
    InvalidObject,
    // func: Func,
    new: New,
    // listen: Listen,
    comment,
    ...await getIO()
});
