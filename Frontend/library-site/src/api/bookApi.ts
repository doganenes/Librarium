import axiosInstance from "../utils/axios";

export interface LoginValues {
    email: string;
    password: string;
}

export const login = async (values: LoginValues) => {
    return axiosInstance.post("/Auth/login", {

    },{
        params:{
            Email: values.email,
            Password: values.password
        }
    }).catch((error) => {
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
    return axiosInstance.post("/Auth/register",{},{params:values}).catch((error) => {
        throw error;
    }
    );
}

export const getAllBooks = async () => {
    return axiosInstance.get("/Book/getAllBooks").catch((error) => {
        throw error;
    });
}

export const getBookByISBN = async (isbn: string) => {
    return axiosInstance.post("/Book/bookSearch",{},{
        params:{
            ISBN: isbn
        }
    }).then((res) => {
        return res.data.$values[0];
    }).catch((error) => {
        throw error;
    });
}