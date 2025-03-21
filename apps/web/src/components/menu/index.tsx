import { MenuIconWrapper } from "@/web/components/shared";
// import {
// 	AlertDialog,
// 	AlertDialogAction,
// 	AlertDialogCancel,
// 	AlertDialogContent,
// 	AlertDialogDescription,
// 	AlertDialogFooter,
// 	AlertDialogHeader,
// 	AlertDialogTitle,
// 	AlertDialogTrigger,
// } from "@/web/components/ui/alert-dialog";
import { WithTooltip } from "@/web/components/with-tooltip";
import { LogIn } from "lucide-react";
import Link from "next/link";
import { ReaderNavigationMenu } from "./reader-navigation-menu";

// const SignOut = () => {
// 	return (
// 		<>
// 			<AlertDialog>
// 				<AlertDialogTrigger>
// 					{/* TODO: can't use Shadcn tooltip as it nests a button inside the alert dialog trigger button */}
// 					{/* <WithTooltip content={<p>Sign out</p>}> */}
// 					<MenuIconWrapper>
// 						<LogOut />
// 					</MenuIconWrapper>
// 					{/* </WithTooltip> */}
// 				</AlertDialogTrigger>
// 				<AlertDialogContent>
// 					<AlertDialogHeader>
// 						<AlertDialogTitle>
// 							Are you sure you want to sign out?
// 						</AlertDialogTitle>
// 						<AlertDialogDescription>
// 							You can still use the reader without being signed out, but you
// 							won't be able to save your progress.
// 						</AlertDialogDescription>
// 					</AlertDialogHeader>
// 					<AlertDialogFooter>
// 						<AlertDialogCancel>Cancel</AlertDialogCancel>
// 						<AlertDialogAction>Sign out</AlertDialogAction>
// 					</AlertDialogFooter>
// 				</AlertDialogContent>
// 			</AlertDialog>
// 		</>
// 	);
// };

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
	return (
		<div className="flex items-center justify-center gap-4 h-[50px]">
			<SignIn />
			<ReaderNavigationMenu />
		</div>
	);
};
