import { createSlice } from "@reduxjs/toolkit"

const todosSlice = createSlice({
    name: 'auth',
    initialState: {
        loggedIn: null,
        email: null,
        password: null,
        name: null,
        restaurantId: null,
        isCustomer: false,
        isAdmin: false,
        wifiPass: null,
    },
    reducers: {
        updateLoginState(state, action) {
            state.loggedIn = action.payload.loggedIn
            state.email = action.payload.email
            state.password = action.payload.password
            state.name = action.payload.name
            state.restaurantId = action.payload.restaurantId
            state.wifiPass = action.payload.wifiPass
        },
        updateConsumerLoginState(state, action) {
            state.loggedIn = action.payload.loggedIn
            state.email = action.payload.email
            state.password = action.payload.password
            state.name = action.payload.name
        },
        updateAdminLoginState(state, action) {
            state.loggedIn = action.payload.loggedIn
            state.email = action.payload.email
            state.password = action.payload.password
            state.name = action.payload.name
            state.isAdmin = true
        },
        setUserIsLoggedIn(state, action) {
            state.loggedIn = action.payload
        },
        setCustomerRestaurantId(state, action) {
            state.restaurantId = action.payload
            state.isCustomer = true
            state.loggedIn = false
        },
        setIsAdmin(state, action) {
            state.isAdmin = action.payload
        }
    }
})

export const { updateLoginState, setUserIsLoggedIn,
    setCustomerRestaurantId, updateConsumerLoginState,
    setIsAdmin, updateAdminLoginState } = todosSlice.actions
export default todosSlice.reducer