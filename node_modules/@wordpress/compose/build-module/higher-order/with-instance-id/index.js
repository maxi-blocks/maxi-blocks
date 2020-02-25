import _extends from "@babel/runtime/helpers/esm/extends";
import { createElement } from "@wordpress/element";

/**
 * Internal dependencies
 */
import createHigherOrderComponent from '../../utils/create-higher-order-component';
import useInstanceId from '../../hooks/use-instance-id';
/**
 * A Higher Order Component used to be provide a unique instance ID by
 * component.
 *
 * @param {WPComponent} WrappedComponent The wrapped component.
 *
 * @return {WPComponent} Component with an instanceId prop.
 */

export default createHigherOrderComponent(function (WrappedComponent) {
  return function (props) {
    var instanceId = useInstanceId(WrappedComponent);
    return createElement(WrappedComponent, _extends({}, props, {
      instanceId: instanceId
    }));
  };
}, 'withInstanceId');
//# sourceMappingURL=index.js.map