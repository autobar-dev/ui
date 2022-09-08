import { Checkbox, PasswordInput, TextInput, Text, Button, Loader } from '@mantine/core';
import { useRouter } from 'next/dist/client/router';
import Head from 'next/head';
import Link from 'next/link';
import React, { useContext, useEffect, useMemo, useState } from 'react'
import KeyIcon from '../../components/atoms/KeyIcon';
import MessageIcon from '../../components/atoms/MessageIcon';
import Logo from '../../components/molecules/Logo';
import UserContext from '../../contexts/UserContext';
import parseCookieString from '../../utils/helpers/parseCookieString';
import { useStyles } from './styles';

async function SendSignInRequest(email: string, password: string, rememberMe: boolean) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/auth/signin`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({
      email,
      password,
    }),
  });

  if(response.status == 200) {
    return;
  } else {
    throw new Error(await response.text());
  }
}

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
        await SendSignInRequest(email, password, rememberMe);
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
          Don't have an account yet? <Link href="/signup"><a>Sign Up</a></Link>
        </Text>
      </div>
    </>
  )
}

export async function getServerSideProps(context: any) {
  const { req, query } = context;

  let redirectPath: string | undefined = undefined;
  const cookies = parseCookieString(req.headers.cookie);

  if(cookies.access_token) {
    const response = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/auth/verify`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        access_token: cookies.access_token,
      }),
    });

    if(response.status == 200) {
      redirectPath = query.r || "/";
    }
  }

  return {
    redirect: redirectPath ? {
      destination: redirectPath,
      permanent: false,
    } : undefined,
    props: {},
  };
}