import PreloadFile from "browserfs/dist/node/generic/preload_file";
import { ApiError, ErrorCode } from "browserfs/dist/node/core/api_error";

/* eslint-disable no-param-reassign */
// eslint-disable-next-line func-names
PreloadFile.prototype.writeSync = function (buffer, offset, length, position) {
    this._dirty = true;
    if (position === undefined || position === null) {
        position = this.getPos();
    }
    if (!this._flag.isWriteable()) {
        throw new ApiError(ErrorCode.EPERM, "File not opened with a writeable mode.");
    }
    let len;
    if (!offset && !position && length === buffer.length) {
        this._stat.size = buffer.length;
        this._buffer = buffer;
        len = length;
    } else {
        const endFp = position + length;
        if (endFp > this._stat.size) {
            this._stat.size = endFp;
            if (endFp > this._buffer.length) {
                // Extend the buffer!
                const newBuff = Buffer.alloc(endFp);
                this._buffer.copy(newBuff);
                this._buffer = newBuff;
            }
        }
        len = buffer.copy(this._buffer, position, offset, offset + length);
    }
    this._stat.mtime = new Date();
    if (this._flag.isSynchronous()) {
        this.syncSync();
        return len;
    }
    this.setPos(position + len);
    return len;
};
