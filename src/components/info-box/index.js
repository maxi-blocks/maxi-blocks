/**
 * WordPress dependencies
 */
import { dispatch } from '@wordpress/data';

/**
 * Internal dependencies
 */
import openSidebar from '../../extensions/dom';

/**
 * External dependencies
 */
import classnames from 'classnames';
import { isEmpty, uniqueId } from 'lodash';

/**
 * Styles
 */
import './editor.scss';

const InfoBox = ({ className, message, links }) => {
	const classes = classnames('maxi-warning-box', className);

	const { openGeneralSidebar } = dispatch('core/edit-post');

	return (
		<div className={classes}>
			{message}
			{links && (
				<div className='maxi-warning-box__links'>
					{links.map(item => (
						<a
							key={uniqueId('maxi-warning-box__links__item')}
							onClick={() => {
								if (!isEmpty(item.panel))
									openGeneralSidebar('edit-post/block').then(
										() => openSidebar(item.panel)
									);

								if (!isEmpty(item.href))
									window.open(item.href, '_blank');
							}}
						>
							{item.title}
						</a>
					))}
				</div>
			)}
		</div>
	);
};

export default InfoBox;
