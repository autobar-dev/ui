import { Button } from "@mantine/core";
import { useContext } from "react";
import UserContext from "../../contexts/UserContext";

export default function UserMenu() {
  const userContext = useContext(UserContext);

  return (
    <>
      <Button
        onClick={() => userContext.flushUser()}
      >Flush</Button>
    </>
  );
}