import { DocumentNode, responsePathAsArray } from "graphql";
import { getServiceUri } from "./getServiceUri";
import { getAuth } from "firebase/auth";

// YOU CAN ONLY PERFORM OPERATIONS REQUIRING A USER ACCOUNT ON THE CLIENT-SIDE (SERVER-SIDE WILL NOT CONTAIN THE USER AUTH TOKEN)

export async function sendGraphQL(query: DocumentNode, url?: string): Promise<any> {
  let gqlUrl = url || `${getServiceUri()}/graphql`;

  let authToken: string | undefined = undefined;

  if(typeof window !== "undefined") {
    const auth = await getAuth();
    const user = auth.currentUser;

    if(user) {
      authToken = await user.getIdToken();
    }
  }

  if(query && query.loc) {
    const body = query.loc?.source.body;

    const response = await fetch(gqlUrl, {
      method: "POST",
      mode: 'cors',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...(authToken ? { 'AuthToken': authToken } : {}),
      },
      body: JSON.stringify({
        query: body,
      }),
    });

    try {
      const parsedResponse = await response.json();
      
      if(parsedResponse.errors) {
        throw new Error(parsedResponse.errors.map((error: any) => error.message).join(", "));
      } else {
        return parsedResponse.data;
      }
    } catch (e) {
      throw e;
    }
  }

  throw new Error("Empty query");
}