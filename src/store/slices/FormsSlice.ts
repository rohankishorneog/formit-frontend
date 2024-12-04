import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { FieldConfig } from "@/types";
import API from "@/api/api";

export interface FormState {
  _id?: string | undefined;
  title: string;
  description?: string;
  createdAt?: Date;
  fields: FieldConfig[];
}

interface InitialState {
  forms: FormState[];
  formCreating: boolean;
  formCreated: boolean;
  formCreatingError: string | null;
  createdFormId: string | null;

  formsLoading: boolean;
  formsLoaded: boolean;
  formsLoadingError: string | null;

  formUpdating: boolean;
  formUpdated: boolean;
  formUpdatingError: string | null;

  formDetails: FormState | null;
  formDetailsLoading: boolean;
  formDetailsError: string | null;
}

const initialState: InitialState = {
  forms: [],
  formCreating: false,
  formCreated: false,
  formCreatingError: null,
  createdFormId: null,

  formUpdating: false,
  formUpdated: false,
  formUpdatingError: null,

  formsLoaded: false,
  formsLoading: false,
  formsLoadingError: null,

  formDetails: null,
  formDetailsLoading: false,
  formDetailsError: null,
};

// Async Thunk for creating a form
export const createForm = createAsyncThunk(
  "forms/createForm",
  async (formData: Omit<FormState, "_id">, { rejectWithValue }) => {
    try {
      const response = await API.post("/forms/create", formData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response.data.message || "Failed to create form"
      );
    }
  }
);

// Async Thunk for fetching form details
export const fetchAllForms = createAsyncThunk(
  "forms/fetchAllForms",
  async () => {
    try {
      const response = await API.get(`/forms/`);
      console.log(response.data);

      return response.data;
    } catch (error: any) {
      return error.response.data.message || "Failed to fetch form details";
    }
  }
);

// Async Thunk for fetching form details
export const fetchFormDetails = createAsyncThunk(
  "forms/fetchFormDetails",
  async (formId: string, { rejectWithValue }) => {
    try {
      const response = await API.get(`/forms/${formId}`);
      console.log(response.data);

      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response.data.message || "Failed to fetch form details"
      );
    }
  }
);

export const updateFormDetails = createAsyncThunk(
  "forms/UpdateFormDetails",
  async (
    { _id, title, description, fields }: FormState,
    { rejectWithValue }
  ) => {
    try {
      const response = await API.put(`/forms/${_id}`, {
        title,
        description,
        fields,
      });
      console.log(response.data);

      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response.data.message || "Failed to fetch form details"
      );
    }
  }
);

// Slice
const formsSlice = createSlice({
  name: "forms",
  initialState,
  reducers: {
    resetCreatingState: (state) => {
      state.formCreated = false;
      state.formCreatingError = "";
    },
    resetUpdatingState: (state) => {
      state.formUpdated = false;
      state.formUpdatingError = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllForms.pending, (state) => {
        state.formsLoading = true;
        state.formsLoadingError = null;
      })
      .addCase(
        fetchAllForms.fulfilled,
        (state, action: PayloadAction<FormState[]>) => {
          state.formsLoading = false;
          state.formsLoaded = true;
          state.forms = action.payload;
        }
      )
      .addCase(fetchAllForms.rejected, (state, action: PayloadAction<any>) => {
        state.formsLoading = true;
        state.formsLoadingError = action.payload;
      })
      // Create Form
      .addCase(createForm.pending, (state) => {
        state.formCreating = true;
        state.formCreated = false;
        state.formCreatingError = null;
        state.createdFormId = null;
      })
      .addCase(
        createForm.fulfilled,
        (state, action: PayloadAction<FormState>) => {
          console.log(action.payload);
          state.formCreating = false;
          state.formCreated = true;
          state.forms.push(action.payload);
          state.createdFormId = action.payload?._id || "";
        }
      )
      .addCase(createForm.rejected, (state, action: PayloadAction<any>) => {
        state.formCreating = false;
        state.formCreatingError = action.payload;
      })
      // Fetch Form Details
      .addCase(fetchFormDetails.pending, (state) => {
        state.formDetailsLoading = true;
        state.formDetails = null;
        state.formDetailsError = null;
      })
      .addCase(
        fetchFormDetails.fulfilled,
        (state, action: PayloadAction<FormState>) => {
          state.formDetailsLoading = false;
          state.formDetails = action.payload;
        }
      )
      .addCase(
        fetchFormDetails.rejected,
        (state, action: PayloadAction<any>) => {
          state.formDetailsLoading = false;
          state.formDetailsError = action.payload;
        }
      );
    builder
      .addCase(updateFormDetails.pending, (state) => {
        state.formUpdating = true;
        state.formUpdated = false;
        state.formUpdatingError = null;
      })
      .addCase(updateFormDetails.fulfilled, (state, action) => {
        state.formUpdating = false;
        state.formUpdated = true;
        state.formCreatingError = null;
        state.formDetails = {
          ...state.formDetails,
          title: action.payload.title,
          description: action.payload.description,
          fields: action.payload.fields,
        };
      })
      .addCase(updateFormDetails.rejected, (state, action) => {
        state.formUpdating = false;
        state.formUpdated = false;
        state.formUpdatingError = action.payload as string;
      });
  },
});
export const { resetCreatingState, resetUpdatingState } = formsSlice.actions;
export default formsSlice.reducer;
