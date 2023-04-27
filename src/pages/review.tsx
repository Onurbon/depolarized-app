import { useEffect, useState } from "react"
import { Form, InfoModal, MenuModal, SmallButton, TextAreaInput } from "../components"
import { arrayRemove, arrayUnion, insertDoc, serverTimestamp, updateDoc } from "../firebase"
import { useGlobal } from "../global"
import { Argument, FeedbackType, Review, UserNotification } from "../global/types"
import { Star, StarFull } from "../graphics"
import { completeOnboardingStep } from "./onboarding"
import { EyeIcon, StarIcon, FlagIcon, TrashIcon, ChatBubbleLeftIcon, PencilIcon } from '@heroicons/react/20/solid'

type Props = {
  argument: Argument,
  review: Review,
  open: boolean,
  close: () => void
}

// local memory prevent sending many review notifications... 
// TODO: should clear that from time to time!
const notificationAlreadySent: any = {}
export const notifyUserOfFeedback = (argument: Argument, feedbackType: FeedbackType) => {
  const key = argument.author + '/' + argument.id + '/' + feedbackType
  if (notificationAlreadySent[key]) return
  console.log('notifyUserOfFeedback', argument)
  insertDoc<UserNotification>(`users/${argument.author}/notifications`, {
    type: 'some-feedback',
    time: serverTimestamp(),
    conversationId: argument.conversationID,
    argumentId: argument.id,
    message: argument.message,
    feedbackType
  })
  notificationAlreadySent[key] = true
}

const flagOptions = [
  { uid: 'troll', label: 'Trolling', info: 'Use this flag if you believe that the author is (probably) trolling and not being sincere. ' },
  { uid: 'propaganda', label: 'Propaganda', info: 'Use this flag if you believe that this content sounds like ideological propaganda. ' },
  { uid: 'lowqual', label: 'Incomprehensible', info: 'Use this flag is the argument does not make any sense to you (e.g. because it is very poorly writen).' },
  { uid: 'illegal', label: 'Illegal', info: 'Use this flag (only) for the really bad things, including child pornography, terrorism and copyright infringment.' },
]

export const FlagModal = ({ argument, review, open, close }: Props) => <MenuModal title="Report as:" open={open} close={close}>
  {flagOptions.map(option => <FlagButton {...{ argument, review, ...option }} />)}
</MenuModal>


export const CommentModal = ({ argument, review, open, close }: Props) => {
  const [newComment, setNewComment] = useState('')
  return <MenuModal title="Your comments:" open={open} close={close}>
    {review.comments?.map(comment =>
      <div key={comment} className="bg-gray-200 p-3 pr-6 rounded-md relative">
        <span className="whitespace-normal font-serif">{comment}</span>
        <TrashIcon className="absolute top-3 right-3 h-5 w-5 text-gray-500 cursor-pointer"
          onClick={() => {
            updateDoc(review.path!, { comments: arrayRemove(comment) })
          }} />
      </div>)}
    <div className="border p-2 shadow rounded bg-gray-200">
      <Form onSubmit={(e) => {
        e.preventDefault()
        updateDoc(review.path!, { comments: arrayUnion(newComment) })
        notifyUserOfFeedback(argument, 'comment')
        setNewComment('')
      }}>
        <TextAreaInput minRows={2} label="" value={newComment} setter={setNewComment} placeholder="Something helpful..." />
        <SmallButton type="submit" style={{ marginTop: 10 }}>Post</SmallButton>
      </Form>
    </div>
  </MenuModal>
}

export const RateModal = ({ argument, review, open, close }: Props) => <MenuModal title="Your ratings:" open={open} close={close}>
  <ClearRatings review={review} />
  {ratingOptions.map(({ uid, label, info }) => <Rating key={uid} argument={argument} review={review} uid={uid} label={label} info={info} />)}
</MenuModal>


const ratingOptions = [
  { uid: 'strong', label: 'Strong', info: 'Does this make a strong and convincing case? (as opposed to, e.g. using hand-wavy arguments or boring platitude)' },
  { uid: 'concise', label: 'Concise', info: 'Is this short and dense in information? (as opposed to feeling very long and slow to read)' },
  { uid: 'respect', label: 'Respectful', info: 'Does the author sound like they are respecting people from the other side of the conversation?' },
  { uid: 'fact', label: 'Factual', info: 'Is the arguments based on concrete facts? (as opposed to, e.g. beeing very subjective and ideological)' }
]


const Rating = ({ argument, review, label, uid, info }: any) => {
  const [{ user }] = useGlobal()
  const [stars, setStars] = useState<number>(review.ratings[uid] || 0)
  useEffect(() => {
    setStars(review.ratings[uid] || 0)
  }, [JSON.stringify(review.ratings)])
  const setter = (score: number) => () => {
    setStars(score)
    updateDoc(review.path, { ratings: { ...review.ratings, [uid]: score } })
    notifyUserOfFeedback(argument, 'ratings')
    completeOnboardingStep(user!, 'ratesomearg')
  }
  return <div>
    <div className="flex justify-end">
      <span className="text-md pt-3 pr-5">{label}
        <InfoModal uid={`ratinginfo_${uid}`}>
          What we try to assess with the "{label.toLowerCase()}" rating is: {info}
        </InfoModal></span>
      <span className="flex">
        {[1, 2, 3, 4, 5].map(x => stars >= x ?
          <StarFull key={x} className="h-6 w-6 m-2 cursor-pointer" onClick={setter(x)} /> :
          <Star key={x} className="h-6 w-6 m-2 cursor-pointer" onClick={setter(x)} />)}
      </span>
    </div >
  </div >
}

const ClearRatings = ({ review }: any) => {
  return <div className="w-full text-right">
    <button className="underline" onClick={() => {
      updateDoc(review.path, { ratings: {} })
    }}>clear all</button>
  </div>
}

const FlagButton = ({ argument, review, label, uid, info }: any) => {
  const [{ user }] = useGlobal()
  const [selected, setSelected] = useState<boolean>(review.flags?.includes(uid))
  useEffect(() => {
    setSelected(review.flags?.includes(uid))
  }, [JSON.stringify(review.flags)])
  const setter = (adding: boolean) => () => {
    setSelected(adding)
    updateDoc(review.path, { flags: adding ? arrayUnion(uid) : arrayRemove(uid) })
    notifyUserOfFeedback(argument, 'flag')
  }
  return selected ?
    <button
      className="block rounded-md border border-transparent bg-red-700 w-full py-2 px-4 text-sm text-white font-medium shadow-sm  focus:outline-none focus:ring-2 focus:ring-grey-500 focus:ring-offset-2"
      onClick={setter(false)}
    >{label}</button>
    : <button
      className="block rounded-md border border-transparent bg-red-50 w-full py-2 px-4 text-sm font-medium shadow-sm hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-grey-500 focus:ring-offset-2"
      onClick={setter(true)}
    >{label}</button>
}

const sumObjectValues = (obj: any) => Object.values(obj || {}).reduce((acc: any, val: any) => acc + val, 0);

export const ArgStats = ({ argument }: { argument: Argument }) => {
  const [details, setDetails] = useState(false)
  const reviewers = argument.reviewers || 0
  const comments = argument.commentCounts || 0
  const edits = argument.editCounts || 0
  const totalStars = sumObjectValues(argument.ratingTotalStars)
  const totalFlags = sumObjectValues(argument.flagCounts)
  return !details ? <div className="text-gray-500 cursor-pointer select-none italic font-thin mt-2" onClick={(e) => {
    e.preventDefault()
    e.stopPropagation()
    setDetails(true)
  }}>
    {!!reviewers &&
      // @ts-ignore
      <span><EyeIcon className="inline w-5 h-5 pb-1" />{reviewers}</span>}
    {!!totalStars &&
      // @ts-ignore
      <span><StarIcon className="inline w-5 h-5 pb-1" />{totalStars}</span>}
    {!!comments &&
      // @ts-ignore
      <span><ChatBubbleLeftIcon className="inline w-5 h-5 pb-1" />{comments}</span>}
    {!!edits &&
      // @ts-ignore
      <span><PencilIcon className="inline w-5 h-5 pb-1" />{edits}</span>}
    {!!totalFlags &&
      // @ts-ignore
      <span> <FlagIcon className="inline w-5 h-5 pb-1" />{totalFlags}</span>}
  </div> :
    // @ts-ignore
    <div className="cursor-pointer select-none italic font-thin mt-2" onClick={(e) => {
      e.preventDefault()
      e.stopPropagation()
      setDetails(false)
    }}>
      <EyeIcon className="text-gray-500 inline w-5 h-5 pb-1" /> {reviewers} views
      {!!comments && <div className="mt-2">
        <ChatBubbleLeftIcon className="text-gray-500 inline w-5 h-5 pb-1" /> {comments} comments
      </div>}
      {!!edits && <div className="mt-2">
        <PencilIcon className="text-gray-500 inline w-5 h-5 pb-1" /> {comments} comments
      </div>}
      <div className="mt-2">
        {ratingOptions.map(({ uid, label }) => {
          const tot = (argument.ratingTotalStars || {})[uid] || 0
          const cnt = (argument.ratingCounts || {})[uid] || 0
          const avg = Math.round(tot / cnt)
          return !!cnt && <div>
            {
              [1, 2, 3, 4, 5].map(i =>
                i <= avg ? <StarIcon className="text-gray-500 inline w-5 h-5 pb-1" />
                  : <StarIcon className="text-gray-200 inline w-5 h-5 pb-1" />
              )
            }
            <span className=""> {label} </span> ({cnt})
          </div>
        })}
      </div>
      <div className="mt-2">
        {flagOptions.map(({ uid, label }) => {
          const cnt = (argument.flagCounts || {})[uid] || 0
          return !!cnt && <div>
            <FlagIcon className="text-gray-500 inline w-5 h-5 pb-1" /><span className=""> {label}</span> ({cnt})
          </div>
        })}
      </div>
    </div>
}

