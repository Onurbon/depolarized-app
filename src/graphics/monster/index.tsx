import m1 from "./monster1.png"
import m2 from "./monster2.png"
import m3 from "./monster3.png"
import m4 from "./monster4.png"
import m5 from "./monster5.png"
import m6 from "./monster6.png"
import m7 from "./monster7.png"
import m8 from "./monster8.png"
import m9 from "./monster9.png"

import { Account } from "../index"

const Monster = ({ i, you }: { i: number, you: boolean }) =>
  you ?
    <Account className="w-14 h-14 rounded-full  bg-white" /> :
    // eslint-disable-next-line
    <img
      className="w-14 rounded-full"
      src={{
        1: m1, 2: m2, 3: m3, 4: m4, 5: m5, 6: m6, 7: m7, 8: m8, 9: m9
      }[(i % 9) + 1]} />

export default Monster
