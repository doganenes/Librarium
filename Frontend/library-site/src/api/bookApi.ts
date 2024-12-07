import axiosInstance from "../utils/axios";

export interface LoginValues {
    email: string;
    password: string;
}

export const login = async (values: LoginValues) => {
    return axiosInstance.post("/Auth/login", values).catch((error) => {
        throw error;
    }
    );
};

export interface registerValues {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    password: string;
}

export const register = async (values: registerValues) => {
    return axiosInstance.post("/Auth/register", values).catch((error) => {
        throw error;
    }
    );
}

export const getAllBooks = async () => {
    return axiosInstance.get("/Book/getAllBooks").catch((error) => {
        throw error;
    });
}