export declare const canUseDOM: () => boolean;
export declare const supportsInlineSVG: () => boolean | null;
export declare class InlineSVGError extends Error {
    name: string;
    message: string;
    data?: object;
    constructor(message: string, data?: object);
}
export declare const isSupportedEnvironment: () => boolean | null;
export declare const randomString: (length: number) => string;
