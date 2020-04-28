import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

/**
 * Internal dependencies
 */
import { createElement } from './react'; // Disable reason: JSDoc linter doesn't seem to parse the union (`&`) correctly.

/* eslint-disable jsdoc/valid-types */

/** @typedef {{children: string} & import('react').ComponentPropsWithoutRef<'div'>} RawHTMLProps */

/* eslint-enable jsdoc/valid-types */

/**
 * Component used as equivalent of Fragment with unescaped HTML, in cases where
 * it is desirable to render dangerous HTML without needing a wrapper element.
 * To preserve additional props, a `div` wrapper _will_ be created if any props
 * aside from `children` are passed.
 *
 * @param {RawHTMLProps} props Children should be a string of HTML. Other props
 *                             will be passed through to div wrapper.
 *
 * @return {JSX.Element} Dangerously-rendering component.
 */

export default function RawHTML(_ref) {
  var children = _ref.children,
      props = _objectWithoutProperties(_ref, ["children"]);

  // The DIV wrapper will be stripped by serializer, unless there are
  // non-children props present.
  return createElement('div', _objectSpread({
    dangerouslySetInnerHTML: {
      __html: children
    }
  }, props));
}
//# sourceMappingURL=raw-html.js.map