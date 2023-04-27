import React, { useEffect, useState } from 'react';
import { Body, Button, Input, TextAreaInput, Select, Form, SmallButtonGrey } from '../components'
import { insertDoc, serverTimestamp } from '../firebase';
import { Argument, Conversation } from '../global/types';


const parse = (text: string) => {
  const data = { prompt: '', context: '', args: [] } as any
  let day = 1
  text.split('\n').forEach((_line: string) => {
    const line = _line.trim()
    if (!line.length) return
    if (line.startsWith('TOPIC')) {
      data.topic = line.split(':')[1].trim().toLowerCase().replace(/ /g, '-')
    }
    if (line.startsWith('QUESTION')) {
      data.prompt = line.split(':')[1].trim()
    }
    if (line.startsWith('INTRODUCTION:')) {
      data.context = line.split(':')[1].trim()
    }
    if (line.startsWith('ARGUMENT')) {
      try {
        const [, credentials, message] = line.match(/^\w*\s*\d*:*\s*\[(.+)\]: (.+)$/)!;
        data.args.push({
          credentials: credentials.split(', '),
          message,
          day: day++,
          turn: (day % 2) ? 'no' : 'yes',
          winning: true
        })
      } catch (e) {
        console.error(e)
        throw new Error('Failed to parse line: ' + line)
      }
    }
    if (line.startsWith('OPTION')) {
      try {
        const [, credentials, message] = line.match(/^\w*\s*\d*:*\s*\[(.+)\]: (.+)$/)!;
        data.args.push({
          credentials: credentials.split(', '),
          message,
          day: day,
          turn: (day % 2) ? 'yes' : 'no',
        })
      } catch (e) {
        console.error(e)
        throw new Error('Failed to parse line: ' + line)
      }
    }
  })
  return JSON.stringify(data, null, 2)
}

const Cheat = () => {
  const [script, setScript] = useState('')
  const [parsed, setParsed] = useState('')
  return <Body back header={<div className="text-center">
    <h1 className='text-lg font-bold'>
      Create content from AI-generated stuff...
    </h1>
  </div>
  }>
    <Form onSubmit={(e) => {
      e.preventDefault()
      if (!parsed.length) {
        // just parsing...
        try {
          setParsed(parse(script))
        } catch (err: any) {
          setParsed('')
          alert(err.message)
          console.error(err)
        }
      } else {
        // actually saving...
        const { prompt, context, topic, args } = JSON.parse(parsed) as any
        const winnings = args.filter((x: any) => x.winning).length
        insertDoc<Conversation>('conversations', {
          prompt,
          context,
          topic,
          firstTurnIsYes: true,
          orderPrio: 0,
          currentDay: winnings + 1,
          wasGenerated: true,
          startTime: serverTimestamp(),
        }).then((ref) => {
          const id = ref.id;
          Promise.all(args.map((arg: any) =>
            insertDoc<Argument>(`conversations/${id}/arguments`, {
              ...arg,
              conversationID: id,
              posted: serverTimestamp(),
            }))).then(() => alert('success!'))
        })
      }
    }}>
      <TextAreaInput value={script} setter={setScript} label="Script" />
      <pre>{parsed}</pre>
      <Button type="submit">{!parsed.length ? "Parse" : "Looks good... save it"}</Button>
    </Form>
  </Body >
}

/* PROMPT for https://platform.openai.com/playground/p/default-tweet-classifier (increase max length)

Imagine two teams of people debating the following:

[INSERT QUESTION....]

A moderator starts by phrasing a very clear question and start with a paragraph explaining why this this an interesting question to debate today. Then the two groups of people will debate. Each group speak one after the other. Each time one person for the group speak. They are anonymous but they will share some concise credentials.  A credential is like a title or diploma or anything relevant to establish the speaker's credibility. Speakers can have up to three credentials, separated by commas. Each argument is one paragraph long. The articipants are respectful, open minded and genuinely curious to understand the other side.  They try to be factual and provide numbers where they can while citing their sources.  Generate the corresponding debate and present it in the following way: 

TOPIC: [single-word summary of the general topic of the debate]
QUESTION: [insert debate question here]
INTRODUCTION: [insert intro from the moderator] 
ARGUMENT 1 [insert credentials here beetwen square brackets]): [insert first argument in favour]
ARGUMENT 2 [credentials]: [insert next argument, now against]
ARGUMENT 3 [credentials]:  [insert next argument, now in favour]
... 

Continue for a total of 5 arguments and then propose 5 options for the argument that may come after that, presenting it in the following way:  

OPTION 1 [credentials]: [possible argument...]
OPTION 2[credentials]: [possible argument...]
OPTION 3[credentials]:[possible argument...]
...

*/



export default Cheat;