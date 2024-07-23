import { createSlice } from '@reduxjs/toolkit';
import {backend_url} from '../../constants/app_constants';
import { User } from "../../constants/types";

interface userState {
  users: User[];
}
const initialState: userState = {
  users: [],
};

export const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    addNewUser: (state, action) => {
      state.users.push(action.payload);
    },
    setUsers: (state, action) => {
      state.users = action.payload;
    },
    updateUser: (state, action) => {  
      const { id, newData } = action.payload;
      const index = state.users.findIndex(user => user.id === id);
      if (index !== -1) {
        state.users[index] = { ...state.users[index], ...newData };
      }
    },
    deleteUser: (state, action) => {
      const userId = action.payload;
      state.users = state.users.filter(user => user.id !== userId);
    },
  },
});

export const { setUsers, updateUser, deleteUser, addNewUser } = usersSlice.actions;

export const deleteUserOnServer = (userId) => async (dispatch) => {
  try {
    const response = await fetch(`${backend_url}/api/users/user/${userId}`, {
      method: 'DELETE',
    });

    if (response.ok) {
      dispatch(deleteUser(userId));
      console.log("Deleted successfully");
    } else {
      throw new Error('Failed to delete record on the server');
    }
  } catch (error) {
    console.error('Error deleting record:', error);
  }
};
export const updateUserOnServer = async (userData) => {
  try {
     
      const response = await fetch(`${backend_url}/api/users/user/${userData.userId}`, {
          method: 'PUT',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify(userData),
      });

      if (!response.ok) {
          throw new Error('Failed to update user');
      }

      // Handle successful response
      // For example, you might parse the response JSON and return some data
      const updatedUserData = await response.json();
      return updatedUserData;
  } catch (error) {
      // Handle errors
      console.error('Error updating user:', error);
      throw error;
  }
};
	
export const handleUserAdd = async (newEmptyRow) => {
  try {
    const response = await fetch(`${backend_url}/api/users/user`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newEmptyRow),
    });

    if (response.ok) {
      // Dispatch the addNewUser action to update Redux state
      // dispatch(addNewUser(newEmptyRow)); // Assuming you have access to `dispatch`
      // Handle success
    } else {
      // Handle failure
    }
  } catch (error) {
    console.error('Error:', error);
  }
};

export default usersSlice.reducer;
