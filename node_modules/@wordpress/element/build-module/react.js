import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

/**
 * External dependencies
 */
import { Children, cloneElement, Component, createContext, createElement, createRef, forwardRef, Fragment, isValidElement, memo, StrictMode, useState, useEffect, useContext, useReducer, useCallback, useMemo, useRef, useImperativeHandle, useLayoutEffect, useDebugValue, lazy, Suspense } from 'react';
import { isString } from 'lodash';
/**
 * Object containing a React element.
 *
 * @typedef {import('react').ReactElement} WPElement
 */

/**
 * Object containing a React component.
 *
 * @typedef {import('react').ComponentType} WPComponent
 */

/**
 * Object containing a React synthetic event.
 *
 * @typedef {import('react').SyntheticEvent} WPSyntheticEvent
 */

/**
 * Object that provides utilities for dealing with React children.
 */

export { Children };
/**
 * Creates a copy of an element with extended props.
 *
 * @param {WPElement} element Element
 * @param {?Object}   props   Props to apply to cloned element
 *
 * @return {WPElement} Cloned element.
 */

export { cloneElement };
/**
 * A base class to create WordPress Components (Refs, state and lifecycle hooks)
 */

export { Component };
/**
 * Creates a context object containing two components: a provider and consumer.
 *
 * @param {Object} defaultValue A default data stored in the context.
 *
 * @return {Object} Context object.
 */

export { createContext };
/**
 * Returns a new element of given type. Type can be either a string tag name or
 * another function which itself returns an element.
 *
 * @param {?(string|Function)} type     Tag name or element creator
 * @param {Object}             props    Element properties, either attribute
 *                                      set to apply to DOM node or values to
 *                                      pass through to element creator
 * @param {...WPElement}       children Descendant elements
 *
 * @return {WPElement} Element.
 */

export { createElement };
/**
 * Returns an object tracking a reference to a rendered element via its
 * `current` property as either a DOMElement or Element, dependent upon the
 * type of element rendered with the ref attribute.
 *
 * @return {Object} Ref object.
 */

export { createRef };
/**
 * Component enhancer used to enable passing a ref to its wrapped component.
 * Pass a function argument which receives `props` and `ref` as its arguments,
 * returning an element using the forwarded ref. The return value is a new
 * component which forwards its ref.
 *
 * @param {Function} forwarder Function passed `props` and `ref`, expected to
 *                             return an element.
 *
 * @return {WPComponent} Enhanced component.
 */

export { forwardRef };
/**
 * A component which renders its children without any wrapping element.
 */

export { Fragment };
/**
 * Checks if an object is a valid WPElement.
 *
 * @param {Object} objectToCheck The object to be checked.
 *
 * @return {boolean} true if objectToTest is a valid WPElement and false otherwise.
 */

export { isValidElement };
/**
 * @see https://reactjs.org/docs/react-api.html#reactmemo
 */

export { memo };
/**
 * Component that activates additional checks and warnings for its descendants.
 */

export { StrictMode };
/**
 * @see https://reactjs.org/docs/hooks-reference.html#usecallback
 */

export { useCallback };
/**
 * @see https://reactjs.org/docs/hooks-reference.html#usecontext
 */

export { useContext };
/**
 * @see https://reactjs.org/docs/hooks-reference.html#usedebugvalue
 */

export { useDebugValue };
/**
 * @see https://reactjs.org/docs/hooks-reference.html#useeffect
 */

export { useEffect };
/**
 * @see https://reactjs.org/docs/hooks-reference.html#useimperativehandle
 */

export { useImperativeHandle };
/**
 * @see https://reactjs.org/docs/hooks-reference.html#uselayouteffect
 */

export { useLayoutEffect };
/**
 * @see https://reactjs.org/docs/hooks-reference.html#usememo
 */

export { useMemo };
/**
 * @see https://reactjs.org/docs/hooks-reference.html#usereducer
 */

export { useReducer };
/**
 * @see https://reactjs.org/docs/hooks-reference.html#useref
 */

export { useRef };
/**
 * @see https://reactjs.org/docs/hooks-reference.html#usestate
 */

export { useState };
/**
 * @see https://reactjs.org/docs/react-api.html#reactlazy
 */

export { lazy };
/**
 * @see https://reactjs.org/docs/react-api.html#reactsuspense
 */

export { Suspense };
/**
 * Concatenate two or more React children objects.
 *
 * @param {...?Object} childrenArguments Array of children arguments (array of arrays/strings/objects) to concatenate.
 *
 * @return {Array} The concatenated value.
 */

export function concatChildren() {
  for (var _len = arguments.length, childrenArguments = new Array(_len), _key = 0; _key < _len; _key++) {
    childrenArguments[_key] = arguments[_key];
  }

  return childrenArguments.reduce(function (accumulator, children, i) {
    Children.forEach(children, function (child, j) {
      if (child && 'string' !== typeof child) {
        child = cloneElement(child, {
          key: [i, j].join()
        });
      }

      accumulator.push(child);
    });
    return accumulator;
  }, []);
}
/**
 * Switches the nodeName of all the elements in the children object.
 *
 * @param {?Object} children Children object.
 * @param {string}  nodeName Node name.
 *
 * @return {?Object} The updated children object.
 */

export function switchChildrenNodeName(children, nodeName) {
  return children && Children.map(children, function (elt, index) {
    if (isString(elt)) {
      return createElement(nodeName, {
        key: index
      }, elt);
    }

    var _elt$props = elt.props,
        childrenProp = _elt$props.children,
        props = _objectWithoutProperties(_elt$props, ["children"]);

    return createElement(nodeName, _objectSpread({
      key: index
    }, props), childrenProp);
  });
}
//# sourceMappingURL=react.js.map