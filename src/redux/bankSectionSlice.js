import { createSlice } from '@reduxjs/toolkit';

export const bankSectionSlice = createSlice({
    name: "bankSection",
    initialState: {
        accountsObj: null,
        accountIdList: undefined,
        total: undefined,
        balanceList: {},
        cash: undefined
    },
    reducers: {
        setAccountObj: (state,action) => {
            state.accountsObj = action.payload
        },
        setAccountIdList: (state, action) => {
            state.accountIdList = action.payload
        },
        setTotal: (state, action) => {
            state.total = action.payload
        },
        setBalanceList: (state, action) => {
            state.balanceList[action.payload[0]] = action.payload[1]
        },
        setCash: (state,action) => {
            state.cash = action.payload
        }
    }
})

export const {setAccountIdList,setAccountObj,setTotal,setBalanceList,setCash} = bankSectionSlice.actions

export default bankSectionSlice.reducer