import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const Api = createApi({
    reducerPath: "api",
    baseQuery: fetchBaseQuery({
        // baseUrl: "http://localhost:8080/api/v1",
        baseUrl: "https://finance-project-9u1h.onrender.com/api/v1",
        prepareHeaders: (headers, { getState }) => {
            const token =
                getState().auth.token || localStorage.getItem("token");

            if (token) {
                headers.set("Authorization", `Bearer ${token}`);
            }

            headers.set("Content-Type", "application/json");

            return headers;
        },
    }),
    tagTypes: ["Auth", "User", "Transaction", "Dashboard"],
    endpoints: (builder) => ({
        // auth
        register: builder.mutation({
            query: (data) => ({
                url: "/auth/register",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Auth"]
        }),

        login: builder.mutation({
            query: (data) => ({
                url: "/auth/login",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Auth"]
        }),

        // users 
        getUsers: builder.query({
            query: () => "/users",
            providesTags: ["User"],
        }),

        getUserById: builder.query({
            query: (id) => `/users/${id}`,
            providesTags: ["User"]
        }),

        updateUser: builder.mutation({
            query: ({ id, data }) => ({
                url: `/users/${id}`,
                method: "PUT",
                body: data,
            }),
            invalidatesTags: ["User"]
        }),

        deleteUser: builder.mutation({
            query: (id) => ({
                url: `/users/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["User"]
        }),

        // tansactions 
        getTransaction: builder.query({
            query: (params) => ({
                url: "/transactions",
                params, // ✅ THIS WAS MISSING
            }),
            providesTags: ["Transaction", "Dashboard"]
        }),

        getTransactionById: builder.query({
            query: (id) => `/transactions/${id}`,
            providesTags: ["Transaction", "Dashboard"]
        }),

        createTransaction: builder.mutation({
            query: (data) => ({
                url: "/transactions",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Transaction", "Dashboard"]
        }),

        updateTransaction: builder.mutation({
            query: ({ id, data }) => ({
                url: `/transactions/${id}`,
                method: "PUT",
                body: data,
            }),
            invalidatesTags: ["Transaction", "Dashboard"]
        }),

        deleteTransaction: builder.mutation({
            query: (id) => ({
                url: `/transactions/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Transaction", "Dashboard"]
        }),

        // dashboard 
        getSummary: builder.query({
            query: () => "/dashboard",
            providesTags: ["Dashboard"]
        }),

        getTrends: builder.query({
            query: () => "/dashboard/trends",
            providesTags: ["Dashboard"]
        }),

        getCategoryTotals: builder.query({
            query: () => "/dashboard/categories",
            providesTags: ["Dashboard"]
        }),
    })
})

export const { useRegisterMutation, useLoginMutation, useGetUsersQuery, useGetUserByIdQuery, useUpdateUserMutation, useDeleteUserMutation, useGetTransactionQuery, useGetTransactionByIdQuery, useCreateTransactionMutation, useUpdateTransactionMutation, useDeleteTransactionMutation, useGetSummaryQuery, useGetTrendsQuery, useGetCategoryTotalsQuery } = Api;