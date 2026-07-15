import axios from "axios";

export const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";

const client = axios.create({ baseURL: API_BASE });

export const api = {
  listHcps: () => client.get("/hcps").then((r) => r.data),
  createHcp: (data) => client.post("/hcps", data).then((r) => r.data),
  getHcp: (id) => client.get(`/hcps/${id}`).then((r) => r.data),
  deleteHcp: (id) => client.delete(`/hcps/${id}`).then((r) => r.data),
  clearAll: () => client.post("/hcps/clear-all").then((r) => r.data),

  listInteractions: (hcpId) =>
    client.get(`/interactions/hcp/${hcpId}`).then((r) => r.data),
  createInteraction: (data) => client.post("/interactions", data).then((r) => r.data),
  updateInteraction: (id, data) =>
    client.patch(`/interactions/${id}`, data).then((r) => r.data),

  chat: (payload) => client.post("/chat", { ...payload, hcp_id: payload.hcpId }).then((r) => r.data),
  chatStream: (payload) => client.post("/chat/stream", { ...payload, hcp_id: payload.hcpId }, { responseType: "text" }),
};

export default client;