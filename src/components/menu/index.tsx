import { MenuIconWrapper } from "@/components/shared";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { WithTooltip } from "@/components/with-tooltip";
import { supabaseClient } from "@/supabase/client";
import { useSession } from "@/supabase/helpers";
import { LogIn, LogOut } from "lucide-react";
import Link from "next/link";
import { ReaderNavigationMenu } from "./reader-navigation-menu";

const SignOut = () => {
	if (!supabaseClient) return null;
	return (
		<>
			<AlertDialog>
				<AlertDialogTrigger>
					{/* TODO: can't use Shadcn tooltip as it nests a button inside the alert dialog trigger button */}
					{/* <WithTooltip content={<p>Sign out</p>}> */}
					<MenuIconWrapper>
						<LogOut />
					</MenuIconWrapper>
					{/* </WithTooltip> */}
				</AlertDialogTrigger>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>
							Are you sure you want to sign out?
						</AlertDialogTitle>
						<AlertDialogDescription>
							You can still use the reader without being signed out, but you
							won't be able to save your progress.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Cancel</AlertDialogCancel>
						<AlertDialogAction
							onClick={() => {
								if (!supabaseClient) return;
								supabaseClient.auth.signOut();
							}}
						>
							Sign out
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</>
	);
};

const SignIn = () => {
	return (
		<WithTooltip content={<p>Sign in</p>}>
			<MenuIconWrapper>
				<Link href="/sign-in">
					<LogIn />
				</Link>
			</MenuIconWrapper>
		</WithTooltip>
	);
};

export const Menu = () => {
	const session = useSession();

	return (
		<div className="flex items-center justify-center gap-4 h-[50px]">
			{session ? <SignOut /> : <SignIn />}
			<ReaderNavigationMenu />
		</div>
	);
};
