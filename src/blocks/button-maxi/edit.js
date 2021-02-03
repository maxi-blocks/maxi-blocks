/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { compose } = wp.compose;
const { withSelect, withDispatch } = wp.data;
const { __experimentalBlock, RichText } = wp.blockEditor;
const { createRef } = wp.element;

/**
 * Internal dependencies
 */
import Inspector from './inspector';
import {
	MaxiBlock,
	Toolbar,
	MotionPreview,
	BackgroundDisplayer,
} from '../../components';
import { getFormatValue } from '../../extensions/text/formats';
import {
	getGroupAttributes,
	getLastBreakpointAttribute,
} from '../../extensions/styles';
import getStyles from './styles';

/**
 * External dependencies
 */
import classnames from 'classnames';
import { isEmpty } from 'lodash';

/**
 * Content
 */
class edit extends MaxiBlock {
	get getStylesObject() {
		return getStyles(this.props.attributes);
	}

	constructor(props) {
		super(props);
		this.buttonRef = createRef();
	}

	componentDidMount() {
		this.buttonRef.current.focus();
	}

	state = {
		formatValue: this.props.generateFormatValue() || {},
		textSelected: '',
	};

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
		const {
			attributes,
			className,
			deviceType,
			setAttributes,
			selectedText,
			generateFormatValue,
		} = this.props;
		const {
			uniqueID,
			blockStyle,
			defaultBlockStyle,
			blockStyleBackground,
			extraClassName,
		} = attributes;

		const { formatValue, textSelected } = this.state;

		if (isEmpty(formatValue) || selectedText !== textSelected)
			this.setState({
				formatValue: generateFormatValue(),
				textSelected: selectedText,
			});

		const classes = classnames(
			'maxi-block',
			'maxi-block--backend',
			'maxi-button-block',
			getLastBreakpointAttribute('display', deviceType, attributes) ===
				'none' && 'maxi-block-display-none',
			blockStyle,
			blockStyle !== 'maxi-custom' &&
				`maxi-background--${blockStyleBackground}`,
			!!attributes['text-highlight'] && 'maxi-highlight--text',
			!!attributes['background-highlight'] &&
				'maxi-highlight--background',
			!!attributes['border-highlight'] && 'maxi-highlight--border',
			extraClassName,
			uniqueID,
			className
		);

		const buttonClasses = classnames(
			'maxi-button-block__button',
			attributes['icon-position'] === 'left' &&
				'maxi-button-block__button--icon-left',
			attributes['icon-position'] === 'right' &&
				'maxi-button-block__button--icon-right'
		);

		return [
			<Inspector {...this.props} formatValue={formatValue} />,
			<Toolbar {...this.props} formatValue={formatValue} />,
			<MotionPreview {...getGroupAttributes(attributes, 'motion')}>
				<__experimentalBlock
					className={classes}
					data-maxi_initial_block_class={defaultBlockStyle}
					onClick={() =>
						this.setState({ formatValue: generateFormatValue() })
					}
				>
					<div className={buttonClasses}>
						{!isEmpty(attributes['icon-name']) && (
							<i className={attributes['icon-name']} />
						)}
						<BackgroundDisplayer
							{...getGroupAttributes(attributes, [
								'background',
								'backgroundColor',
								'backgroundGradient',
								'backgroundHover',
								'backgroundColorHover',
								'backgroundGradientHover',
							])}
						/>
						<RichText
							ref={this.buttonRef}
							withoutInteractiveFormatting
							placeholder={__('Set some text…', 'maxi-blocks')}
							className='maxi-button-block__content'
							value={attributes.buttonContent}
							identifier='content'
							onChange={buttonContent =>
								setAttributes({ buttonContent })
							}
							placeholder={__('Set some text…', 'maxi-blocks')}
							withoutInteractiveFormatting
						/>
					</div>
				</__experimentalBlock>
			</MotionPreview>,
		];
	}
}

const editSelect = withSelect(select => {
	const selectedText = window.getSelection().toString();
	const deviceType = select('maxiBlocks').receiveMaxiDeviceType();

	return {
		// The 'selectedText' attribute is a trigger for generating the formatValue
		selectedText,
		deviceType,
	};
});

const editDispatch = withDispatch(
	(dispatch, { attributes: { isList, typeOfList } }) => {
		const generateFormatValue = () => {
			const formatElement = {
				multilineTag: isList ? 'li' : undefined,
				multilineWrapperTags: isList ? typeOfList : undefined,
				__unstableIsEditableTree: true,
			};
			const formatValue = getFormatValue(formatElement);

			return formatValue;
		};

		return {
			generateFormatValue,
		};
	}
);

export default compose(editSelect, editDispatch)(edit);
