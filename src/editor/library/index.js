/**
 * WordPress dependencies.
 */
import { __ } from '@wordpress/i18n';
import { Modal } from '@wordpress/components';
import { useState } from '@wordpress/element';

/**
 * Internal dependencies
 */
import LibraryToolbar from './toolbar';
import LibraryContainer from './container';
/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * Styles
 */
import './editor.scss';

/**
 * Component
 *
 * @param {string} cloudType Type of the data to get from the Cloud, values: patterns, svg, sc
 */
const CloudLibrary = props => {
	const { onClose, className, cloudType, blockStyle, layerId, onSelect } =
		props;

	const [type, setType] = useState(cloudType);

	const classes = classnames('maxi-library-modal', className);

	return (
		<Modal
			title={__('Maxi Cloud Library', 'maxi-blocks')}
			className={classes}
			shouldCloseOnEsc
			shouldCloseOnClickOutside={false}
			onRequestClose={onClose}
		>
			<>
				<LibraryToolbar type={type} onChange={type => setType(type)} />
				<LibraryContainer
					layerId={layerId}
					type={type}
					onRequestClose={onClose}
					blockStyle={blockStyle}
					onSelect={onSelect}
				/>
			</>
		</Modal>
	);
};

export default CloudLibrary;
