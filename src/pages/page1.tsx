import { UserButton, useSignIn, useUser} from '@clerk/nextjs';
import {isClerkAPIResponseError} from "@clerk/shared";
import {useState} from "react";

export default function Page1() {
    const [signInErrors, setSignInErrors] = useState<string[]>([]);
    const { signIn, isLoaded } = useSignIn();
    const {user, isSignedIn} = useUser();

    const signInWithGoogle = async () => {
        if (!isLoaded) {
            return;
        }

        setSignInErrors([]);
        try {
            await signIn.authenticateWithRedirect({
                strategy: 'oauth_google',
                redirectUrl: `/sign-in/sso-callback`,
                redirectUrlComplete: `/page1`,
            });
        } catch (error) {
            if (isClerkAPIResponseError(error)) {
                setSignInErrors(
                    error.errors.map((err) => {
                        return err.code;
                    })
                );
            } else {
                setSignInErrors(['something went wrong']);
            }
        }
    };

    return (<div>
        <h1>using signIn</h1>
        <button onClick={signInWithGoogle}>Sign in with google</button>
        <div id={"clerk-captcha"} />
        {signInErrors.length > 0 &&
            signInErrors.map((error, index) => {
                return (
                    <p
                        key={index}
                    >{error}</p>
                );
            })}
        { isSignedIn && (
            <div>
                Signed in as {user?.primaryEmailAddress?.emailAddress}
                <UserButton afterSignOutUrl={'/page1'}/>
            </div>
        )}
    </div>);
}
