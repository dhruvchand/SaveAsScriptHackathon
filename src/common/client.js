import axios from "axios";
import { v4 as uuidv4 } from "uuid";

const ENDPOINT = "http://localhost:60024/metrics:";

const sendMetrics = async function (payload) {
  payload.id = uuidv4();
  try {
    const response = await axios.post(ENDPOINT, payload);
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

export { sendMetrics };
