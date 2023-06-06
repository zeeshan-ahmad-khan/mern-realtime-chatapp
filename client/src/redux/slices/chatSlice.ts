import { createSlice } from "@reduxjs/toolkit";

const chatSlice = createSlice({
    name: "chat",
    initialState: {
        chatId: "",
        receiver: {} as any
    },
    reducers: {
        setChatData: (state, action) => {
            const { chatId, receiver } = action.payload;
            state.chatId = chatId
            state.receiver = receiver
        }
    }
})

export default chatSlice.reducer;
export const { setChatData } = chatSlice.actions;