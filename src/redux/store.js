import { configureStore, combineReducers } from "@reduxjs/toolkit";
import authReducer from "./auth/authSlice";
import applicationReducer from "./ticket/ticketSlice";
import accountReducer from "./account/accountSlice";
import employeeReducer from "./employee/employeeSlice";
import branchReducer from "./branch/branchSlice";
import addressReducer from "./address/addressSlice";
import workscheduleReducer from "./workschedule/workscheduleSlice";
import brandReducer from "./brand/brandSlice";
import dashboardReducer from "./dashboard/dashboardSlice";

import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";
import autoMergeLevel2 from "redux-persist/es/stateReconciler/autoMergeLevel2";
const persistConfig = {
  key: "root",
  storage,
  stateReconciler: autoMergeLevel2
};
const rootReducer = combineReducers({ 
    auth: authReducer, 
    dashboard: dashboardReducer, 
    accounts: accountReducer,
    employees: employeeReducer,
    branchs: branchReducer,
    addresss: addressReducer ,
    workschedule: workscheduleReducer,
    application: applicationReducer,
    brand: brandReducer
});
const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
})

export let persistor = persistStore(store);