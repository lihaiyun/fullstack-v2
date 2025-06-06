"use client";
import { useFormik } from "formik";
import * as Yup from "yup";
import http from "@/utils/http";
import { useRouter } from "next/navigation";

const registerSchema = Yup.object().shape({
    name: Yup.string().trim()
        .required('Name is required')  
        .matches(/^[a-zA-Z '-,.]+$/, 'Name must only contain letters, spaces and characters: \'-,.')
        .max(100, 'Name must be at most 100 characters'),
    email: Yup.string().trim()
        .required('Email is required')
        .email('Email must be a valid email address')
        .max(100, 'Email must be at most 100 characters'),
    password: Yup.string().trim()
        .required('Password is required')
        .min(8, 'Password must be at least 8 characters')
        .matches(/^(?=.*[a-zA-Z])(?=.*[0-9]).*$/, 'Password must contain at least one letter and one number')
        .max(50, 'Password must be at most 50 characters'),
    confirmPassword: Yup.string().trim()
        .required('Confirm password is required')
        .oneOf([Yup.ref('password')], 'Passwords must match')
});

export default function Register() {
    const router = useRouter();

    const formik = useFormik({
        initialValues: {
            name: "",
            email: "",
            password: "",
            confirmPassword: "",
        },
        validationSchema: registerSchema,
        onSubmit: async (data) => {
            data.name = data.name.trim();
            data.email = data.email.trim().toLowerCase();
            data.password = data.password.trim();
            http.post("/users/register", data)
            .then((res) => {
                // Handle successful registration, e.g., redirect to login page
                console.log("Registration successful:", res.data);
                // Optionally redirect or show a success message
                router.push("/user/login"); // Redirect to login page after registration
            })
            .catch((err) => {
                // Handle error, e.g., show a notification or alert
                console.error("Registration failed:", err.response?.data || err.message);
            });
        },
    });

    return (
        <div className="flex flex-col items-center justify-center p-4">
            <h1 className="text-2xl font-bold mb-4">Register</h1>
            <form className="w-full max-w-md" onSubmit={formik.handleSubmit}>
                <div className="mb-4">
                    <label className="block text-sm font-medium mb-2" htmlFor="name">Name</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.name}
                        required
                    />
                    {formik.touched.name && formik.errors.name && (
                        <div className="text-red-500 text-xs mt-1">{formik.errors.name}</div>
                    )}
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-medium mb-2" htmlFor="email">Email</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.email}
                        required
                    />
                    {formik.touched.email && formik.errors.email && (
                        <div className="text-red-500 text-xs mt-1">{formik.errors.email}</div>
                    )}
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-medium mb-2" htmlFor="password">Password</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.password}
                        required
                    />
                    {formik.touched.password && formik.errors.password && (
                        <div className="text-red-500 text-xs mt-1">{formik.errors.password}</div>
                    )}
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-medium mb-2" htmlFor="confirmPassword">Confirm Password</label>
                    <input
                        type="password"
                        id="confirmPassword"
                        name="confirmPassword"
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.confirmPassword}
                        required
                    />
                    {formik.touched.confirmPassword && formik.errors.confirmPassword && (
                        <div className="text-red-500 text-xs mt-1">{formik.errors.confirmPassword}</div>
                    )}
                </div>
                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors"
                >
                    Register
                </button>
            </form>
        </div>
    );
}