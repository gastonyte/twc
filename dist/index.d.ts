/// <reference types="react" />
import * as React from "react";
import { clsx } from "clsx";
type AbstractCompose = (...params: any) => any;
type ResultProps<TComponent extends React.ElementType, TProps, TExtraProps, TCompose extends AbstractCompose> = TProps extends undefined ? TExtraProps extends undefined ? Omit<React.ComponentProps<TComponent>, "className"> & {
    className?: Parameters<TCompose>[0];
} : Omit<React.ComponentProps<TComponent>, "className"> & {
    className?: Parameters<TCompose>[0];
} & TExtraProps : TProps;
type Template<TComponent extends React.ElementType, TCompose extends AbstractCompose, TExtraProps, TParentProps = undefined> = <TProps = TParentProps>(strings: TemplateStringsArray | ((props: ResultProps<TComponent, TProps, TExtraProps, TCompose>) => "className" extends keyof TProps ? TProps["className"] : Parameters<TCompose>[0]), ...values: any[]) => React.ForwardRefExoticComponent<ResultProps<TComponent, TProps, TExtraProps, TCompose>>;
type ElementTagName = Exclude<keyof HTMLElementTagNameMap | keyof SVGElementTagNameMap, "set">;
type FirstLevelTemplate<TComponent extends React.ElementType, TCompose extends AbstractCompose, TExtraProps> = Template<TComponent, TCompose, TExtraProps> & {
    /**
     * Add additional props to the component.
     */
    attrs: <TProps = undefined>(attrs: (Omit<Partial<React.ComponentProps<TComponent>>, "className"> & Record<string, any>) | ((props: ResultProps<TComponent, TProps, TExtraProps, TCompose>) => Record<string, any>)) => Template<TComponent, TCompose, TExtraProps, TProps>;
} & {
    /**
     * Prevent props from being forwarded to the component.
     */
    transientProps: (fn: string[] | ((prop: string) => boolean)) => FirstLevelTemplate<TComponent, TCompose, TExtraProps>;
};
type Twc<TCompose extends AbstractCompose> = (<T extends React.ElementType>(component: T) => FirstLevelTemplate<T, TCompose, undefined>) & {
    [Key in ElementTagName]: FirstLevelTemplate<Key, TCompose, {
        asChild?: boolean;
    }>;
};
type TwcComponentProps<TComponent extends React.ElementType, TCompose extends AbstractCompose = typeof clsx> = ResultProps<TComponent, undefined, {
    asChild?: boolean;
}, TCompose>;
type Config<TCompose extends AbstractCompose> = {
    /**
     * The compose function to use. Defaults to `clsx`.
     */
    compose?: TCompose;
    /**
     * The function to use to determine if a prop should be forwarded to the
     * underlying component. Defaults to `prop => prop[0] !== "$"`.
     */
    shouldForwardProp?: (prop: string) => boolean;
};
declare const createTwc: <TCompose extends AbstractCompose = typeof clsx>(config?: Config<TCompose>) => Twc<TCompose>;
declare const twc: Twc<typeof clsx>;
export { clsx as cx, TwcComponentProps, Config, createTwc, twc };
