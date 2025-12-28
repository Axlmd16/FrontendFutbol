import http from "@/app/config/http";
import { API_ENDPOINTS } from "@/app/config/constants";

const inscriptionApi = {
  /**
   * Register a new athlete
   * @param {Object} athletePayload
   * @returns {Promise}
   */
  registerDeportista: (athletePayload) => {
    const response = http.post(API_ENDPOINTS.ATHLETES.CREATE, athletePayload);
    return response.data;
  },
};

export default inscriptionApi;
