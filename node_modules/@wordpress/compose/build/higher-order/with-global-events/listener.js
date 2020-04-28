"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _lodash = require("lodash");

/**
 * External dependencies
 */

/**
 * Class responsible for orchestrating event handling on the global window,
 * binding a single event to be shared across all handling instances, and
 * removing the handler when no instances are listening for the event.
 */
var Listener = /*#__PURE__*/function () {
  function Listener() {
    (0, _classCallCheck2.default)(this, Listener);
    this.listeners = {};
    this.handleEvent = this.handleEvent.bind(this);
  }

  (0, _createClass2.default)(Listener, [{
    key: "add",
    value: function add(eventType, instance) {
      if (!this.listeners[eventType]) {
        // Adding first listener for this type, so bind event.
        window.addEventListener(eventType, this.handleEvent);
        this.listeners[eventType] = [];
      }

      this.listeners[eventType].push(instance);
    }
  }, {
    key: "remove",
    value: function remove(eventType, instance) {
      this.listeners[eventType] = (0, _lodash.without)(this.listeners[eventType], instance);

      if (!this.listeners[eventType].length) {
        // Removing last listener for this type, so unbind event.
        window.removeEventListener(eventType, this.handleEvent);
        delete this.listeners[eventType];
      }
    }
  }, {
    key: "handleEvent",
    value: function handleEvent(event) {
      (0, _lodash.forEach)(this.listeners[event.type], function (instance) {
        instance.handleEvent(event);
      });
    }
  }]);
  return Listener;
}();

var _default = Listener;
exports.default = _default;
//# sourceMappingURL=listener.js.map