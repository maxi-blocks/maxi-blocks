/**
 * WordPress dependencies
 */
import { Component } from '@wordpress/element';

/**
 * Internal dependencies
 */
import { withFocusOutside } from '@wordpress/components';

class PopoverDetectOutside extends Component {
	handleFocusOutside(event) {
		this.props.onFocusOutside(event);
	}

	render() {
		return this.props.children;
	}
}

export default withFocusOutside(PopoverDetectOutside);
