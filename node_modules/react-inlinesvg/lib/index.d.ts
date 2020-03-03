import * as React from 'react';
import { InlineSVGError } from './helpers';
export interface IProps {
    baseURL?: string;
    cacheRequests?: boolean;
    children?: React.ReactNode;
    description?: string;
    loader?: React.ReactNode;
    innerRef?: React.Ref<HTMLElement>;
    onError?: (error: InlineSVGError | IFetchError) => void;
    onLoad?: (src: string, isCached: boolean) => void;
    preProcessor?: (code: string) => string;
    src: string;
    title?: string;
    uniqueHash?: string;
    uniquifyIDs?: boolean;
    [key: string]: any;
}
export interface IState {
    content: string;
    element: React.ReactNode;
    hasCache: boolean;
    status: string;
}
export interface IFetchError extends Error {
    code: string;
    errno: string;
    message: string;
    type: string;
}
export interface IStorageItem {
    content: string;
    queue: any[];
    status: string;
}
export declare const STATUS: {
    FAILED: string;
    LOADED: string;
    LOADING: string;
    PENDING: string;
    READY: string;
    UNSUPPORTED: string;
};
export default class InlineSVG extends React.PureComponent<IProps, IState> {
    static defaultProps: {
        cacheRequests: boolean;
        uniquifyIDs: boolean;
    };
    private _isMounted;
    private readonly hash;
    constructor(props: IProps);
    componentDidMount(): void;
    componentDidUpdate(prevProps: IProps, prevState: IState): void;
    componentWillUnmount(): void;
    private processSVG;
    private updateSVGAttributes;
    private getNode;
    private getElement;
    private load;
    private handleLoad;
    private handleError;
    private request;
    render(): {} | null;
}
