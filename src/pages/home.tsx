import React, { useEffect, useState } from 'react';
import { useFirestoreQuery, getFirestoreDoc, orderBy } from '../firebase';
import { useGlobal } from '../global';
import { Conversation } from "../global/types"
import { ComingUp, Active, Completed, Back, Prev, Account } from "../graphics"
import { Header, InfoModal, Modal } from '../components';
import { timeStatus } from '../global/utils';
import ConversationPage from './conversation';
import { completeOnboardingStep } from './onboarding';
import InfoHome from "./info_home"

const StatusIcon = ({ status }: any) => {
  if (status === 'COMING UP') return <div className='w-12 h-12 pt-1 border-2 rounded-full border-radius-50  border-blue-600' >
    <ComingUp className="w-11 h-11" />
  </div>
  if (status === 'COMPLETED') return <div className='w-12 h-12 p-2 border-2 rounded-full border-radius-50  border-orange-600' >
    <Active className="w-7 h-7" />
  </div>
  if (status === 'ACTIVE') return <div className='w-12 h-12 pt-1  border-2 rounded-full border-radius-50  border-green-600' >
    <Completed className="w-11 h-10" />
  </div>
  throw new Error(`Unknown status: ${status}`)
}

const StatusInfo = ({ status, details }: any) => {
  if (status === 'COMING UP') return <div className='inline text-sm font-light text-blue-600' >
    {status} &#8226; {details}
  </div>
  if (status === 'COMPLETED') return <div className='inline text-sm font-light text-orange-600' >
    {status} &#8226; {details}
  </div>
  if (status === 'ACTIVE') return <div className='inline text-sm font-light text-green-600' >
    {status} &#8226; {details}
  </div>
  throw new Error(`Unknown status: ${status}`)
}

const Card = ({ selected, children, onClick }: any) => !selected ?
  <div className='bg-blue-50 border-b-4 border-gray-50 hover:bg-blue-100 p-3 pb-5' onClick={onClick}>{children}</div>
  : <div className='bg-blue-200 border-b-4 border-gray-50 p-3 pb-5' onClick={onClick}>{children}</div>


const Conversations = ({ selected, setSelected }: any) => {
  const [{ user }] = useGlobal()
  const { data, error } = useFirestoreQuery<Conversation>('conversations', orderBy('orderPrio', 'desc'))
  if (error) return <div className='text-red-900'>{error}</div>
  return <>{data.map(conv => {
    const { status, details } = timeStatus(conv)
    return <Card key={conv.id} selected={selected?.id === conv.id} onClick={() => {
      setSelected(conv)
      if (status === 'COMPLETED') completeOnboardingStep(user!, 'openonecompleted')
      if (status === 'ACTIVE') completeOnboardingStep(user!, 'openoneactive')
    }}>
      <div className='flex'>
        <div className='mr-3'>
          <StatusIcon status={status} />
        </div>
        <div className='leading-5'>
          <span className='line-clamp-1 mb-1'>
            <span className="text-sm font-light text-gray-400">/{conv.topic || 'general'} &#8226; </span >
            <StatusInfo status={status} details={details} />
          </span>
          <div className='text-md'>{conv.prompt}</div>
        </div>
      </div>
    </Card >
  })}
  </>
}

const ShowOneOrBoth = ({ left, right, showRight }: any) => <div>
  <div className="hidden w-full md:flex">
    {/* show both when big... */}
    <div className="flex-none w-[400px] h-full" >{left}</div>
    <div className="grow h-full">{right}</div>
  </div>
  <div className="md:hidden">
    {/* show only one... */}
    <div className="w-full h-full">{showRight ? right : left}</div>
  </div>
</div>


export const isArgumentPage = (path: string) => {
  const [, , , p, argId] = path.split('/')
  return p === 'argument' && argId
}

const Home = () => {
  const [{ user, path }, { goto }] = useGlobal()
  const convIdFromUrl = path.split('/')[2]
  const [selected, setSelected] = useState<Conversation | false>(false)
  const [error, setError] = useState<false | string>(false)
  useEffect(() => {
    if (convIdFromUrl) {
      getFirestoreDoc(`conversations/${convIdFromUrl}`)
        .then(snap => {
          if (snap.exists()) {
            setSelected({ id: convIdFromUrl, ...snap.data() } as Conversation)
          } else {
            setError(`Could not find conversation ${convIdFromUrl}`)
          }
        })
    } else {
      setSelected(false)
    }
  }, [convIdFromUrl])

  if (isArgumentPage(path)) {
    return !selected ?
      <div>loading...</div> :
      <ConversationPage _conversation={selected} />
  }

  return <div className='h-screen bg-gradient-to-r from-blue-50 via-purple-50 to-red-50'>
    <Header left={
      <>
        <span className="hidden md:block text-2xl font-bold text-gray-900">
          Depolarized
          <InfoHome />
        </span>
        {convIdFromUrl ?
          <>
            <span className="md:hidden text-2xl font-bold text-gray-900">
              <Back className="w-9 h-9 cursor-pointer" onClick={() => {
                setSelected(false)
                goto('')
              }} />
            </span>
          </>
          : <span className="md:hidden text-xl text-gray-900 font-semibold">
            Conversations
          </span>
        }
      </>
    } middle={selected && <span className="line-clamp-1 block md:hidden text-l ml-3 font-light text-gray-900">
      /{selected.topic || 'general'}
    </span>}
      showNew={user!.isAdmin && convIdFromUrl} />
    <div className='mx-auto max-w-7xl'>
      <ShowOneOrBoth
        showRight={!!convIdFromUrl}
        left={
          <div className="h-[calc(100%-92px)] overflow-y-auto bg-gray-50 p-3">
            <Conversations selected={selected} setSelected={(conv: Conversation) => {
              setError(false)
              setSelected(conv)
              goto(`conversation/${conv.id}`)
            }} /></div>}
        right={<div className="h-[calc(100%-92px)] overflow-y-auto bg-gray-50 md:p-3 relative">
          {error || (selected ? <ConversationPage _conversation={selected} /> :
            <div className='text-md italic text-gray-600 p-3 text-center mt-24'>
              Welcome to Depolarized. <br />
              Select a conversation on the left column to get started. <br />
              <Prev className='inline h-12 mt-12 text-gray-600 opacity-25' />
            </div>
          )}
        </div>}
      />
    </div>
  </div >

}

export default Home