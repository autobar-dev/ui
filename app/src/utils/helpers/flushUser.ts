import MeQuery from "../../graphql/MeQuery";
import User from "../../types/User";
import { sendGraphQL } from "./sendGraphQL";

export default async function flushUser(user: User | undefined, setUser: Function, apiUrl: string) {
  const query = MeQuery();  

  try {
    const { me } = await sendGraphQL(query, apiUrl);
    setUser(me);
  } catch(e) {
    setUser(undefined);
  }
}