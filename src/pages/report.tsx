import React, { useState } from "react"
import { callGPT } from "../ai/api"
import { Input, SmallButtonGrey } from '../components'
import Plotly from 'react-plotly.js';
import { listenerCount } from "process";

const model = 'gpt-3.5-turbo'

const prompt = (question: string) => `
Imagine you are consulting the US public and asking them: "QUESTION"

Imagine that the participants are responding and expressing their feelings about this back making a short statement, one or two sentences long, explaining both what they believe and why they believe it. 

Produce a table with 30 rows in total including 
- 10 examples of statements that Republicans might have given; and
- 10 examples of  statements that Democrats might have given
- 10 examples of  statements that Independents might have given

Make sure to pick diversified examples to represent a broad range of views.  
Also make sure to have the same number of statements for each sides, meaning 10 for democrats, 10 for republicans and 10 for independents.

Come up with a way to organize these statement into a few different topics but only return one single consolidated table with all the topics.

The columns of the table should be: 
- [topic] : the topic that the statement belong to
- [statement] : one of the 30 aforementioned statements 
- [side] : either R for republican or D for democrat or I for independents
- [resonance] : score between 0 and 100 representing the % of people (from general population) who would strongly agree with this statement 
- [respect] : score between 0 and 100 representing the % of people among those disagreeing with the statement who still respect that other people may agree with this statement (meaning that they don't find the statement outrageous)


`.replace(/QUESTION/g, question)

const validLine = (x: any) => x.startsWith('|') && x.split('|').length > 4
  && x.split('|')[1].trim() !== 'Topic'
  && !x.split('|')[1].trim().startsWith('-')

const parse = (table: string) => table.split('\n').slice(2).filter(validLine).map(line => {
  const [, topic, statement, side, resonance, respect] = line.split('|').map(x => x.trim())
  return {
    topic, statement, side,
    resonance: parseInt(resonance, 10),
    respect: parseInt(respect, 10)
  }
}).map((x) => ({ ...x, score: x.resonance + x.respect }))
  .sort((x, y) => y.score - x.score)
  .map((x, i) => ({ ...x, rank: i + 1 }))

export const Report = () => {
  const [question, setQuestion] = useState('Did Joe Biden win the last election fair and square?')
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<any>(null)
  const run = async () => {
    setLoading(true)
    const res = await callGPT(model, prompt(question)) as any
    const txt = res.data.choices[0].message.content
    console.log('txt results', txt)
    const json = parse(txt)
    console.log('json results', json)
    setResults(json)
    setLoading(false)
  }
  return <div className="p-3">
    <div className="text-center">
      <div className="inline-block w-1/2 pr-4">
        <Input type="text" value={question} setter={setQuestion} label="" />
      </div>
      <SmallButtonGrey onClick={() => { run() }} disabled={loading}>Consult the AI</SmallButtonGrey>

    </div>
    <br />
    {loading ? 'loading...' : results &&
      <div className="flex">
        <ScatterPlot results={results} />
        <Table results={results} />
      </div>
    }
  </div >
}

function groupBy(array: any, key: any) {
  return array.reduce(function (acc: any, obj: any) {
    let groupKey = obj[key];
    if (!acc[groupKey]) {
      acc[groupKey] = [];
    }
    acc[groupKey].push(obj);
    return acc;
  }, {});
}

const Table = ({ results }: any) => {
  const groups = groupBy(results, 'topic')
  const topics = Object.keys(groups)
  return <div className="w-1/2 text-sm pt-12">
    {topics.map((topic: any) => <div className="mt-2">
      <span className="text-md font-semibold ">{topic}</span>
      <ul>
        {groups[topic].map((x: any) => <li key={x.rank}>
          <span className={
            x.side === 'R' ? "text-red-500" :
              x.side === 'D' ? "text-blue-500" :
                "text-purple-500"
          }>{x.rank}.</span> "{x.statement}" ({x.resonance},{x.respect})
        </li>)}
      </ul>
    </div>)}
  </div>
}

const ScatterPlot = ({ results }: any) => {
  const traces: any = {
    R: {
      x: [], y: [], text: [],
      mode: 'markers+text',
      type: 'scatter',
      name: 'Republicans',
      marker: { size: 20, color: 'red' },
      textfont: {
        family: 'sans serif',
        size: 12,
        color: 'white'
      },
    },
    D: {
      x: [], y: [], text: [],
      mode: 'markers+text',
      type: 'scatter',
      name: 'Democrats',
      marker: { size: 20, color: 'blue' },
      textfont: {
        family: 'sans serif',
        size: 12,
        color: 'white'
      },
    },
    I: {
      x: [], y: [], text: [],
      mode: 'markers+text',
      type: 'scatter',
      name: 'Independents',
      marker: { size: 20, color: 'purple' },
      textfont: {
        family: 'sans serif',
        size: 12,
        color: 'white'
      },
    },
  }
  results.forEach((r: any, i: number) => {
    traces[r.side].x.push(r.resonance)
    traces[r.side].y.push(r.respect)
    traces[r.side].text.push('' + r.rank)
  })
  const data = [traces.R, traces.D, traces.I]
  console.log(data)
  return <div className="w-1/2 text-center">
    <style scoped>{`
    .modebar-container { display: none; }
    `}
    </style>
    <Plotly data={data} layout={
      {
        width: 750,
        height: 800,
        xaxis: {
          title: { text: 'resonance' },
          range: [0, 100],
          fixedrange: true,
        },
        yaxis: {
          title: { text: 'respect' },
          range: [0, 100],
          fixedrange: true,
        },
      }
    } />
  </div>
}
export default Report