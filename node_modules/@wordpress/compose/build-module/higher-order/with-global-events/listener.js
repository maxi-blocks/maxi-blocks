import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";

/**
 * External dependencies
 */
import { forEach, without } from 'lodash';
/**
 * Class responsible for orchestrating event handling on the global window,
 * binding a single event to be shared across all handling instances, and
 * removing the handler when no instances are listening for the event.
 */

var Listener = /*#__PURE__*/function () {
  function Listener() {
    _classCallCheck(this, Listener);

    this.listeners = {};
    this.handleEvent = this.handleEvent.bind(this);
  }

  _createClass(Listener, [{
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
      this.listeners[eventType] = without(this.listeners[eventType], instance);

      if (!this.listeners[eventType].length) {
        // Removing last listener for this type, so unbind event.
        window.removeEventListener(eventType, this.handleEvent);
        delete this.listeners[eventType];
      }
    }
  }, {
    key: "handleEvent",
    value: function handleEvent(event) {
      forEach(this.listeners[event.type], function (instance) {
        instance.handleEvent(event);
      });
    }
  }]);

  return Listener;
}();

export default Listener;
//# sourceMappingURL=listener.js.map