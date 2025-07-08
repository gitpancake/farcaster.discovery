import axios, { AxiosInstance } from "axios";

export abstract class Neynar {
  protected apiKey: string;
  protected baseUrl: string;
  protected instance: AxiosInstance;

  constructor() {
    if (!process.env.NEYNAR_API_KEY) throw new Error("NEYNAR_API_KEY is not defined");
    this.apiKey = process.env.NEYNAR_API_KEY;
    this.baseUrl = "https://api.neynar.com/v2";

    this.instance = axios.create({
      baseURL: this.baseUrl,
      headers: {
        accept: "application/json",
        api_key: this.apiKey,
      },
    });
  }
}
