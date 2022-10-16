import React, { useContext, useEffect } from 'react'
import Head from 'next/head'
import { Code, TextInput, Title } from '@mantine/core'
import Shell from '../../components/organisms/Shell'
import UserContext from '../../contexts/UserContext';
import { TableOfContents } from '../../components/organisms/TableOfContents';
import { useRouter } from 'next/router';
import ImageWithPicker from '../../components/molecules/ImageWithPicker';
import { useStyles } from './styles';

export default function ProfilePage() {
  const { user } = useContext(UserContext);
  const router = useRouter();

  useEffect(() => {
    if(!user) {
      router.push("/signin?r=/profile");
    }
  }, [user]);

  const { classes } = useStyles();

  return (
    <>
      <Head>
        <title>Profile | Autobar</title>
      </Head>
      <Shell>
        <div className={classes.root}>
          <div
            className={classes.profileInfoSegment}
          >
            <ImageWithPicker
              className={classes.profilePictureSelector}
              src={user?.profilePicture ? `${process.env.NEXT_PUBLIC_BUCKET_URL}/${user.profilePicture}` : undefined}
            />
            <div
              className={classes.profileInfoNameSurname}
            >
              <TextInput
                label="Name"
                value={user?.name}
                size={"md"}
              />
              <TextInput
                label="Surname"
                value={user?.surname}
                size={"md"}
              />
            </div>
          </div>
          <div className={classes.contactDetailsSegment}>
            <TextInput
              label="E-mail"
              value={user?.email}
              size={"md"}
              disabled
            />
            <TextInput
              label="Phone number"
              value={user?.phoneNumber}
              size={"md"}
              disabled
            />
            <TextInput
              label="Date of birth"
              value={new Date(user?.birthdate!).toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric' })}
              size={"md"}
              disabled
            />
          </div>
        </div>
      </Shell>
    </>
  )
}
