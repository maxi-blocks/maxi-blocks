/* eslint-disable @wordpress/no-unsafe-wp-apis */
/**
 * WordPress dependencies
 */
import { __experimentalBlock as Block } from '@wordpress/block-editor';

/**
 * Internal dependencies
 */
import {
	getLastBreakpointAttribute,
	getGroupAttributes,
} from '../../extensions/styles';
import MotionPreview from '../motion-preview';

/**
 * External dependencies
 */
import classnames from 'classnames';

const MaxiBlockComponent = props => {
	const {
		tagName = 'div',
		children,
		blockStyle,
		blockStyleBackground,
		extraClassName,
		uniqueID,
		className,
		displayValue,
		motion,
		fullWidth,
		disableMotion = false,
		...extraProps
	} = props;

	const classes = classnames(
		'maxi-block',
		'maxi-block--backend',
		'maxi-motion-effect',
		`maxi-motion-effect-${uniqueID}`,
		displayValue === 'none' && 'maxi-block-display-none',
		blockStyle,
		blockStyle !== 'maxi-custom' &&
			`maxi-background--${blockStyleBackground}`,
		extraClassName,
		uniqueID,
		className
	);

	return (
		<>
			{!disableMotion && (
				<>
					<MotionPreview
						key={`motion-preview-${uniqueID}`}
						{...motion}
					>
						<Block
							tagName={tagName}
							className={classes}
							data-align={fullWidth}
							{...extraProps}
						>
							{children}
						</Block>
					</MotionPreview>
				</>
			)}
			{disableMotion && (
				<Block
					tagName={tagName}
					className={classes}
					data-align={fullWidth}
					{...extraProps}
				>
					{children}
				</Block>
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

	return {
		blockStyle,
		blockStyleBackground,
		extraClassName,
		uniqueID,
		fullWidth,
		displayValue,
		motion,
	};
};

export default MaxiBlockComponent;
