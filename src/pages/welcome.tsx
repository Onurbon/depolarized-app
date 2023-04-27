import React, { useState, useEffect } from 'react';
import { submitNumber, submitCode, setupRecaptchaVerifier } from '../firebase';
import { Body, Button, Input, PhoneInput, Form } from '../components'


type Step = 'askInviteAndPhoneNumber' | 'verifyPhoneNumber';


const RequiredLabel = ({ children }: any) =>
  <span className='font-bold'>{children}<span className='text-purple-900 text-lg'>*</span>
  </span>


const AskInviteAndPhoneNumber = ({ onComplete }: any) => {
  const [invite, setInvite] = useState('')
  const [inviteError, setInviteError] = useState('')
  const [number, setNumber] = useState('')
  const [validNumber, setValidNumber] = useState(false)
  const [numberError, setNumberError] = useState('')
  const [loading, setLoading] = useState(false)
  useEffect(() => { setupRecaptchaVerifier() }, [])

  return <Form onSubmit={(e) => {
    console.log('onSubmit', { invite, inviteError, number, numberError, loading })
    e.preventDefault()
    if (invite.length < 5) {
      // yup... we're not actually checking the invite code
      setInviteError('Invalid invite code')
      setNumberError('')
    } else if (!validNumber) {
      setInviteError('')
      setNumberError('Invalid phone number')
    } else {
      setInviteError('')
      setLoading(true)
      submitNumber(number,
        // on success 
        () => {
          setNumberError('')
          setLoading(false)
          onComplete(number)
        },
        // on error
        (e: any) => {
          console.error(e)
          setLoading(false)
          setNumberError(parseNumberError(e))
        })

    }
  }}>
    <span className='text-sm italic'>
      We are currently testing this prototype privately with a few selected people.
      If you don't have an invite code yet, you can <a className="underline text-purple-600"
        href="(link redacted)">join the waiting list</a>.
    </span>
    <Input
      type="text"
      value={invite}
      setter={setInvite}
      error={inviteError}
      label=""
      reactLabel={<RequiredLabel>Invite code:</RequiredLabel>}
      placeholder="AB12345" />
    <PhoneInput

      type="text"
      value={number}
      setter={setNumber}
      setValid={setValidNumber}
      error={numberError}
      errorSetter={setNumberError}
      label=""
      reactLabel={<RequiredLabel>Phone number:</RequiredLabel>}
      placeholder="e.g. +1 123-456-7890" />
    <Button id='sign-in-button' type="submit" disabled={loading}>Submit</Button>
  </Form >
}


const parseNumberError = (e: any) => {
  if (e.message === "Firebase: Invalid format. (auth/invalid-phone-number).") {
    return "Invalid phone number."
  }
  return e.message
}

const VerifyPhoneNumber = ({ number }: any) => {
  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  return <Form onSubmit={
    (e) => {
      e.preventDefault()
      submitCode(code, () => {
        setError('')
      }, (e: any) => {
        console.error(e)
        setError(e.message)
      })
    }
  }>
    <Input
      type="text"
      value={code}
      setter={setCode}
      error={error}
      label={`Enter the verification code sent to ${number}`}
      placeholder="123456" />
    <Button type="submit">Submit</Button>
  </Form>
}

const SignIn = () => {
  const [step, setStep] = useState<Step>('askInviteAndPhoneNumber')
  const [number, setNumber] = useState('')
  return <div>
    {(step === 'askInviteAndPhoneNumber') ?
      <AskInviteAndPhoneNumber onComplete={(phoneNumber: string) => {
        setStep('verifyPhoneNumber')
        setNumber(phoneNumber)
      }} /> :
      <VerifyPhoneNumber number={number} />}
  </div>
}


export const Welcome = () =>
  <Body>
    <SignIn />
  </Body>


export default Welcome