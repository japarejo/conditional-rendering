import { Link, LinkProps } from "@chakra-ui/react";
import { Link as RouterLink, NavLinkProps } from "react-router-dom";

export default function AppLink(props: LinkProps & NavLinkProps) {
  return <Link as={RouterLink} {...props} />;
}
