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
    'auth/updateProfilePicture', async (data, thunkAPI) => {
        try {
            return await authService.uploadProfilePicture(data.file, data.token);
        } catch (error) {
            const message = error.response ? error.response.data.message : error.message;
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const uploadResume = createAsyncThunk(
    'auth/uploadResume', async (data, thunkAPI) => {
        try {
            return await authService.uploadResume(data.file, data.token);
        } catch (error) {
            const message = error.response ? error.response.data.message : error.message;
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// export const getProfile = createAsyncThunk(
//     'auth/getProfile',
//     async (token, thunkAPI) => {
//         try {
//             return await authService.fetchProfile(token);
//         } catch (error) {
//             const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
//             return thunkAPI.rejectWithValue(message);
//         }
//     }
// );

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
            .addCase(updateProfilePicture.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(updateProfilePicture.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.user = action.payload;
            })
            .addCase(updateProfilePicture.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            .addCase(uploadResume.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(uploadResume.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.user = action.payload;
            })
            .addCase(uploadResume.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            // .addCase(getProfile.pending, (state) => {
            // state.isLoading = true;
            // })
            // .addCase(getProfile.fulfilled, (state, action) => {
            // state.isLoading = false;
            // state.isSuccess = true;
            // state.user = action.payload; // Update user with fetched profile data
            // })
            // .addCase(getProfile.rejected, (state, action) => {
            // state.isLoading = false;
            // state.isError = true;
            // state.message = action.payload;
            // });

    }
});

export const { reset } = authSlice.actions;
export default authSlice.reducer;
