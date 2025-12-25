/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useState, forwardRef, lazy, Suspense } from '@wordpress/element';

/**
 * Internal dependencies
 */
// import MaxiExportPopUp from './MaxiExportPopUp';
import Button from '@components/button';
import Icon from '@components/icon';

/**
 * Styles and icons
 */
import './editor.scss';
import { cloudLib } from '@maxi-icons';

const MaxiExportPopUp = lazy(() => import('./MaxiExportPopUp'));

const MaxiExportEditorPopUp = forwardRef((props, settingsRef) => {
	const [isVisible, setIsVisible] = useState(false);

	return (
		<>
			<Button
				id='maxi-button__export'
				className='action-buttons__button style-card-button'
				aria-label={__('Export', 'maxi-blocks')}
				onClick={() => setIsVisible(!isVisible)}
			>
				<Icon icon={cloudLib} className='export-icon' />
				<span>{__('Export', 'maxi-blocks')}</span>
			</Button>
			{isVisible && (
				<Suspense fallback={null}>
					<MaxiExportPopUp
						ref={settingsRef}
						setIsVisible={setIsVisible}
					/>
				</Suspense>
			)}
		</>
	);
});

export default MaxiExportEditorPopUp;
