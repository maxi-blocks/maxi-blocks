"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _element = require("@wordpress/element");

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _isShallowEqual = _interopRequireDefault(require("@wordpress/is-shallow-equal"));

var _createHigherOrderComponent = _interopRequireDefault(require("../../utils/create-higher-order-component"));

function _createSuper(Derived) { return function () { var Super = (0, _getPrototypeOf2.default)(Derived), result; if (_isNativeReflectConstruct()) { var NewTarget = (0, _getPrototypeOf2.default)(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2.default)(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

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
var pure = (0, _createHigherOrderComponent.default)(function (Wrapped) {
  if (Wrapped.prototype instanceof _element.Component) {
    return /*#__PURE__*/function (_Wrapped) {
      (0, _inherits2.default)(_class, _Wrapped);

      var _super = _createSuper(_class);

      function _class() {
        (0, _classCallCheck2.default)(this, _class);
        return _super.apply(this, arguments);
      }

      (0, _createClass2.default)(_class, [{
        key: "shouldComponentUpdate",
        value: function shouldComponentUpdate(nextProps, nextState) {
          return !(0, _isShallowEqual.default)(nextProps, this.props) || !(0, _isShallowEqual.default)(nextState, this.state);
        }
      }]);
      return _class;
    }(Wrapped);
  }

  return /*#__PURE__*/function (_Component) {
    (0, _inherits2.default)(_class2, _Component);

    var _super2 = _createSuper(_class2);

    function _class2() {
      (0, _classCallCheck2.default)(this, _class2);
      return _super2.apply(this, arguments);
    }

    (0, _createClass2.default)(_class2, [{
      key: "shouldComponentUpdate",
      value: function shouldComponentUpdate(nextProps) {
        return !(0, _isShallowEqual.default)(nextProps, this.props);
      }
    }, {
      key: "render",
      value: function render() {
        return (0, _element.createElement)(Wrapped, this.props);
      }
    }]);
    return _class2;
  }(_element.Component);
}, 'pure');
var _default = pure;
exports.default = _default;
//# sourceMappingURL=index.js.map