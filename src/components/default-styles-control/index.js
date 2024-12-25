/**
 * Internal dependencies
 */
import Button from '@components/button';

/**
 * External dependencies
 */
import classnames from 'classnames';
import { uniqueId } from 'lodash';

/**
 * Styles and icons
 */
import './editor.scss';

/**
 * Component
 */
const DefaultStylesControl = props => {
	const { className, items } = props;

	const classes = classnames('maxi-default-styles-control', className);

	return (
		<div className={classes}>
			{items.map(item => {
				const classesItem = classnames(
					'maxi-default-styles-control__button',
					item.className,
					item.activeItem &&
						'maxi-default-styles-control__button--active'
				);

				return (
					<Button
						label={item.label}
						key={uniqueId('maxi-default-styles-control__button-')}
						className={classesItem}
						onClick={() => item.onChange()}
					>
						{item.content}
					</Button>
				);
			})}
		</div>
	);
};

export default DefaultStylesControl;
