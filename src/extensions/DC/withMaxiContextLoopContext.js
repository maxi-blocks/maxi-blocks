import { createHigherOrderComponent, pure } from '@wordpress/compose';
import LoopContext from './loopContext';

const withMaxiContextLoopContext = createHigherOrderComponent(
	WrappedComponent =>
		pure(props => (
			<LoopContext.Consumer>
				{context => (
					<WrappedComponent loopContext={context} {...props} />
				)}
			</LoopContext.Consumer>
		)),
	'withMaxiContextLoopContext'
);

export default withMaxiContextLoopContext;
