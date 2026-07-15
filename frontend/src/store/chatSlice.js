import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "./api";

export const sendChat = createAsyncThunk(
  "chat/send",
  async ({ hcpId, message, history }) => {
    const res = await api.chat({ hcpId, message, history });
    return res;
  }
);

export const sendChatStream = createAsyncThunk(
  "chat/sendStream",
  async ({ hcpId, message, history }) => {
    const res = await api.chatStream({ hcpId, message, history });
    return res.data;
  }
);

const chatSlice = createSlice({
  name: "chat",
  initialState: {
    messages: [], // {role, content, tool_used}
    loading: false,
    error: null,
    streaming: false,
  },
  reducers: {
    resetChat(state) {
      state.messages = [];
    },
    addUserMessage(state, action) {
      state.messages.push({
        role: "user",
        content: action.payload,
        tool_used: null,
      });
    },
    appendAssistantChunk(state, action) {
      const chunk = action.payload;
      if (state.messages.length > 0 && state.messages[state.messages.length - 1].role === "assistant") {
        state.messages[state.messages.length - 1].content += chunk;
      } else {
        state.messages.push({
          role: "assistant",
          content: chunk,
          tool_used: null,
        });
      }
    },
    setStreaming(state, action) {
      state.streaming = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendChat.pending, (state) => {
        state.loading = true;
      })
      .addCase(sendChat.fulfilled, (state, action) => {
        state.loading = false;
        state.messages.push({
          role: "assistant",
          content: action.payload.reply,
          tool_used: action.payload.tool_used,
        });
      })
      .addCase(sendChat.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(sendChatStream.pending, (state) => {
        state.streaming = true;
        state.loading = true;
      })
      .addCase(sendChatStream.fulfilled, (state, action) => {
        state.streaming = false;
        state.loading = false;
        // Final chunk received, ensure assistant message exists
        if (state.messages.length === 0 || state.messages[state.messages.length - 1].role !== "assistant") {
          state.messages.push({
            role: "assistant",
            content: action.payload,
            tool_used: null,
          });
        }
      })
      .addCase(sendChatStream.rejected, (state, action) => {
        state.streaming = false;
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { resetChat, addUserMessage, appendAssistantChunk, setStreaming } = chatSlice.actions;
export default chatSlice.reducer;