import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Collection {
    id: string;
    name: string;
    selectors: number[];
    chapters: any[];
}

interface CollectionsState {
    collections: Collection[];
}

const initialState: CollectionsState = {
    collections: typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('collections') || '[]') : [],
};

const collectionsSlice = createSlice({
    name: 'collections',
    initialState,
    reducers: {
        addCollection: (state, action: PayloadAction<Collection>) => {
            state.collections.push(action.payload);
            localStorage.setItem('collections', JSON.stringify(state.collections));
        },
        updateCollection: (state, action: PayloadAction<Collection>) => {
            const index = state.collections.findIndex(
                (collection) => collection.id === action.payload.id
            );
            if (index !== -1) {
                state.collections[index] = action.payload;
                localStorage.setItem('collections', JSON.stringify(state.collections));
            }
        },
        updateCollectionSelectors: (state, action: PayloadAction<{ id: string; selectors: number[] }>) => {
            const collection = state.collections.find(
                (collection) => collection.id === action.payload.id
            );
            if (collection) {
                collection.selectors = action.payload.selectors;
                localStorage.setItem('collections', JSON.stringify(state.collections));
            }
        },
        deleteCollection: (state, action: PayloadAction<string>) => {
            state.collections = state.collections.filter(
                (collection) => collection.id !== action.payload
            );
            localStorage.setItem('collections', JSON.stringify(state.collections));
        },
    },
});

export const {
    addCollection,
    updateCollection,
    updateCollectionSelectors,
    deleteCollection,
} = collectionsSlice.actions;

export default collectionsSlice.reducer;
