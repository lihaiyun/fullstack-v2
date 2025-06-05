import Image from "next/image";
import http from "@utils/http";
import dayjs from "dayjs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, CheckCircle, XCircle, Clock, Calendar, Plus } from "lucide-react";
import Link from "next/link";

function formatDate(dateString: string) {
  return dayjs(dateString).format("D MMM YYYY");
}

export default async function Projects() {
  // Fetch data on the server
  let projects = [];
  try {
    const response = await http.get("/projects");
    projects = response.data;
  } catch (error) {
    console.error("Error fetching projects:", error);
  }

  // Helper to render status with icon and color
  function renderStatus(status: string) {
    switch (status) {
      case "Completed":
        return (
          <>
            <CheckCircle className="w-4 h-4 text-green-500" />
            <span className="text-green-600">Completed</span>
          </>
        );
      case "In Progress":
        return (
          <>
            <Clock className="w-4 h-4 text-yellow-500" />
            <span className="text-yellow-600">In Progress</span>
          </>
        );
      case "Not Started":
      default:
        return (
          <>
            <XCircle className="w-4 h-4 text-gray-400" />
            <span className="text-gray-500">Not Started</span>
          </>
        );
    }
  }

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Projects</h1>
        <Button asChild>
          <Link href="/projects/add">
            <Plus className="w-4 h-4 mr-2" />
            Add Project
          </Link>
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {projects.map((project: any) => (
          <Card key={project._id} className="p-2">
            <CardHeader className="p-2 pb-0">
              <CardTitle className="text-xl">{project.name}</CardTitle>
            </CardHeader>
            <CardContent className="p-2 pt-0">
              <div className="flex items-center gap-3 mb-2">
                <span className="flex items-center gap-1 text-sm text-gray-600">
                  <User className="w-4 h-4" />
                  {project.owner.name}
                </span>
                <span className="flex items-center gap-1 text-sm">
                  {renderStatus(project.status)}
                </span>
                <span className="flex items-center gap-1 text-sm text-gray-500">
                  <Calendar className="w-4 h-4" />
                  {formatDate(project.dueDate)}
                </span>
              </div>
              <p className="text-gray-700 mb-2">{project.description}</p>
              <div className="relative w-full aspect-[16/9]">
                <Image
                  src={project.imageUrl}
                  alt={project.name}
                  fill
                  sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                  className="rounded object-cover"
                  priority
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
}
