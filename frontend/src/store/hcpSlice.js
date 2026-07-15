import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "./api";

export const fetchHcps = createAsyncThunk("hcp/fetchAll", async () => {
  return await api.listHcps();
});

export const addHcp = createAsyncThunk("hcp/add", async (data) => {
  return await api.createHcp(data);
});

export const fetchInteractions = createAsyncThunk(
  "hcp/fetchInteractions",
  async (hcpId) => {
    return await api.listInteractions(hcpId);
  }
);

export const saveInteraction = createAsyncThunk(
  "hcp/saveInteraction",
  async (data) => {
    return await api.createInteraction(data);
  }
);

export const editInteraction = createAsyncThunk(
  "hcp/editInteraction",
  async ({ id, data }) => {
    return await api.updateInteraction(id, data);
  }
);

export const deleteHcp = createAsyncThunk(
  "hcp/delete",
  async (id) => {
    await api.deleteHcp(id);
    return id;
  }
);

export const clearAll = createAsyncThunk("hcp/clearAll", async () => {
  await api.clearAll();
});

const hcpSlice = createSlice({
  name: "hcp",
  initialState: {
    list: [],
    selectedId: null,
    interactions: [],
    loading: false,
    saving: false,
    error: null,
  },
  reducers: {
    selectHcp(state, action) {
      state.selectedId = action.payload;
    },
    clearInteractions(state) {
      state.interactions = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchHcps.pending, (state) => { state.loading = true; })
      .addCase(fetchHcps.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchHcps.rejected, (state) => { state.loading = false; })
      .addCase(addHcp.pending, (state) => { state.saving = true; })
      .addCase(addHcp.fulfilled, (state, action) => {
        state.saving = false;
        state.list.unshift(action.payload);
        state.selectedId = action.payload.id;
      })
      .addCase(addHcp.rejected, (state) => { state.saving = false; })
      .addCase(fetchInteractions.pending, (state) => { state.loading = true; })
      .addCase(fetchInteractions.fulfilled, (state, action) => {
        state.loading = false;
        state.interactions = action.payload;
      })
      .addCase(fetchInteractions.rejected, (state) => { state.loading = false; })
      .addCase(saveInteraction.pending, (state) => { state.saving = true; })
      .addCase(saveInteraction.fulfilled, (state, action) => {
        state.saving = false;
        state.interactions.unshift(action.payload);
      })
      .addCase(saveInteraction.rejected, (state) => { state.saving = false; })
      .addCase(editInteraction.pending, (state) => { state.saving = true; })
      .addCase(editInteraction.fulfilled, (state, action) => {
        state.saving = false;
        const idx = state.interactions.findIndex(
          (i) => i.id === action.payload.id
        );
        if (idx !== -1) state.interactions[idx] = action.payload;
      })
      .addCase(editInteraction.rejected, (state) => { state.saving = false; })
      .addCase(deleteHcp.pending, (state) => { state.loading = true; })
      .addCase(deleteHcp.fulfilled, (state, action) => {
        state.loading = false;
        state.list = state.list.filter((h) => h.id !== action.payload);
        if (state.selectedId === action.payload) {
          state.selectedId = null;
          state.interactions = [];
        }
      })
      .addCase(deleteHcp.rejected, (state) => { state.loading = false; })
      .addCase(clearAll.pending, (state) => { state.loading = true; })
      .addCase(clearAll.fulfilled, (state) => {
        state.loading = false;
        state.list = [];
        state.selectedId = null;
        state.interactions = [];
      })
      .addCase(clearAll.rejected, (state) => { state.loading = false; });
  },
});

export const { selectHcp, clearInteractions } = hcpSlice.actions;
export default hcpSlice.reducer;