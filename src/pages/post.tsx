import React, { useState } from "react"
import { Button, Form, InfoModal, Input, Select, SelectInput, SmallButton, TextAreaInput } from "../components";
import { insertDoc, serverTimestamp, useFirestoreLiveQuery } from '../firebase';
import { LeftOrRight, useSubscribers } from './conversation'
import { Argument, CredentialRequest, UserNotification } from "../global/types";
import { useGlobal } from "../global";
import { completeOnboardingStep } from "./onboarding";
import { Account } from "../graphics";
import CredRequest from "./credrequest";

const Label = ({ children }: any) =>
  <span className='font-bold'>{children}
  </span>


const RequiredLabel = ({ children }: any) =>
  <span className='font-bold'>{children}<span className='text-purple-900 text-lg'>*</span>
  </span>


const NEWCRED = 'REQUEST NEW CREDENTIAL'

export const PostNewArgument = ({ id, day, turn, draft }: any) => {
  const [{ user }] = useGlobal()
  const { data: credrequests } = useFirestoreLiveQuery<CredentialRequest>(`users/${user!.uid}/credentialrequests`)
  const [message, setMessage] = useState('')
  const [details, setDetails] = useState('')
  const [credentials, setCredentials] = useState<{ label: string, value: string }[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { data: subscribers } = useSubscribers(id)

  const credentialsOptions =
    [{ value: NEWCRED, label: NEWCRED },
    ...credrequests.filter(x => x.status !== 'rejected').map(x => (
      {
        value: x.credential + (x.status === 'approved' ? '(v)' : ''),
        label: x.credential + (x.status === 'approved' ? ' ✅' : x.status === 'requested' ? ' ⏳' : '')
      }
    ))]

  const showCredRequest = credentials.some(x => x.value === NEWCRED)

  return <LeftOrRight side={turn === 'yes' ? 'left' : 'right'}>
    <div className="max-w-md bg-gray-100 rounded-md shadow border-2 border-blue-300 p-3 m-2">
      <Form className="space-y-3" onSubmit={(e) => {
        e.preventDefault()
        if (message.length === 0) {
          return setError('Summary is required.')
        }
        if (message.length > 400) {
          return setError(`Summary is too long (${message.length}/400).`)
        }
        setError('')
        setLoading(true)
        const doc = {
          day,
          turn,
          conversationID: id,
          message,
          details,
          author: user!.uid,
          credentials: credentials.map((x: any) => x.value),
          posted: serverTimestamp(),
          ...draft ? { draft } : {}
        }
        console.log(doc)
        insertDoc<Argument>(`conversations/${id}/arguments`, doc).then((ref) => {
          completeOnboardingStep(user!, 'postsomearg')
          setError('')
          setLoading(false)
          setMessage('')
          setDetails('')
          setCredentials([])
          // TODO: move to server side!
          subscribers.forEach((sub) => {
            if (sub.side === turn || sub.side === 'both') {
              console.log('NOTIFYING...', sub)
              insertDoc<UserNotification>(`users/${sub.id}/notifications`, {
                type: 'new-argument',
                time: serverTimestamp(),
                conversationId: id,
                argumentId: ref.id,
                message: message
              })
            }
          })
        })
      }}>
        <h1 className="font-semibold ">
          {!draft ?
            <span>Your argument for "{turn}":</span>
            : <span>Your draft argument for "{turn}":</span>}
        </h1>
        <TextAreaInput
          value={message}
          setter={setMessage}
          label="Summary"
          reactLabel={<RequiredLabel>Summary</RequiredLabel>}
          placeholder={`One or two sentences, up to 250 characters.`}
        />
        <TextAreaInput
          value={details}
          setter={setDetails}
          label="Full argument"
          reactLabel={<RequiredLabel>Full argument</RequiredLabel>}
          placeholder={`Provide all the details and nuances that you want. \n`}
        />

        {showCredRequest ? <CredRequest onClose={(newCred, requestVerif) => {
          setCredentials(
            [...credentials.filter((x) => x.value !== NEWCRED),
            ...newCred ? [{
              label: newCred,
              value: newCred + (requestVerif ? ' ⏳' : '')
            }] : []
            ])
        }} /> :
          <SelectInput
            label="Credentials"
            placeholder="Optional list of credentials"
            reactLabel={
              <span>
                <Label>Credentials</Label>
                <InfoModal uid="postrequirescreds">
                  You'll need to use verified credentials each time you post an argument.
                  For instance, you can select the credential "{credentialsOptions[0].label}"
                  which you automatically got by creating an account with the
                  phone numbers that you provided. You can also request more credentials
                  on your account page, which you'll find by clicking on the icon "<Account className="inline h-5 w-5" />" on the top
                  right of this screen.
                </InfoModal>
              </span>

            }
            value={credentials}
            options={credentialsOptions as any}
            onChange={setCredentials as any}
          />
        }

        <div className="mt-3">
          <SmallButton type="submit" disabled={loading || showCredRequest}>
            {!draft ?
              <span>Submit argument</span>
              : <span>Save draft</span>}
          </SmallButton>
        </div>
        {error.length > 0 && <div className="text-red-500">{error}</div>}
      </Form >
    </div >
  </LeftOrRight >
}
