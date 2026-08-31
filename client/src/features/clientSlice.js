import { createSlice } from '@reduxjs/toolkit'

const clientSlice = createSlice({
    name: 'client',
    initialState: {
        clients: [],
        selectedClient: null,
        isEditing: false,
        uniqueId: null,
        searchQuery: ''
    },
    reducers: {
        setClients: (state, action) => {
            state.clients = action.payload;
        },
        setSelectedClient: (state, action) => {
            state.selectedClient = action.payload
        },
        clearSelectedClient: (state) => {
            state.selectedClient = null
        },
        setIsEditing: (state, action) => {
            state.isEditing = action.payload.boolean;
            state.uniqueId = action.payload.id;
        },
        removeClient: (state, action) => {
            let clientId = action.payload
            state.clients = state.clients.filter((client) => client._id != clientId)
        },
        resetClientForm: (state) => {
            state.isEditing = false;
            state.uniqueId = null;
        },
        setClientSearchQuery: (state, action) => {
            state.searchQuery = action.payload;
        }
    }
})

export const { setClients, setSelectedClient, clearSelectedClient, setIsEditing, removeClient, resetClientForm, setClientSearchQuery } = clientSlice.actions
export default clientSlice.reducer