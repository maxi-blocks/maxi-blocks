import { createElement } from "@wordpress/element";

/**
 * Internal dependencies
 */
import createHigherOrderComponent from '../../utils/create-higher-order-component';
/**
 * Higher-order component creator, creating a new component which renders if
 * the given condition is satisfied or with the given optional prop name.
 *
 * @param {Function} predicate Function to test condition.
 *
 * @return {Function} Higher-order component.
 */

var ifCondition = function ifCondition(predicate) {
  return createHigherOrderComponent(function (WrappedComponent) {
    return function (props) {
      if (!predicate(props)) {
        return null;
      }

      return createElement(WrappedComponent, props);
    };
  }, 'ifCondition');
};

export default ifCondition;
//# sourceMappingURL=index.js.map