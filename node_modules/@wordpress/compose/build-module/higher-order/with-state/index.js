import _extends from "@babel/runtime/helpers/esm/extends";
import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _assertThisInitialized from "@babel/runtime/helpers/esm/assertThisInitialized";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { createElement } from "@wordpress/element";

function _createSuper(Derived) { return function () { var Super = _getPrototypeOf(Derived), result; if (_isNativeReflectConstruct()) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

/**
 * WordPress dependencies
 */
import { Component } from '@wordpress/element';
/**
 * Internal dependencies
 */

import createHigherOrderComponent from '../../utils/create-higher-order-component';
/**
 * A Higher Order Component used to provide and manage internal component state
 * via props.
 *
 * @param {?Object} initialState Optional initial state of the component.
 *
 * @return {WPComponent} Wrapped component.
 */

export default function withState() {
  var initialState = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  return createHigherOrderComponent(function (OriginalComponent) {
    return /*#__PURE__*/function (_Component) {
      _inherits(WrappedComponent, _Component);

      var _super = _createSuper(WrappedComponent);

      function WrappedComponent() {
        var _this;

        _classCallCheck(this, WrappedComponent);

        _this = _super.apply(this, arguments);
        _this.setState = _this.setState.bind(_assertThisInitialized(_this));
        _this.state = initialState;
        return _this;
      }

      _createClass(WrappedComponent, [{
        key: "render",
        value: function render() {
          return createElement(OriginalComponent, _extends({}, this.props, this.state, {
            setState: this.setState
          }));
        }
      }]);

      return WrappedComponent;
    }(Component);
  }, 'withState');
}
//# sourceMappingURL=index.js.map