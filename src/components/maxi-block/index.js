/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable @wordpress/no-unsafe-wp-apis */
/**
 * WordPress dependencies
 */
import { useBlockProps } from '@wordpress/block-editor';
import { forwardRef } from '@wordpress/element';

/**
 * Internal dependencies
 */
import {
	getLastBreakpointAttribute,
	getGroupAttributes,
} from '../../extensions/styles';
import BackgroundDisplayer from '../background-displayer';
import MotionPreview from '../motion-preview';

/**
 * External dependencies
 */
import classnames from 'classnames';
import { isEmpty } from 'lodash';

const WRAPPER_BLOCKS = [
	'maxi-blocks/container-maxi',
	'maxi-blocks/row-maxi',
	'maxi-blocks/group-maxi',
];

const getBlockClassName = blockName => {
	return `maxi-${blockName
		.replace('maxi-blocks/', '')
		.replace('-maxi', '')}-block`;
};

const MainBlock = forwardRef(
	(
		{
			tagName: TagName = 'div',
			children,
			background,
			disableBackground,
			uniqueID,
			isSave,
			...props
		},
		ref
	) => {
		if (isSave)
			return (
				<TagName ref={ref} {...useBlockProps.save(props)}>
					{disableBackground && (
						<BackgroundDisplayer
							{...background}
							blockClassName={uniqueID}
						/>
					)}
					{children}
				</TagName>
			);

		return (
			<TagName {...useBlockProps({ ...props, ref })}>
				{disableBackground && (
					<BackgroundDisplayer
						{...background}
						blockClassName={uniqueID}
					/>
				)}
				{children}
			</TagName>
		);
	}
);

const MaxiBlock = forwardRef((props, ref) => {
	const {
		blockName,
		tagName = 'div',
		children,
		blockStyle,
		extraClassName,
		uniqueID,
		className,
		displayValue,
		fullWidth,
		motion,
		background,
		disableMotion = false,
		disableBackground = false,
		isSave = false,
		classes: customClasses,
		paletteClasses,
		hasArrow,
		hasLink,
		...extraProps
	} = props;

	// Adds hover class to show the appender on wrapper blocks
	if (WRAPPER_BLOCKS.includes(blockName) && ref?.current) {
		const el = ref.current;
		const appenders = Array.from(
			el.querySelectorAll('.block-list-appender')
		);
		const appender = appenders[appenders.length - 1];

		if (appender) {
			el.addEventListener('mouseover', () => {
				el.classList.add('maxi-block--hovered');
				appender.classList.add('block-list-appender--show');
			});

			el.addEventListener('mouseout', () => {
				el.classList.remove('maxi-block--hovered');
				appender.classList.remove('block-list-appender--show');
			});
		}
	}

	const classes = classnames(
		'maxi-block',
		blockName && getBlockClassName(blockName),
		!isSave && 'maxi-block--backend',
		((motion['hover-type'] && motion['hover-type'] !== 'none') ||
			motion['shape-divider-top-status'] ||
			motion['shape-divider-bottom-status'] ||
			motion['parallax-status'] ||
			motion['number-counter-status'] ||
			motion['motion-status'] ||
			(motion['entrance-type'] && motion['entrance-type'] !== 'none')) &&
			'maxi-motion-effect',
		((motion['hover-type'] && motion['hover-type'] !== 'none') ||
			motion['shape-divider-top-status'] ||
			motion['shape-divider-bottom-status'] ||
			motion['parallax-status'] ||
			motion['number-counter-status'] ||
			motion['motion-status'] ||
			(motion['entrance-type'] && motion['entrance-type'] !== 'none')) &&
			`maxi-motion-effect-${uniqueID}`,
		blockStyle,
		extraClassName,
		uniqueID,
		className,
		displayValue === 'none' && 'maxi-block-display-none',
		customClasses,
		paletteClasses,
		hasArrow && 'maxi-block--has-arrow',
		hasLink && 'maxi-block--has-link'
	);
	const blockProps = {
		tagName,
		className: classes,
		'data-align': fullWidth,
		...extraProps,
	};

	if (!disableMotion && !isSave)
		return (
			<MotionPreview key={`motion-preview-${uniqueID}`} {...motion}>
				<MainBlock
					ref={ref}
					id={uniqueID}
					key={`maxi-block-${uniqueID}`}
					uniqueID={uniqueID}
					background={background}
					disableBackground={!disableBackground}
					isSave={isSave}
					{...blockProps}
				>
					{children}
				</MainBlock>
			</MotionPreview>
		);

	return (
		<MainBlock
			ref={ref}
			id={uniqueID}
			key={`maxi-block-${uniqueID}`}
			uniqueID={uniqueID}
			background={background}
			disableBackground={!disableBackground}
			isSave={isSave}
			{...blockProps}
		>
			{children}
		</MainBlock>
	);
});

export const getMaxiBlockBlockAttributes = props => {
	const { name, deviceType, attributes } = props;
	const { blockStyle, extraClassName, uniqueID, fullWidth, linkSettings } =
		attributes;
	const displayValue = getLastBreakpointAttribute(
		'display',
		deviceType,
		attributes,
		false,
		true
	);
	const motion = {
		...getGroupAttributes(attributes, [
			'motion',
			'entrance',
			'numberCounter',
			'parallax',
			'shapeDivider',
			'hover',
		]),
	};

	const background = {
		...getGroupAttributes(attributes, [
			'background',
			'backgroundColor',
			'backgroundImage',
			'backgroundVideo',
			'backgroundGradient',
			'backgroundSVG',
			'backgroundHover',
			'backgroundColorHover',
			'backgroundImageHover',
			'backgroundVideoHover',
			'backgroundGradientHover',
			'backgroundSVGHover',
		]),
	};
	const hasArrow = props.attributes['arrow-status'] || false;
	const hasLink =
		linkSettings && !isEmpty(linkSettings) && !isEmpty(linkSettings.url);

	return {
		blockName: name,
		blockStyle,
		extraClassName,
		uniqueID,
		fullWidth,
		displayValue,
		motion,
		background,
		hasArrow,
		hasLink,
	};
};

export default MaxiBlock;
