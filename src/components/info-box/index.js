/**
 * WordPress dependencies
 */
import { dispatch } from '@wordpress/data';

/**
 * Internal dependencies
 */
import { openSidebarAccordion } from '@extensions/inspector';
import Icon from '@components/icon';

/**
 * External dependencies
 */
import classnames from 'classnames';
import { isEmpty, uniqueId } from 'lodash';

/**
 * Styles and icons
 */
import { closeIcon } from '@maxi-icons';
import './editor.scss';

const InfoBox = ({ className, message, links, tab = 0, onClose }) => {
	const classes = classnames('maxi-warning-box', className);

	return (
		<div className={classes}>
			{message}
			{links && (
				<div className='maxi-warning-box__links'>
					{links.map(item => (
						<a
							key={uniqueId('maxi-warning-box__links__item')}
							onClick={() => {
								if (!isEmpty(item.clientId))
									dispatch('core/block-editor').selectBlock(
										item.clientId
									);

								if (!isEmpty(item.panel))
									openSidebarAccordion(tab, item.panel);

								if (!isEmpty(item.href))
									window.open(item.href, '_blank');
							}}
						>
							{item.title}
						</a>
					))}
				</div>
			)}
			{onClose && (
				<div
					className='maxi-warning-box__close-button'
					onClick={onClose}
				>
					<Icon icon={closeIcon} />
				</div>
			)}
		</div>
	);
};

export default InfoBox;
