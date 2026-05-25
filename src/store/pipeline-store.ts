import { create } from "zustand";
import type { AIBlueprint, ChatMessage, PipelineFormData } from "@/types";
import { generateBlueprint } from "@/lib/mock-ai";

const defaultForm: PipelineFormData = {
  cloudProvider: "aws",
  pipelineState: "partial-cicd",
  teamSize: 12,
  deployFrequency: "weekly",
  compliance: ["SOC2"],
  bottlenecks: "Manual approval gates, slow test suites",
  securityConcerns: "Secrets management, container scanning",
  currentTooling: "Jenkins, Terraform, Docker",
  budget: 250000,
  desiredVelocity: "high",
};

interface PipelineStore {
  formData: PipelineFormData;
  activeTab: "spec" | "roi";
  blueprint: AIBlueprint | null;
  isGenerating: boolean;
  streamingText: string;
  chatOpen: boolean;
  chatMessages: ChatMessage[];
  chatLoading: boolean;
  setFormField: <K extends keyof PipelineFormData>(
    key: K,
    value: PipelineFormData[K]
  ) => void;
  setActiveTab: (tab: "spec" | "roi") => void;
  applyScenario: (preset: Partial<PipelineFormData>) => void;
  generateBlueprint: () => Promise<void>;
  setChatOpen: (open: boolean) => void;
  addChatMessage: (role: "user" | "assistant", content: string) => void;
  setChatLoading: (loading: boolean) => void;
  resetBlueprint: () => void;
}

export const usePipelineStore = create<PipelineStore>((set, get) => ({
  formData: defaultForm,
  activeTab: "spec",
  blueprint: null,
  isGenerating: false,
  streamingText: "",
  chatOpen: false,
  chatMessages: [
    {
      id: "welcome",
      role: "assistant",
      content:
        "Welcome to Tensure. I can help design deployment pipelines, estimate ROI, and build modernization roadmaps. How can I assist?",
      timestamp: Date.now(),
    },
  ],
  chatLoading: false,

  setFormField: (key, value) =>
    set((s) => ({ formData: { ...s.formData, [key]: value } })),

  setActiveTab: (tab) => set({ activeTab: tab }),

  applyScenario: (preset) =>
    set((s) => ({ formData: { ...s.formData, ...preset } })),

  generateBlueprint: async () => {
    const { formData } = get();
    set({ isGenerating: true, blueprint: null, streamingText: "" });

    const chunks = [
      "Initializing AI agents...",
      "Parsing infrastructure spec...",
      "Building architecture graph...",
      "Computing ROI model...",
      "Generating roadmap phases...",
    ];

    for (const chunk of chunks) {
      set({ streamingText: chunk });
      await new Promise((r) => setTimeout(r, 450));
    }

    const blueprint = await generateBlueprint(formData);
    set({ blueprint, isGenerating: false, streamingText: "Blueprint ready." });
  },

  setChatOpen: (open) => set({ chatOpen: open }),

  addChatMessage: (role, content) =>
    set((s) => ({
      chatMessages: [
        ...s.chatMessages,
        {
          id: `${Date.now()}-${Math.random()}`,
          role,
          content,
          timestamp: Date.now(),
        },
      ],
    })),

  setChatLoading: (loading) => set({ chatLoading: loading }),

  resetBlueprint: () =>
    set({ blueprint: null, isGenerating: false, streamingText: "" }),
}));
