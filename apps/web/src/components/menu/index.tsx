import { MenuIconWrapper } from "@/web/components/shared";

import { WithTooltip } from "@/web/components/with-tooltip";
import { authClient } from "@/web/lib/auth-client";
import { LogIn, LogOut } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReaderNavigationMenu } from "./reader-navigation-menu";

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
        <LogOut onClick={() => authClient.signOut()} />
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
