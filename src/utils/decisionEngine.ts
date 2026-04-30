import { UserProfile, UserDocuments, mockAiResponses } from "./mockData";



export interface DecisionState {
  readinessScore: number;
  roadmapStep: number;
  urgentAction: string | null;
  nextBestAction: string | null;
  status: "eligible" | "not_eligible" | "pending";
  aiContext: string;
}

/**
 * Calculates the user's voting readiness score and current roadmap step.
 * 
 * @param profile - The user's profile information (age, location, etc.)
 * @param documents - The user's document status (Aadhaar, Voter ID, etc.)
 * @returns An object containing the readiness score, roadmap progress, and recommended actions.
 */
export const calculateDecisionState = (
  profile: UserProfile,
  documents: UserDocuments
): DecisionState => {
  // ── HARD RULE: Under 18 = Not Eligible ──
  // Ignore ALL documents, skip scoring entirely
  if (profile.age !== null && profile.age < 18) {
    return {
      readinessScore: 0,
      roadmapStep: 0,
      urgentAction: "notEligible",
      nextBestAction: "wait18",
      status: "not_eligible",
      aiContext: mockAiResponses.underage,
    };
  }

  let readinessScore = 0;
  let roadmapStep = 1;
  let urgentAction: string | null = null;
  let nextBestAction: string | null = null;
  let status: "eligible" | "not_eligible" | "pending" = "pending";
  let aiContext = mockAiResponses.fallback;

  // Base score for awareness
  readinessScore += 10;

  if (profile.age === null && !documents.voterId && !documents.aadhaar) {
    // No data at all
    roadmapStep = 1;
    urgentAction = "enterDetails";
    nextBestAction = "enterDetailsAction";
    status = "pending";
  } else {
    if (documents.aadhaar) readinessScore += 30;
    if (documents.voterId) readinessScore += 40;
    if (profile.location) readinessScore += 20;

    if (!documents.voterId) {
      // ── Missing Voter ID: actionable guidance ──
      roadmapStep = 2; // Registration phase
      urgentAction = "applyVoterId";
      nextBestAction = "applyVoterIdAction";
      status = "pending";
      aiContext = mockAiResponses.missingVoterId;
    } else {
      // ── Fully ready ──
      roadmapStep = 4; // Ready to vote / Find booth
      urgentAction = "checkPollingBooth";
      nextBestAction = "findPollingBooth";
      status = "eligible";
      aiContext = mockAiResponses.ready;
    }
  }

  // Ensure score doesn't exceed 100
  readinessScore = Math.min(readinessScore, 100);

  return {
    readinessScore,
    roadmapStep,
    urgentAction,
    nextBestAction,
    status,
    aiContext,
  };
};
