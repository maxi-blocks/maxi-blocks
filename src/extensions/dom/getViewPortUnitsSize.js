import getEditorWrapper from './getEditorWrapper';

const getVwSize = () => getEditorWrapper().offsetWidth * 0.01;
const getVhSize = () => window.innerHeight * 0.01;

export { getVwSize, getVhSize };
