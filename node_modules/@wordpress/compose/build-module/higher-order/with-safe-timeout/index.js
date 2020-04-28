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
 * External dependencies
 */
import { without } from 'lodash';
/**
 * WordPress dependencies
 */

import { Component } from '@wordpress/element';
/**
 * Internal dependencies
 */

import createHigherOrderComponent from '../../utils/create-higher-order-component';
/**
 * A higher-order component used to provide and manage delayed function calls
 * that ought to be bound to a component's lifecycle.
 *
 * @param {WPComponent} OriginalComponent Component requiring setTimeout
 *
 * @return {WPComponent} Wrapped component.
 */

var withSafeTimeout = createHigherOrderComponent(function (OriginalComponent) {
  return /*#__PURE__*/function (_Component) {
    _inherits(WrappedComponent, _Component);

    var _super = _createSuper(WrappedComponent);

    function WrappedComponent() {
      var _this;

      _classCallCheck(this, WrappedComponent);

      _this = _super.apply(this, arguments);
      _this.timeouts = [];
      _this.setTimeout = _this.setTimeout.bind(_assertThisInitialized(_this));
      _this.clearTimeout = _this.clearTimeout.bind(_assertThisInitialized(_this));
      return _this;
    }

    _createClass(WrappedComponent, [{
      key: "componentWillUnmount",
      value: function componentWillUnmount() {
        this.timeouts.forEach(clearTimeout);
      }
    }, {
      key: "setTimeout",
      value: function (_setTimeout) {
        function setTimeout(_x, _x2) {
          return _setTimeout.apply(this, arguments);
        }

        setTimeout.toString = function () {
          return _setTimeout.toString();
        };

        return setTimeout;
      }(function (fn, delay) {
        var _this2 = this;

        var id = setTimeout(function () {
          fn();

          _this2.clearTimeout(id);
        }, delay);
        this.timeouts.push(id);
        return id;
      })
    }, {
      key: "clearTimeout",
      value: function (_clearTimeout) {
        function clearTimeout(_x3) {
          return _clearTimeout.apply(this, arguments);
        }

        clearTimeout.toString = function () {
          return _clearTimeout.toString();
        };

        return clearTimeout;
      }(function (id) {
        clearTimeout(id);
        this.timeouts = without(this.timeouts, id);
      })
    }, {
      key: "render",
      value: function render() {
        return createElement(OriginalComponent, _extends({}, this.props, {
          setTimeout: this.setTimeout,
          clearTimeout: this.clearTimeout
        }));
      }
    }]);

    return WrappedComponent;
  }(Component);
}, 'withSafeTimeout');
export default withSafeTimeout;
//# sourceMappingURL=index.js.map