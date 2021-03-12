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
import './store';
import LibraryToolbar from './toolbar';
import LibraryContainer from './container';
import LibrarySpinner from './spinner';

/**
 * External dependencies
 */
import classnames from 'classnames';
import { isEmpty, isBoolean, isArray } from 'lodash';

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

	const { cloudData, categories } = useSelect(select => {
		const { receiveMaxiCloudLibrary, receiveCloudCategories } = select(
			'maxiBlocks/cloudLibrary'
		);
		const cloudData = receiveMaxiCloudLibrary(type);
		const categories = receiveCloudCategories();

		return {
			cloudData,
			categories,
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
			{isEmpty(cloudData) && <LibrarySpinner />}
			{isArray(cloudData) && !isEmpty(cloudData) && (
				<LibraryContainer
					cloudData={cloudData}
					categories={categories}
					type={type}
					onRequestClose={onClose}
				/>
			)}
			{!cloudData && isBoolean(cloudData) && (
				<p>There are no items for this type</p>
			)}
		</Modal>
	);
};

export default CloudLibrary;
