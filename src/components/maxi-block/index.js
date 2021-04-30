/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable @wordpress/no-unsafe-wp-apis */
/**
 * WordPress dependencies
 */
import {
	__experimentalBlock as Block,
	useBlockProps,
} from '@wordpress/block-editor';

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

const MainBlock = ({
	tagName: TagName = 'div',
	children,
	background,
	disableBackground,
	uniqueID,
	...props
}) => {
	if (!useBlockProps)
		return (
			<Block tagName={TagName} {...props}>
				<BackgroundDisplayer
					{...background}
					blockClassName={uniqueID}
				/>
				{children}
			</Block>
		);

	return (
		<TagName {...useBlockProps(props)}>
			<BackgroundDisplayer {...background} blockClassName={uniqueID} />
			{children}
		</TagName>
	);
};

const MaxiBlock = props => {
	const {
		tagName = 'div',
		children,
		blockStyle,
		blockStyleBackground,
		extraClassName,
		uniqueID,
		className,
		displayValue,
		fullWidth,
		motion,
		background,
		highlights,
		disableMotion = false,
		disableBackground = false,
		...extraProps
	} = props;

	const classes = classnames(
		'maxi-block',
		'maxi-block--backend',
		'maxi-motion-effect',
		`maxi-motion-effect-${uniqueID}`,
		blockStyle,
		extraClassName,
		uniqueID,
		className,
		displayValue === 'none' && 'maxi-block-display-none',
		blockStyle !== 'maxi-custom' &&
			`maxi-background--${blockStyleBackground}`,
		!!highlights['border-highlight'] && 'maxi-highlight--border',
		!!highlights['text-highlight'] && 'maxi-highlight--text',
		!!highlights['background-highlight'] && 'maxi-highlight--background'
	);

	const blockProps = {
		tagName,
		className: classes,
		'data-align': fullWidth,
		...extraProps,
	};

	return (
		<>
			{!disableMotion && (
				<>
					<MotionPreview
						key={`motion-preview-${uniqueID}`}
						{...motion}
					>
						<MainBlock
							{...blockProps}
							background={background}
							disableBackground={
								disableBackground ||
								!highlights['background-highlight']
							}
						>
							{children}
						</MainBlock>
					</MotionPreview>
				</>
			)}
			{disableMotion && (
				<MainBlock
					{...blockProps}
					background={background}
					disableBackground={
						disableBackground || !highlights['background-highlight']
					}
				>
					{children}
				</MainBlock>
			)}
		</>
	);
};

export const getMaxiBlockBlockAttributes = props => {
	const { deviceType, attributes } = props;
	const {
		blockStyle,
		blockStyleBackground,
		extraClassName,
		uniqueID,
		fullWidth,
	} = attributes;
	const displayValue = getLastBreakpointAttribute(
		'display',
		deviceType,
		attributes
	);
	const motion = { ...getGroupAttributes(attributes, 'motion') };
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
	const highlights = { ...getGroupAttributes(attributes, 'highlight') };

	return {
		blockStyle,
		blockStyleBackground,
		extraClassName,
		uniqueID,
		fullWidth,
		displayValue,
		motion,
		background,
		highlights,
	};
};

export default MaxiBlock;
