import en from "./en";
import zhCN from "./zhCN";

const merge = (from: any, to: any): typeof en => {
    for (const key in from) {
        if (!(key in to) && typeof from[key] === "string") to[key] = from[key];
        else if (typeof from[key] === "object") to[key] = { ...from[key], ...to[key] };
    }
    return to;
};

export default {
    en,
    "zh-CN": merge(en, zhCN)
} as Record<string, typeof en>;
