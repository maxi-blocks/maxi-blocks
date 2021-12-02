/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable @wordpress/no-unsafe-wp-apis */
/**
 * WordPress dependencies
 */
import { useBlockProps } from '@wordpress/block-editor';
import { forwardRef, useEffect, useState } from '@wordpress/element';
import { select, useSelect } from '@wordpress/data';

/**
 * Internal dependencies
 */
import {
	getLastBreakpointAttribute,
	getGroupAttributes,
	getHasParallax,
} from '../../extensions/styles';
import BackgroundDisplayer from '../background-displayer';

/**
 * External dependencies
 */
import classnames from 'classnames';
import { isEmpty } from 'lodash';

/**
 * Styles
 */
import './style.scss';
import './editor.scss';

const WRAPPER_BLOCKS = [
	'maxi-blocks/container-maxi',
	'maxi-blocks/row-maxi',
	'maxi-blocks/group-maxi',
];

const INNER_BLOCKS = ['maxi-blocks/group-maxi', 'maxi-blocks/column-maxi'];

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
			anchorLink,
			...props
		},
		ref
	) => {
		if (isSave)
			return (
				<TagName ref={ref} {...useBlockProps.save(props)}>
					{!isEmpty(anchorLink) && (
						<span id={anchorLink} className='maxi-block-anchor' />
					)}
					{disableBackground && (
						<BackgroundDisplayer isSave {...background} />
					)}
					{children}
				</TagName>
			);

		return (
			<TagName {...useBlockProps({ ...props, ref })}>
				{!isEmpty(anchorLink) && <span id={anchorLink} />}
				{disableBackground && <BackgroundDisplayer {...background} />}
				{children}
			</TagName>
		);
	}
);

const MaxiBlock = forwardRef((props, ref) => {
	const {
		clientId,
		blockName,
		tagName = 'div',
		children,
		blockStyle,
		extraClassName,
		anchorLink,
		uniqueID,
		className,
		displayValue,
		blockFullWidth,
		motion,
		background,
		disableBackground = false,
		isSave = false,
		classes: customClasses,
		paletteClasses,
		hasArrow,
		hasLink,
		hasScrollEffects,
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

	// Not usable/necessary on save blocks
	const [isDragOverBlock, setIsDragOverBlock] = isSave ? [] : useState(false);

	// Not usable/necessary on save blocks
	const { isDragging, isDraggingOrigin } =
		isSave || (!isSave && !INNER_BLOCKS.includes(blockName))
			? { isDragging: false, isDraggingOrigin: false }
			: useSelect(select => {
					const {
						isDraggingBlocks,
						getDraggedBlockClientIds,
						getBlockParentsByBlockName,
					} = select('core/block-editor');

					const draggedBlockClientIds = getDraggedBlockClientIds();
					const blockParents = getBlockParentsByBlockName(
						draggedBlockClientIds[0],
						INNER_BLOCKS,
						true
					);
					const isDraggingOrigin = blockParents.includes(clientId);

					return {
						isDragging: isDraggingBlocks(),
						isDraggingOrigin,
					};
			  });

	if (!isSave && !INNER_BLOCKS.includes(blockName))
		useEffect(() => {
			if (!isDragging && isDragOverBlock) setIsDragOverBlock(false);
		}, [isDragging]);

	const classes = classnames(
		'maxi-block',
		!isSave && 'maxi-block--backend',
		blockName && getBlockClassName(blockName),
		((motion['hover-type'] && motion['hover-type'] !== 'none') ||
			motion['shape-divider-top-status'] ||
			motion['shape-divider-bottom-status'] ||
			motion['number-counter-status'] ||
			motion['motion-status'] ||
			getHasParallax(background['background-layers'])) &&
			'maxi-motion-effect',
		(motion['hover-type'] && motion['hover-type'] !== 'none') ||
			motion['shape-divider-top-status'] ||
			motion['shape-divider-bottom-status'] ||
			motion['number-counter-status'] ||
			motion['motion-status'] ||
			(getHasParallax(background['background-layers']) &&
				`maxi-motion-effect-${uniqueID}`),
		hasScrollEffects && 'maxi-scroll-effect',
		blockStyle,
		extraClassName,
		uniqueID,
		className,
		displayValue === 'none' && 'maxi-block-display-none',
		customClasses,
		paletteClasses,
		hasArrow && 'maxi-block--has-arrow',
		hasLink && 'maxi-block--has-link',
		isDragging && isDragOverBlock && 'maxi-block--is-drag-over'
	);

	const blockProps = {
		tagName,
		className: classes,
		'data-align': blockFullWidth,
		ref,
		id: uniqueID,
		key: `maxi-block-${uniqueID}`,
		uniqueID,
		anchorLink,
		background,
		disableBackground: !disableBackground,
		isSave,
		...(INNER_BLOCKS.includes(blockName) && {
			onDragLeave: ({ target }) => {
				if (
					isDragOverBlock &&
					(!ref.current.isSameNode(target) ||
						isDraggingOrigin ||
						!ref.current.contains(target))
				)
					setIsDragOverBlock(false);
			},
			onDragOver: () => {
				const { getBlock } = select('core/block-editor');
				const { innerBlocks } = getBlock(clientId);

				const isLastOnHierarchy = isEmpty(innerBlocks)
					? true
					: innerBlocks.every(
							({ name }) =>
								![
									...INNER_BLOCKS,
									'maxi-blocks/row-maxi',
								].includes(name)
					  );

				if (
					!isDragOverBlock &&
					!isSave &&
					INNER_BLOCKS.includes(blockName) &&
					isLastOnHierarchy
				)
					setIsDragOverBlock(true);
			},
		}),
		...extraProps,
	};

	return <MainBlock {...blockProps}>{children}</MainBlock>;
});

export const getMaxiBlockAttributes = props => {
	const { name, deviceType, attributes, clientId } = props;
	const {
		blockStyle,
		extraClassName,
		anchorLink,
		uniqueID,
		blockFullWidth,
		linkSettings,
	} = attributes;

	const motion = {
		...getGroupAttributes(attributes, [
			'motion',
			'numberCounter',
			'shapeDivider',
			'hover',
		]),
	};

	const background = {
		...getGroupAttributes(attributes, ['blockBackground']),
	};
	const hasArrow = props.attributes['arrow-status'] || false;
	const hasLink =
		linkSettings && !isEmpty(linkSettings) && !isEmpty(linkSettings.url);

	const hasScrollEffects = !isEmpty(
		props.attributes['scroll-active-general']
	);

	const scrollSettingsShared = [
		'speed',
		'delay',
		'easing',
		'viewport-top',
		'status-reverse',
	];

	const scrollSettingsVertical = [
		...scrollSettingsShared,
		'offset-start',
		'offset-mid',
		'offset-end',
	];

	const scrollSettingsRotate = [
		...scrollSettingsShared,
		'rotate-start',
		'rotate-mid',
		'rotate-end',
	];

	const scrollSettingsFade = [
		...scrollSettingsShared,
		'opacity-start',
		'opacity-mid',
		'opacity-end',
	];

	const scrollSettingsBlur = [
		...scrollSettingsShared,
		'blur-start',
		'blur-mid',
		'blur-end',
	];

	const scrollSettingsScale = [
		...scrollSettingsShared,
		'scale-start',
		'scale-mid',
		'scale-end',
	];

	const scrollTypes = [
		'vertical',
		'horizontal',
		'rotate',
		'scale',
		'fade',
		'blur',
	];

	const dataScrollTypeValue = () => {
		let responseString = '';
		scrollTypes.forEach(type => {
			if (attributes[`scroll-status-${type}-general`])
				responseString += `${type} `;
		});
		return responseString?.trim();
	};

	const enabledScrolls = dataScrollTypeValue();

	const scroll = {};

	if (!isEmpty(enabledScrolls)) {
		scroll['data-scroll-effect-type'] = enabledScrolls;

		scrollTypes.forEach(type => {
			if (enabledScrolls.includes(type)) {
				let responseString = '';
				let scrollSettings;

				switch (type) {
					case 'vertical':
						scrollSettings = scrollSettingsVertical;
						break;
					case 'horizontal':
						scrollSettings = scrollSettingsVertical;
						break;
					case 'rotate':
						scrollSettings = scrollSettingsRotate;
						break;
					case 'fade':
						scrollSettings = scrollSettingsFade;
						break;
					case 'blur':
						scrollSettings = scrollSettingsBlur;
						break;
					case 'scale':
						scrollSettings = scrollSettingsScale;
						break;
					default:
						break;
				}

				scrollSettings.forEach(setting => {
					const scrollSettingValue =
						attributes[`scroll-${setting}-${type}-general`];

					responseString += `${scrollSettingValue} `;
				});

				if (!isEmpty(responseString))
					scroll[`data-scroll-effect-${type}-general`] =
						responseString.trim();
			}
		});
	}

	const displayValue = getLastBreakpointAttribute(
		'display',
		deviceType,
		attributes,
		false,
		true
	);

	return {
		clientId,
		blockName: name,
		blockStyle,
		extraClassName,
		anchorLink,
		uniqueID,
		blockFullWidth,
		displayValue,
		motion,
		background,
		hasArrow,
		hasLink,
		hasScrollEffects,
		...scroll,
	};
};

export default MaxiBlock;
