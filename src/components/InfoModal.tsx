import { useEffect, useState } from "react";
import { Modal } from "./Modal";
import { InformationCircleIcon } from '@heroicons/react/20/solid'
import { arrayUnion, updateDoc } from "../firebase";
import { User } from "../global/types";
import { useGlobal } from "../global";
import { SmallButtonGrey } from "./Button";

type Props = {
  children?: any;
  uid: string;
  openAfter?: string[];
  autoOpen?: boolean;
  carousel?: any[];
}

export const saveAsViewed = (user: User, uid: string) => {
  if (!user.viewedInfoModals?.includes(uid)) {
    updateDoc<User>(`users/${user.uid}`, {
      viewedInfoModals: arrayUnion(uid) as any
    })
  }
}


export const InfoModal = ({ children, uid, openAfter, autoOpen, carousel }: Props) => {
  const [{ user }, { markViewedInfoModal }] = useGlobal()
  const [open, setOpen] = useState(false)
  const [pulse, setPulse] = useState(false)
  const occurence = Math.random().toString()
  useEffect(() => {
    const viewed = user?.viewedInfoModals || []
    // @ts-ignore
    const isFirstOccurence = document.getElementById(uid).dataset.occurence === occurence
    if (user &&
      !viewed.includes(uid) &&
      !openAfter?.some(x => !viewed.includes(x)) &&
      !open &&
      isFirstOccurence) {
      setPulse(true)
      if (autoOpen) {
        setOpen(true)
      }

    } else if (pulse) {
      setPulse(false)
    }
  }, [user, open])
  const close = () => {
    //  optimistic update, to prevent another autoOpen
    markViewedInfoModal(uid)
    setOpen(false)
    setTimeout(() => saveAsViewed(user!, uid), 500)
  }
  return <>
    <div className="inline-block align-middle ml-1 relative" onClick={(e) => {
      e.preventDefault()
      e.stopPropagation()
      setOpen(true)
    }}>
      <InformationCircleIcon id={uid} className="cursor-pointer w-5 h-5 text-gray-400 pb-1" data-occurence={occurence} />
      {pulse &&
        <div className="absolute top-0 animate-ping bg-black w-5 h-5 rounded-full pointer-events-none" />
      }
    </div>
    {open && <Modal open={open} close={close} closeEasily={!carousel}>
      {carousel ? <Carousel pages={carousel} close={close} /> : children}
    </Modal>}
  </>
}

const SmallCloseButton = ({ close }: any) => <button
  type="button"
  className="inline-flex justify-center rounded-md border border-transparent bg-gray-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-gray-700 focus:outline-none sm:text-sm"
  onClick={close}
>
  Got it!
</button>


const Carousel = ({ pages, close }: any) => {
  const [page, setPage] = useState(0)
  return <div className=''>
    {pages[page]}
    <div className='text-center m-2 space-y-2'>
      <div>
        {
          pages.map((_: any, i: number) => i <= page ?
            <div className="inline-block bg-gray-800 m-2 w-2 h-2 rounded-full" /> :
            <div className="inline-block bg-gray-200 m-2 w-2 h-2 rounded-full" />
          )
        }
      </div >
      <div>
        <SmallButtonGrey disabled={page === 0} onClick={() => { setPage(page - 1) }}>Prev</SmallButtonGrey>
        {page < pages.length - 1 ?
          <SmallButtonGrey onClick={() => { setPage(page + 1) }}>Next</SmallButtonGrey> :
          <SmallCloseButton close={close} />
        }
      </div>
    </div >
  </div >
}