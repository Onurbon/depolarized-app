import { InfoModal } from "../components";

import { Back, Star, StarFull, Flag, FlagFull, Edit, Comment, Prev, Next } from "../graphics"


const Step = ({ title, children }: any) => <div>
  <h1 className="text-center text-lg font-semibold">{title}</h1>
  <div className="m-3"> {children}</div>
</div>


const InfoReview = () => <InfoModal
  uid="reviewcarousel"
  autoOpen
  carousel={[
    <Step title="Review page">
      You have opened an active argument and this is the page where you will be able to review it.
    </Step>,
    <Step title="Navigation">
      You can go to the next or previous arguments using the arrows <Prev className="inline w-5" /> and <Next className="inline w-5" /> at the bottom of this screen.
    </Step>,
    <Step title="Flags">
      If something looks wrong with this argument, tap on the flag icon <Flag className="inline w-5" /> at the bottom of this screen.
    </Step>,
    <Step title="Ratings">
      Tap on the ratings icon <Star className="inline w-5" /> to provide feedback on how strong,
      concise and respectful an argument is.
    </Step>,
    <Step title="Suggest edits">
      Tap on the edit icon <Edit className="inline w-5" /> to start editing the argument. After making changes and clicking "submit",
      you will see a "diff" view summarizing what you changed. This is also what the argument's
      original author will see when considering your proposed edits.
    </Step>,
    <Step title="Comments">
      Sometime you won't have time to edit the text yourself. In these situations you can leave a comment
      or request to the author using the icon <Comment className="inline w-5" />.
    </Step>,
    <Step title="What happens next?">
      We're still working on the exact formula, but all your inputs (flags, ratings, edits and comments)
      are playing an important role in surfacing the best argument each day.
    </Step>,
  ]}
/>

export default InfoReview