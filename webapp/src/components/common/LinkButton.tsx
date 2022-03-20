import { Button, ButtonProps } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

export default function LinkButton(props: ButtonProps & {to: string}) {
  let navigate = useNavigate();
  return <Button onClick={() => navigate(props.to)} {...props} />;
}
