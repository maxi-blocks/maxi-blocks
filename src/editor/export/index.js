/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useState, forwardRef } from '@wordpress/element';

/**
 * Internal dependencies
 */
import MaxiExportPopUp from './MaxiExportPopUp';
import Button from '../../components/button';
import Icon from '../../components/icon';

/**
 * Styles and icons
 */
import './editor.scss';
import { styleCardMenu } from '../../icons';

const MaxiExportEditorPopUp = forwardRef((props, settingsRef) => {
	const [isVisible, setIsVisible] = useState(false);

	return (
		<>
			<Button
				id='maxi-button__go-to-customizer'
				className='action-buttons__button style-card-button'
				aria-label={__('Export', 'maxi-blocks')}
				onClick={() => setIsVisible(!isVisible)}
			>
				<Icon icon={styleCardMenu} />
				<span>{__('Export', 'maxi-blocks')}</span>
			</Button>
			{isVisible && (
				<MaxiExportPopUp
					ref={settingsRef}
					setIsVisible={setIsVisible}
				/>
			)}
		</>
	);
});

export default MaxiExportEditorPopUp;
