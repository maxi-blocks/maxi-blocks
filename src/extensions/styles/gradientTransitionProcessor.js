/**
 * External dependencies
 */
import { isEmpty, isNil, isString } from 'lodash';

const BREAKPOINTS = ['general', 'xxl', 'xl', 'l', 'm', 's', 'xs'];
const BACKGROUND_PROPS = ['background', 'background-color'];
const GRADIENT_REGEX =
	/(?:repeating-)?(?:linear|radial|conic)-gradient\(/i;

const isGradientBackground = value =>
	isString(value) && GRADIENT_REGEX.test(value);

const isPseudoTarget = target =>
	target.includes(':before') ||
	target.includes(':after') ||
	target.includes('::before') ||
	target.includes('::after');

const getBaseTarget = target => target.replace(/:hover/g, '');

const getOverlayTarget = target => `${target}:before`;

const getBackgroundLayerTransitionTargets = target => {
	const baseTarget = getBaseTarget(target);
	const backgroundLayerTarget = baseTarget.replace(
		/ > \.maxi-background-displayer \.maxi-background-displayer__\d+$/,
		' > .maxi-background-displayer > div'
	);

	if (backgroundLayerTarget === baseTarget) return [];

	if (!target.includes(':hover')) return [backgroundLayerTarget];

	return [
		`:hover${backgroundLayerTarget}`,
		`${backgroundLayerTarget}:hover`,
		backgroundLayerTarget,
	];
};

const getBreakpointBackgrounds = targetStyles => {
	const response = {};

	if (isEmpty(targetStyles)) return response;

	Object.values(targetStyles).forEach(styleGroup => {
		if (isEmpty(styleGroup) || typeof styleGroup !== 'object') return;

		BREAKPOINTS.forEach(breakpoint => {
			const breakpointStyles = styleGroup[breakpoint];
			if (isEmpty(breakpointStyles)) return;

			BACKGROUND_PROPS.forEach(prop => {
				if (!isNil(response[breakpoint])) return;
				if (isNil(breakpointStyles[prop])) return;

				response[breakpoint] = {
					prop,
					value: breakpointStyles[prop],
				};
			});
		});
	});

	return response;
};

const getBreakpointProperty = (targetStyles, breakpoint, prop) => {
	if (isEmpty(targetStyles)) return undefined;

	const breakpointIndex = BREAKPOINTS.indexOf(breakpoint);
	const breakpointsToCheck = BREAKPOINTS.slice(
		0,
		breakpointIndex + 1
	).reverse();

	return breakpointsToCheck.reduce((response, currentBreakpoint) => {
		if (!isNil(response)) return response;

		return Object.values(targetStyles).reduce((value, styleGroup) => {
			if (!isNil(value)) return value;

			return styleGroup?.[currentBreakpoint]?.[prop];
		}, undefined);
	}, undefined);
};

const removeBreakpointBackground = (targetStyles, breakpoint) => {
	if (isEmpty(targetStyles)) return;

	Object.values(targetStyles).forEach(styleGroup => {
		const breakpointStyles = styleGroup?.[breakpoint];
		if (isEmpty(breakpointStyles)) return;

		BACKGROUND_PROPS.forEach(prop => {
			delete breakpointStyles[prop];
		});
	});
};

const replaceTransitionProperty = transition => {
	if (!isString(transition)) return undefined;

	return transition
		.split(',')
		.map(item => item.trim().replace(/^\S+/, 'opacity'))
		.join(', ');
};

const getTransition = (styles, target, breakpoint) => {
	const targets = [target, ...getBackgroundLayerTransitionTargets(target)];

	return targets.reduce((response, currentTarget) => {
		if (response) return response;

		return replaceTransitionProperty(
			styles[currentTarget]?.transition?.[breakpoint]?.transition
		);
	}, undefined);
};

const ensureBreakpointObject = (styles, target, group, breakpoint) => {
	if (isNil(styles[target])) styles[target] = {};
	if (isNil(styles[target][group])) styles[target][group] = {};
	if (isNil(styles[target][group][breakpoint]))
		styles[target][group][breakpoint] = {};

	return styles[target][group][breakpoint];
};

const ensureHostStyles = (styles, target, breakpoint) => {
	if (target.includes('.maxi-background-displayer')) return;

	const position = getBreakpointProperty(
		styles[target],
		breakpoint,
		'position'
	);
	if (!isNil(position) && position !== 'static') return;

	const hostStyles = ensureBreakpointObject(
		styles,
		target,
		'gradientTransitionHost',
		breakpoint
	);

	hostStyles.position = 'relative';
};

const addOverlayStyles = ({
	styles,
	baseTarget,
	hoverTarget,
	breakpoint,
	background,
}) => {
	const baseOverlayTarget = getOverlayTarget(baseTarget);
	const hoverOverlayTarget = getOverlayTarget(hoverTarget);
	const baseTransition = getTransition(styles, baseTarget, breakpoint);
	const hoverTransition =
		getTransition(styles, hoverTarget, breakpoint) || baseTransition;

	ensureHostStyles(styles, baseTarget, breakpoint);

	const baseOverlayStyles = ensureBreakpointObject(
		styles,
		baseOverlayTarget,
		'gradientTransitionOverlay',
		breakpoint
	);

	Object.assign(baseOverlayStyles, {
		content: '""',
		position: 'absolute',
		top: '0',
		right: '0',
		bottom: '0',
		left: '0',
		'border-radius': 'inherit',
		'pointer-events': 'none',
		background,
		opacity: 0,
	});

	if (baseTransition) baseOverlayStyles.transition = baseTransition;

	const hoverOverlayStyles = ensureBreakpointObject(
		styles,
		hoverOverlayTarget,
		'gradientTransitionOverlay',
		breakpoint
	);

	hoverOverlayStyles.opacity = 1;
	if (hoverTransition) hoverOverlayStyles.transition = hoverTransition;
};

const applyGradientBackgroundTransitions = styles => {
	Object.keys(styles).forEach(hoverTarget => {
		if (!hoverTarget.includes(':hover') || isPseudoTarget(hoverTarget))
			return;

		const hoverBackgrounds = getBreakpointBackgrounds(styles[hoverTarget]);
		if (isEmpty(hoverBackgrounds)) return;

		const baseTarget = getBaseTarget(hoverTarget);
		const baseBackgrounds = getBreakpointBackgrounds(styles[baseTarget]);

		Object.entries(hoverBackgrounds).forEach(
			([breakpoint, hoverBackground]) => {
				const baseBackground = baseBackgrounds[breakpoint];

				if (
					!isGradientBackground(hoverBackground.value) &&
					!isGradientBackground(baseBackground?.value)
				)
					return;

				addOverlayStyles({
					styles,
					baseTarget,
					hoverTarget,
					breakpoint,
					background: hoverBackground.value,
				});
				removeBreakpointBackground(styles[hoverTarget], breakpoint);
			}
		);
	});

	return styles;
};

export default applyGradientBackgroundTransitions;
