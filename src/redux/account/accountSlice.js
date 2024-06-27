import { createSlice } from "@reduxjs/toolkit";

const accountSlice = createSlice({
    name:"accounts",
    initialState:{
        accounts: {
            allAccounts:null,
            isFetching:false,
            error:false
        },
        msg:"",
    },
    reducers:{
        getAccountsStart: (state)=>{
            state.accounts.isFetching = true;
        },
        getAccountsSuccess: (state,action) =>{
            state.accounts.isFetching = false;
            state.accounts.allAccounts = action.payload;
        },
        getAccountsFailed: (state) => {
            state.accounts.isFetching = false;
            state.accounts.error = true;
        }
    }
})

export const {
    getAccountsStart,
    getAccountsSuccess,
    getAccountsFailed
} = accountSlice.actions;

export default accountSlice.reducer;