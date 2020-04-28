import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { createElement } from "@wordpress/element";

function _createSuper(Derived) { return function () { var Super = _getPrototypeOf(Derived), result; if (_isNativeReflectConstruct()) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

/**
 * WordPress dependencies
 */
import isShallowEqual from '@wordpress/is-shallow-equal';
import { Component } from '@wordpress/element';
/**
 * Internal dependencies
 */

import createHigherOrderComponent from '../../utils/create-higher-order-component';
/**
 * Given a component returns the enhanced component augmented with a component
 * only rerendering when its props/state change
 *
 * @param {Function} mapComponentToEnhancedComponent Function mapping component
 *                                                   to enhanced component.
 * @param {string}   modifierName                    Seed name from which to
 *                                                   generated display name.
 *
 * @return {WPComponent} Component class with generated display name assigned.
 */

var pure = createHigherOrderComponent(function (Wrapped) {
  if (Wrapped.prototype instanceof Component) {
    return /*#__PURE__*/function (_Wrapped) {
      _inherits(_class, _Wrapped);

      var _super = _createSuper(_class);

      function _class() {
        _classCallCheck(this, _class);

        return _super.apply(this, arguments);
      }

      _createClass(_class, [{
        key: "shouldComponentUpdate",
        value: function shouldComponentUpdate(nextProps, nextState) {
          return !isShallowEqual(nextProps, this.props) || !isShallowEqual(nextState, this.state);
        }
      }]);

      return _class;
    }(Wrapped);
  }

  return /*#__PURE__*/function (_Component) {
    _inherits(_class2, _Component);

    var _super2 = _createSuper(_class2);

    function _class2() {
      _classCallCheck(this, _class2);

      return _super2.apply(this, arguments);
    }

    _createClass(_class2, [{
      key: "shouldComponentUpdate",
      value: function shouldComponentUpdate(nextProps) {
        return !isShallowEqual(nextProps, this.props);
      }
    }, {
      key: "render",
      value: function render() {
        return createElement(Wrapped, this.props);
      }
    }]);

    return _class2;
  }(Component);
}, 'pure');
export default pure;
//# sourceMappingURL=index.js.map