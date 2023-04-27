import { InformationCircleIcon } from "@heroicons/react/20/solid";
import { InfoModal } from "../components";
import { Account } from "../graphics";

const Step = ({ title, children }: any) => <div>
  <h1 className="text-center text-lg font-semibold">{title}</h1>
  <div className="m-3"> {children}</div>
</div>

const InfoHome = () => <InfoModal
  uid="homecarousel"
  autoOpen
  carousel={[
    <Step title="Home page">
      This is Depolarized's home page where you'll find a list of conversations.
    </Step>,
    <Step title="Organized conversations">
      Conversations are initiated by moderators (not you yet). They start and end at specific dates.
    </Step>,
    <Step title="Alternating arguments">
      Some days are reserved for arguments in favour of the prompt (arguing "yes") and some days are reserved for opposing arguments (arguing "no").
      We switch side each day for balance.
    </Step>,
    <Step title="Verified credentials">
      While arguments are made anonymously, authors will typically share relevant credentials to add context (and credibility) to their words.
    </Step>,
    <Step title="Short and long forms">
      The first paragraph or each argument should capture the main point and serve as a summary. The next paragraphs will then provide more details and evidence.

    </Step>,
    <Step title="Review process">
      Multiple authors will submit arguments on each day. Reviewers can then propose some changes, rate them, and eventually elect a winner at the
      end of each day.
    </Step>,
    <Step title="What next?">
      Select a conversation on this page and look for info icons <InformationCircleIcon className="inline w-5 h-5 mb-1" /> for more help.
      <br /><br />
      You can also visit your account page by tapping the icon <Account className="inline h-5 w-5 mb-1" /> on the top right of this page.
    </Step>,
  ]}
/>

export default InfoHome