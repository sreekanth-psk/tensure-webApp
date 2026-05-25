export interface InsightPost {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  readTime: string;
  date: string;
  image: string;
  imageAlt: string;
}

export const INSIGHT_POSTS: InsightPost[] = [
  {
    id: "1",
    title: "AI Agents Transform CI/CD Pipeline Design",
    excerpt:
      "How autonomous agents analyze bottlenecks and generate optimized deployment workflows across intelligent delivery lanes.",
    category: "AI Infrastructure",
    readTime: "8 min",
    date: "May 2026",
    image: "/images/insights/devops-pipeline-corridor.png",
    imageAlt: "Isometric DevOps pipeline with containers moving through deployment tracks to a cloud platform",
  },
  {
    id: "2",
    title: "Building the Platform Engineering Control Center",
    excerpt:
      "Design patterns for unified observability, deployment dashboards, and real-time infrastructure orchestration.",
    category: "Platform Engineering",
    readTime: "12 min",
    date: "Apr 2026",
    image: "/images/insights/platform-control-center.png",
    imageAlt: "Futuristic workspace with holographic dashboards and analytics displays",
  },
  {
    id: "3",
    title: "Cloud Logistics for Global Software Delivery",
    excerpt:
      "Connecting automated fulfillment, data streams, and cloud hubs for enterprise-scale release operations.",
    category: "Cloud Delivery",
    readTime: "10 min",
    date: "Mar 2026",
    image: "/images/insights/cloud-logistics-hub.png",
    imageAlt: "Automated logistics hub with cloud computing overlay and global network streams",
  },
  {
    id: "4",
    title: "Financial Security & Compliance Monitoring",
    excerpt:
      "Real-time security posture tracking, protected assets, and secure network gateways for regulated enterprises.",
    category: "Security",
    readTime: "9 min",
    date: "Feb 2026",
    image: "/images/insights/financial-security-monitoring.png",
    imageAlt: "Financial security dashboard with shields, charts, and secure network gateway visualization",
  },
];
