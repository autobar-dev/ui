import MeQuery from "../../graphql/MeQuery";
import { sendGraphQL } from "./sendGraphQL";

export default async function flushUser(setUser: Function, apiUrl: string) {
  const query = MeQuery();

  try {
    const { me } = await sendGraphQL(query, apiUrl);

    setUser(me);
  } catch(e) {
    console.error(e);
    setUser(undefined);
  }
}