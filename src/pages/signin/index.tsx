import { Checkbox, PasswordInput, TextInput, Text, Button, Loader } from '@mantine/core';
import { useRouter } from 'next/dist/client/router';
import Head from 'next/head';
import Link from 'next/link';
import React, { useContext, useEffect, useMemo, useState } from 'react'
import KeyIcon from '../../components/atoms/KeyIcon';
import MessageIcon from '../../components/atoms/MessageIcon';
import Logo from '../../components/molecules/Logo';
import FirebaseContext from '../../contexts/FirebaseContext';
import UserContext from '../../contexts/UserContext';
import parseCookieString from '../../utils/helpers/parseCookieString';
import {
  getAuth,
  setPersistence,
  signInWithEmailAndPassword,
  browserLocalPersistence,
  browserSessionPersistence,
} from "firebase/auth";
import { useStyles } from './styles';

export default function SignInPage() {
  const { classes } = useStyles();
  const { flushUser } = useContext(UserContext);
  const router = useRouter();

  const { r } = router.query;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const [loading, setLoading] = useState(false);

  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  useEffect(() => {
    const auth = getAuth();

    if(auth.currentUser) {
      flushUser()
        .then(() => {
          if(r && typeof r == "string") {
            router.push(decodeURIComponent(r));
          } else {
            router.push("/");
          }
        })
        .catch((e: any) => {
          console.error(e);
        });
    }
  }, []);

  async function sendSignInRequest(email: string, password: string, rememberMe: boolean) {
    const auth = getAuth();

    try {
      const statePersistence = rememberMe ? browserLocalPersistence : browserSessionPersistence;

      await setPersistence(auth, statePersistence);
      const authResult = await signInWithEmailAndPassword(auth, email, password);

      console.log(authResult);

      return;
    } catch(e) {
      throw e;
    }
  }

  const handleSignInButtonClick = async () => {
    setEmailError("");
    setPasswordError("");

    const emailValidationRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;

    const emailMatches = emailValidationRegex.test(email);
    const passwordMatches = password.length > 0;

    if(!emailMatches || !passwordMatches) {
      if(!emailMatches) {
        setEmailError("Email is invalid");
      }

      if(!passwordMatches) {
        setPasswordError("Password is invalid");
      }
    } else {
      setLoading(true);
      
      try {
        await sendSignInRequest(email, password, rememberMe);
        await flushUser();

        if(r && typeof r == "string") {
          router.push(decodeURIComponent(r));
        } else {
          router.push("/");
        }
      } catch(e) {
        console.error(e);

        setPasswordError("Invalid email or password");
        setLoading(false);
      }
    }
  };

  return (
    <>
      <Head>
        <title>Sign In | Autobar</title>
      </Head>
      <div className={classes.container}>
        <Link href="/">
          <a className={classes.logo}>
            <Logo
              iconColor="#E3B04B"
              textColor="#f8f8f8"
              type={"logo-with-text"}
            />
          </a>
        </Link>
        <TextInput
          label="Email"
          className={classes.emailInput}
          size={'lg'}
          disabled={loading}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={emailError ? emailError : false}
          icon={
            <MessageIcon
              className={classes.inputIcon}
              color="#f8f8f8"
            />
          }
        />
        <PasswordInput
          label="Password"
          className={classes.passwordInput}
          size={'lg'}
          disabled={loading}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={passwordError ? passwordError : false}
          onKeyDown={(e) => e.key == "Enter" && handleSignInButtonClick()}
          icon={
            <KeyIcon
              className={classes.inputIcon}
              color="#f8f8f8"
            />
          }
        />
        <div className={classes.rememberMeAndForgotPassword}>
          <Checkbox
            label="Remember me"
            radius={5}
            className={classes.rememberMe}
            size={'sm'}
            disabled={loading}
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
          />
          <Link href="/forgotpassword">
            <a className={classes.forgotPassword}>
              <Text size={'sm'}>Forgot your password?</Text>
            </a>
          </Link>
        </div>
        <Button
          className={classes.signInButton}
          size={'lg'}
          disabled={loading}
          onClick={handleSignInButtonClick}
        >
          {
            loading ? 
              <Loader size={'sm'} />
            :
              "Sign In"
          }
        </Button>
        <Text size={'md'} className={classes.signUpText}>
          Don&apos;t have an account yet? <Link href="/signup"><a>Sign Up</a></Link>
        </Text>
      </div>
    </>
  )
}