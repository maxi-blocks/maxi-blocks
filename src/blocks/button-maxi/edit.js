/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { compose } from '@wordpress/compose';
import { withSelect } from '@wordpress/data';
import { RichText } from '@wordpress/block-editor';

/**
 * Internal dependencies
 */
import Inspector from './inspector';
import { MaxiBlockComponent, Toolbar, RawHTML } from '../../components';
import MaxiBlock, {
	getMaxiBlockBlockAttributes,
} from '../../components/maxi-block';
import { getGroupAttributes, getPaletteClasses } from '../../extensions/styles';

import getStyles from './styles';

/**
 * External dependencies
 */
import classnames from 'classnames';
import { isEmpty } from 'lodash';

/**
 * Content
 */
class edit extends MaxiBlockComponent {
	get getStylesObject() {
		return getStyles(this.props.attributes);
	}

	get getCustomData() {
		const { uniqueID } = this.props.attributes;

		const motionStatus =
			!!this.props.attributes['motion-status'] ||
			!isEmpty(this.props.attributes['entrance-type']);

		return {
			[uniqueID]: {
				...(motionStatus && {
					...getGroupAttributes(this.props.attributes, [
						'motion',
						'entrance',
					]),
				}),
			},
		};
	}

	render() {
		const { attributes, setAttributes } = this.props;
		const { uniqueID, parentBlockStyle } = attributes;

		const buttonClasses = classnames(
			'maxi-button-block__button',
			attributes['icon-position'] === 'left' &&
				'maxi-button-block__button--icon-left',
			attributes['icon-position'] === 'right' &&
				'maxi-button-block__button--icon-right'
		);

		const paletteClasses = getPaletteClasses(attributes, parentBlockStyle);

		return [
			<Inspector key={`block-settings-${uniqueID}`} {...this.props} />,
			<Toolbar
				key={`toolbar-${uniqueID}`}
				ref={this.blockRef}
				{...this.props}
			/>,
			<MaxiBlock
				key={`maxi-button--${uniqueID}`}
				ref={this.blockRef}
				paletteClasses={paletteClasses}
				{...getMaxiBlockBlockAttributes(this.props)}
				disableBackground
			>
				<div className={buttonClasses}>
					<RichText
						withoutInteractiveFormatting
						className='maxi-button-block__content'
						value={attributes.buttonContent}
						identifier='content'
						onChange={buttonContent =>
							setAttributes({ buttonContent })
						}
						placeholder={__('Set some text…', 'maxi-blocks')}
					/>
					<span className='maxi-button-block__icon'>
						<svg viewBox='0 0 36.1 36.1'>
							<circle fill='' r='17.2' cy='18' cx='18' />
						</svg>
					</span>
				</div>
			</MaxiBlock>,
		];
	}
}

const editSelect = withSelect(select => {
	const deviceType = select('maxiBlocks').receiveMaxiDeviceType();

	return {
		deviceType,
	};
});

export default compose(editSelect)(edit);
