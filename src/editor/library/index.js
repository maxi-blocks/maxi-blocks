/**
 * WordPress dependencies.
 */
const { __ } = wp.i18n;
const { Modal } = wp.components;
const { useSelect } = wp.data;
const { useState } = wp.element;

/**
 * Internal dependencies
 */
import LibraryToolbar from './toolbar';

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
 */
const CloudLibrary = props => {
	const { onClose, className } = props;

	const [type, setType] = useState('pattern');

	const { cloudData } = useSelect(select => {
		const { receiveMaxiCloudLibrary } = select('maxiBlocks');
		const cloudData = receiveMaxiCloudLibrary();

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
			<LibraryToolbar type={type} onChange={type => setType(type)} />
		</Modal>
	);
};

export default CloudLibrary;
