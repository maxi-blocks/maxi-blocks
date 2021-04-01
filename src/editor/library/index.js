/**
 * WordPress dependencies.
 */
import { __ } from '@wordpress/i18n';
const { Modal } = wp.components;
import { useSelect } from '@wordpress/data';
const { useState, Fragment } = wp.element;

/**
 * Internal dependencies
 */
import './store';
import LibraryToolbar from './toolbar';
import LibraryContainer from './container';
import LibrarySpinner from './spinner';

/**
 * External dependencies
 */
import classnames from 'classnames';
import { isEmpty } from 'lodash';

/**
 * Styles
 */
import './editor.scss';

/**
 * Component
 */
const CloudLibrary = props => {
	const { onClose, className } = props;

	const [type, setType] = useState('patterns');

	const { cloudData } = useSelect(select => {
		const { receiveMaxiCloudLibrary } = select('maxiBlocks/cloudLibrary');
		const cloudData = receiveMaxiCloudLibrary(type);

		return {
			cloudData,
		};
	});

	const classes = classnames('maxi-library-modal', className);

	return (
		<Modal
			title={__('Maxi Cloud Library', 'maxi-blocks')}
			className={classes}
			shouldCloseOnEsc
			shouldCloseOnClickOutside={false}
			onRequestClose={onClose}
		>
			{(isEmpty(cloudData) && <LibrarySpinner />) || (
				<Fragment>
					<LibraryToolbar
						type={type}
						onChange={type => setType(type)}
					/>
					<LibraryContainer
						cloudData={cloudData}
						type={type}
						onRequestClose={onClose}
					/>
				</Fragment>
			)}
		</Modal>
	);
};

export default CloudLibrary;
