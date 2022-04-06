/**
 * Internal dependencies
 */
import { openSidebarAccordion } from '../../extensions/inspector-path';

/**
 * External dependencies
 */
import classnames from 'classnames';
import { isEmpty, uniqueId } from 'lodash';

/**
 * Styles
 */
import './editor.scss';

const InfoBox = ({ className, message, links, tab = 0 }) => {
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
		</div>
	);
};

export default InfoBox;
