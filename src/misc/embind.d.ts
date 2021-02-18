interface RegisteredClass {
    baseClass: any;
    constructor: new (...args: any[]) => any;
    downcast: number;
    getActualType: (a1: any) => any;
    instancePrototype: ClassHandle;
    name: string;
    pureVirtualFunctions: any[];
    rawDestructor: (a1: any) => any;
    upcast: number;
}

interface RegisteredPointer {
    destructorFunction: (...args: any[]) => any;
    isConst: boolean;
    isReference: boolean;
    isSmartPointer: boolean;
    name: string;
    pointeeType: any;
    rawConstructor: any;
    rawDestructor: any;
    rawGetPointee: any;
    rawShare: any;
    registeredClass: RegisteredClass;
    sharingPolicy: any;
    toWireType: (destructors: any, handle: any) => any;
}

interface ClassHandlePointerInfo {
    count: { value: number };
    deleteScheduled: boolean;
    preservePointerOnDelete: boolean;
    ptr: number;
    ptrType: RegisteredPointer;
}

interface ClassHandle {
    readonly $$: ClassHandlePointerInfo;
    clone(): this;
    delete(): void;
    deleteLater(): void;
    isAliasOf(that: this): boolean;
    isDeleted(): boolean;
}
