
import React, { useEffect, useState } from "react"
import { Button, Form, InfoModal, Select, SelectInput, SmallButton, SmallButtonGreen, SmallButtonGrey, TextAreaInput } from "../components";
import { useFirestoreQuery, where, orderBy, useFirestoreLiveQuery, updateDoc, arrayRemove, arrayUnion, updateDocNested, useFirestoreLiveDoc, serverTimestamp, insertDoc } from "../firebase";
import { useGlobal } from "../global";
import { Argument, Conversation, User, UserNotification } from "../global/types"
import { timeStatus } from "../global/utils"
import Monster from "../graphics/monster"
import { PostNewArgument } from "./post";
import { ArgumentPage } from "./argument"
import { completeOnboardingStep } from "./onboarding";
import { ArgStats } from "./review";
import { isArgumentPage } from "./home";
import { ExclamationTriangleIcon } from '@heroicons/react/20/solid'
import dedent from "dedent";

const useTimeStatus = (_conversation: any) => {
  const conversation = useFirestoreLiveDoc<Conversation>(`conversations/${_conversation.id}`, _conversation)
  return timeStatus(conversation)
}

const ConversationPage = ({ _conversation }: { _conversation: Conversation; }) => {
  const [{ user, path }] = useGlobal()
  const conversation = _conversation
  // const conversation = useFirestoreLiveDoc<Conversation>(`conversations/${_conversation.id}`, _conversation)
  const joined = user!.joinedConversations || []
  const registered = joined.includes(conversation.id!)
  const side = (user!.chosenSide || {})[conversation.id!]
  const [, , , p, argId] = path.split('/')
  const { id, prompt, context, moderator } = conversation
  const { status, details, day, turn } = useTimeStatus(conversation)
  const showContext = context && context.length
  const showWinning = status === 'COMPLETED' || (status === 'ACTIVE' && day! > 1)
  const showNextArgs = status === 'ACTIVE' && registered && (side === 'both' || side === turn);
  const showWaitForTurn = status === 'ACTIVE' && registered && side !== 'both' && side !== turn;
  const showJoinNow = status === 'ACTIVE' && !registered
  const showRegistration = status === 'COMING UP'
  const moderatorOrAdmin = (user?.isAdmin || user!.uid === conversation.moderator)
  const showModeration = moderatorOrAdmin && !conversation.terminated
  const { args, fetching } = useAllArguments({ userId: user!.uid, moderatorOrAdmin, id, day })
  const showPreviousLost = args.some(x => x.day < day! && !x.winning)
  if (isArgumentPage(path)) {
    return fetching ?
      <div>loading...</div> :
      <ArgumentPage
        key={argId}
        conversation={conversation}
        args={args}
        argId={argId} />
  }

  return <div className="pb-12">
    <TopBox {...{ user, prompt, status, details, conversation, registered, side, turn }} />
    {fetching ? '' : <>
      {showContext && <Context context={context} you={moderator === user!.uid} />}
      {showWinning && <WinningArgs day={day} args={args.filter(x => x.winning && x.day < day!)} id={id} status={status} />}
      {showNextArgs && <NextArgs args={args.filter(x => x.day === day)} id={id} day={day} turn={turn} />}
      {showWaitForTurn && <WaitForTurn args={args.filter(x => x.day === day! + 1)} id={id!} day={day!} turn={turn!} />}
      {showPreviousLost && <PreviousLosses args={args.filter(x => x.day < day! && !x.winning)} id={id} day={day} turn={turn} />}
      {showJoinNow && <JoinNow id={id!} />}
      {showRegistration && <Registration id={id!} />}
      {showModeration && <Moderation turn={turn!} conversation={conversation} args={args} />}
    </>}
  </div >
}

const TopBox = ({ user, prompt, status, details, conversation, registered, side, turn }: any) => {
  return <div className="bg-purple-100 text-center mb-3">
    <div className="text-lg font-semibold p-3 max-w-md mx-auto">
      {prompt}
    </div>
    <div className="text-sm font-semibold pb-3 text-gray-500">
      {status} &#8226; {details}
      <InfoModal uid="explainstatus" openAfter={["discoverhomepage"]}>
        Conversations are organised to start and end at specific dates.
        Their status is ACTIVE between the start and end dates,
        COMPLETED after the end date and COMING UP before the start date.
      </InfoModal>
    </div>
    {registered && !conversation.terminated && <div>
      <div className="max-w-xl m-auto">
        You have joined {" "}
        {side === 'yes' ? 'the "yes" team' : side === 'no' ? 'the "no" team' : 'both sides'}
        {side === turn ? ' and it is your turn.' : side === 'both' ? '.' : ' and it is not your turn.'}
        <InfoModal uid="sideofconversation" openAfter={["explainstatus"]}>
          You have joined this conversation indicating that you were planning to
          argue for a particular side (or both) and we automatically
          send notifications to remind you when it is your turn.
          You can click on "leave" to stop receiving notifications.
        </InfoModal>
        <div className="p-3">
          <SmallButtonGrey onClick={() => {
            updateDoc(`users/${user!.uid}`, { joinedConversations: arrayRemove(conversation.id) })
          }}> Leave this conversation </SmallButtonGrey>
        </div>
      </div>
    </div>}

  </div>
}


const Context = ({ context, you }: any) => {
  return <LeftOrRight side={'middle'}>
    <div className={`bg-gray-100 m-2 p-2 rounded-md shadow border-2 border-gray whitespace-pre-line`}>
      <div className='flex mb-2'>
        <div className='mr-3 h-12'>
          <Monster i={0} you={you} />
        </div>
        <div className=''>
          <div className='text-md italic font-semibold mb-1'>
            Moderator
            <InfoModal uid="argheader" openAfter={["discoverhomepage", "explainstatus"]}>
              Conversation are initiated and facilitated by users called "moderators" who are in charge of
              phrasing good questions, providing some context and steering the conversations into
              interesting directions.
            </InfoModal>
          </div>
        </div>
      </div>
      <div className="font-serif">
        {context}
      </div>
    </div >
  </LeftOrRight >
}


const Registration = ({ id }: { id: string }) => {
  const [{ user }] = useGlobal()
  const joined = user!.joinedConversations || []
  const side = user!.chosenSide || {}
  const registered = joined.includes(id)
  return registered ? <div className="p-4 text-center italic">
    <p className="mb-4">
      You have registered your interest in participating to this conversation and {" "}
      {{ yes: 'argue for "yes".', no: 'argue for "no".', both: 'contribute to both sides.' }[side[id]]}.
    </p>
    <SmallButtonGrey onClick={() => {
      updateDoc(`users/${user!.uid}`, { joinedConversations: arrayRemove(id) })
    }}>unregister</SmallButtonGrey>
  </div> : <div className="p-4 text-center italic max-w-xl m-auto">
    <p className="mb-4">
      This conversation hasn't started yet but you can
      register your interest by choosing one of the option below.
      You will be notified when the conversation starts and when it will be
      your turn to contribute.
    </p>
    {[
      { side: 'yes', desc: 'Join to argue for "yes"' },
      { side: 'no', desc: 'Join to argue for "no"' },
      { side: 'both', desc: 'Contribute to both sides' }].map(({ side, desc }) => <div className="m-3">
        <SmallButton onClick={() => {
          updateDocNested(`users/${user!.uid}`, {
            joinedConversations: arrayUnion(id),
            [`chosenSide.${id}`]: side
          })
          completeOnboardingStep(user!, 'registerupcoming')
        }}>{desc}</SmallButton>
      </div>)}

  </div>
}


const WaitForTurn = ({ id, day, turn, args }: { id: string, day: number, turn: string, args: Argument[] }) => {
  return <div>
    <SectionHeader >
      Which argument should go next?
    </SectionHeader>
    <div className="p-4 text-center italic max-w-xl m-auto">
      <p className="mb-4">
        It's the other side's turn to propose the next arguments, but you can start drafting
        something now and publish it in the next round (after making some changes to take into
        account what the other side said).
      </p>
    </div>
    {args.map((argument: Argument, i: number) => <ArgumentSummary
      currentDay={day}
      args={args}
      key={argument.id}
      cid={id}
      argument={argument}
      proposal={true}
      position={i + 1}
      total={args.length} />)}
    <PostNewArgument id={id} day={day + 1} turn={turn === 'yes' ? 'no' : 'yes'} draft />
  </div>
}



const JoinNow = ({ id }: { id: string }) => {
  const [{ user }] = useGlobal()
  return <div>
    <SectionHeader >
      Which argument should go next?
    </SectionHeader>
    <div className="p-4 text-center italic max-w-xl m-auto">
      <p className="mb-4">
        Do you want to contribute to this conversations? You first need to join and
        pick a side (or both) and we'll notify you when it's your turn.
      </p>
      {[
        { side: 'yes', desc: 'Join the conversation to argue for "yes"' },
        { side: 'no', desc: 'Join the conversation to argue for "no"' },
        { side: 'both', desc: 'Contribute to both sides' }].map(({ side, desc }) => <div key={side} className="m-3">
          <SmallButton onClick={() => {
            updateDocNested(`users/${user!.uid}`, {
              joinedConversations: arrayUnion(id),
              [`chosenSide.${id}`]: side
            })
            completeOnboardingStep(user!, 'registerupcoming')
          }}>{desc}</SmallButton>
        </div>)}
    </div>
  </div>
}

const short = (str: string) => str.slice(0, 50) + '...'

const suffix = ' (pending)'
const rmPending = (str: string) => str.endsWith(suffix) ? str.slice(0, str.length - suffix.length) : str;

const Moderation = ({ conversation, args, turn }: { conversation: Conversation, args: Argument[], turn: string }) => {
  const [winner, setWinner] = useState('')
  const [comment, setComment] = useState('')
  const { data: subscribers } = useSubscribers(conversation.id!)
  const [showSubscribers, setShowSubscribers] = useState(false)
  const options: any = { "": "select the winning argument..." }
  args.filter(x => !x.winning).forEach((x, i) => {
    options[x.id!] = `Option ${i + 1}: ${short(x.message)}`
  })

  const mainAction = ({ terminate }: { terminate: boolean }) => () => {
    // eslint-disable-next-line no-restricted-globals
    if (terminate && !confirm('Are you sure you want to terminate this conversation?')) return
    updateDoc<Conversation>(`conversations/${conversation.id}`,
      terminate ?
        {
          terminated: true,
          terminatedAt: serverTimestamp()
        }
        : {
          currentDay: conversation.currentDay! + 1
        }
    )
    updateDoc<Argument>(`conversations/${conversation.id}/arguments/${winner}`,
      {
        winning: true,
        wonAt: serverTimestamp(),
        credentials: args.find(x => x.id === winner)?.credentials.map(rmPending),
        ...(comment.trim().length ? { moderatorComment: comment } : {})
      }
    )
    if (!terminate) {
      // TODO: move this to batch update on server side! 
      subscribers.forEach(({ id }) => {
        insertDoc<UserNotification>(`users/${id}/notifications`, {
          type: 'next-round',
          time: serverTimestamp(),
          conversationId: conversation.id,
          prompt: conversation.prompt,
        })
      })
    }
    // TODO: sent notifications in case of termination too
  }

  return <div>
    <SectionHeader >
      Moderation
    </SectionHeader>
    <div className="p-4 text-center italic max-w-xl m-auto">
      <Form>
        <Select
          label="Winning argument (required)"
          value={winner}
          setter={setWinner}
          options={options}></Select>
        <TextAreaInput
          label="Moderator comment (optional)"
          value={comment}
          setter={setComment}
        ></TextAreaInput>
      </Form>
      <br />
      <a
        className="not-italic font-semibold inline-block text-sm text-center bg-yellow-500 hover:bg-yellow-700 text-white py-2 px-4 rounded mr-2"
        href={generateMailtoLink(conversation, turn, conversation.currentDay!, subscribers)}
        target="_blank" rel="noreferrer">Prepare Email</a>
      <SmallButton type="submit" disabled={!winner.length}
        onClick={mainAction({ terminate: false })}>Next day</SmallButton>
      <SmallButton type="submit" disabled={!winner.length}
        onClick={mainAction({ terminate: true })}>Terminate</SmallButton>
    </div>

    {
      showSubscribers ? <>
        <h1 className="text-center text-md font-thin">Subscribers</h1>
        {subscribers.map(({ name, email, phone, side }) => <div key={email}>
          <div className="text-center text-md max-w-xl m-auto">
            {name} ({email},{phone}) joined {side}
          </div>
        </div>)}
      </> : <div className="text-center text-md font-thin" onClick={() => setShowSubscribers(true)}>(show subscribers)</div>
    }
  </div >
}
const generateMailtoLink = (conversation: Conversation, turn: string, currentDay: number, subscribers: Subscriber[],) => {
  const nextTurn = turn === 'yes' ? 'no' : 'yes'
  const nextDay = currentDay + 1
  const emails = subscribers.filter(x => x.email).map(x => x.email)
  const bcc = emails.join(',')
  const subject = encodeURI(conversation.prompt + ` (Round ${nextDay} - ${nextTurn})`)
  const body = encodeURI(dedent`Dear depolarizers, 

    We're writing to you because you have joined the following conversation on the Depolarized app:

    > ${conversation.prompt}

    The moderator has elected a winning argument and flipped the switch to change side.    
    It is now the turn of contributors on the "${nextTurn}" side to propose arguments. 

    https://depolarized.co/conversation/${conversation.id}

    If you had proposed an argument in a previous round, and if this argument hasn't won yet, 
    you will still be able to find it towards the bottom of the page (under "Arguments you wrote 
    in previous rounds") and you are welcome to submit it again in later rounds.

    Please also feel free to reply to this email with any question or feedback!
    
    Andy and Bruno`);
  return `https://mail.google.com/mail/?view=cm&fs=1&tf=1&bcc=${bcc}&su=${subject}&body=${body}`
}

type Subscriber = {
  id: string;
  name: string;
  email: string | undefined;
  emailVerified: boolean;
  phone: string;
  side: "yes" | "no" | "both"
}

export const useSubscribers = (convId: string): {
  fetching: boolean
  data: Subscriber[],
} => {
  const { fetching, data } = useFirestoreQuery<User>('users', where('joinedConversations', 'array-contains', convId))
  return {
    fetching, data: data.map(user => ({
      id: user.id!,
      name: user.displayName,
      email: user.email,
      emailVerified: user.emailVerified,
      phone: user.phoneNumber,
      side: user.chosenSide[convId]
    }))
  }
}

const SectionHeader = ({ children }: any) =>
  <div className="w-full text-md italic  text-center border-b-2 h-4 mb-5">
    <span className="bg-gray-50 p-2 ">
      {children}
    </span>
  </div>

const useAllArguments = ({ userId, id, day, moderatorOrAdmin }: any) => {
  // winning arguments from previous days... 
  const { data: winningArgs, fetching: fetchingWinning } = useFirestoreQuery<Argument>(
    `conversations/${id}/arguments`,
    where('winning', '==', true),
    where('day', '<', day),
    orderBy('day'))
  // candidates for current days  
  const { data: nextArgs, fetching: fetchingNext } = useFirestoreLiveQuery<Argument>(
    `conversations/${id}/arguments`,
    where('day', '==', day), // 
    orderBy('posted'))
  // you drafts for candidates for next days  
  const { data: nextDayDrafts, fetching: fetchingNextDrafts } = useFirestoreLiveQuery<Argument>(
    `conversations/${id}/arguments`,
    where('day', '==', day + 1),
    orderBy('posted'))
  // the stuff you posted on previous days which didn't win  
  const { data: previousPosts, fetching: fetchingPreviousPosts } = useFirestoreLiveQuery<Argument>(
    `conversations/${id}/arguments`,
    where('day', '<', day),
    where('author', '==', userId),
    orderBy('day'))
  const fetching = fetchingWinning || fetchingNext || fetchingNextDrafts || fetchingPreviousPosts
  if (fetching) {
    return { fetching, args: [] }
  } else {
    return {
      fetching, args: filterDrafts(userId, moderatorOrAdmin, [
        ...winningArgs,
        ...nextArgs,
        ...nextDayDrafts,
        ...previousPosts.filter(x => !x.winning)])
    }
  }
}

// TODO: should filter on server side somehow, probably using subcollection for each user

const filterDrafts = (userId: string, moderatorOrAdmin: boolean, args: Argument[]) =>
  moderatorOrAdmin ? args :
    args.filter(a => !a.draft || a.author === userId)


const WinningArgs = ({ day, args, id, status }: any) => {
  return <div>
    <SectionHeader >
      Winning arguments{status === 'ACTIVE' && ' so far'}
      <InfoModal uid="winningargssection" openAfter={["discoverhomepage", "explainstatus"]}>
        Every day, users vote to elect a winning argument for that day.
        Below is the list of winning arguments from previous days.
      </InfoModal>
    </SectionHeader>
    {args.map((argument: Argument) => <div key={argument.id}>
      <ArgumentSummary currentDay={day} args={args} key={argument.id} cid={id} argument={argument} />
      {argument.moderatorComment && <Context context={argument.moderatorComment} you={false} />}
    </div>
    )}
  </div >
}

const NextArgs = ({ args, id, day, turn }: any) => {
  return <div>
    <SectionHeader >
      Which argument should go next?
      <InfoModal uid="nextargssection" openAfter={["discoverhomepage", "explainstatus"]}>
        Users are invited each day to propose different options for the next argument.
        Below is the list of options submitted so far.
      </InfoModal>
    </SectionHeader>
    {args.map((argument: Argument, i: number) => <ArgumentSummary
      currentDay={day}
      args={args}
      key={argument.id}
      cid={id}
      argument={argument}
      publishable
      proposal={true}
      position={i + 1}
      total={args.length} />)}
    <PostNewArgument id={id} day={day} turn={turn} />
  </div >
}

const PreviousLosses = ({ args, id, day, turn }: any) => {
  return <div>
    <SectionHeader >
      Arguments you wrote in previous rounds
      <InfoModal uid="prevroundlosses" openAfter={["discoverhomepage", "explainstatus"]}>
        This section is for the arguments you wrote in previous rounds which haven't yet
        been elected as best/winning argument. You may want to copy/paste them and
        make appropriate changes before resubmitting then in later rounds.
      </InfoModal>
    </SectionHeader>
    {args.map((argument: Argument, i: number) => <ArgumentSummary
      currentDay={day}
      args={args}
      key={argument.id}
      cid={id}
      argument={argument}
      proposal={true}
      position={i + 1}
      total={args.length} />)}
  </div >
}

// see https://codepen.io/robstinson/pen/oNLaLMN...
export const LeftOrRight = ({ side, children }: any) => <div className="w-full my-4">
  {side === "right" ?
    <div className="max-w-md ml-auto">{children}</div> :
    side === 'left' ?
      <div className="max-w-md" >{children}</div> :
      <div className="max-w-md m-auto" >{children}</div>
  }
</div>

const wordCountAndTime = (text?: string) => {
  if (!text || text.length === 0) return ''
  const words = (text).split(' ').length
  const time = Math.ceil(words / 200)
  return `(${words} words, ${time} minutes)`
}

export const placeAndOrder = (currentDay: number, args: Argument[], argId: string) => {
  const arg = args.find(x => x.id === argId)!
  const winningArgs = args.filter(x => x.winning && x.day < currentDay)
  const position = args.map(x => x.id).indexOf(argId)
  const { day } = arg
  const side = arg.turn === 'yes' ? '"yes"' : '"no"'
  const header = (arg.winning && arg.day < currentDay) ?
    `Best argument for ${side} in round ${day}`
    : (arg.day < currentDay && !arg.winning) ?
      `Previous proposal from round ${day}`
      : `Proposal ${(position - winningArgs.length) + 1} for ${side} in round ${day}`
  const prevArg = position > 0 ? args[position - 1].id : null
  const nextArg = position < args.length - 1 ? args[position + 1].id : null
  return { header, prevArg, nextArg }
}


export const ArgHeader = ({ turn, header, day, credentials, you }: any) => <div className='flex mb-2'>
  <div className='mr-3 h-12'>
    <Monster i={day} you={you} />
  </div>
  <div className=''>
    <div className='text-md italic font-semibold mb-1'>{header}</div>
    <div className='text-md italic '>
      {credentials?.map((x: any) => x.replace(/\(v\)/g, '✅')).join(', ')}
      {you && <span className="text-green-700 font-semibold pl-1">(you)</span>}
      {credentials.length > 0 &&
        <InfoModal uid="credentialsonmessage" openAfter={["discoverhomepage", "explainstatus"]}>
          Here is the list of credentials of the author...
        </InfoModal>}
    </div>
  </div>
</div>



type ArgSummaryProps = { currentDay: number, args: Argument[], argument: Argument, cid: string, proposal?: boolean, position?: number, total?: number, publishable?: boolean }

const ArgumentSummary = ({ currentDay, args, argument, cid, proposal, position, total, publishable }: ArgSummaryProps) => {
  const [{ user }, { goto }] = useGlobal()
  const { day, turn, message, credentials, details, author, draft } = argument
  const you = user!.uid === author
  const { header } = turn === 'moderator' ? { header: 'Moderator intro' } : placeAndOrder(currentDay, args, argument.id!)

  return <LeftOrRight side={turn === 'yes' ? 'left' : turn === 'no' ? 'right' : 'middle'}>
    <div className="bg-gray-100 m-2 p-2 rounded-md shadow border-2 border-gray whitespace-pre-line">
      {argument.draft &&
        <div className="text-center bg-gray-500 text-white  mb-4">
          <ExclamationTriangleIcon className="inline w-10" />
          UNPUBLISHED DRAFT </div>
      }
      <ArgHeader turn={turn} header={header} day={day} credentials={credentials} you={you} />
      <div className="font-serif">
        {message}
      </div>
      {<div className="mt-3 italic font-thin">
        {argument.winning ?
          (<SmallButtonGrey
            onClick={() => { goto(`conversation/${cid}/argument/${argument.id}`) }}>
            <span className="italic">
              Read more {wordCountAndTime(details)}
            </span>
          </SmallButtonGrey>) :
          !you ? <SmallButton
            onClick={() => { goto(`conversation/${cid}/argument/${argument.id}`) }}>
            <span className="">
              Review {wordCountAndTime(details)}
            </span>
          </SmallButton>
            : (draft && publishable) ?
              <SmallButtonGreen
                onClick={() => { updateDoc(`conversations/${cid}/arguments/${argument.id}`, { draft: false }) }}>
                <span className="">
                  Publish
                </span>
              </SmallButtonGreen>
              : <SmallButtonGreen
                onClick={() => { goto(`conversation/${cid}/argument/${argument.id}`) }}>
                <span className="">
                  Edit {wordCountAndTime(details)}
                </span>
              </SmallButtonGreen>}
      </div>}
      <ArgStats argument={argument} />
    </div >
  </LeftOrRight >
}


export default ConversationPage