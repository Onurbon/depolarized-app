import React, { useEffect, useState } from 'react';
import { Body, Button, Input, TextAreaInput, Select, Form, SmallButtonGrey } from '../components'
import { insertDoc, serverTimestamp } from '../firebase';
import { useGlobal } from '../global';
import { Conversation } from '../global/types';
import { Timestamp } from 'firebase/firestore';

const today = () => new Date().toISOString().split('T')[0]

const NewConversation = () => {
  const [, { goto }] = useGlobal()
  const [topic, setTopic] = useState('')
  const [prompt, setPrompt] = useState('')
  const [context, setContext] = useState('')
  const [promptError, setPromptError] = useState('')
  const [date, setDate] = useState(today())
  const [duration, setDuration] = useState("5")
  const [loading, setLoading] = useState(false)
  const [whoStarts, setWhoStarts] = useState("yes")
  return <Body back header={<div className="text-center">
    <h1 className='text-lg font-bold'>
      New conversation
    </h1>
  </div>
  }>
    <Form onSubmit={(e) => {
      e.preventDefault()
      if (!prompt.length) {
        setPromptError('Prompt can not be empty');
        return
      }
      if (!prompt.trim().endsWith('?')) {
        setPromptError('Prompts should be yes/no questions ending with "?"');
        return
      }
      setPromptError('')
      setLoading(true)
      insertDoc<Conversation>('conversations', {
        prompt,
        context,
        topic,
        startTime: Timestamp.fromDate(new Date(date)),
        currentDay: 1,
        firstTurnIsYes: (whoStarts === 'yes'),
        orderPrio: 0
      }).then((ref) => {
        setLoading(false)
        setPrompt('')
        alert('Conversation successfully added' + ref.id)
        goto(`conversation/${ref.id}`)
      })
    }}>
      <Input type="text" value={topic} setter={setTopic} label="Topic" placeholder="general" />
      <Input type="text" value={prompt} setter={setPrompt} error={promptError} label="Prompt" placeholder="Has X-ism gone too far?" />
      <TextAreaInput value={context} setter={setContext} label="Context (optional)" placeholder="Explain why it's timely and interesting." />
      <Input type="date" value={date} setter={setDate} label="Start date" />
      <Input type="number" value={duration} setter={setDuration} label="Duration (days)" />
      <Select value={whoStarts} options={{ yes: 'YES team', no: 'NO team' }} setter={setWhoStarts} label="Who starts" />
      <Button type="submit" disabled={loading}>Submit</Button>
    </Form>
  </Body >
}

export default NewConversation;