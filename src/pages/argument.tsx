import { Header, InfoModal, SmallButton, SmallButtonGrey, SmallButtonRed, TextAreaInputLarger, ThreeColumnLayout } from "../components"
import { updateDoc, useFirestoreLiveDoc, serverTimestamp, deleteField, arrayUnion, useFirestoreDoc } from "../firebase"
import { useGlobal } from "../global"
import { Argument, Conversation, Review } from "../global/types"
import { Back, Star, Flag, Edit, Comment, Prev, Next } from "../graphics"
import { useEffect, useState } from "react"
import { ArgHeader, placeAndOrder } from "./conversation"
import { diffWords } from "diff"
import { FlagModal, CommentModal, RateModal, ArgStats, notifyUserOfFeedback } from "./review"
import InfoReview from "./info_review"
import { Iterate } from "./iterate"
// import Scratchpad from "./scratchpad"
import { AIPlayground } from "../ai/playground"


type Props = {
  conversation: Conversation,
  args: Argument[],
  argId: string
}

const truncate = (text: string, limit?: number) => {
  if (!limit || text.length < limit) return text
  const l = Math.ceil((limit - 5) / 2)
  return text.slice(0, l) + ' ... ' + text.slice(text.length - l)
}


export const DiffText = ({ original, modified, limit }: { original: string, modified: string, limit?: number }) => <>
  {modified === original ? original : diffWords(original, modified).map(({ added, removed, value }, i) =>
    added
      ? <span key={i} className="text-green-700 bg-green-200 ">{truncate(value, limit)}</span> :
      removed ?
        <span key={i} className="text-red-500  bg-red-200 line-through">{truncate(value, limit)}</span>
        :
        <span key={i}>{truncate(value, limit)}</span>)}
</>

export const ArgumentPage = ({ conversation, argId, args }: Props) => {
  const [{ user, path }, { goto }] = useGlobal()
  const data = args.find(x => x.id === argId)!
  const { day, message, credentials, details, winning, author } = data || {}
  const isAuthor = user!.uid === author
  const isAdmin = user?.isAdmin
  const reviewable = !isAuthor && !winning
  const [openModal, setOpenModal] = useState<false | string>(false)
  const [editing, setEditing] = useState(false)
  const [_message, setMessage] = useState(message)
  const [_details, setDetails] = useState(details)
  const [_originalMessage, setOriginalMessage] = useState(message)
  const [_originalDetails, setOriginalDetails] = useState(details)
  const reviewPath = `conversations/${conversation.id}/arguments/${argId}/reviews/${user!.uid}`
  const review = useFirestoreLiveDoc<Review>(reviewPath,
    { flags: [], ratings: {}, comments: [], path: reviewPath },
    { firstViewedAt: serverTimestamp() })
  const [hasRatings, setHasRatings] = useState(false)
  const [hasEdits, setHasEdits] = useState(false)
  const [hasComments, setHasComments] = useState(false)
  const [hasFlags, setHasFlags] = useState(false)
  const [hasChanged, setHasChanged] = useState(false)

  useEffect(() => {
    setHasRatings(Object.keys(review?.ratings).length > 0)
    setHasFlags(review?.flags?.length > 0)
    setHasComments(review?.comments?.length > 0)
    const hasEdits = !!review?.edits
    setHasEdits(hasEdits)
    if (hasEdits) {
      const edits = review?.edits!
      const changed = hasEdits && (edits.originalMessage !== message || edits.originalDetails !== details)
      setHasChanged(changed)
      if (!changed) {
        setMessage(edits.modifiedMessage)
        setDetails(edits.modifiedDetails)
      }
    }
  }, [JSON.stringify(review)])

  useEffect(() => {
    if (hasEdits) {
      const edits = review?.edits!
      const changed = hasEdits && (edits.originalMessage !== message || edits.originalDetails !== details)
      setHasChanged(changed)
    }
  }, [message, details])

  // handle missing argument 404 
  if (!data) return <div className="fixed top-0 left-0 bottom-0 right-0 bg-gray-50 text-center p-8 space-y-5">
    <div className="text-2xl">404</div>
    Could not find argument {argId} <br />
    <SmallButton onClick={() => { goto(`conversation/${conversation.id}`) }}>back to conversation</SmallButton>
  </div>

  const { header, prevArg, nextArg } = placeAndOrder(conversation.currentDay!, args, argId)
  // 
  return <div key={argId} className="fixed top-0 left-0 bottom-0 right-0 bg-gray-50" >
    <Header left={
      <span className="text-2xl font-bold text-gray-900">
        <Back className="w-9 h-9 cursor-pointer" onClick={() => {
          goto(`conversation/${conversation.id}`)
        }} />
      </span >
    }
      middle={
        <div>
          <div className="hidden md:block">
            {winning ? "Previous winning argument for:" :
              isAuthor ? "Iterating on your own argument for:" :
                "Reviewing proposed arguments for:"}
          </div>
          <div className="text-md font-bold text-gray-900" >
            {conversation.prompt}
            {!winning && !isAuthor && <InfoReview />}
          </div >
        </div>
      }
      showNew={false} />
    <div className="text-lg bg-gray-50 h-[calc(100%-172px)] whitespace-pre-line">
      <ThreeColumnLayout
        leftLabel="previous argument"
        left={<PreviousArgument convId={conversation.id!} argId={prevArg} />}
        rightLabel="AI playground"
        right={<AIPlayground convId={conversation.id!} argId={argId} compact />}>
        <div className="max-w-2xl m-auto">
          <ArgHeader header={header} credentials={credentials} day={day} you={isAuthor} />
          <br />
          {hasChanged && hasEdits && <div className="mt-4 text-md  text-blue-700 italic">
            You had proposed some edits to an earlier version of this document
            but the author has now published a new version. The red and green highlights are to indicate what
            has the author has changed since your last review.
            <InfoModal uid="norebasingyet">
              When you propose changes to an argument, we keep track of the exact version that you were looking
              at when proposing the changes. Before an author makes changes, they are prompted to
              review all the edits that have been proposed. If the author hasn't integrated your proposed edits
              in this new version, you can assume that they did so intentionally and there is no need to
              re-submit the same change.
            </InfoModal>
            <SmallButtonGrey onClick={() => {
              updateDoc(reviewPath, {
                edits: deleteField(),
                previousEdits: arrayUnion(review?.edits!)
              })
              setMessage(message)
              setDetails(details)
            }}>Clear edits and refresh</SmallButtonGrey>
          </div>}
          <h2 className="font-semibold mt-2 mb-2">Summary:</h2>
          <div className="font-serif">
            {editing ?
              <TextAreaInputLarger label="" value={_message || ''} setter={setMessage} /> :
              <DiffText original={_originalMessage} modified={_message} />}
          </div>
          <br />
          {<div className="">
            <h2 className="font-semibold mt-2 mb-2">Details:</h2>
            <div className="font-serif">
              {editing ?
                <TextAreaInputLarger label="" value={_details || ''} setter={setDetails} /> :
                <DiffText original={_originalDetails || ''} modified={_details || ''} />}
            </div>
          </div>}
          <div className="mt-4">
            <ArgStats argument={data} />
          </div>
          {isAuthor && <Iterate argId={argId} convId={conversation.id!} argument={data} />}
        </div>
      </ThreeColumnLayout>
    </div>
    <div className="h-[90px] text-center bg-gray-100">
      <div className="max-w-md m-auto h-[90px] flex justify-between">
        {editing ? <div className="h-10 m-auto">
          {hasEdits && <SmallButtonRed onClick={() => {
            // eslint-disable-next-line
            if (confirm('Are you sure you want to revert and loose all your previous edits?')) {
              setEditing(false)
              setMessage(message)
              setDetails(details)
              updateDoc(reviewPath, { edits: deleteField() })
            }
          }}>Clear</SmallButtonRed>}
          {<SmallButtonGrey onClick={() => {
            setEditing(false)
            setMessage(message)
            setDetails(details)
          }}>Cancel</SmallButtonGrey>}
          {!isAuthor && <SmallButton onClick={() => {
            setEditing(false)
            notifyUserOfFeedback(data, 'edits')
            updateDoc(reviewPath, {
              edits: {
                originalMessage: _originalMessage,
                modifiedMessage: _message,
                originalDetails: _originalDetails,
                modifiedDetails: _details || ''
              }
            })
          }}>Submit</SmallButton>}
          {(isAuthor || isAdmin) && <SmallButtonRed onClick={() => {
            setEditing(false)
            setMessage(_message)
            setDetails(_details)
            setOriginalMessage(_message)
            setOriginalDetails(_details)
            updateDoc(`conversations/${conversation.id}/arguments/${argId}`, { message: _message, details: _details })
          }}>Apply</SmallButtonRed>}
        </div> : <>
          {!prevArg ? <Prev className="h-6 w-6 m-6 opacity-10" />
            : <Prev className="h-6 w-6 m-6 cursor-pointer " onClick={() => { goto(`conversation/${conversation.id}/argument/${prevArg}`) }} />
          }
          {reviewable &&
            <>
              <ShadowFull full={hasFlags}>
                <Flag className="h-6 w-6 cursor-pointer" onClick={() => { setOpenModal(openModal === 'flag' ? false : 'flag') }} />
              </ShadowFull>
              <ShadowFull full={hasComments}>
                <Comment className="h-6 w-6 cursor-pointer" onClick={() => { setOpenModal(openModal === 'comment' ? false : 'comment') }} />
              </ShadowFull>
              <ShadowFull full={hasEdits && !hasChanged}>
                <Edit className="h-6 w-6 cursor-pointer" onClick={() => {
                  if (hasChanged && hasEdits) {
                    // eslint-disable-next-line
                    if (!confirm('The author has published a new version.'
                      + 'We need to clear your previous edits before making new ones.')) {
                      return
                    }
                    updateDoc(reviewPath, {
                      edits: deleteField(),
                      previousEdits: arrayUnion(review?.edits!)
                    }).then(() => {
                      setMessage(message)
                      setDetails(details)
                      setOriginalMessage(message)
                      setOriginalDetails(details)
                      setEditing(true)
                    })
                  } else {
                    // TODO: test this complex logic somehow...
                    setOriginalMessage(review?.edits?.originalMessage || message)
                    setOriginalDetails(review?.edits?.originalDetails || details || '')
                    setEditing(true)
                  }
                }} />
              </ShadowFull>
              <ShadowFull full={hasRatings}>
                <Star className="h-6 w-6 cursor-pointer" onClick={() => { setOpenModal(openModal === 'rate' ? false : 'rate') }} />
              </ShadowFull>
            </>}
          {(isAuthor || (isAdmin && !reviewable)) &&
            <ShadowFull full={hasEdits}>
              <Edit className="h-6 w-6 cursor-pointer" onClick={() => { setEditing(true) }} />
            </ShadowFull>
          }
          {!nextArg ? <Next className="h-6 w-6  m-6 opacity-10" />
            : <Next className="h-6 w-6 m-6 cursor-pointer " onClick={() => { goto(`conversation/${conversation.id}/argument/${nextArg}`) }} />
          }
        </>}
      </div>
    </div >
    {openModal === 'flag' && <FlagModal argument={data} review={review} open={true} close={() => { setOpenModal(false) }} />}
    {openModal === 'rate' && <RateModal argument={data} review={review} open={true} close={() => { setOpenModal(false) }} />}
    {openModal === 'comment' && <CommentModal argument={data} review={review} open={true} close={() => { setOpenModal(false) }} />}
  </div >
}

const ShadowFull = ({ children, full }: any) => !full ?
  <div className="h-6 w-6 my-6 rounded-full">
    {children}
  </div >
  : <div className="bg-gray-300 h-6 w-6 my-6 rounded-full">
    {children}
  </div>




const PreviousArgument = ({ convId, argId }: any) => {
  const { data, fetching } = useFirestoreDoc<Argument>(`conversations/${convId}/arguments/${argId}`)
  if (fetching) return <div>fetching prev arg...</div>
  return <div className="w-full text-center">
    <div className="inline-block text-left text-md max-w-2xl margin-auto">
      <h2 className="font-semibold mt-2 mb-2">Summary:</h2>
      <div className="font-serif">
        {data.message}
      </div>
      <h2 className="font-semibold mt-2 mb-2">Details:</h2>
      <div className="font-serif">
        {data.details}
      </div>
    </div>
  </div>
}