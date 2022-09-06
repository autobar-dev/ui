import MeQuery from "../../graphql/MeQuery";
import { sendGraphQL } from "./sendGraphQL";

export default async function flushUser(setUser: Function, apiUrl: string) {
  console.log('apiUrl', apiUrl);

  const query = MeQuery();

  try {
    const response = await sendGraphQL(query, apiUrl);

    console.log('flushUser MeQuery response', response);
  } catch(e) {
    console.error(e);
    setUser(undefined);
  }
}