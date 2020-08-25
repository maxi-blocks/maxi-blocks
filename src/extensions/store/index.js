/**
 * WordPress dependencies
 */
const { apiFetch } = wp;
const { registerStore, select } = wp.data;

/**
 * Register Store
 */

const reducer = (state = { breakpoints: {}, meta: {} }, action) => {
    switch (action.type) {
        case 'SEND_POST_STYLES':
            return {
                ...state,
                meta: action.meta,
            };
        case 'SEND_BREAKPOINTS':
            return {
                ...state,
                breakpoints: action.breakpoints,
            };
        case 'SAVE_POST_STYLES':
            controls.SAVE_POST_STYLES(action);
            return {
                ...state,
                meta: action.meta,
            };
    }

    return state;
};

const actions = {
    receiveMaxiStyles() {
        return {
            type: 'RECEIVE_POST_STYLES',
        };
    },
    sendMaxiStyles(meta) {
        return {
            type: 'SEND_POST_STYLES',
            meta,
        };
    },
    receiveMaxiBreakpoints() {
        return {
            type: 'RECEIVE_BREAKPOINTS',
        };
    },
    sendMaxiBreakpoints(breakpoints) {
        return {
            type: 'SEND_BREAKPOINTS',
            breakpoints,
        };
    },
    saveMaxiStyles(meta, update = false) {
        return {
            type: 'SAVE_POST_STYLES',
            meta,
            update,
        };
    },
};

const controls = {
    async RECEIVE_POST_STYLES() {
        const id = select('core/editor').getCurrentPostId();

        return await apiFetch({ path: `/maxi-blocks/v1.0/post/${id}` });
    },
    async RECEIVE_BREAKPOINTS() {
        return await apiFetch({ path: '/maxi-blocks/v1.0/breakpoints/' });
    },
    async SAVE_POST_STYLES(action) {
        const id = select('core/editor').getCurrentPostId();

        await apiFetch({
            path: '/maxi-blocks/v1.0/post',
            method: 'POST',
            data: {
                id,
                meta: JSON.stringify(action.meta),
                update: action.update,
            },
        });
    },
};

const selectors = {
    receiveMaxiStyles(state) {
        if (state) return state.meta;
    },
    receiveMaxiBreakpoints(state) {
        if (state) return state.breakpoints;
    },
};

const resolvers = {
    *receiveMaxiStyles() {
        const maxiStyles = yield actions.receiveMaxiStyles();
        return actions.sendMaxiStyles(maxiStyles);
    },
    *receiveMaxiBreakpoints() {
        const maxiBreakpoints = yield actions.receiveMaxiBreakpoints();
        return actions.sendMaxiBreakpoints(maxiBreakpoints);
    },
};

const store = registerStore('maxiBlocks', {
    reducer,
    actions,
    selectors,
    controls,
    resolvers,
});
