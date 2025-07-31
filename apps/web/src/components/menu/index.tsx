import { MenuIconWrapper } from "@/web/components/shared";

import { WithTooltip } from "@/web/components/with-tooltip";
import { LogIn, LogOut } from "lucide-react";
import Link from "next/link";
import { ReaderNavigationMenu } from "./reader-navigation-menu";
import { authClient } from "@/web/lib/auth-client";
import { Button } from "@/web/components/ui/button";
import { usePathname } from "next/navigation";

const SignIn = () => {
  const currentUrl = usePathname();
  return (
    <WithTooltip content={<span>Sign in</span>}>
      <MenuIconWrapper>
        <Link href={`/signin?redirectUrl=${currentUrl}`}>
          <LogIn />
        </Link>
      </MenuIconWrapper>
    </WithTooltip>
  );
};

const SignOut = () => {
  return (
    <WithTooltip content={<span>Sign out</span>}>
      <MenuIconWrapper>
        <Button
          className="hover:bg-transparent"
          variant="ghost"
          onClick={() => authClient.signOut()}
        >
          <LogOut />
        </Button>
      </MenuIconWrapper>
    </WithTooltip>
  );
};

export const Menu = () => {
  const data = authClient.useSession();

  const hasSession = data.data?.session != null;

  return (
    <div className="flex items-center justify-center gap-4 h-[50px]">
      {hasSession ? <SignOut /> : <SignIn />}
      <ReaderNavigationMenu />
    </div>
  );
};
