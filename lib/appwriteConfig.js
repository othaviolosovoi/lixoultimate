import { Client, Account } from "react-native-appwrite";

const endpoint = (process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT || '').trim();
const projectId = (process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID || '').trim();

console.log("Appwrite Config:", {
  endpoint,
  projectId,
  endpointLength: endpoint.length,
  projectIdLength: projectId.length,
});

const client = new Client()
  .setEndpoint(endpoint)
  .setProject(projectId);

const account = new Account(client);

export { account };
