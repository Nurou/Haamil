import apiClient from "@haamil/api-client";
import { API_CONFIG } from "./config";

export default apiClient(API_CONFIG.baseUrl);
