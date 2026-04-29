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

export const mockDigiLockerUser = {
  profile: {
    name: "Rahul Sharma",
    age: 19,
    location: "Mumbai, Maharashtra",
    isFirstTimeVoter: true,
    isConnected: true,
  },
  documents: {
    aadhaar: true,
    voterId: false,
    drivingLicense: true,
    panCard: false,
  },
};

export const defaultUser = {
  profile: {
    name: "",
    age: null,
    location: null,
    isFirstTimeVoter: false,
    isConnected: false,
  },
  documents: {
    aadhaar: false,
    voterId: false,
    drivingLicense: false,
    panCard: false,
  },
};

export const mockAiResponses = {
  missingVoterId: "I notice you don't have a Voter ID linked. As a first-time voter, getting registered is your next crucial step. Would you like me to guide you through the process?",
  underage: "It looks like you're under 18! You can't vote just yet, but this is the perfect time to learn about the process so you're ready when you're eligible.",
  ready: "You have all your documents ready! Check out your polling booth location to ensure a smooth experience on voting day.",
  fallback: "I'm your AI Election Assistant. How can I help you get ready for the upcoming elections?",
};

export const mockPollingBooth = {
  name: "St. Xavier's High School",
  address: "St. Xavier's High School, Fort, Mumbai",
  distance: "1.2 km away",
  bestTime: "Early morning (7 AM - 9 AM) to avoid queues.",
  lat: 18.9401,
  lng: 72.8347
};

export const misinfoQA = [
  {
    question: "Do I need Aadhaar to vote?",
    answer: "No, Aadhaar is not mandatory for voting. You can vote using your Voter ID (EPIC) or other acceptable photo identity documents."
  },
  {
    question: "Can I vote without a Voter ID card?",
    answer: "If your name is on the electoral roll, you can vote using alternate ID proofs like a Passport, Driving License, or PAN Card."
  },
  {
    question: "Can I register to vote if I'm 17?",
    answer: "Yes, you can apply in advance if you are 17+ and will turn 18 by one of the qualifying dates (Jan 1, Apr 1, Jul 1, Oct 1)."
  }
];
