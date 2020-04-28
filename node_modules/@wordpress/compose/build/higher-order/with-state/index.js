"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = withState;

var _element = require("@wordpress/element");

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _createHigherOrderComponent = _interopRequireDefault(require("../../utils/create-higher-order-component"));

function _createSuper(Derived) { return function () { var Super = (0, _getPrototypeOf2.default)(Derived), result; if (_isNativeReflectConstruct()) { var NewTarget = (0, _getPrototypeOf2.default)(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2.default)(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

/**
 * A Higher Order Component used to provide and manage internal component state
 * via props.
 *
 * @param {?Object} initialState Optional initial state of the component.
 *
 * @return {WPComponent} Wrapped component.
 */
function withState() {
  var initialState = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  return (0, _createHigherOrderComponent.default)(function (OriginalComponent) {
    return /*#__PURE__*/function (_Component) {
      (0, _inherits2.default)(WrappedComponent, _Component);

      var _super = _createSuper(WrappedComponent);

      function WrappedComponent() {
        var _this;

        (0, _classCallCheck2.default)(this, WrappedComponent);
        _this = _super.apply(this, arguments);
        _this.setState = _this.setState.bind((0, _assertThisInitialized2.default)(_this));
        _this.state = initialState;
        return _this;
      }

      (0, _createClass2.default)(WrappedComponent, [{
        key: "render",
        value: function render() {
          return (0, _element.createElement)(OriginalComponent, (0, _extends2.default)({}, this.props, this.state, {
            setState: this.setState
          }));
        }
      }]);
      return WrappedComponent;
    }(_element.Component);
  }, 'withState');
}
//# sourceMappingURL=index.js.map