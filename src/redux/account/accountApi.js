import axios from "axios";
import { getAccountsFailed, getAccountsStart, getAccountsSuccess } from "./accountSlice";
const url = process.env.PUBLIC_URL;

export const getAllAccount = async (accessToken,dispatch) => {
    dispatch(getAccountsStart());
    try {
      const res = await axios.get("/api/account", {
        headers: { 
          Authorization: `Bearer ${accessToken}`,
      },
      });
      dispatch(getAccountsSuccess(res.data.data));
    } catch (err) {
        dispatch(getAccountsFailed())
    }
};