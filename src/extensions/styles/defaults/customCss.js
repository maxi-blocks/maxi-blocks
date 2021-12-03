import breakpointObjectCreator from '../breakpointObjectCreator';

const rawCustomCss = {
	'custom-css': {
		type: 'object',
	},
};

const customCss = breakpointObjectCreator({
	obj: rawCustomCss
});

export default customCss;
