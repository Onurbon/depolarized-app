import { useEffect } from "react";
import toast from "react-hot-toast";

/* eslint no-restricted-globals: 0 */

const snoozeLength = 10 * 60 * 1000; // 10 minutes
let snoozedUntil: number = parseInt(localStorage['refreshSnoozeUntil'] || '0');
let shown = false

const notify = (loaded: any, available: any) => {
  if (shown || (snoozedUntil && Date.now() < snoozedUntil)) return
  shown = true
  toast(t => <div className="text-center">
    A new version of Depolarized is available <br />
    <button
      className="border bg-gray-200 rounded p-3 m-1"
      onClick={() => {
        snoozedUntil = Date.now() + snoozeLength
        localStorage['refreshSnoozeUntil'] = snoozedUntil
        console.log({ snoozedUntil })
        shown = false
        toast.dismiss(t.id);
      }}
    >
      Snooze for 10 minutes
    </button>
    <button
      className="rounded bg-purple-700 text-white p-3 m-1"
      onClick={() => {
        location.reload();
      }}
    >
      Refresh to update
    </button> <br />
    <span className="text-xs">(You were on version {loaded} and the latest is {available}.)</span>
  </div >,
    {
      duration: 1000000000
    })
}

const notifySame = (loaded: any) => {
  toast(t => <div className="text-center">
    You are already on the latest version!
    <span className="text-xs">(Current version: {loaded}.)</span>
  </div >,
    {
      duration: 3000
    })
}




export const checkVersions = (active: boolean) => {
  console.log('checking versions...')
  const origin = location.origin;
  let loaded = '';
  [...document.getElementsByTagName("script") as any].forEach(e => {
    const match = e.src.match(/main\.(\w+)\.js/)
    if (match) loaded = match[1]
  })
  fetch(origin)
    .then((res) => res.text())
    .then((text) => {
      const available = text.split("/static/js/main.")[1].split(".")[0];
      if (loaded !== available) {
        notify(loaded, available)
      } else {
        if (active) notifySame(loaded)
        console.log('version seems up to date')
      }
    });
};

const checkVersionPassive = () => checkVersions(false)

export const useRefresh =
  (origin !== "https://depolarized.co") ? () => { }
    : () => {
      useEffect(() => {
        document.addEventListener("visibilitychange", checkVersionPassive);
        return () => document.removeEventListener("visibilitychange", checkVersionPassive);
      }, []);
    }