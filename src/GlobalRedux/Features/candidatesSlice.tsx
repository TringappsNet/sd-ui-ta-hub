import { createSlice } from '@reduxjs/toolkit';
import {backend_url} from "../../constants/app_constants"
import { Candidate } from '../../constants/types';
interface candidateState{
  candidates: Candidate[],
}
const initialState:candidateState = {
  candidates: [],
  
};

export const candidatesSlice = createSlice({
  name: 'candidates',
  initialState,
  reducers: {
    setCandidates: (state, action) => {
      state.candidates = action.payload;
    },
    addNewCandidate: (state, action) => {
      state.candidates.push(action.payload);
    },
    updateCandidate: (state, action) => {
      const updatedCandidate = action.payload;
      state.candidates = state.candidates.map(candidate => 
        candidate.id === updatedCandidate.id ? updatedCandidate : candidate
      );
    },
    deleteCandidate: (state, action) => {
      const candidateId = action.payload;
      state.candidates = state.candidates.filter(candidate => candidate.id !== candidateId);
    },
  },
});

export const { setCandidates, addNewCandidate, updateCandidate, deleteCandidate } = candidatesSlice.actions;

// Function to delete candidate on the server
export const deleteCandidateOnServer = (candidateId) => async () => {
  try {
    const response = await fetch(`${backend_url}/api/candidates/candidate/${candidateId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Failed to delete candidate on the server');

    }

    // Dispatch action to delete candidate from the Redux store
    // dispatch(deleteCandidate(candidateId));
  } catch (error) {
    console.error('Error deleting candidate:', error);
    // Handle error, if needed
  }
};

export const updateCandidateOnServer = (userData) => async () => {
  try {
    // Destructure userData and exclude clientName and taskCandidateStatus
    
    // const { clientName, taskCandidateStatus, ...payload } = userData;
    const response = await fetch(`${backend_url}/api/candidates/candidate/${userData.candidateId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData), // Send the modified payload
    });

    if (!response.ok) {
      throw new Error('Failed to update candidate on the server');
    }

    // Dispatch action to update candidate in the Redux store
    // dispatch(updateCandidate(updatedCandidate));
  } catch (error) {
    console.error('Error updating candidate:', error);
    // Handle error, if needed
  }
};


export const handleCandidateAdd = async (newEmptyRow) => {
  try {
    const response = await fetch(`${backend_url}/api/candidates/candidate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newEmptyRow),
    });

    if (response.ok) {
      // Dispatch the addNewCandidate action to update Redux state
      // dispatch(addNewCandidate(newEmptyRow)); // Assuming you have access to `dispatch`
      // Handle success
    } else {
      // Handle failure
    }
  } catch (error) {
    console.error('Error:', error);
  }
};


export default candidatesSlice.reducer;
