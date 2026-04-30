"use client";

import React, { createContext, useState, useEffect, ReactNode } from "react";
import { UserProfile, UserDocuments, defaultUser } from "../utils/mockData";
import { calculateDecisionState, DecisionState } from "../utils/decisionEngine";

// Dynamic mock names instead of hardcoded "Rahul Sharma"
const mockNames = [
  "Ananya Deshmukh",
  "Vikram Patil",
  "Priya Iyer",
  "Arjun Mehta",
  "Sneha Kulkarni",
  "Rohan Joshi",
  "Kavitha Nair",
  "Amit Verma",
];

const mockLocations = [
  "Mumbai, Maharashtra",
  "Pune, Maharashtra",
  "Delhi, NCR",
  "Bengaluru, Karnataka",
  "Chennai, Tamil Nadu",
  "Hyderabad, Telangana",
];

interface UserContextProps {
  profile: UserProfile;
  documents: UserDocuments;
  decisionState: DecisionState;
  connectDigiLocker: () => void;
  disconnectDigiLocker: () => void;
  updateDocuments: (docs: Partial<UserDocuments>) => void;
  manualSetup: (data: { age: number; location: string; hasAadhaar: boolean; hasVoterId: boolean }) => void;
}

export const UserContext = createContext<UserContextProps | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [profile, setProfile] = useState<UserProfile>(defaultUser.profile);
  const [documents, setDocuments] = useState<UserDocuments>(defaultUser.documents);
  const [decisionState, setDecisionState] = useState<DecisionState>(
    calculateDecisionState(defaultUser.profile, defaultUser.documents)
  );

  useEffect(() => {
    setDecisionState(calculateDecisionState(profile, documents));
  }, [profile, documents]);

  const connectDigiLocker = () => {
    // Pick a random name and location for realism
    const randomName = mockNames[Math.floor(Math.random() * mockNames.length)];
    const randomLocation = mockLocations[Math.floor(Math.random() * mockLocations.length)];
    const randomAge = 18 + Math.floor(Math.random() * 10); // 18-27

    setProfile({
      name: randomName,
      age: randomAge,
      location: randomLocation,
      isFirstTimeVoter: randomAge <= 21,
      isConnected: true,
    });
    setDocuments({
      aadhaar: true,
      voterId: Math.random() > 0.4, // 60% chance of having voter ID
      drivingLicense: Math.random() > 0.3,
      panCard: Math.random() > 0.5,
    });
  };

  const disconnectDigiLocker = () => {
    setProfile(defaultUser.profile);
    setDocuments(defaultUser.documents);
  };

  const updateDocuments = (docs: Partial<UserDocuments>) => {
    setDocuments((prev) => ({ ...prev, ...docs }));
  };

  const manualSetup = (data: { age: number; location: string; hasAadhaar: boolean; hasVoterId: boolean }) => {
    setProfile({
      name: "Voter",
      age: data.age,
      location: data.location,
      isFirstTimeVoter: data.age <= 21,
      isConnected: false,
    });
    setDocuments({
      aadhaar: data.hasAadhaar,
      voterId: data.hasVoterId,
      drivingLicense: false,
      panCard: false,
    });
  };

  const contextValue = React.useMemo(() => ({
    profile,
    documents,
    decisionState,
    connectDigiLocker,
    disconnectDigiLocker,
    updateDocuments,
    manualSetup,
  }), [profile, documents, decisionState]);

  return (
    <UserContext.Provider value={contextValue}>
      {children}
    </UserContext.Provider>
  );
};
