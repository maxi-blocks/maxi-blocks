"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _element = require("@wordpress/element");

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _lodash = require("lodash");

var _createHigherOrderComponent = _interopRequireDefault(require("../../utils/create-higher-order-component"));

function _createSuper(Derived) { return function () { var Super = (0, _getPrototypeOf2.default)(Derived), result; if (_isNativeReflectConstruct()) { var NewTarget = (0, _getPrototypeOf2.default)(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2.default)(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

/**
 * A higher-order component used to provide and manage delayed function calls
 * that ought to be bound to a component's lifecycle.
 *
 * @param {WPComponent} OriginalComponent Component requiring setTimeout
 *
 * @return {WPComponent} Wrapped component.
 */
var withSafeTimeout = (0, _createHigherOrderComponent.default)(function (OriginalComponent) {
  return /*#__PURE__*/function (_Component) {
    (0, _inherits2.default)(WrappedComponent, _Component);

    var _super = _createSuper(WrappedComponent);

    function WrappedComponent() {
      var _this;

      (0, _classCallCheck2.default)(this, WrappedComponent);
      _this = _super.apply(this, arguments);
      _this.timeouts = [];
      _this.setTimeout = _this.setTimeout.bind((0, _assertThisInitialized2.default)(_this));
      _this.clearTimeout = _this.clearTimeout.bind((0, _assertThisInitialized2.default)(_this));
      return _this;
    }

    (0, _createClass2.default)(WrappedComponent, [{
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
        this.timeouts = (0, _lodash.without)(this.timeouts, id);
      })
    }, {
      key: "render",
      value: function render() {
        return (0, _element.createElement)(OriginalComponent, (0, _extends2.default)({}, this.props, {
          setTimeout: this.setTimeout,
          clearTimeout: this.clearTimeout
        }));
      }
    }]);
    return WrappedComponent;
  }(_element.Component);
}, 'withSafeTimeout');
var _default = withSafeTimeout;
exports.default = _default;
//# sourceMappingURL=index.js.map