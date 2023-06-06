import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
    name: "auth",
    initialState: {
        email: "",
        user_id: "",
        username: ""
    },
    reducers: {
        setCurrentUser: (state, action) => {
            return { ...state, ...action.payload }
        },
        removeCurrentUser: (state) => {
            return {
                email: "",
                user_id: "",
                username: ""
            }
        }
    },
})

export default authSlice.reducer;
export const { setCurrentUser, removeCurrentUser } = authSlice.actions;