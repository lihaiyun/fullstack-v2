"use client";
import { useFormik } from "formik";
import * as Yup from "yup";
import http from "@/utils/http";
import { useRouter } from "next/navigation";
import { useState } from "react";

const projectSchema = Yup.object().shape({
  name: Yup.string().required("Project name is required"),
  description: Yup.string().required("Description is required"),
  dueDate: Yup.date().required("Due date is required"),
  status: Yup.string().oneOf(["not-started", "in-progress", "completed"]).required("Status is required"),
});

export default function AddProject() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const formik = useFormik({
    initialValues: {
      name: "",
      description: "",
      dueDate: "",
      status: "not-started",
    },
    validationSchema: projectSchema,
    onSubmit: async (values, { setSubmitting }) => {
      setError(null);
      try {
        await http.post("/projects", values);
        router.push("/projects");
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to add project");
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <h1 className="text-2xl font-bold mb-4">Add New Project</h1>
      <form className="w-full max-w-md" onSubmit={formik.handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2" htmlFor="name">Project Name</label>
          <input
            type="text"
            id="name"
            name="name"
            className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              formik.touched.name && formik.errors.name ? "border-red-500" : "border-gray-300"
            }`}
            value={formik.values.name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            required
          />
          {formik.touched.name && formik.errors.name && (
            <div className="text-red-500 text-xs mt-1">{formik.errors.name}</div>
          )}
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2" htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            rows={4}
            className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              formik.touched.description && formik.errors.description ? "border-red-500" : "border-gray-300"
            }`}
            value={formik.values.description}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            required
          ></textarea>
          {formik.touched.description && formik.errors.description && (
            <div className="text-red-500 text-xs mt-1">{formik.errors.description}</div>
          )}
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2" htmlFor="dueDate">Due Date</label>
          <input
            type="date"
            id="dueDate"
            name="dueDate"
            className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              formik.touched.dueDate && formik.errors.dueDate ? "border-red-500" : "border-gray-300"
            }`}
            value={formik.values.dueDate}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            required
          />
          {formik.touched.dueDate && formik.errors.dueDate && (
            <div className="text-red-500 text-xs mt-1">{formik.errors.dueDate}</div>
          )}
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2" htmlFor="status">Status</label>
          <select
            id="status"
            name="status"
            className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              formik.touched.status && formik.errors.status ? "border-red-500" : "border-gray-300"
            }`}
            value={formik.values.status}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            required
          >
            <option value="not-started">Not Started</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
          {formik.touched.status && formik.errors.status && (
            <div className="text-red-500 text-xs mt-1">{formik.errors.status}</div>
          )}
        </div>
        {error && <div className="text-red-500 text-sm mb-2">{error}</div>}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors"
          disabled={formik.isSubmitting}
        >
          {formik.isSubmitting ? "Adding..." : "Add Project"}
        </button>
      </form>
    </div>
  );
}
