import * as React from 'react';
import { clsx } from 'clsx';
export { clsx as cx } from 'clsx';
import { Slot } from '@radix-ui/react-slot';

function filterProps(props, shouldForwardProp) {
    const filteredProps = {};
    const keys = Object.keys(props);
    for(let i = 0; i < keys.length; i++){
        const prop = keys[i];
        if (shouldForwardProp(prop)) {
            filteredProps[prop] = props[prop];
        }
    }
    return filteredProps;
}
const createTwc = (config = {})=>{
    const compose = config.compose || clsx;
    const defaultShouldForwardProp = config.shouldForwardProp || ((prop)=>prop[0] !== "$");
    const wrap = (Component)=>{
        const createTemplate = (attrs, shouldForwardProp = defaultShouldForwardProp)=>{
            const template = (stringsOrFn, ...values)=>{
                const isClassFn = typeof stringsOrFn === "function";
                const tplClassName = !isClassFn && String.raw({
                    raw: stringsOrFn
                }, ...values);
                return /*#__PURE__*/ React.forwardRef((p, ref)=>{
                    const { className: classNameProp, asChild, ...rest } = p;
                    const rp = typeof attrs === "function" ? attrs(p) : attrs ? attrs : {};
                    const fp = filterProps({
                        ...rp,
                        ...rest
                    }, shouldForwardProp);
                    const Comp = asChild ? Slot : Component;
                    const resClassName = isClassFn ? stringsOrFn(p) : tplClassName;
                    return /*#__PURE__*/ React.createElement(Comp, {
                        ref: ref,
                        className: typeof resClassName === "function" ? (renderProps)=>compose(resClassName(renderProps), typeof classNameProp === "function" ? classNameProp(renderProps) : classNameProp) : compose(resClassName, classNameProp),
                        ...fp
                    });
                });
            };
            template.transientProps = (fnOrArray)=>{
                const shouldForwardProp = typeof fnOrArray === "function" ? (prop)=>!fnOrArray(prop) : (prop)=>!fnOrArray.includes(prop);
                return createTemplate(attrs, shouldForwardProp);
            };
            if (attrs === undefined) {
                template.attrs = (attrs)=>{
                    return createTemplate(attrs, shouldForwardProp);
                };
            }
            return template;
        };
        return createTemplate();
    };
    return new Proxy((component)=>{
        return wrap(component);
    }, {
        get (_, name) {
            return wrap(name);
        }
    });
};
const twc = createTwc();

export { createTwc, twc };
