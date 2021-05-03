/**
 * WordPress dependencies
 */
import { Button } from '@wordpress/components';

/**
 * Internal dependencies
 */
import MaxiBlock, {
	getMaxiBlockBlockAttributes,
} from '../../components/maxi-block';

/**
 * External dependencies
 */
import classnames from 'classnames';
import { isNil, isEmpty } from 'lodash';

/**
 * Save
 */
const save = props => {
	const { attributes } = props;
	const { uniqueID, linkSettings, buttonContent } = attributes;

	const classes = 'maxi-button-block';

	const linkOpt = !isNil(linkSettings) && linkSettings;

	const linkProps = {
		...linkOpt,
		href: linkOpt.url || '',
		target: linkOpt.opensInNewTab ? '_blank' : '_self',
	};

	const buttonClasses = classnames(
		'maxi-button-block__button',
		attributes['icon-position'] === 'left' &&
			'maxi-button-block__button--icon-left',
		attributes['icon-position'] === 'right' &&
			'maxi-button-block__button--icon-right'
	);

	return (
		<MaxiBlock
			className={classes}
			id={uniqueID}
			{...getMaxiBlockBlockAttributes(props)}
			isSave
			disableBackground
		>
			<Button
				className={buttonClasses}
				{...(!isEmpty(linkProps.href) && linkProps)}
			>
				{!isEmpty(attributes['icon-name']) && (
					<i className={attributes['icon-name']} />
				)}
				<span className='maxi-button-block__content'>
					{buttonContent}
				</span>
			</Button>
		</MaxiBlock>
	);
};

export default save;
