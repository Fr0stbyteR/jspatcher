import BaseObject from "../base/BaseObject";
import "./UI.scss";

export default class UIObject<D = {}, S = {}, I extends any[] = any[], O extends any[] = any[], A extends any[] = any[], P = {}, U = {}, E = {}> extends BaseObject<D, S, I, O, A, P, U, E> {
    static package = "UI";
    static author = "Fr0stbyteR";
    static version = "1.0.0";
    static description = "UI Object";
}
