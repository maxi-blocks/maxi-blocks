/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { compose } from '@wordpress/compose';
import { withSelect } from '@wordpress/data';
import { RichText } from '@wordpress/block-editor';
import { RawHTML, createRef } from '@wordpress/element';

/**
 * Internal dependencies
 */
import Inspector from './inspector';
import { MaxiBlockComponent, Toolbar } from '../../components';
import MaxiBlock, {
	getMaxiBlockBlockAttributes,
} from '../../components/maxi-block';
import { getGroupAttributes } from '../../extensions/styles';
import getStyles from './styles';
import IconToolbar from '../../components/toolbar/iconToolbar';

/**
 * External dependencies
 */
import classnames from 'classnames';
import { isEmpty } from 'lodash';

/**
 * Content
 */
class edit extends MaxiBlockComponent {
	constructor(...args) {
		super(...args);

		this.iconRef = createRef(null);
	}

	typingTimeout = 0;

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
		const { uniqueID } = attributes;

		const buttonClasses = classnames(
			'maxi-button-block__button',
			attributes['icon-content'] &&
				attributes['icon-position'] === 'left' &&
				'maxi-button-block__button--icon-left',
			attributes['icon-content'] &&
				attributes['icon-position'] === 'right' &&
				'maxi-button-block__button--icon-right'
		);

		return [
			<Inspector
				key={`block-settings-${uniqueID}`}
				{...this.props}
				propsToAvoid={['buttonContent', 'formatValue']}
			/>,
			<Toolbar
				key={`toolbar-${uniqueID}`}
				ref={this.blockRef}
				{...this.props}
				propsToAvoid={['buttonContent', 'formatValue']}
			/>,
			<MaxiBlock
				key={`maxi-button--${uniqueID}`}
				ref={this.blockRef}
				{...getMaxiBlockBlockAttributes(this.props)}
				disableBackground
			>
				<div className={buttonClasses}>
					<RichText
						className='maxi-button-block__content'
						value={attributes.buttonContent}
						identifier='content'
						onChange={buttonContent => {
							if (this.typingTimeout) {
								clearTimeout(this.typingTimeout);
							}

							this.typingTimeout = setTimeout(() => {
								setAttributes({ buttonContent });
							}, 100);
						}}
						placeholder={__('Set some text…', 'maxi-blocks')}
						withoutInteractiveFormatting
						__unstableDisableFormats
					/>
					{attributes['icon-content'] && (
						<>
							<IconToolbar
								key={`icon-toolbar-${uniqueID}`}
								ref={this.iconRef}
								{...this.props}
								propsToAvoid={['buttonContent', 'formatValue']}
							/>
							<div
								ref={this.iconRef}
								className='maxi-button-block__icon'
							>
								<RawHTML>{attributes['icon-content']}</RawHTML>
							</div>
						</>
					)}
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
