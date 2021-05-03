/* eslint-disable @wordpress/no-unsafe-wp-apis */
/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { compose } from '@wordpress/compose';
import { withSelect, dispatch } from '@wordpress/data';
import { RichText } from '@wordpress/block-editor';

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

	componentDidMount() {
		this.blockRef.current.focus();
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
		const { attributes, setAttributes, clientId } = this.props;
		const { uniqueID } = attributes;

		const classes = 'maxi-button-block';

		const buttonClasses = classnames(
			'maxi-button-block__button',
			attributes['icon-position'] === 'left' &&
				'maxi-button-block__button--icon-left',
			attributes['icon-position'] === 'right' &&
				'maxi-button-block__button--icon-right'
		);

		return [
			<Inspector key={`block-settings-${uniqueID}`} {...this.props} />,
			<Toolbar key={`toolbar-${uniqueID}`} {...this.props} />,
			<MaxiBlock
				key={`maxi-button--${uniqueID}`}
				className={classes}
				{...getMaxiBlockBlockAttributes(this.props)}
				disableBackground
			>
				<div className={buttonClasses}>
					{!isEmpty(attributes['icon-name']) && (
						<i className={attributes['icon-name']} />
					)}
					<RichText
						ref={this.blockRef}
						withoutInteractiveFormatting
						className='maxi-button-block__content'
						value={attributes.buttonContent}
						identifier='content'
						onChange={buttonContent =>
							setAttributes({ buttonContent })
						}
						placeholder={__('Set some text…', 'maxi-blocks')}
					>
						{({ value }) => {
							dispatch('maxiBlocks/text').sendFormatValue(
								value,
								clientId
							);
						}}
					</RichText>
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
