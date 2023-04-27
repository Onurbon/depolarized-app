import { updateDoc } from "../firebase";
import { useState } from "react";
import { Body, SmallButton, TextAreaInput } from "../components";
import { useFirestoreLiveQuery, where } from "../firebase";
import { CredentialRequest } from "../global/types";

const CredReq = ({ cr }: { cr: CredentialRequest }) => {
  const [comment, setComment] = useState(cr.comment || '')
  return <div className="border-2 border-gray-500 shadow rounded p-3 space-y-4">
    <span className="font-semibold">{cr.displayName}</span> <br />
    <span>{cr.phoneNumber}</span> <br />
    <span>{cr.email} {cr.emailVerified && ' (verified)'}</span> <br />
    credential: <span className="font-semibold text-blue-500">
      {cr.credential}
    </span> <br />
    email: {cr.credentialEmail} <br />
    evidence: {cr.evidence} <br />
    status: {cr.status.toUpperCase()} <br />
    requested: {cr.requestedAt?.toDate().toLocaleString()}
    <TextAreaInput label="" value={comment} setter={setComment} placeholder="Your comment " />
    <SmallButton onClick={() => {
      updateDoc(`users/${cr.userID}/credentialrequests/${cr.id}`, { status: 'approved', comment })
    }}>Approve</SmallButton>
    <SmallButton onClick={() => {
      updateDoc(`users/${cr.userID}/credentialrequests/${cr.id}`, { status: 'rejected', comment })
    }}>Reject</SmallButton>
  </div>
}

const Verif = () => {
  const { data, fetching } = useFirestoreLiveQuery<CredentialRequest>('group:credentialrequests', where('status', '==', 'requested'));
  if (fetching) return <div>Loading...</div>
  return <Body header={
    <div className="text-center">
      <h1 className="text-xl font-bold">Pending credential requests ({data.length}) </h1>
    </div>
  }>
    {!data.length && 'There are no pending requests at this time.'}
    {data.map(cr => <CredReq key={cr.id} cr={cr} />)}
    {/* <pre>{JSON.stringify(data, null, 2)}</pre> */}
  </Body >

}

export default Verif