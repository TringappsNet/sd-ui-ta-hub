export interface columnProps{
    id: string;
    column: string;
    title: string;
    count: number;
}
export interface Task {
    taskId: string;
    jobId: number;
    jobTitle: string;
    roleType: string;
    modeOfWork: string;
    workLocation: string;
    yearsOfExperienceRequired: number;
    primarySkillSet: string;
    secondarySkillSet: string;
    clientBudget: string;
    assignedBudget: string;
    primaryAssignee: string;
    taskStatus: string;
    secondaryAssignee: string;
    approvalStatus: boolean;
    backlogs: boolean;
    description: string;
    createdAt: string; // Consider using Date if you're working with date objects
    lastUpdated: string; // Consider using Date if you're working with date objects
    clientName: string;
}

export interface User {
    id: number;
    roleId: number;
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    phone: string;
    resetToken: string;
    password: string;
    isActive: boolean;
    inviteToken: string;
    getgAccessToken: string;
    getgTokenExpiresIn: number;
    getgIdToken: string;
    getgAccessTokenCreatedAt: string; // Consider using Date if working with date objects
    currentSessionId: string;
    lastLoginTime: string; // Consider using Date if working with date objects
    createdAt: string; // Consider using Date if working with date objects
    lastUpdated: string; // Consider using Date if working with date objects
}

export interface Candidate {
    id: number;
    candidateName: string;
    candidateEmail: string;
    candidateContact: string;
    technology: string;
    totalExperience: string;
    currentCtc: string;
    expectedCtc: string;
    noticePeriod: string;
    modeOfWork: string;
    currentLocation: string;
    candidateStatus: string;
    comments: string;
    remarks: string;
    recruiter: string;
    recruitedSource: string;
    createdDate: string; // Consider using Date if working with date objects
    lastUpdated: string; // Consider using Date if working with date objects
    clientName: string;
    taskCandidateStatus: string;
  }

export interface Client {
    id: number;
    clientName: string;
    clientSpocName: string;
    clientSpocContact: string;
    clientLocation: string;
    createdAt: string; // Consider using Date if working with date objects
    lastUpdated: string; // Consider using Date if working with date objects
    jobTitle: string;
}

export interface rows{ 
    id:number,
    name: string, 
    age: string, 
    roleId: number, 
    isNew: boolean,
}