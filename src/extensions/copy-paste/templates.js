const templates = {
	background: {
		'Background color': {
			groupAttributes: ['background', 'backgroundColor'],
		},
		'Background gradient': {
			groupAttributes: ['background', 'backgroundGradient'],
		},
		'Background color hover': {
			groupAttributes: ['backgroundHover', 'backgroundColorHover'],
		},
		'Background gradient hover': {
			groupAttributes: ['backgroundHover', 'backgroundGradientHover'],
		},
	},
	border: {
		Border: {
			groupAttributes: 'border',
		},
		'Border width': {
			groupAttributes: 'borderWidth',
		},
		'Border radius': {
			groupAttributes: 'borderRadius',
		},
		'Border hover': {
			groupAttributes: 'borderHover',
		},
		'Border width hover': {
			groupAttributes: 'borderWidthHover',
		},
		'Border radius hover': {
			groupAttributes: 'borderRadiusHover',
		},
	},
	boxShadow: {
		'Box shadow': {
			groupAttributes: 'boxShadow',
		},
		'Box shadow hover': {
			groupAttributes: 'boxShadowHover',
		},
	},
	typography: {
		Typography: {
			groupAttributes: 'typography',
		},
		'Typography hover': {
			groupAttributes: 'typographyHover',
		},
	},
	size: {
		'Full width': {
			props: 'full-width',
			hasBreakpoints: true,
		},
		Size: { groupAttributes: 'size' },
	},
	marginPadding: {
		Margin: {
			groupAttributes: 'margin',
		},
		Padding: {
			groupAttributes: 'padding',
		},
	},
};

export default templates;
