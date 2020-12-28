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
	getColorBackgroundObject,
	getBoxShadowObject,
	getAlignmentFlexObject,
	getTransformObject,
	getAlignmentTextObject,
	setTextCustomFormats,
	getLastBreakpointValue,
	getIconObject,
} from '../../utils';
import { MaxiBlock, Toolbar, MotionPreview } from '../../components';
import { getFormatValue } from '../../extensions/text/formats';

/**
 * External dependencies
 */
import classnames from 'classnames';
import { isNil, isEmpty } from 'lodash';

/**
 * Content
 */
class edit extends MaxiBlock {
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

	get getObject() {
		const { uniqueID, typography, typographyHover } = this.props.attributes;

		let response = {
			[this.props.attributes.uniqueID]: this.getWrapperObject,
			[`${this.props.attributes.uniqueID} .maxi-button-block__button`]: this
				.getNormalObject,
			[`${this.props.attributes.uniqueID} .maxi-button-block__button:hover`]: this
				.getHoverObject,
			[`${this.props.attributes.uniqueID} .maxi-button-block__button i`]: this
				.getIconObject,
		};

		response = Object.assign(
			response,
			setTextCustomFormats(
				[
					`${uniqueID} .maxi-button-block__button`,
					`${uniqueID} .maxi-button-block__button li`,
				],
				typography,
				typographyHover
			)
		);

		return response;
	}

	get getIconObject() {
		const {
			icon,
			iconPadding,
			iconBorder,
			iconBackground,
		} = this.props.attributes;

		const response = {
			icon: getIconObject(icon),
			padding: iconPadding,
			border: iconBorder,
			borderWidth: iconBorder.borderWidth,
			borderRadius: iconBorder.borderRadius,
			background: getColorBackgroundObject(iconBackground.colorOptions),
		};

		return response;
	}

	get getWrapperObject() {
		const { alignment, zIndex, transform, display } = this.props.attributes;

		const response = {
			alignment: getAlignmentFlexObject(alignment),
			zIndex,
			transform: getTransformObject(transform),
			display,
		};

		return response;
	}

	get getNormalObject() {
		const {
			background,
			alignmentText,
			typography,
			boxShadow,
			border,
			size,
			padding,
			margin,
			zIndex,
			position,
		} = this.props.attributes;

		const response = {
			typography,
			alignmentText: {
				...getAlignmentTextObject(alignmentText),
			},
			background: {
				...getColorBackgroundObject(background.colorOptions),
			},
			boxShadow: getBoxShadowObject(boxShadow),
			border,
			borderWidth: border.borderWidth,
			borderRadius: border.borderRadius,
			size,
			padding,
			margin,
			zIndex,
			position,
			positionOptions: position.options,
		};

		return response;
	}

	get getHoverObject() {
		const {
			backgroundHover,
			typographyHover,
			boxShadowHover,
			borderHover,
		} = this.props.attributes;

		const response = {
			borderWidth: borderHover.borderWidth,
			borderRadius: borderHover.borderRadius,
		};

		if (!isNil(backgroundHover) && !!backgroundHover.status) {
			response.backgroundHover = {
				...getColorBackgroundObject(backgroundHover),
			};
		}

		if (!isNil(boxShadowHover) && !!boxShadowHover.status) {
			response.boxShadowHover = {
				...getBoxShadowObject(boxShadowHover),
			};
		}

		if (!isNil(typographyHover) && !!typographyHover.status) {
			response.typographyHover = {
				...typographyHover,
			};
		}

		if (!isNil(borderHover) && !!borderHover.status) {
			response.borderHover = {
				...borderHover,
			};
		}

		return response;
	}

	get getCustomData() {
		const { uniqueID, motion } = this.props.attributes;

		const motionStatus =
			!!motion.interaction.interactionStatus || !!motion.parallax.status;

		return {
			[uniqueID]: {
				...(motionStatus && { motion }),
			},
		};
	}

	render() {
		const {
			className,
			attributes: {
				uniqueID,
				blockStyle,
				defaultBlockStyle,
				blockStyleBackground,
				extraClassName,
				content,
				motion,
			},
			setAttributes,
			deviceType,
			selectedText,
			generateFormatValue,
		} = this.props;
		const { formatValue, textSelected } = this.state;
		const display = { ...this.props.attributes.display };
		const icon = { ...this.props.attributes.icon };
		const highlight = { ...this.props.attributes.highlight };
		const {
			textHighlight,
			backgroundHighlight,
			borderHighlight,
		} = highlight;

		if (isEmpty(formatValue) || selectedText !== textSelected)
			this.setState({
				formatValue: generateFormatValue(),
				textSelected: selectedText,
			});

		const classes = classnames(
			'maxi-block',
			'maxi-block--backend',
			'maxi-button-block',
			getLastBreakpointValue(display, 'display', deviceType) === 'none' &&
				'maxi-block-display-none',
			blockStyle,
			blockStyle !== 'maxi-custom' &&
				`maxi-background--${blockStyleBackground}`,
			!!textHighlight && 'maxi-highlight--text',
			!!backgroundHighlight && 'maxi-highlight--background',
			!!borderHighlight && 'maxi-highlight--border',
			extraClassName,
			uniqueID,
			className
		);

		const buttonClasses = classnames(
			'maxi-button-block__button',
			icon.position === 'left' && 'maxi-button-block__button--icon-left',
			icon.position === 'right' && 'maxi-button-block__button--icon-right'
		);

		return [
			<Inspector {...this.props} formatValue={formatValue} />,
			<Toolbar {...this.props} formatValue={formatValue} />,
			<MotionPreview motion={motion}>
				<__experimentalBlock
					className={classes}
					data-maxi_initial_block_class={defaultBlockStyle}
					onClick={() =>
						this.setState({ formatValue: generateFormatValue() })
					}
				>
					<div className={buttonClasses}>
						{icon.icon && <i className={icon.icon} />}
						<RichText
							ref={this.buttonRef}
							withoutInteractiveFormatting
							placeholder={__('Set some text…', 'maxi-blocks')}
							className='maxi-button-block__content'
							value={content}
							identifier='content'
							onChange={content => setAttributes({ content })}
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
