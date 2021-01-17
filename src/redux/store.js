import { configureStore } from "@reduxjs/toolkit";
import bankSectionReducer from "./bankSectionSlice";

export default configureStore({
    reducer:{
        bankSection: bankSectionReducer
    }
})