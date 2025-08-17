import { AxiosError } from "axios";
import { LoginInterface } from "../interfaces/login_interface";
import AxiosInstance from "../axios_instance";
import { LoginDataInterface } from "../interfaces/login_data_interface";

export const loginRequest = async (data: LoginInterface) => {
  console.log("this is the data", data);

  try {
    const res = await AxiosInstance.post<LoginDataInterface>("/auth/login", {
      email: data.email,
      password: data.password,
    });

    return res.data;
  } catch (e) {
    console.log(e);
    const err = e as AxiosError;

    //   const responseData = err.response?.data;
    //   const responseData = err.response?.data as { detail?: string | Array<{ msg: string }> };
    const responseData = err.response?.data as {
      detail?: string | Array<{ msg: string; loc: string[] }>;
    };

    if (Array.isArray(responseData?.detail)) {
      // FastAPI validation error with multiple details
      const firstError = responseData.detail[0];
      const fieldName = firstError?.loc?.[firstError.loc.length - 1] || "field";
      const errorMessage = `${fieldName}: ${firstError?.msg || "Validation error occurred"}`;
      throw new Error(errorMessage);
    } else if (typeof responseData?.detail === "string") {
      // Custom FastAPI error
      throw new Error(responseData.detail);
    } else {
      // Fallback error
      throw new Error("An unexpected error occurred");
    }
  }
};
