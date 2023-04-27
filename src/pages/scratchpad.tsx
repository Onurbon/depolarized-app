import { useState, useEffect, useRef } from "react";
import { updateDoc, useFirestoreDoc } from "../firebase";
import { useGlobal } from "../global";
import { ScratchpadDoc } from "../global/types";
import TextareaAutosize from 'react-textarea-autosize';


const debounceTime = 2000

const Scratchpad = ({ convId }: { convId: string }) => {
  const [{ user }] = useGlobal()
  const [text, setText] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<any>(null);
  const { data, fetching } = useFirestoreDoc<ScratchpadDoc>(`conversations/${convId}/scratchpads/${user!.uid}`)
  useEffect(() => {
    setText(data?.text)
    setLastSaved(data?.saved)
  }, [fetching])
  const timeout = useRef<any>(null)

  const handleInputChange = (event: any) => {
    if (timeout.current) clearTimeout(timeout.current);
    const newText = event.target.value
    setText(newText);
    setIsSaving(true);
    timeout.current = setTimeout(() => {
      const now = new Date().toLocaleString()
      updateDoc<ScratchpadDoc>(`conversations/${convId}/scratchpads/${user!.uid}`, { text: newText, saved: now }).then(() => {
        setIsSaving(false);
        setLastSaved(now);
        console.log('saved: ', newText)
      });
    }, debounceTime);
  };

  return fetching ?
    <div>fetching...</div> :
    <div className="text-sm">
      <div className="italic font-thin">{isSaving ? "Saving..." : lastSaved ? `Last saved: ${lastSaved}` : ''}</div>
      <TextareaAutosize
        minRows={10}
        className="block w-full text-md bg-red-50 resize-none rounded-md font-serif border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500  placeholder-gray-400"
        value={text} onChange={handleInputChange} />
    </div>
};

export default Scratchpad;
