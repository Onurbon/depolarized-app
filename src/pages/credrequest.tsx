import { useState } from "react"
import { InfoModal, Input, SmallButton, SmallButtonGrey, TextAreaInput, InputCheckBox } from "../components"
import { insertDoc, serverTimestamp } from "../firebase"
import { useGlobal } from "../global"
import { CredentialRequest } from "../global/types"
import { completeOnboardingStep } from "./onboarding"

type Props = {
  onClose: (newCred?: string, requestVerif?: boolean) => void
}

const CredRequest = ({ onClose }: Props) => {
  const [{ user }] = useGlobal()
  const [newCred, setNewCred] = useState('')
  const [newCredEmail, setNewCredEmail] = useState('')
  const [evidence, setEvidence] = useState('')
  const [requestVerif, setRequestVerif] = useState(false)

  const onSubmit = (e: any) => {
    e.preventDefault()
    e.stopPropagation()
    const { uid, displayName, phoneNumber, email, emailVerified } = user!
    insertDoc<CredentialRequest>(`users/${user?.uid}/credentialrequests`, {
      credential: newCred,
      credentialEmail: newCredEmail,
      evidence,
      status: requestVerif ? 'requested' : 'norequest',
      requestedAt: serverTimestamp(),
      // user info for context...
      displayName,
      phoneNumber,
      email,
      emailVerified,
      userID: uid
    })
    setNewCred('')
    setEvidence('')
    onClose(newCred, requestVerif)
    completeOnboardingStep(user!, 'requestonecred')
  }

  return <div className='border rounded border-blue-600 p-3 space-y-4'>
    <Input
      label=""
      reactLabel={<span>
        <span className='font-bold'>New credential</span>
        <InfoModal uid="newcredname">
          Type any credential you want to associate with this account.
          <br />
          Credentials may correspond to an occupation, a job title,
          an affiliation, or any short bio (200 characters maximum).
        </InfoModal>
      </span>}
      value={newCred} setter={setNewCred}
      placeholder="e.g. NHS nurse, BigCorp employee"
    />
    <InputCheckBox
      value={requestVerif}
      setter={setRequestVerif}
      type="checkbox"
      label="Request a verified checkmark"
    />
    {requestVerif && <>
      <Input
        label=""
        reactLabel={<span>
          <span className='font-bold'>Related email</span>
          <InfoModal uid="newcredemail">
            If you're verifying your affiliation with a specific company or institution, please provide
            the corresponding professional email.
          </InfoModal>
        </span>}
        value={newCredEmail} setter={setNewCredEmail}
        placeholder="e.g. alice@nhs.co.uk, bob@bigcorp.com"
      />
      <TextAreaInput
        label="Relevant links or evidence"
        reactLabel={<span>
          <span className='font-bold'>Relevant links and evidence</span>
          <InfoModal uid="newcredlinks">
            Add links to the webpages that will help us verify the requested
            credential.
          </InfoModal>
        </span>}
        value={evidence} setter={setEvidence}
        placeholder="e.g. http://nhs.co.uk/staff, http://linkedin.com/bob, "
      />
    </>}
    <SmallButton
      type="button"
      onClick={onSubmit}> {requestVerif ? "Submit & request verification" : 'Submit'}</SmallButton>
    <SmallButtonGrey
      type="button"
      onClick={() => onClose()}>Cancel</SmallButtonGrey>

  </div >
}

export default CredRequest