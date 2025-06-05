import Image from "next/image";
import http from "@utils/http";

export default async function Projects() {
  // Fetch data on the server
  let projects = [];
  try {
    const response = await http.get("/projects");
    projects = response.data;
    //console.log("Fetched projects:", projects);
  } catch (error) {
    // Handle error as needed
    console.error("Error fetching projects:", error);
  }

  return (
    <div>
      {projects.map((project: any) => (
        <div key={project._id} className="p-4 border rounded-lg shadow-md">
          <h2 className="text-xl font-bold">{project.name}</h2>
          <p className="text-gray-700">{project.description}</p>
          <Image
            src={project.imageUrl}
            alt={project.name}
            width={300}
            height={200}
            className="mt-2 rounded"
            priority
            style={{ width: "auto", height: "auto" }}
          />
        </div>
      ))}
    </div>
  )
}
