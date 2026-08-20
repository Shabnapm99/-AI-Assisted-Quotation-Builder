import { createSlice } from '@reduxjs/toolkit'

const quoteSlice = createSlice({
    name: 'quote',
    initialState: {
        quotes: [],
        currentQuote: null,
        isEditing: false,
        uniqueId: null
    },
    reducers: {
        setQuotes: (state, action) => {
            state.quotes = action.payload;
        },
        setCurrentQuote: (state, action) => {
            state.currentQuote = action.payload
        },
        clearCurrentQuote: (state) => {
            state.currentQuote = null
        },
        setIsEditing: (state, action) => {
            state.isEditing = action.payload.boolean;
            state.uniqueId = action.payload.id;
        },
        removeQuote: (state, action) => {
            let quoteId = action.payload
            state.quotes = state.quotes.filter((quote) => quote._id != quoteId)
        },
        addQuoteToList: (state, action) => {
            state.quotes = [action.payload, ...state.quotes];
        },
        updateQuoteInList: (state, action) => {
            const updated = action.payload;
            state.quotes = state.quotes.map((q) => q._id === updated._id ? { ...q, ...updated } : q);
            if (state.currentQuote && state.currentQuote._id === updated._id) {
                state.currentQuote = { ...state.currentQuote, ...updated };
            }
        },
        resetQuoteForm: (state) => {
            state.isEditing = false;
            state.uniqueId = null;
        }
    }
})

export const { setQuotes, setCurrentQuote, clearCurrentQuote, setIsEditing, removeQuote, addQuoteToList, updateQuoteInList, resetQuoteForm } = quoteSlice.actions
export default quoteSlice.reducer