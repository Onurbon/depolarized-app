import React, { useState, useEffect } from 'react';
import { setProfileName, setProfileEmail, sendEmailVerif } from '../firebase';
import { Body, Button, Input, Form } from '../components'
import { useGlobal } from '../global';


const RequiredLabel = ({ children }: any) =>
  <span className='font-bold'>{children}<span className='text-purple-900 text-lg'>*</span>
  </span>


const DetailsForm = ({ onComplete }: any) => {
  const [{ user }] = useGlobal()
  const [name, setName] = useState(user!.displayName || '')
  const [nameError, setNameError] = useState('')
  const [email, setEmail] = useState(user!.email || '')
  const [emailError, setEmailError] = useState('')
  const [loading, setLoading] = useState(false)
  useEffect(() => {
    setName(user!.displayName || '')
    setEmail(user!.email || '')
  }, [user])

  return <Form onSubmit={(e) => {
    e.preventDefault()
    setNameError(name.length ? '' : 'Name required')
    setEmailError(email.length ? '' : 'Email required')
    if (name.length && email.length) {
      setLoading(true)
      setProfileName(name)
        .catch((e) => {
          console.error(e)
          setNameError(e.message)
          setLoading(false)
        }).then(() => {
          if (email === user!.email) {
            setLoading(false)
            return
          }
          setProfileEmail(email)
            .then(() => {
              sendEmailVerif().then(() => {
                alert(`A verification email has been sent to ${email}. Please check your SPAM folder and mark the email as "NOT JUNK".`)
              }).catch(e => {
                console.error(e)
                setEmailError(e.message)
                setLoading(false)
              })
            })
        })
    }
  }}>
    <span className='text-sm italic'>
      Please provide your details so that we can communicate with you during beta testing.
      We will NOT share these with any other user.
    </span>
    <Input
      type="text"
      value={name}
      setter={setName}
      error={nameError}
      label="name"
      reactLabel={<RequiredLabel>Name</RequiredLabel>}
      placeholder="Jane Doe" />
    <Input
      type="text"
      value={email}
      setter={setEmail}
      error={emailError}
      label="email"
      reactLabel={<RequiredLabel>Email</RequiredLabel>}
      placeholder="jane.doe@gmail.com" />
    <Button id='sign-in-button' type="submit" disabled={loading}>Submit</Button>
  </Form >
}



export const Details = () =>
  <Body>
    <DetailsForm />
  </Body>


export default Details