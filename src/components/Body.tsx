
import { useGlobal } from "../global"
import { Back } from "../graphics"

const defaultHeader = <>
  <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
    Depolarized.
  </h2>
  <p className="mt-2 text-center text-sm text-gray-600">
    A place for deep and balanced conversations.
  </p>
  <p className="mt-2 text-center text-sm text-purple-600">
    (private beta)
  </p>
</>


export function Body({ header, back, children }: any) {
  const [, { goBack }] = useGlobal()
  return (
    <div className="h-screen bg-gradient-to-r from-blue-100 via-purple-100 to-red-100">
      <div>
        <div className="flex min-h-full flex-col justify-center py-12 sm:px-6 lg:px-8">
          <div className="sm:mx-auto sm:w-full sm:max-w-md">
            {back && <div className="absolute w-10">
              <Back className="w-10 h-10 cursor-pointer" onClick={() => goBack('')} />
            </div>
            }
            {header || defaultHeader}
          </div>
          <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md md:max-w-xl ">
            <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
              {children}
            </div>
          </div>
        </div>
      </div>
    </div >
  )
}
