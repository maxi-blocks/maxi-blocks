"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.concatChildren = concatChildren;
exports.switchChildrenNodeName = switchChildrenNodeName;
Object.defineProperty(exports, "Children", {
  enumerable: true,
  get: function get() {
    return _react.Children;
  }
});
Object.defineProperty(exports, "cloneElement", {
  enumerable: true,
  get: function get() {
    return _react.cloneElement;
  }
});
Object.defineProperty(exports, "Component", {
  enumerable: true,
  get: function get() {
    return _react.Component;
  }
});
Object.defineProperty(exports, "createContext", {
  enumerable: true,
  get: function get() {
    return _react.createContext;
  }
});
Object.defineProperty(exports, "createElement", {
  enumerable: true,
  get: function get() {
    return _react.createElement;
  }
});
Object.defineProperty(exports, "createRef", {
  enumerable: true,
  get: function get() {
    return _react.createRef;
  }
});
Object.defineProperty(exports, "forwardRef", {
  enumerable: true,
  get: function get() {
    return _react.forwardRef;
  }
});
Object.defineProperty(exports, "Fragment", {
  enumerable: true,
  get: function get() {
    return _react.Fragment;
  }
});
Object.defineProperty(exports, "isValidElement", {
  enumerable: true,
  get: function get() {
    return _react.isValidElement;
  }
});
Object.defineProperty(exports, "memo", {
  enumerable: true,
  get: function get() {
    return _react.memo;
  }
});
Object.defineProperty(exports, "StrictMode", {
  enumerable: true,
  get: function get() {
    return _react.StrictMode;
  }
});
Object.defineProperty(exports, "useState", {
  enumerable: true,
  get: function get() {
    return _react.useState;
  }
});
Object.defineProperty(exports, "useEffect", {
  enumerable: true,
  get: function get() {
    return _react.useEffect;
  }
});
Object.defineProperty(exports, "useContext", {
  enumerable: true,
  get: function get() {
    return _react.useContext;
  }
});
Object.defineProperty(exports, "useReducer", {
  enumerable: true,
  get: function get() {
    return _react.useReducer;
  }
});
Object.defineProperty(exports, "useCallback", {
  enumerable: true,
  get: function get() {
    return _react.useCallback;
  }
});
Object.defineProperty(exports, "useMemo", {
  enumerable: true,
  get: function get() {
    return _react.useMemo;
  }
});
Object.defineProperty(exports, "useRef", {
  enumerable: true,
  get: function get() {
    return _react.useRef;
  }
});
Object.defineProperty(exports, "useImperativeHandle", {
  enumerable: true,
  get: function get() {
    return _react.useImperativeHandle;
  }
});
Object.defineProperty(exports, "useLayoutEffect", {
  enumerable: true,
  get: function get() {
    return _react.useLayoutEffect;
  }
});
Object.defineProperty(exports, "useDebugValue", {
  enumerable: true,
  get: function get() {
    return _react.useDebugValue;
  }
});
Object.defineProperty(exports, "lazy", {
  enumerable: true,
  get: function get() {
    return _react.lazy;
  }
});
Object.defineProperty(exports, "Suspense", {
  enumerable: true,
  get: function get() {
    return _react.Suspense;
  }
});

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _objectWithoutProperties2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutProperties"));

var _react = require("react");

var _lodash = require("lodash");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

/**
 * Concatenate two or more React children objects.
 *
 * @param {...?Object} childrenArguments Array of children arguments (array of arrays/strings/objects) to concatenate.
 *
 * @return {Array} The concatenated value.
 */
function concatChildren() {
  for (var _len = arguments.length, childrenArguments = new Array(_len), _key = 0; _key < _len; _key++) {
    childrenArguments[_key] = arguments[_key];
  }

  return childrenArguments.reduce(function (accumulator, children, i) {
    _react.Children.forEach(children, function (child, j) {
      if (child && 'string' !== typeof child) {
        child = (0, _react.cloneElement)(child, {
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


function switchChildrenNodeName(children, nodeName) {
  return children && _react.Children.map(children, function (elt, index) {
    if ((0, _lodash.isString)(elt)) {
      return (0, _react.createElement)(nodeName, {
        key: index
      }, elt);
    }

    var _elt$props = elt.props,
        childrenProp = _elt$props.children,
        props = (0, _objectWithoutProperties2.default)(_elt$props, ["children"]);
    return (0, _react.createElement)(nodeName, _objectSpread({
      key: index
    }, props), childrenProp);
  });
}
//# sourceMappingURL=react.js.map