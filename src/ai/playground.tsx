import { useState, useEffect } from "react"
import TextareaAutosize from 'react-textarea-autosize';
import { promptsTree } from './prompts'
import * as examples from './examples'
import { inputToString } from "./utils"
import { callGPT, callDALLE } from "./api";
import { useGlobal } from "../global";
import { updateDoc, useFirestoreDoc, useFirestoreLiveDoc, useFirestoreQuery, where } from "../firebase"
import { Argument, Conversation } from "../global/types";
import dedent from "dedent";

const Loading = () => {
  const [time, setTime] = useState<number>(0)
  useEffect(() => {
    const interval = setInterval(() => { setTime((t) => t + 1) }, 1000)
    return () => clearInterval(interval)
  }, [])
  return <span className="text-gray-500 text-sm">Loading ({time}s)...</span>
}

const LoadingImage = () => {
  const [time, setTime] = useState<number>(0)
  useEffect(() => {
    const interval = setInterval(() => { setTime((t) => t + 1) }, 1000)
    return () => clearInterval(interval)
  }, [])
  return <div className="text-gray-500 text-xs">
    Generating image ({time}s)...
  </div>
}


const summarizeArg = (a: Argument) => dedent`
  Someone with credentials "${a.credentials.join(',')}" 
  made the following argument for ${a.turn}: 
  ${a.message}
  `

const useDebateData = (convId: string, argId: string): false | string => {
  const { data: conversation, fetching: f1 } = useFirestoreDoc<Conversation>(
    `conversations/${convId}`)
  const { data: arg, fetching: f2 } = useFirestoreDoc<Argument>(
    `conversations/${convId}/arguments/${argId}`)
  const { data: winning, fetching: f3 } = useFirestoreQuery<Argument>(
    `conversations/${convId}/arguments`,
    where('winning', '==', true))
  const fetching = f1 || f2 || f3
  if (fetching) return false
  const prevArg = winning.find(x => x.day === arg.day - 1)
  return inputToString({
    prompt: conversation.prompt,
    intro: conversation.context,
    summary: winning
      .filter(x => x.day < arg.day - 1)
      .map(summarizeArg)
      .join('\n\n'),
    prev: prevArg && {
      name: 'Previous Speaker',
      credentials: prevArg.credentials.join(','),
      side: prevArg.turn as any,
      message: prevArg.message + '\n\n' + (prevArg.details || '')
    },
    last: {
      name: 'Last Speaker',
      credentials: arg.credentials.join(','),
      side: arg.turn as any,
      message: arg.message + '\n\n' + (arg.details || '')
    }
  })
}

const useCache = (convId: any, argId: any): any => {
  if (!argId) return {}
  // eslint-disable-next-line
  return useFirestoreLiveDoc<any>(
    `conversations/${convId}/arguments/${argId}/ai/cache`, {}, {})

}

const saveCache = (convId: any, argId: any, uid: any, output: any) => {
  if (!argId) return
  updateDoc(`conversations/${convId}/arguments/${argId}/ai/cache`, { [uid]: output })
}

const clearCache = (convId: any, argId: any, uid: any) => {
  if (!argId) return
  updateDoc(`conversations/${convId}/arguments/${argId}/ai/cache`, { [uid]: null })
}


type Props = { convId?: string, argId?: string, compact?: boolean }

export const AIPlayground = (props: Props) => {
  const [{ path }] = useGlobal()
  const [, , , _convId, , _argId] = path.split('/')
  const convId = props.convId || _convId
  const argId = props.argId || _argId
  const compact = !!props.compact
  const [text, setText] = useState('')
  const [output, setOutput] = useState('')
  const [error, setError] = useState('')
  const [customPrompt, setCustomPrompt] = useState('')

  const [model, setModel] = useState('gpt-3.5-turbo')

  const [promptEditorOpen, setPromptEditorOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [loadingTime, setLoadingTime] = useState(0)
  const [loadedFromCache, setLoadedFromCache] = useState<boolean | string>(false)
  // eslint-disable-next-line
  const debateFromUrl = !!argId && useDebateData(convId, argId)
  useEffect(() => { if (debateFromUrl) setText(debateFromUrl) }, [debateFromUrl])
  const [loadingImage, setLoadingImage] = useState(false)
  const [imageError, setImageError] = useState<any>(false)
  const [generatedImage, setGeneratedImage] = useState<any>(false)
  const aiCache = useCache(convId, argId)

  useEffect(() => {
    const prefix = 'DALL-E PROMPT:'
    if (!loading && output.trim().startsWith(prefix)) {
      console.log('TRUGGER IMAGE GENERATION')
      const imagePrompt = output.slice(prefix.length)
      setLoadingImage(true)
      setImageError(false)
      callDALLE(imagePrompt).then(response => {
        setGeneratedImage(response.data.data[0].url)
      }).catch(e => {
        const errMessage = e?.response?.data?.error?.message || e.message
        console.log('ERROR', errMessage)
        setImageError(errMessage)
      }).finally(() => {
        setLoadingImage(false)
      })
    } else {
      setLoadingImage(false)
      setImageError(false)
      setGeneratedImage(false)
    }
  }, [output, loading])
  return <div className="m-auto ">
    <div className="flex">
      {!compact && <div className="grow-0  p-2 space-y-2">
        <h1 className="font-semibold mt-3">Load famous debate:</h1>
        {Object.keys(examples as any).map(name =>
          <button key={name}
            className="block rounded bg-gray-200 hover:bg-gray-300 p-1 px-3 my-2"
            onClick={() => {
              setText(inputToString((examples as any)[name]))
            }}>{name}</button>)}
      </div>}
      {!compact && <div className="grow  p-2 h-[100vh] overflow-auto">
        <TextareaAutosize
          className="w-full resize-none"
          value={text}
          minRows={20}
          onChange={(e) => setText(e.target.value)}
        />
      </div>}
      <div className="grow  p-2 h-[100vh] overflow-auto">
        {error.length ?
          <span className="text-red-500">{error}</span> :
          loading ?
            <Loading />
            : loadingTime ? (
              promptEditorOpen ? <>
                <TextareaAutosize
                  className="w-full resize-none"
                  value={customPrompt}
                  minRows={20}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                />
                <button className="mt-5 text-blue-500 underline" onClick={() => {
                  setLoading(true)
                  const start = Date.now()
                  setError('')
                  const prompt = customPrompt.replace(/\$TEXT/g, text)
                  callGPT(model, prompt).then((res: any) => {
                    setOutput(
                      res.data.choices[0].message.content
                    )
                  }).catch(err => {
                    console.log({ err })
                    setError(err.response.data.error.message)
                  }).finally(() => {
                    setLoading(false)
                    setLoadingTime((Date.now() - start) / 1000)
                    setPromptEditorOpen(false)
                  })
                }}>run this prompt</button>
                <button className="ml-3 mt-5 text-blue-500 underline"
                  onClick={() => {
                    setPromptEditorOpen(false)
                  }}>
                  close
                </button>

              </>
                : <div className="w-full text-center">
                  <div className="text-left inline-block">
                    {loadedFromCache ?
                      <div className="text-gray-500 text-sm mb-3">
                        Loaded from cache <button className="inline text-sm underline "
                          onClick={() => {
                            clearCache(convId, argId, loadedFromCache)
                            setOutput('')
                            setLoadingTime(0)
                          }}>
                          (clear)
                        </button>
                      </div>
                      : <div className="text-gray-500 text-sm mb-3">
                        Loaded in {loadingTime}s
                      </div>}
                    <div className="max-w-2xl whitespace-pre-line font-serif">{output}</div>
                    <button className="mt-5 text-blue-500 underline" onClick={() => {
                      setPromptEditorOpen(true)
                    }}>tweek prompt</button>
                    {imageError ? <div className="max-w-2xl text-red-500 text-sm">DALL-E ERROR: {imageError}</div> :
                      loadingImage ? <LoadingImage /> :
                        generatedImage ?
                          <img className="block mt-5" src={generatedImage} alt="generated img" />
                          : false}
                  </div>
                </div>) : 'Waiting for instruction...'}
        {/* IMAGE OUTPUT */}

      </div>
      <div className="grow-0 p-2 h-[100vh] space-y-2 overflow-auto text-sm">
        Model: <select className="bg-transparent text-sm" value={model} onChange={(e) => { setModel(e.target.value) }}>
          <option value="gpt-3.5-turbo">gpt-3.5-turbo</option>
          <option value="gpt-4">gpt-4</option>
        </select>
        {promptsTree.map(({ categoryName, prompts }) =>
          <div key={categoryName}>
            <h1 className="font-semibold mt-3">{categoryName}:</h1>
            {prompts.map(({ uid, name, prompt: promptTemplate }) =>
              <button key={name}
                className="block rounded-lg border-2 border-black hover:bg-gray-300 p-1 px-3 my-2"
                style={aiCache[uid] ? { backgroundColor: 'pink' } : {}}
                onClick={() => {
                  setLoading(true)
                  const start = Date.now()
                  setError('')
                  const prompt = promptTemplate.replace(/\$TEXT/g, text)
                  if (aiCache[uid]) {
                    console.log('YO, doing stuff')
                    setCustomPrompt(promptTemplate)
                    setOutput(aiCache[uid])
                    setLoading(false)
                    setLoadingTime(1)
                    setLoadedFromCache(uid)
                  } else {
                    callGPT(model, prompt).then((res: any) => {
                      setCustomPrompt(promptTemplate)
                      const _output = res.data.choices[0].message.content
                      setOutput(_output)
                      saveCache(convId, argId, uid, _output)
                    }).catch(err => {
                      console.log({ err })
                      setError(err.response.data.error.message)
                    }).finally(() => {
                      setLoading(false)
                      setLoadingTime((Date.now() - start) / 1000)
                      setLoadedFromCache(false)
                    })

                  }
                }}>{name}</button>
            )}
          </div>
        )}
      </div>
    </div >
  </div >
}

export default AIPlayground