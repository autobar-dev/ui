import { Checkbox, PasswordInput, TextInput, Text, Button, Loader } from '@mantine/core';
import Head from 'next/head';
import Link from 'next/link';
import React, { useEffect, useMemo, useState } from 'react'
import KeyIcon from '../../components/atoms/KeyIcon';
import MessageIcon from '../../components/atoms/MessageIcon';
import Logo from '../../components/molecules/Logo';
import { useStyles } from './styles';

async function SendSignInRequest(email: string, password: string, rememberMe: boolean) {
  const response = await fetch(process.env.NEXT_PUBLIC_API_URL + "/auth/signin", {
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

  console.log(response);
}

export default function SignInPage() {
  const { classes } = useStyles();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const [loading, setLoading] = useState(false);

  const handleSignInButtonClick = async () => {
    setLoading(true);
    await SendSignInRequest(email, password, rememberMe);
    setLoading(false);
  };

  return (
    <>
      <Head>
        <title>Sign In | Autobar</title>
      </Head>
      <div className={classes.container}>
        <Logo
          iconColor="#E3B04B"
          textColor="#f8f8f8"
          type={"logo-with-text"}
          className={classes.logo}
        />
        <TextInput
          label="Email"
          className={classes.emailInput}
          size={'lg'}
          disabled={loading}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
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