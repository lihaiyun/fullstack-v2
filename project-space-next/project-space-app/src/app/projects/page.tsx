import Image from "next/image";
import http from "@utils/http";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function Projects() {
  // Fetch data on the server
  let projects = [];
  try {
    const response = await http.get("/projects");
    projects = response.data;
  } catch (error) {
    console.error("Error fetching projects:", error);
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {projects.map((project: any) => (
        <Card key={project._id} className="flex flex-col">
          <CardHeader>
            <CardTitle className="text-xl">{project.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 mb-2">{project.description}</p>
            <div className="relative w-full aspect-[16/9]">
              <Image
                src={project.imageUrl}
                alt={project.name}
                fill
                className="rounded object-cover"
                priority
              />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
