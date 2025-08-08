import { UserButton, useSignUp, useUser} from '@clerk/nextjs';
import {useState} from "react";
import {isClerkAPIResponseError} from "@clerk/shared";

export default function Page1() {
    const [signInErrors, setSignInErrors] = useState<string[]>([]);
    const { signUp, isLoaded } = useSignUp();
    const {user, isSignedIn} = useUser();

    const signInWithGoogle = async () => {
        if (!isLoaded) {
            return;
        }

        setSignInErrors([]);
        try {
            await signUp.authenticateWithRedirect({
                strategy: 'oauth_google',
                redirectUrl: `/sign-in/sso-callback`,
                redirectUrlComplete: `/page2`,
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
        <h1>using signUp</h1>
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
                <UserButton afterSignOutUrl={'/page2'}/>
            </div>
        )}
    </div>);
}
