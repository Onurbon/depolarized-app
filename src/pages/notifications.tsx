
import { useState } from "react"
import { useGlobal } from "../global"
import { User, UserNotification } from "../global/types"
import { ChevronRightIcon, ChevronDownIcon } from '@heroicons/react/20/solid'
import { arrayUnion, orderBy, removeDoc, updateDoc, useFirestoreLiveQuery } from "../firebase"
import { SummarizeEdits } from "./iterate"

const StepCount = ({ n }: { n: number }) => <div
  className="inline-block rounded-full mr-1 h-6 w-6 border-2 border-purple-500 text-center text-sm bg-black text-green-50">{n}</div>


const summary = (x: UserNotification) => <div>
  {x.type === 'comment-used' && 'Your comment was useful'}
  {x.type === 'edits-used' && 'Your edits were useful'}
  {x.type === 'new-argument' && 'New argument to review'}
  {x.type === 'next-round' && 'Next round in conversation'}
  {x.type === 'some-feedback' && 'You received some ' + x.feedbackType}
</div>

const LinkNewArgument = ({ x }: { x: UserNotification }) =>
  <span> Summary of the new argument: "{x.message}"
    <a
      className="block my-1 text-purple-800 underline"
      href={`/conversation/${x.conversationId!}/argument/${x.argumentId}`}>
      Review this argument.
    </a>
  </span>


const LinkArgumentFeedback = ({ x }: { x: UserNotification }) =>
  <span> A user added some {x.feedbackType} on your argument: "{x.message}"
    <a
      className="block my-1 text-purple-800 underline"
      href={`/conversation/${x.conversationId!}/argument/${x.argumentId}`}>
      Review the feedback.
    </a>
  </span>


const LinkConversation = ({ x }: { x: UserNotification }) =>
  <span>The moderator has elected a winning argument and flipped the
    switch to change side in the conversation "{x.prompt}"<br />
    <a
      className="block my-1 text-purple-800 underline"
      href={`/conversation/${x.conversationId!}`}>
      Open this conversation
    </a>
  </span>


const details = (x: UserNotification) => {
  return <div>
    {x.type === 'comment-used' && <>
      You said: "{x.comment}"
      <br />
      And the author made the following changes:
      <SummarizeEdits edits={x.authorEdits!} />
    </>}
    {x.type === 'edits-used' && <>
      You proposed the following changes:
      <SummarizeEdits edits={x.edits!} />
      <br />
      And the author made the following changes:
      <SummarizeEdits edits={x.authorEdits!} />
    </>}
    {x.type === 'new-argument' && <>
      <LinkNewArgument x={x} />
    </>}
    {x.type === 'some-feedback' && <>
      <LinkArgumentFeedback x={x} />
    </>}

    {x.type === 'next-round' && <>
      <LinkConversation x={x} />
    </>}
  </div>
}


const SingleNotification = ({ id, ...rest }: UserNotification) => {
  const [{ user }] = useGlobal()
  const [open, setOpen] = useState(false)
  return <li key={id} className="bg-purple-200  my-3 p-1 pl-3 rounded border border-gray-200 shadow" onClick={() => { setOpen(!open) }}>
    <h1 className="relative select-none">
      {summary(rest)}
      {open ?
        <ChevronDownIcon className="w-4 absolute right-2 top-[2px]" />
        : <ChevronRightIcon className="w-4 absolute right-2 top-[2px]" />}

    </h1>
    {open && <div className="select-none text-sm pt-2 italic">
      {details(rest)}
      <div>
        <button className="bg-purple-500 rounded px-2 mt-3 text-white" onClick={() => {
          removeDoc(`users/${user!.uid}/notifications/${id}`)
        }}>clear</button>
      </div>
    </div>}
  </li>
}

const Notifications = () => {
  const [{ user }] = useGlobal()
  const [open, setOpen] = useState(true)
  const { data: notifications } = useFirestoreLiveQuery<UserNotification>(`users/${user!.uid}/notifications`, orderBy('time'))
  if (!notifications.length) return <></>
  return <div className="rounded border border-gray-200 p-3 shadow-lg bg-purple-100">
    <h1 className="text-md select-none cursor-pointer"
      onClick={() => { setOpen(!open) }}
    > You have <StepCount n={notifications.length} /> new notifications
      {open ?
        <ChevronDownIcon className="w-4 absolute right-2 top-[2px]" />
        : <ChevronRightIcon className="w-4 absolute right-2 top-[2px]" />}
    </h1>
    {open && <ul className="">
      {notifications.map(notification => <SingleNotification key={notification.id!}  {...notification} />)}
    </ul>}
  </div>
}

export default Notifications