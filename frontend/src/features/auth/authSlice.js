import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"; 
import authService from "../authServices";

// Get user from local Storage
const user = JSON.parse(localStorage.getItem("user"));

const initialState = {
    user: user ? user : null,
    isError: false,
    isLoading: false,
    isSuccess: false,
    message: " "
};


export const register = createAsyncThunk('auth/register', async (user, thunkAPI) => {
    try {
        return await authService.register(user);
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
        return thunkAPI.rejectWithValue(message); 
    }
});



export const login  = createAsyncThunk(
    'auth/login', async (user, thunkAPI) => {
    try {
        return await authService.login(user);
    } catch (error) {
        const message = 
        (error.response && 
            error.response.data && 
            error.response.data.message) || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});

export const updateProfilePicture = createAsyncThunk(
    'auth/uploadProfilePicture',
    async (profilePicture, thunkAPI) => {
        try {
            const response = await authService.uploadProfilePicture(profilePicture); 
            return response
        } catch (error) {
            const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const logout = createAsyncThunk('auth/logout', async () => {
    authService.logout(); 
});

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
         reset: (state) => {
            state.isLoading = false;
            state.isError = false;
            state.isSuccess = false;
            state.message = '';
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(register.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(register.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.user = action.payload; 
            })
            .addCase(register.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload; 
                state.user = null; 
            })
            .addCase(login.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(login.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.user = action.payload; 
            })
            .addCase(login.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload; 
                state.user = null; 
            })
            .addCase(logout.fulfilled,(state)=>{
               state.user = null 
               state.isSuccess=false;
               state.message='' 
            }) 
            .addCase(updateProfilePicture.fulfilled,(state,action)=>{
                console.log("Update payload:", action.payload);
                if(state.user){
                    state.user.profilePicture=action.payload.profilePicture
                }
            })
    }
});

export const { reset } = authSlice.actions;
export default authSlice.reducer;
