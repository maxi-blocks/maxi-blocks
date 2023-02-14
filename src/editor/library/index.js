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
	const {
		onClose,
		className,
		cloudType,
		blockStyle,
		onSelect,
		url,
		title,
		cardId,
		prefix = '',
	} = props;

	const [type, setType] = useState(cloudType);

	const classes = classnames('maxi-library-modal', className);

	return (
		<Modal
			title={__('Template Library Maxi', 'maxi-blocks')}
			className={classes}
			shouldCloseOnEsc
			shouldCloseOnClickOutside={false}
			onRequestClose={onClose}
		>
			<>
				<LibraryToolbar
					type={type}
					onChange={type => setType(type)}
					onRequestClose={onClose}
					cardId={cardId}
				/>
				<LibraryContainer
					type={type}
					onRequestClose={onClose}
					blockStyle={blockStyle}
					onSelect={onSelect}
					url={url}
					title={title}
					prefix={prefix}
				/>
			</>
		</Modal>
	);
};

export default CloudLibrary;
