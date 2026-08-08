export type Task = {
  id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  member: string;
  dueDate: string;
  labels: string[];
  team: string;
};

export const tasks: Task[] = [
  {
    id: "1",
    title: "Write API Documentation",
    description:
      "Create clear and detailed API documentation to guide developers in using the inventory and sales metrics features effectively.",
    status: "To Do",
    priority: "High",
    member: "Admin",
    dueDate: "29 Jul",
    labels: ["Research", "Development"],
    team: "Development",
  },

  {
    id: "2",
    title: "Implement Search Function",
    description:
      "Implement a search function to help users quickly find the information they need.",
    status: "To Do",
    priority: "Medium",
    member: "Admin",
    dueDate: "29 Jul",
    labels: ["Development"],
    team: "Development",
  },

  {
    id: "3",
    title: "Deploy to Production",
    description:
      "Prepare and deploy the completed application to the production environment.",
    status: "To Do",
    priority: "High",
    member: "Admin",
    dueDate: "28 Jul",
    labels: ["Deployment"],
    team: "Development",
  },

  {
    id: "4",
    title: "Code Review Completed",
    description:
      "Review the implementation and make sure the code meets the required quality standards.",
    status: "Doing",
    priority: "High",
    member: "Admin",
    dueDate: "29 Jul",
    labels: ["Development"],
    team: "Development",
  },

  {
    id: "5",
    title: "Design Mockups Finalized",
    description:
      "Finalize the application design mockups.",
    status: "Doing",
    priority: "Medium",
    member: "Admin",
    dueDate: "29 Jul",
    labels: ["Design"],
    team: "Design",
  },

  {
    id: "6",
    title: "Feature Testing Passed",
    description:
      "Complete testing of the application features.",
    status: "Completed",
    priority: "Low",
    member: "QA Team",
    dueDate: "30 Jul",
    labels: ["Testing"],
    team: "QA",
  },

  {
    id: "7",
    title: "UI Design Updated",
    description:
      "Update the user interface based on the latest design requirements.",
    status: "Completed",
    priority: "Medium",
    member: "Designer",
    dueDate: "31 Jul",
    labels: ["Design"],
    team: "Design",
  },

  {
    id: "8",
    title: "Security Audit Scheduled",
    description:
      "Schedule the security audit for the application.",
    status: "Completed",
    priority: "High",
    member: "Security",
    dueDate: "01 Aug",
    labels: ["Audit"],
    team: "Security",
  },

  {
    id: "9",
    title: "UI Review",
    description:
      "Review the current user interface and identify improvements.",
    status: "On Hold",
    priority: "Low",
    member: "Designer",
    dueDate: "02 Aug",
    labels: ["Review"],
    team: "Design",
  },

  {
    id: "10",
    title: "Backend Improvements",
    description:
      "Improve the backend implementation and performance.",
    status: "On Hold",
    priority: "Medium",
    member: "Developer",
    dueDate: "03 Aug",
    labels: ["Development"],
    team: "Development",
  },
];