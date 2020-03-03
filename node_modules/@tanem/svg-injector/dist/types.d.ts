export declare type AfterAll = (elementsLoaded: number) => void;
export declare type BeforeEach = (svg: Element) => void;
export declare type Errback = (error: Error | null, svg?: Element) => void;
export declare type EvalScripts = 'always' | 'once' | 'never';
