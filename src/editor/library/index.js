/* eslint-disable import/no-cycle */
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
		cost,
		toneUrl,
		cardId,
		isPro,
		isBeta,
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
					cardId={cardId}
					title={title}
					cost={cost}
					toneUrl={toneUrl}
					onRequestClose={onClose}
					isPro={isPro}
					isBeta={isBeta}
				/>
				<LibraryContainer
					type={type}
					onRequestClose={onClose}
					blockStyle={blockStyle}
					onSelect={onSelect}
					url={url}
					title={title}
					prefix={prefix}
					isPro={isPro}
					isBeta={isBeta}
				/>
			</>
		</Modal>
	);
};

export default CloudLibrary;
