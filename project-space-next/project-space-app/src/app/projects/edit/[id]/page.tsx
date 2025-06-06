"use client";
import { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import http from "@/utils/http";
import { useRouter, useParams } from "next/navigation";

const projectSchema = Yup.object().shape({
  name: Yup.string().trim()
    .required('Name is required')
    .min(3, 'Name must be at least 3 characters')
    .max(100, 'Name must be at most 100 characters'),
  description: Yup.string()
    .max(500, 'Description must be at most 500 characters'),
  dueDate: Yup.date()
    .required('Due date is required'),
  status: Yup.string()
    .required('Status is required')
    .oneOf(['not-started', 'in-progress', 'completed'], 'Invalid status'),
});

export default function EditProject() {
  const router = useRouter();
  const params = useParams();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const formik = useFormik({
    initialValues: {
      name: "",
      description: "",
      dueDate: "",
      status: "not-started",
    },
    validationSchema: projectSchema,
    enableReinitialize: true,
    onSubmit: async (values, { setSubmitting }) => {
      setError(null);
      try {
        await http.put(`/projects/${params.id}`, values);
        router.push("/projects");
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to update project");
      } finally {
        setSubmitting(false);
      }
    },
  });

  useEffect(() => {
    async function fetchProject() {
      try {
        const res = await http.get(`/projects/${params.id}`);
        const { name, description, dueDate, status } = res.data;
        formik.setValues({
          name: name || "",
          description: description || "",
          dueDate: dueDate ? dueDate.slice(0, 10) : "",
          status: status || "not-started",
        });
      } catch (err: any) {
        setError("Failed to load project");
      } finally {
        setLoading(false);
      }
    }
    fetchProject();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id]);

  if (loading) {
    return <div className="p-4 text-center">Loading...</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <h1 className="text-2xl font-bold mb-4">Edit Project</h1>
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
          {formik.isSubmitting ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
}