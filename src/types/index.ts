export interface UserDocuments {
  aadhaar: boolean;
  voterId: boolean;
  drivingLicense: boolean;
  panCard: boolean;
}

export interface UserProfile {
  name: string;
  age: number | null;
  location: string | null;
  isFirstTimeVoter: boolean;
  isConnected: boolean;
}

export interface DecisionState {
  readinessScore: number;
  roadmapStep: number;
  urgentAction: string | null;
  nextBestAction: string | null;
  status: "eligible" | "not_eligible" | "pending";
  aiContext: string;
}

export interface Message {
  id: string;
  sender: "user" | "bot";
  text: string;
  timestamp?: number;
}

export interface LanguageContextProps {
  language: string;
  setLanguage: (lang: string) => void;
  t: any; // Will refine this as we go
}

export interface PollingBooth {
  name: string;
  address: string;
  distance: string;
  bestTime: string;
  lat: number;
  lng: number;
}
