/* eslint-disable no-alert */
/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useSelect } from '@wordpress/data';
import { forwardRef } from '@wordpress/element';
import { Popover } from '@wordpress/components';

/**
 * Internal dependencies
 */
import Icon from '../../components/icon';
import Button from '../../components/button';

/**
 * Icons
 */
import { styleCardBoat, closeIcon } from '../../icons';

const MaxiExportPopUp = forwardRef(({ setIsVisible }, ref) => {
	const { isRTL, currentPostTitle, postContent } = useSelect(select => {
		const { getEditorSettings, getEditedPostContent } =
			select('core/editor');
		const { getCurrentPost } = select('core/editor');
		const { isRTL } = getEditorSettings();
		const currentPost = getCurrentPost();

		return {
			isRTL,
			currentPostTitle:
				currentPost?.title || `maxi-export-${currentPost?.id || ''}`,
			postContent: getEditedPostContent(),
		};
	});

	const handleDownload = () => {
		const exportData = {
			[currentPostTitle]: {
				content: postContent,
			},
		};

		const jsonData = JSON.stringify(exportData, null, 2);
		const blob = new Blob([jsonData], { type: 'application/json' });

		const url = window.URL.createObjectURL(blob);
		const link = document.createElement('a');
		link.href = url;
		link.download = `${currentPostTitle
			.toLowerCase()
			.replace(/\s+/g, '-')}.json`;

		document.body.appendChild(link);
		link.click();

		document.body.removeChild(link);
		window.URL.revokeObjectURL(url);
	};

	return (
		<Popover
			anchor={ref.current}
			noArrow
			resize
			position={isRTL ? 'bottom left right' : 'bottom right left'}
			className='maxi-style-cards__popover maxi-sidebar'
			focusOnMount
			strategy='fixed'
		>
			<div className='active-style-card'>
				<div className='active-style-card_icon'>
					<Icon icon={styleCardBoat} />
				</div>
				<div className='active-style-card_title'>
					<span>{__('Export', 'maxi-blocks')}</span>
					<h2 className='maxi-style-cards__popover__title'>
						{__('Export current page', 'maxi-blocks')}
					</h2>
				</div>
				<span
					className='maxi-responsive-close has-tooltip'
					onClick={() => setIsVisible(false)}
				>
					<span className='tooltip'>
						{__('Close', 'maxi-blocks')}
					</span>
					<Icon icon={closeIcon} />
				</span>
			</div>

			<div className='maxi-style-cards__sc'>
				<div className='maxi-style-cards__sc__more-sc'>
					<Button
						className='maxi-style-cards__download-button'
						onClick={handleDownload}
					>
						{__('Download as JSON', 'maxi-blocks')}
					</Button>
				</div>
			</div>
		</Popover>
	);
});

export default MaxiExportPopUp;
