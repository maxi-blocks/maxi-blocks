/**
 * WordPress dependencies
 */
const { registerStore } = wp.data;
const apiFetch = wp.apiFetch;

/**
 * Register Store
 */
const actions = {
	setGXstyles( GXStyles ) {
		return {
			type: 'SET_USER_ROLES',
			GXStyles,
		};
	},
	receiveGXStyles( path ) {
		return {
			type: 'RECEIVE_USER_ROLES',
			path,
		};
	},
};

const store = registerStore( 'gx', {
	reducer( state = { GXStyles: {} }, action ) {

		switch ( action.type ) {
			case 'SET_USER_ROLES':
				return {
					...state,
					GXStyles: action.GXStyles,
				};
		}

		return state;
	},

	actions,

	selectors: {
		receiveGXStyles( state ) {
			const { GXStyles } = state;
			return GXStyles;
		},
	},

	controls: {
		RECEIVE_USER_ROLES( action ) {
			return apiFetch( { path: action.path } );
		},
	},

	resolvers: {
		* receiveGXStyles( state ) {
            const GXStyles = yield actions.receiveGXStyles( '/gx/v1.0/default-theme-dark/?' + state );
			return actions.setGXstyles( GXStyles );
		},
	},
} );