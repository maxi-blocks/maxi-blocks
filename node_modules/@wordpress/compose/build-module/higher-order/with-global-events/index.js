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
import { forEach } from 'lodash';
/**
 * WordPress dependencies
 */

import { Component, forwardRef } from '@wordpress/element';
/**
 * Internal dependencies
 */

import createHigherOrderComponent from '../../utils/create-higher-order-component';
import Listener from './listener';
/**
 * Listener instance responsible for managing document event handling.
 *
 * @type {Listener}
 */

var listener = new Listener();
/**
 * Higher-order component creator which, given an object of DOM event types and
 * values corresponding to a callback function name on the component, will
 * create or update a window event handler to invoke the callback when an event
 * occurs. On behalf of the consuming developer, the higher-order component
 * manages unbinding when the component unmounts, and binding at most a single
 * event handler for the entire application.
 *
 * @param {Object<string,string>} eventTypesToHandlers Object with keys of DOM
 *                                                     event type, the value a
 *                                                     name of the function on
 *                                                     the original component's
 *                                                     instance which handles
 *                                                     the event.
 *
 * @return {Function} Higher-order component.
 */

function withGlobalEvents(eventTypesToHandlers) {
  return createHigherOrderComponent(function (WrappedComponent) {
    var Wrapper = /*#__PURE__*/function (_Component) {
      _inherits(Wrapper, _Component);

      var _super = _createSuper(Wrapper);

      function Wrapper() {
        var _this;

        _classCallCheck(this, Wrapper);

        _this = _super.apply(this, arguments);
        _this.handleEvent = _this.handleEvent.bind(_assertThisInitialized(_this));
        _this.handleRef = _this.handleRef.bind(_assertThisInitialized(_this));
        return _this;
      }

      _createClass(Wrapper, [{
        key: "componentDidMount",
        value: function componentDidMount() {
          var _this2 = this;

          forEach(eventTypesToHandlers, function (handler, eventType) {
            listener.add(eventType, _this2);
          });
        }
      }, {
        key: "componentWillUnmount",
        value: function componentWillUnmount() {
          var _this3 = this;

          forEach(eventTypesToHandlers, function (handler, eventType) {
            listener.remove(eventType, _this3);
          });
        }
      }, {
        key: "handleEvent",
        value: function handleEvent(event) {
          var handler = eventTypesToHandlers[event.type];

          if (typeof this.wrappedRef[handler] === 'function') {
            this.wrappedRef[handler](event);
          }
        }
      }, {
        key: "handleRef",
        value: function handleRef(el) {
          this.wrappedRef = el; // Any component using `withGlobalEvents` that is not setting a `ref`
          // will cause `this.props.forwardedRef` to be `null`, so we need this
          // check.

          if (this.props.forwardedRef) {
            this.props.forwardedRef(el);
          }
        }
      }, {
        key: "render",
        value: function render() {
          return createElement(WrappedComponent, _extends({}, this.props.ownProps, {
            ref: this.handleRef
          }));
        }
      }]);

      return Wrapper;
    }(Component);

    return forwardRef(function (props, ref) {
      return createElement(Wrapper, {
        ownProps: props,
        forwardedRef: ref
      });
    });
  }, 'withGlobalEvents');
}

export default withGlobalEvents;
//# sourceMappingURL=index.js.map