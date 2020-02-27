"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _element = require("@wordpress/element");

var _createHigherOrderComponent = _interopRequireDefault(require("../../utils/create-higher-order-component"));

/**
 * Internal dependencies
 */

/**
 * Higher-order component creator, creating a new component which renders if
 * the given condition is satisfied or with the given optional prop name.
 *
 * @param {Function} predicate Function to test condition.
 *
 * @return {Function} Higher-order component.
 */
var ifCondition = function ifCondition(predicate) {
  return (0, _createHigherOrderComponent.default)(function (WrappedComponent) {
    return function (props) {
      if (!predicate(props)) {
        return null;
      }

      return (0, _element.createElement)(WrappedComponent, props);
    };
  }, 'ifCondition');
};

var _default = ifCondition;
exports.default = _default;
//# sourceMappingURL=index.js.map