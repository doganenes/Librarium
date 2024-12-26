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
    return axiosInstance.get("/Book/bookSearch",{
        params:{
            BookISBN: isbn
        }
    }).then((res) => {
        return res.data.$values[0];
    }).catch((error) => {
        throw error;
    });
}

export type Review = {
    reviewId: number,
    description: string,
    reviewRate: number,
    createdDate: string,
    isbn: string,
    userId: string
  }

export const getReviewsByISBN = async (isbn: string): Promise<Review[]> => {
    return axiosInstance.get("/Review/getBookReview",{
        params:{
            ISBN: isbn
        }
    }).then(response => response.data.$values)
    .catch((error) => {
        throw error;
    });
}

export const deleteReview = async (reviewId: string) => {
    return axiosInstance.delete("/Review/deleteReview",{
        params:{
            reviewId
        }
    }).catch((error) => {
        throw error;
    });
}

export const getUserFromToken = async () => {
    return axiosInstance.get("/Auth/getUserFromToken").catch((error) => {
        throw error;
    });
}

export const makeReview = async (userId:string, isbn: string, rating: number, review: string) => {
    return axiosInstance.post("/Review/makeReview",{},{
        params:{
            UserId: userId,
            ISBN: isbn,
            rate: rating,
            description: review
        }
    }).catch((error) => {
        throw error;
    });
}

export const addFavoriteBook = async (userId:string, isbn: string) => {
    return axiosInstance.post("/User/addFavoriteBook",{},{
        params:{
            UserId: userId,
            ISBN: isbn
        }
    }).catch((error) => {
        throw error;
    });
}

export const removeFavoriteBook = async (userId:string, isbn: string) => {
    return axiosInstance.delete("/User/removeFavoriteBook",{
        params:{
            userId,
            ISBN: isbn
        }
    }).catch((error) => {
        throw error;
    });
}

export const getFavoriteBookList = async (userId:string) => {
    return axiosInstance.get("/User/getFavoriteBookList",{
        params:{
            userId
        }
    }).then(response => response.data.$values) // Extract the array of favorite books
    .catch((error) => {
        throw error;
    });
}


export const borrowBook = async (userId:string, isbn: string) => {
    return axiosInstance.post("/Borrow/borrowBook",{},{
        params:{
            UserId: userId,
            ISBN: isbn
        }
    }).catch((error) => {
        throw error;
    });
}

export const returnBook = async (userId:string, isbn: string) => {
    return axiosInstance.post("/Borrow/returnBook",{},{
        params:{
            UserId: userId,
            ISBN: isbn
        }
    }).catch((error) => {
        throw error;
    });
}

export const overdueBooks = async (userId:string) => {
    return axiosInstance.get("/Borrow/overdueBooks",{
        params:{
            UserId: userId
        }
    }).then(response => response.data.$values) // Extract the array of overdue books
    .catch((error) => {
        throw error;
    });
}

export const getBorrowsByUserId = async (userId:string) => {
    return axiosInstance.get("/Borrow/getBorrowsByUserId",{
        params:{
            UserId: userId
        }
    }).then(response => response.data.$values) // Extract the array of borrowed books
    .catch((error) => {
        throw error;
    });
}