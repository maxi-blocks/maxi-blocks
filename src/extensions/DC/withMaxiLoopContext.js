import { createHigherOrderComponent, pure } from '@wordpress/compose';
import LoopContext from './loopContext';

const withMaxiLoopContext = createHigherOrderComponent(
	WrappedComponent =>
		pure(props => (
			<LoopContext.Consumer>
				{context => (
					<WrappedComponent loopContext={context} {...props} />
				)}
			</LoopContext.Consumer>
		)),
	'withMaxiLoopContext'
);

export default withMaxiLoopContext;
