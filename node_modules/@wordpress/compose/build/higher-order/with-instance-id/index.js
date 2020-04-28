"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _element = require("@wordpress/element");

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _createHigherOrderComponent = _interopRequireDefault(require("../../utils/create-higher-order-component"));

var _useInstanceId = _interopRequireDefault(require("../../hooks/use-instance-id"));

/**
 * Internal dependencies
 */

/**
 * A Higher Order Component used to be provide a unique instance ID by
 * component.
 *
 * @param {WPComponent} WrappedComponent The wrapped component.
 *
 * @return {WPComponent} Component with an instanceId prop.
 */
var _default = (0, _createHigherOrderComponent.default)(function (WrappedComponent) {
  return function (props) {
    var instanceId = (0, _useInstanceId.default)(WrappedComponent);
    return (0, _element.createElement)(WrappedComponent, (0, _extends2.default)({}, props, {
      instanceId: instanceId
    }));
  };
}, 'withInstanceId');

exports.default = _default;
//# sourceMappingURL=index.js.map