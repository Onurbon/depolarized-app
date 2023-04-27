import { useGlobal } from "../global"
import { Logo, Account, Plus } from "../graphics"
import { onboardingStepsLeft } from "../global/utils"

export const Header = ({ left, middle, showNew, hideNew }: any) => {
  const [{ user }, { goto }] = useGlobal()
  const stepsLeft = onboardingStepsLeft(user!)
  const notifications = user!.notificationCounts || 0
  return (
    <header className="bg-gradient-to-r border-b-2 border-gray-500 from-blue-100 via-purple-100 to-red-100">
      <nav className="mx-auto max-w-7xl px-6" aria-label="Top">
        <div className="flex w-full items-center justify-between h-20">
          <div className="flex items-center">
            {left}
          </div>
          <div className="flex items-center">
            {middle}
          </div>
          <div className="ml-1 space-x-4 flex">
            {showNew && <Plus className="hidden md:inline w-10 h-10 cursor-pointer" onClick={() => {
              goto('new')
            }} />}
            {showNew &&
              <Plus className="inline md:hidden w-10 h-10 cursor-pointer" onClick={() => {
                goto('new')
              }} />
            }
            <div className="relative">
              <Account className="inline w-10 h-10 cursor-pointer" onClick={() => {
                goto('account')
              }} />
              {(stepsLeft.length > 0) && <div
                className="absolute pointer-events-none right-[-5px] bottom-0 animate-bounce inline-block rounded-full h-6 w-6 border-2 border-green-500 text-center text-sm bg-black text-green-50">
                {stepsLeft.length}
              </div>}
              {(notifications > 0) && <div
                className="absolute pointer-events-none left-[-5px] bottom-0 animate-bounce inline-block rounded-full h-6 w-6 border-2 border-red-500 text-center text-sm bg-red-600 text-white">
                {notifications}
              </div>}
            </div>
          </div>
        </div>
      </nav>
    </header>
  )
}
