
import { useState } from "react"
import { useGlobal } from "../global"
import { OnboardingStep, User } from "../global/types"
import { onboardingStepsLeft } from "../global/utils"
import { ChevronRightIcon, ChevronDownIcon } from '@heroicons/react/20/solid'
import { arrayUnion, updateDoc } from "../firebase"


const StepCount = ({ n }: { n: number }) => <div
  className="inline-block rounded-full mr-1 h-6 w-6 border-2 border-green-500 text-center text-sm bg-black text-green-50">{n}</div>

export const completeOnboardingStep = (user: User, stepUID: string) => {
  if (!user.completedOnboardingSteps?.includes(stepUID)) {
    updateDoc<User>(`users/${user.uid}`, {
      completedOnboardingSteps: arrayUnion(stepUID) as any
    })
  }
}

const Step = ({ uid, name, details, completed }: OnboardingStep) => {
  const [{ user }] = useGlobal()
  const [open, setOpen] = useState(false)
  return <li key={uid} className="bg-green-200  my-3 p-1 pl-3 rounded border border-gray-200 shadow" onClick={() => { setOpen(!open) }}>
    <h1 className="relative select-none">
      {name}
      {open ?
        <ChevronDownIcon className="w-4 absolute right-2 top-[2px]" />
        : <ChevronRightIcon className="w-4 absolute right-2 top-[2px]" />}

    </h1>
    {open && <div className="select-none text-sm pt-2 italic">
      {details}
      <div>
        <button className="bg-green-500 rounded px-2 mt-3" onClick={() => {
          completeOnboardingStep(user!, uid)
        }}>skip</button>
      </div>
    </div>}
  </li>
}

const Onboarding = () => {
  const [{ user }] = useGlobal()
  const [open, setOpen] = useState(false)
  const steps = onboardingStepsLeft(user!)
  if (!steps.length) return <></>
  return <div className="rounded border border-gray-200 p-3 shadow-lg bg-green-100 mb-6">
    <h1 className="text-md select-none cursor-pointer"
      onClick={() => { setOpen(!open) }}
    > You have <StepCount n={steps.length} /> remaining onboarding steps
      {open ?
        <ChevronDownIcon className="w-4 absolute right-2 top-[2px]" />
        : <ChevronRightIcon className="w-4 absolute right-2 top-[2px]" />}
    </h1>
    {open && <ul className="">
      {steps.map(step => <Step key={step.uid}  {...step} />)}
    </ul>}
  </div>
}

export default Onboarding