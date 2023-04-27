import { useState } from "react"
import { SmallButtonGrey, SmallButton, TextAreaInputLarger } from "../components"
import { insertDoc, serverTimestamp, useFirestoreLiveQuery, useFirestoreQuery, where, updateDoc } from "../firebase"
import { Iteration, Review, AuthorFeedback, ReviewEdits, Argument, UserNotification } from "../global/types"
import { DiffText } from "./argument"
import hash from "string-hash"

const uniqueId = (reviewerId: string, content: string) => reviewerId + '-' + hash(content)

type Props = {
  convId: string,
  argId: string
  argument: Argument
}

type Comment = {
  uid: string, reviewer: string, comment: string
}

type Edit = {
  uid: string, reviewer: string, edits: ReviewEdits
}


const newComments = (reviewsWithComments: Review[], seen: Set<string>) => {
  const result: Array<Comment> = []
  reviewsWithComments.forEach(review => {
    review.comments!.forEach(comment => {
      const uid = uniqueId(review.id!, comment)
      if (!seen.has(uid)) result.push(
        { uid, reviewer: review.id!, comment })
    })
  })

  return result
}

const newEdits = (reviewsWithEdits: Review[], reviewsWithPreviousEdits: Review[], seen: Set<string>) => {
  const result: Array<Edit> = []
  reviewsWithEdits.forEach(review => {
    const { originalMessage, originalDetails, modifiedMessage, modifiedDetails } = review.edits!
    const content = originalMessage + originalDetails + modifiedMessage + modifiedDetails
    const uid = uniqueId(review.id!, content)
    if (!seen.has(uid)) result.push({ uid, reviewer: review.id!, edits: review.edits! })
  })
  reviewsWithPreviousEdits.forEach(review => {
    review.previousEdits!.forEach(edits => {
      const { originalMessage, originalDetails, modifiedMessage, modifiedDetails } = edits
      const content = originalMessage + originalDetails + modifiedMessage + modifiedDetails
      const uid = uniqueId(review.id!, content)
      if (!seen.has(uid)) result.push({ uid, reviewer: review.id!, edits })
    })
  })
  return result
}


export const Iterate = ({ convId, argId, argument }: Props) => {
  const { data: reviewsWithEdits, fetching: f1 } = useFirestoreLiveQuery<Review>(`conversations/${convId}/arguments/${argId}/reviews`, where('edits', '!=', null))
  const { data: reviewsWithPreviousEdits, fetching: f2 } = useFirestoreLiveQuery<Review>(`conversations/${convId}/arguments/${argId}/reviews`, where('previousEdits', '!=', null))
  const { data: reviewsWithComments, fetching: f3 } = useFirestoreLiveQuery<Review>(`conversations/${convId}/arguments/${argId}/reviews`, where('comments', '!=', null))
  const { data: iterations, fetching: f4 } = useFirestoreLiveQuery<Iteration>(`conversations/${convId}/arguments/${argId}/iterations`)
  const fetching = f1 || f2 || f3 || f4
  if (fetching) return <div>fetching...</div>
  const seen = new Set(iterations.map(x => x.uid))
  const comments = newComments(reviewsWithComments, seen)
  const edits = newEdits(reviewsWithEdits, reviewsWithPreviousEdits, seen)
  return <>
    <Comments {...{ convId, argId, comments, argument }} />
    <Edits {...{ convId, argId, edits, argument }} />
  </>
}


const Comments = ({ comments, convId, argId, argument }: { comments: Comment[], convId: string, argId: string, argument: Argument }) => {
  const [openId, setOpenId] = useState('')
  if (!comments.length) return <></>
  return <div>
    <div className="font-semibold mb-2 mt-4">Comments:</div>
    {comments.map(x => {
      const answerComment = (feedback: AuthorFeedback, authorEdits?: ReviewEdits) => {
        return insertDoc<Iteration>(`conversations/${convId}/arguments/${argId}/iterations`, {
          uid: x.uid,
          reviewerId: x.reviewer,
          type: 'comment',
          comment: x.comment,
          authorFeedback: feedback,
          processedAt: serverTimestamp(),
          ...authorEdits ? { authorEdits } : {}
        })
      }
      return <div className="bg-gray-100 p-3 my-3 rounded-md relative" >
        <div className="bg-white p-3 font-serif rounded-md mb-3">
          {x.comment}
        </div>
        <div className="flex justify-between">
          <SmallButton onClick={() => { setOpenId(x.uid) }}>
            Make some changes...
          </SmallButton>
          <div>
            <SmallButtonGrey onClick={() => answerComment('ignore')}>
              Ignore
            </SmallButtonGrey>
            <SmallButtonGrey onClick={() => answerComment('spam')}>
              Report spam</SmallButtonGrey>
          </div>
        </div>
        {
          openId === x.uid && <ChangeModal
            title={"Proposed changes"}
            feedback={x.comment}
            message={argument.message}
            details={argument.details || ''}
            onCancel={() => { setOpenId('') }}
            onSubmit={(message, details) => {
              setOpenId('');
              const authorEdits = {
                originalMessage: argument.message,
                modifiedMessage: message,
                originalDetails: argument.details || '',
                modifiedDetails: details
              }
              answerComment('thanks', authorEdits)
              updateDoc(`conversations/${convId}/arguments/${argId}`, { message, details })
              insertDoc<UserNotification>(`users/${x.reviewer}/notifications`, {
                type: 'comment-used',
                time: serverTimestamp(),
                argumentId: argument.id,
                comment: x.comment,
                authorEdits,
              })
            }}
          />
        }
      </div>
    })}
  </div >
}


const Edits = ({ edits, convId, argId, argument }: { edits: Edit[], convId: string, argId: string, argument: Argument }) => {
  const [openId, setOpenId] = useState('')
  if (!edits.length) return <></>
  return <div>
    <div className="font-semibold mb-2 mt-4">Proposed changes:</div>
    {edits.map(x => {
      const answerEdits = (feedback: AuthorFeedback, authorEdits?: ReviewEdits) => {
        return insertDoc<Iteration>(`conversations/${convId}/arguments/${argId}/iterations`, {
          uid: x.uid,
          reviewerId: x.reviewer,
          type: 'edit',
          edits: x.edits,
          authorFeedback: feedback,
          processedAt: serverTimestamp(),
          ...authorEdits ? { authorEdits } : {}
        })
      }
      return <div key={x.uid} className="bg-gray-100 p-3 my-3 rounded-md relative" >
        <div className="bg-white p-3 font-serif rounded-md mb-3">
          <SummarizeEdits edits={x.edits} />
        </div>
        <div className="flex justify-between">
          <SmallButton onClick={() => { setOpenId(x.uid) }}>
            Make some changes
          </SmallButton>
          <div>
            <SmallButtonGrey onClick={() => answerEdits('ignore')}>
              Ignore
            </SmallButtonGrey>
            <SmallButtonGrey onClick={() => answerEdits('spam')}>
              Report spam</SmallButtonGrey>
          </div>
        </div>
        {openId === x.uid && <ChangeModal
          title={"Proposed changes"}
          feedback={<SummarizeEdits edits={x.edits} />}
          message={argument.message}
          details={argument.details || ''}
          onCancel={() => { setOpenId('') }}
          onSubmit={(message, details) => {
            setOpenId('');
            const authorEdits = {
              originalMessage: argument.message,
              modifiedMessage: message,
              originalDetails: argument.details || '',
              modifiedDetails: details
            }
            answerEdits('thanks', authorEdits)
            updateDoc<Argument>(`conversations/${convId}/arguments/${argId}`, { message, details })
            insertDoc<UserNotification>(`users/${x.reviewer}/notifications`, {
              type: 'edits-used',
              time: serverTimestamp(),
              argumentId: argument.id,
              edits: x.edits,
              authorEdits,
            })
          }}
        />}
      </div>
    })}
  </div >
}

const LIMIT = 50;

export const SummarizeEdits = ({ edits }: { edits: ReviewEdits }) => <div>
  {edits.originalMessage !== edits.modifiedMessage &&
    <>
      <span className="font-sans font-semibold"> Summary: </span>
      <DiffText original={edits.originalMessage} modified={edits.modifiedMessage} limit={LIMIT} />
    </>}
  {edits.originalDetails !== edits.modifiedDetails &&
    <>
      <span className="font-sans font-semibold"> Details: </span>
      <DiffText original={edits.originalDetails} modified={edits.modifiedDetails} limit={LIMIT} />
    </>}
</div>

type ChangesModalProps = {
  title: string;
  feedback: any; // some react stuff, either edit or comment...
  message: string;
  details: string;
  onCancel: () => void;
  onSubmit: (message: string, details: string) => void;
}

const ChangeModal = ({ title, feedback, message, details, onCancel, onSubmit }: ChangesModalProps) => {
  const [_message, setMessage] = useState(message)
  const [_details, setDetails] = useState(details)
  const header = (style: any) =>
    <div className="bg-gray-300 rounded p-3 shadow-md max-h-48 overflow-y-auto" style={style}>
      <div className="max-w-2xl m-auto p-3">
        <h2 className="font-semibold mt-2 mb-2">{title}:</h2>
        <div className="bg-gray-200  rounded p-3">
          {feedback}
        </div>
      </div>
    </div>
  return <div className="fixed top-0 left-0 bottom-0 right-0 bg-gray-50 overflow-y-auto z-10" >
    {header({})}
    {header({ position: 'fixed', top: 0, left: 0, right: 0 })}
    <div className="max-w-2xl m-auto p-3 mb-[90px]">
      <h2 className="font-semibold mt-4 mb-2">Summary:</h2>
      <TextAreaInputLarger label="" value={_message} setter={setMessage} />
      <h2 className="font-semibold mt-2 mb-2">Details:</h2>
      <TextAreaInputLarger label="" value={_details} setter={setDetails} />
    </div>
    <div className="h-[90px] text-center bg-gray-100 fixed bottom-0 left-0 right-0 pt-6">
      <SmallButton onClick={() => onSubmit(_message, _details)}>
        Save changes
      </SmallButton>
      <SmallButtonGrey onClick={onCancel}>
        Cancel
      </SmallButtonGrey>
    </div>
  </div>
}


