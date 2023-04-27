import React, { useState } from 'react';
import { Body, SmallButton, SmallButtonGrey, Form, SmallInput, Input, TextAreaInput, InfoModal, Select } from '../components'
import { auth, setProfileName, setProfileEmail, sendEmailVerif, serverTimestamp, insertDoc, useFirestoreLiveQuery, removeDoc } from '../firebase';
import { useGlobal } from '../global';
import { PencilSquareIcon, CheckBadgeIcon, TrashIcon, ExclamationTriangleIcon, ClockIcon } from '@heroicons/react/20/solid'
import { CredentialRequest } from '../global/types';
import Onboarding, { completeOnboardingStep } from './onboarding';
import Notifications from './notifications';
import CredRequest from './credrequest';
import { checkVersions } from '../refresh';

const SignOut = () => {
  const [, { goto }] = useGlobal()
  return <SmallButtonGrey onClick={() => {
    // eslint-disable-next-line no-restricted-globals
    if (confirm('Are you sure you want to sign out? You will need a phone to sign back in.')) {
      auth.signOut()
      goto('/')
    }
  }}>
    Log out
  </SmallButtonGrey>
}

const CheckVersions = () => {
  return <SmallButtonGrey onClick={() => checkVersions(true)}>
    Check for update...
  </SmallButtonGrey>
}

const Editable = ({ label, initValue, onSubmit, infoModal, locked, error, verified, verificationNeeded }: any) => {
  const [editing, setEditing] = useState(false)
  const [value, setValue] = useState(initValue)
  return <div className="my-3">
    {
      (locked) ?
        <div >
          <span className="text-sm mr-3 font-bold text-gray-700">
            {label} {infoModal}
            :</span>
          {initValue}
          {verified && <CheckBadgeIcon className="ml-2 mb-1 inline h-5 w-5 text-green-700" />}
        </div>
        : (!editing) ?
          <button onClick={() => { setEditing(true) }}>
            <span className="text-sm mr-3 font-bold text-gray-700">
              {label} {infoModal}
              :</span>
            {!error ? initValue :
              <span className="text-red-800">{error}</span>}
            {<PencilSquareIcon className="ml-2 mb-1 inline h-5 w-5 text-gray-700" />}
            {verified && <CheckBadgeIcon className="ml-2 mb-1 inline h-5 w-5 text-green-700" />}
            {verificationNeeded && <CheckBadgeIcon className="ml-2 mb-1 inline h-5 w-5 text-orange-700"
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                alert(verificationNeeded)
              }} />}
          </button> : <Form onSubmit={(e) => {
            e.preventDefault()
            onSubmit(value)
            setEditing(false)
          }}>
            <SmallInput
              label={label}
              autoFocus
              value={value}
              setter={setValue}
              error={''}
            >
              <div className="my-2 " >
                <SmallButton type="submit" disabled={value.length === 0}
                >Save</SmallButton>
                <SmallButtonGrey type="button" onClick={() => { setEditing(false); setValue(initValue) }}>Cancel</SmallButtonGrey>
              </div>
            </SmallInput>
          </Form >}
  </div >
}



const Account = () => {
  const [{ user }] = useGlobal()
  const [name, setName] = useState<string>(user!.displayName || '')
  const [nameError, setNameError] = useState(false)
  const [email, setEmail] = useState<string>(user!.email || '')
  const [emailError, setEmailError] = useState<any>(false)
  const [emailVerified, setEmailVerified] = useState(!!user!.emailVerified)
  const { data: liveRequests } = useFirestoreLiveQuery<CredentialRequest>(`users/${user!.uid}/credentialrequests`)
  const [openCredRequest, setOpenCredRequest] = useState(false)
  if (emailVerified) {
    completeOnboardingStep(user!, 'verifemail')
  }
  return <Body back header={<div className="text-center">
    <h1 className='text-xl font-bold'>
      Account
      <InfoModal uid="youraccountpage"> You're looking at your account page.
        This is the place to update your details and request new credentials.
      </InfoModal>
    </h1>
  </div>
  }>

    <Onboarding />
    <Notifications />

    <Editable label="Phone"
      infoModal={
        <InfoModal uid="explainphone">
          Depolarized accounts are tied to your phone number.
          You'll need to contact us to transfer an account to a different number.
          Phone numbers are also used to verify specific credentials.
        </InfoModal>
      }

      initValue={user!.phoneNumber} locked verified />

    <Editable label="Name"
      infoModal={
        <InfoModal uid="explainname">
          Your name will <strong>not be shown to other users</strong> but we will use it when corresponding with you.
          Using your <strong>real name is optional</strong> but may help us verify the credentials that you want associated with your account.
        </InfoModal>
      }
      initValue={name} error={nameError} onSubmit={(value: any) => {
        setName(value)
        setNameError(false)
        setProfileName(value).catch(e => {
          console.error(e)
          setName(user!.displayName || '')
          setNameError(e.message)
        }).then(() => {
          completeOnboardingStep(user!, 'addname')
        })
      }} />

    <Editable label="Email" initValue={email} error={emailError}
      verified={emailVerified}
      infoModal={<InfoModal uid="explainpersoemail">
        Please provide your personal email and we will automatically
        send an verication code to the provided address. You will need
        to get this email verified before you can request other credentials.
      </InfoModal>}

      verificationNeeded={email && !emailVerified &&
        `A verification email must have been sent to ${email}. ` +
        `Check your spam folder if needed. `}
      onSubmit={(value: any) => {
        if (value === email) return;
        setEmail(value)
        setEmailError(false)
        setProfileEmail(value).then(() => {
          setEmailVerified(false)
          sendEmailVerif().then(() => {
            alert(`A verification email has been sent to ${value}.`)
          }).catch(e => {
            console.error(e)
          })
          completeOnboardingStep(user!, 'addemail')
        }).catch(e => {
          console.error(e)
          if (e.message === 'Firebase: Error (auth/requires-recent-login).') {
            // eslint-disable-next-line no-restricted-globals
            if (confirm(
              'For security reasons, you need to log out and sign' +
              ' back in before updating your email. Do you want to log out now?')) {
              auth.signOut()
              window.location.reload()
            } else {
              setEmail(user!.email || '');
              setEmailError('Recent login required')
            }
          } else {
            setEmail(user!.email || '')
            setEmailError(e.message)
          }
        })
      }} />
    <h2 className="text-sm mr-3 font-bold text-gray-700">Credentials:</h2>
    <ul className="list-disc m-4">
      {liveRequests.map(x =>
        <li key={x.id} className="h-9">
          {x.credential}
          <button onClick={() => {
            // eslint-disable-next-line
            if (x.status === 'rejected' || confirm(`Are you sure you want to delete "${x.credential}"`)) {
              removeDoc(`users/${user?.uid}/credentialrequests/${x.id}`)
            }
          }}>
            <TrashIcon className='ml-2 mb-1 inline h-5 w-5 text-gray-700' /></button>
          {x.status === 'requested' &&
            <button onClick={() => {
              alert('Your verification request was received on ' +
                x.requestedAt.toDate().toLocaleString()
                + ' and will be processed shortly.')
            }}>
              <ClockIcon className='ml-1 inline h-5 w-5 text-blue-500' />
              {/* <span className='text-blue-500'> verification pending </span> */}
            </button >}
          {x.status === 'rejected' &&
            <button onClick={() => { alert(x.comment) }}>
              <ExclamationTriangleIcon className='ml-1 inline h-5 w-5 text-red-500' />
              <span className='text-red-500'> rejected</span>
            </button >}
          {x.status === 'approved' && <>
            <CheckBadgeIcon className="ml-2 mb-1 inline h-5 w-5 text-green-700" />
          </>}
        </li>
      )}

    </ul>
    {
      openCredRequest ?
        <CredRequest onClose={() => { setOpenCredRequest(false) }} />
        :
        <SmallButton onClick={() => { setOpenCredRequest(true) }}>Request more credentials...</SmallButton>
    }

    <hr className="my-5" />
    <SignOut />
    <CheckVersions />
  </Body >
}

export default Account