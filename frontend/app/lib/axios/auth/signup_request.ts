import { AxiosError } from "axios";
import AxiosInstance from "../axios_instance";
import { SignupInterface } from "../interfaces/signup_interface";

export const signupRequest = async (data: SignupInterface) => {
  try {
    const res = await AxiosInstance.post("/auth/signup", data);
    return res.data;
  } catch (e) {
    const err = e as AxiosError;
    const error_message = err.response?.data as {detail : string};
    throw new Error(error_message.detail)
  }
};

