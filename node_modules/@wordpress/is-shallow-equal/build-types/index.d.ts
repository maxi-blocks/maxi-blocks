export = isShallowEqual;
/**
 * @typedef {Record<string, any>} ComparableObject
 */
/**
 * Returns true if the two arrays or objects are shallow equal, or false
 * otherwise.
 *
 * @param {any[]|ComparableObject} a First object or array to compare.
 * @param {any[]|ComparableObject} b Second object or array to compare.
 *
 * @return {boolean} Whether the two values are shallow equal.
 */
declare function isShallowEqual(a: any[] | Record<string, any>, b: any[] | Record<string, any>): boolean;
declare namespace isShallowEqual {
    export { isShallowEqualObjects, isShallowEqualArrays, ComparableObject };
}
/**
 * Internal dependencies;
 */
declare var isShallowEqualObjects: typeof import("./objects");
declare var isShallowEqualArrays: typeof import("./arrays");
type ComparableObject = {
    [x: string]: any;
};
//# sourceMappingURL=index.d.ts.map