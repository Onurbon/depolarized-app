import dedent from "dedent";
import { Input } from "./utils";

// https://syncedreview.com/2020/06/30/yann-lecun-quits-twitter-amid-acrimonious-exchanges-on-ai-bias/

export const Yann_v_Timmit: Input = {
  prompt: "Is racial bias in AI models mostly a matter of training data?",
  intro:
    "This debate happened on Twitter between Yann LeCun, a senior AI researcher at Facebook, and Timnit Gebru and AI ethics researcher. Some people complained on Twitter about about the bias of some AI models which performed better a recognising white faces than black faces. Yann commented that this is was due to the training dataset containing mostly white faces, but Timnit disagreed.",
  summary: dedent`
    Here is what Yann and Timnit told each other via public Tweets: 
    Yann: "ML systems are biased when data is biased. This face upsampling system makes everyone look white because the network was pretrained on FlickFaceHQ, which mainly contains white people pics. Train the *exact* same system on a dataset from Senegal, and everyone will look African."
    Timmit: "I’m sick of this framing. Tired of it. Many people have tried to explain, many scholars. Listen to us. You can’t just reduce harms caused by ML to dataset bias."
    Yann: "Not so much ML researchers but ML engineers. The consequences of bias are considerably more dire in a deployed product than in an academic paper."
    Timmit: "Again. UNBELIEVABLE. What does it take? If tutorials at your own conference, books and books and talks and talks from experts coming to YOU, to your own house, feeding it to you, Emily and I even cover issues with how the research community approaches data. Nope. Doesn’t matter. This is not even people outside the community, which we say people like him should follow, read, learn from. This is us trying to educate people in our own community. Its a depressing time to be sure. Depressing."
    `,
  prev: {
    name: "Yann",
    side: "yes",
    credentials: "AI researcher",
    message:
      "I very much admire your work on AI ethics and fairness. I care deeply about about working to make sure biases don’t get amplified by AI and I’m sorry that the way I communicated here became the story.",
  },
  last: {
    name: "Timmit",
    side: "no",
    credentials: "AI ethics expert",
    message:
      "We’re often told things like ‘I’m sorry that’s how it made you feel.’ That doesn’t really own up to the actual thing. I hope you understand *why* *how* you communicated became the story. It became the story because its a pattern of marginalization.",
  },
};

// https://scrapsfromtheloft.com/psychology/jordan-petersons-channel-4-interview-cathy-newman-transcript/
export const Peterson_v_Newman: Input = {
  prompt: "Have western societies become hostile to men?",
  intro: `This conversations happened on a TV interview. The host Cathy Newman is interviewing the psychologist Jordan Peterson and asking question about his latest book which has be considered by some to include a critique of modern feminism.`,
  summary: dedent`
    Newman: Let me put it quite to you from the book where you say “there are whole disciplines in universities forthrightly hostile towards men. These are the areas of study dominated by the postmodern stroke neo-Marxist claim the Western culture in particular is an oppressive structure created by white men to dominate and exclude women.” But then I want to put you…
    Peterson: Minorities too, dominate…
    Newman: Okay, sure, but I want to put to you… here in the UK, for example, let’s say that as an example, the gender pay gap stands at just over 9%. You’ve got women at the BBC recently saying that the broadcaster is illegally paying them less than men to do the same job. You’ve got only seven women running the top footsie 100 companies.
    Peterson: Hum.
    Newman: So it seems to a lot of women that they still being dominated and excluded, to quote your words back to you.
    Peterson: It does seem that way. But multivariate analysis of the pay gap indicate that it doesn’t exist.
    Newman: But that’s not true, is it? That 9 percent pay gap, that’s a gap between median hourly earnings between men and women. That exists.
    Peterson: Yes. But there’s multiple reasons for that. One of them is gender, but that’s not the only reason. If you’re a social scientist worth your salt, you never do a univariate analysis. You say women in aggregate are paid less than men. Okay. Well then we break its down by age; we break it down by occupation; we break it down by interest; we break it down by personality.
    Newman: But you’re saying, basically, it doesn’t matter if women aren’t getting to the top, because that’s what is skewing that gender pay gap, isn’t it? You’re saying that’s just a fact of life, women aren’t necessarily going to get to the top.
    Peterson: No, I’m not saying it doesn’t matter, either.
    Newman: You’re saying that it’s a fact of life…
    Peterson: I’m saying there are multiple reasons for it.
    Newman: Yeah, but why should women put up with those reasons?
    Peterson: I’m not saying that they should put up with it! I’m saying that the claim that the wage gap between men and women is only due to sex is wrong. And it is wrong. There’s no doubt about that. The multivariate analysis have been done. So I can give you an example––
    Newman: I’m saying that nine percent pay gap exists. That’s a gap between men and women. I’m not saying why it exists but it exists. Now you’re a woman that seems pretty unfair.
    Peterson: You have to say why it exists.
    Newman: But do you agree that it’s unfair if you’re a woman…
    Peterson: Not necessary
    Newman: …and on average you’re getting paid nine percent less than a man that’s not fair, is it?
    Peterson: It depends on why it’s happening. I can give you an example. Okay, there’s a personality trait known as agreeableness. Agreeable people are compassionate and polite. And agreeable people get paid less than disagreeable people for the same job. Women are more agreeable than men.
    Newman: Again, a vast generalization. Some women are not more agreeable than men.
    Peterson: That’s true. And some women get paid more than men.
    Newman: So you’re saying by and large women are too agreeable to get the pay raises that they deserve.
    Peterson: No, I’m saying that is one component of a multivariate equation that predicts salary. It accounts for maybe 5 percent of the variance, something like that. So you need another 18 factors, one of which is gender. And there is prejudice. There’s no doubt about that. But it accounts for a much smaller portion of the variance in the pay gap than the radical feminists claim.
    Newman: Okay, so rather than denying that the pay gap exists, which is what you did at the beginning of this conversation, shouldn’t you say to women, rather than being agreeable and not asking for a pay raise, go ask for a pay raise. Make yourself disagreeable with your boss.
    Peterson: Oh, definitely. But also I didn’t deny it existed. I denied that it existed because of gender. See, because I’m very, very, very careful with my words.
    Newman: So the pay gap exists. You accept that. But you’re saying… I mean the pay gap between men and women exists—you’re saying it’s not because of gender, it’s because women are too agreeable to ask for pay raises.
    Peterson: That’s one of the reasons.
    `,
  prev: {
    name: "Newman",
    side: "no",
    credentials: "TV host, feminist",
    message:
      "Newman: Okay, one of the reasons… so why not get them to ask for a pay raise? Wouldn’t that be fairer way of proceeding?",
  },
  last: {
    name: "Peterson",
    side: "yes",
    credentials: "Psychologist and Author",
    message:
      "Peterson: I’ve done that many, many, many times in my career. So one of the things you do as a clinical psychologist is assertiveness training. So you might say––often you treat people for anxiety, you treat them for depression, and maybe the next most common category after that would be assertiveness training. So I’ve had many, many women, extraordinarily competent women, in my clinical and consulting practice, and we’ve put together strategies for their career development that involved continual pushing, competing, for higher wages. And often tripled their wages within a five-year period.",
  },
};

// https://munkdebates.com/debates/mainstream-media
export const Matt_v_Malcom: Input = {
  prompt: "Can we still trust mainstream media?",
  intro:
    "Public trust in mainstream media is at an all-time low. Critics point to coverage of COVID-19, the 2020 election, and the Ottawa trucker protest as proof that legacy outlets like the New York Times, The Globe and Mail and CNN can no longer be relied upon to provide unbiased reporting. Activist journalists are using pen and paper to push political agendas while their bosses lean into the profitability of polarization. Mainstream media’s defenders argue that their institutions offer an invaluable public service that alternative outlets are either incapable or uninterested in providing: careful fact-based reporting on important issues and holding the powerful to account. In a brave new world of “fake news” and “drive by” journalism, traditional news organizations are essential to democracy and a bulwark against corruption, misinformation and the private interests of the powerful.",
  summary: dedent`
    Matt Taibbi argued that mainstream media cannot be trusted as they have lost their basic function of just telling us what's happening. Instead, they sell narratives to cater to a specific audience. This creates a bifurcated system that emphasizes certain facts while downplaying others based on considerations other than truth or newsworthiness. Journalists now get too cozy with politicians and make serious accusations without calling people for comment. This has resulted in a lot of false reports such as those made during the Trump years. Meanwhile, Malcolm shared his experience working in mainstream media, where the importance of fairness and accuracy was drilled into him. He was required to talk to all sides of an issue before writing a story, and the story would not appear in the paper if he failed to do so.
    `,
  prev: {
    name: "Matt",
    side: "no",
    credentials:
      "Former Rolling Stone journalist, Investigator of the Twitter Files",
    message: `Matt: Once upon a time, I think journalists were more interested in what was true and what was not true than whether or not this fit the narrative or not. I think what happened with the Trump-Russia story is what's the upside for a lot of these institutions to call up somebody like Konstantin Kilimnik and find out his side of the story? Is that going to get on the front page of The New York Times? Probably not. Yes, there are processes, fact-checking is important, I do it, I hire fact-checkers to do it, but this is not the standard process for all mainstream media institutions anymore. We don't do it as much as we used to. Part of that is for financial reasons.`,
  },
  last: {
    name: "Malcolm",
    side: "yes",
    credentials: "Journalist at the New Yorker",
    message: dedent`
        Wait, I can't sit here and let you make these statements without any kind of-- We don't do that as much as we used to for financial reasons. I mean, I worked at The New Yorker. The New Yorker, if anything, spends more money on fact- checking today than it did in the past. I would've thought with my first book, I didn't hire a fact checker, but then I observed the number of errors in it and I also observed that the nature of the journalism world in which we live, the scrutiny of journalists is such that it's really perilous not to have a fact checker and so now, I have fact-checkers. Many other people, I think, have observed the same thing, that there is now so much attention paid to the accuracy of things that writers say that you'd better make sure you don't have errors in your-- Matt, I understand that you do have this wonderful nostalgia for the way things used to be, but I think that you need to fact- check some of your nostalgic notions about the wonderful world of the 1950s. Who was watchdogging The New York Times in the 1950s? Nobody was. It was a tiny little universe of-- People now watchdog institutions like that and so they have a higher commitment to the truth. Here's what I think the debate boils down to, and that is that our opponents believe that the mainstream media, they're concerned that the mainstream media, to the extent that they have told us what it is, is filled with people who don't think like they do and that fact makes them uncomfortable. In support of this, they have given us a long list of rather predictable hot-button topics taken from their Twitter feed. My question was, what would make them happy? What would restore the trust of Matt and Doug in the mainstream media?  think what they-- With Matt, the answer's obvious, he would like if the world resembled 1955 again, that would fill him with joy. Doug would like more stories on the Hunter Biden laptop - but more seriously, I think that they would be happier if they felt that the composition of prestigious journalistic institutions more closely reflected the full range of ideological attitudes in the American public. That is actually a serious proposition. I don't mean to make light of it at all. It is one that makes me a little uncomfortable because I don't think that you can ultimately say that trust in institutions is reserved solely for institutions that perfectly match the characteristics of the general population.
        It's like saying that we don't trust kindergarten teachers because kindergarten teachers are over-represented with people who have an enormous amount of patience for temper tantrums of four-year-olds. They are an extraordinary and very specific subgroup of the population that performs very well in that particular task. More generally, though, when we say of journalists, that I don't think we should be judging the quality and trustworthiness of journalists by the composition of that group or by their private ideological positions.
        I believe that in a liberal society, that we have to believe that the people who compose our professions can place their professional obligations above their personal ideological positions. If you don't believe we are capable of that act of transformation, then you can't have trust in any of the institutions that make up liberal society.`,
  },
};

// http://chomsky.info/1971xxxx/
export const Foucault_v_Chomsky: Input = {
  prompt: "Is our society democratic?",
  intro: dedent`
  Ladies and gentlemen, welcome to the third debate of the International Philosophers’ Project. Tonight’s debaters are Mr. Michel Foucault, of the College de France, and Mr. Noam Chomsky, of the Massachusetts Institute of Technology. Both philosophers have points in common and points of difference. Perhaps the best way to compare both philosophers would be to see them as tunnellers through a mountain working at opposite sides of the same mountain with different tools, without even knowing if they are working in each other’s direction.
  But both are doing their jobs with quite new ideas, digging as profoundly as possible with an equal commitment in philosophy as in politics: enough reasons, it seems to me for us to expect a fascinating debate about philosophy and about politics.
  I intend, therefore, not to lose any time and to start off with a central, perennial question: the question of human nature.
  All studies of man, from history to linguistics and psychology, are faced with the question of whether, in the last instance, we are the product of all kinds of external factors, or if, in spite of our differences, we have something we could call a common human nature, by which we can recognise each other as human beings.
`,
  summary: dedent`
  Michel Foucault and Noam Chomsky had very different views on human nature.
  Foucault rejected the idea of a fixed human nature and argued that humans are constantly shaped and defined by power relations within society. He believed that power is not just exercised by those in authority, but is present in all social relationships and institutions, shaping the way we think, behave, and relate to one another. In other words, our sense of self and identity is not inherent but constructed through our experiences within these power structures.
  On the other hand, Chomsky believed that humans are born with an innate language ability, which is evidence of a universal grammar that is hard-wired into the human brain. He also argued that there is a universal human nature characterized by certain moral and ethical principles that are common across all cultures and societies.`,
  prev: {
    name: "Chomsky",
    credentials: "Linguist at MIT",
    side: "yes",
    message: dedent`
      I’ll overcome the urge to answer the earlier very interesting question that you asked me and turn to this one.
      Let me begin by referring to something that we have already discussed, that is, if it is correct, as I believe it is, that a fundamental element of human nature is the need for creative work, for creative inquiry, for free creation without the arbitrary limiting effect of coercive institutions, then, of course, it will follow that a decent society should maximise the possibilities for this fundamental human characteristic to be realised. That means trying to overcome the elements of repression and oppression and destruction and coercion that exist in any existing society, ours for example, as a historical residue.
      Now any form of coercion or repression, any form of autocratic control of some domain of existence, let’s say, private ownership of capital or state control of some aspects of human life, any such autocratic restriction on some area of human endeavour, can be justified, if at all, only in terms of the need for subsistence, or the need for survival, or the need for defence against some horrible fate or something of that sort. It cannot be justified intrinsically. Rather it must be overcome and eliminated.
      And I think that, at least in the technologically advanced societies of the West we are now certainly in a position where meaningless drudgery can very largely be eliminated, and to the marginal extent that it’s necessary, can be shared among the population; where centralised autocratic control of, in the first place, economic institutions, by which I mean either private capitalism or state totalitarianism or the various mixed forms of state capitalism that exist here and there, has become a destructive vestige of history.
      They are all vestiges that have to be overthrown, eliminated in favour of direct participation in the form of workers’ councils or other free associations that individuals will constitute themselves for the purpose of their social existence and their productive labour.
      Now a federated, decentralised system of free associations, incorporating economic as well as other social institutions, would be what I refer to as anarcho-syndicalism; and it seems to me that this is the appropriate form of social organisation for an advanced technological society, in which human beings do not have to be forced into the position of tools, of cogs in the machine. There is no longer any social necessity for human beings to be treated as mechanical elements in the productive process; that can be overcome and we must overcome it by a society of freedom and free association, in which the creative urge that I consider intrinsic to human nature, will in fact be able to realise itself in whatever way it will.
      And again, like Mr. Foucault, I don’t see how any human being can fail to be interested in this question. [Foucault laughs.]
      `,
  },
  last: {
    name: "Foucault",
    credentials: "French Philosopher",
    side: "no",
    message: dedent`
    I don’t have the least belief that one could consider our society democratic. [Laughs.]
    If one understands by democracy the effective exercise of power by a population which is neither divided nor hierarchically ordered in classes, it is quite clear that we are very far from democracy. It is only too clear that we are living under a regime of a dictatorship of class, of a power of class which imposes itself by violence, even when the instruments of this violence are institutional and constitutional; and to that degree, there isn’t any question of democracy for us.
    Well. When you asked me why I was interested in politics, I refused to answer because it seemed evident to me, but perhaps your question was:
    How am I interested in it?
    And had you asked me that question, and in a certain sense I could say you have, I would say to you that I am much less advanced in my way; I go much less far than Mr. Chomsky. That is to say that I admit to not being able to define, nor for even stronger reasons to propose, an ideal social model for the functioning of our scientific or technological society.
    On the other hand, one of the tasks that seems immediate and urgent to me, over and above anything else, is this: that we should indicate and show up, even where they are hidden, all the relationships of political power which actually control the social body and oppress or repress it.
    What I want to say is this: it is the custom, at least in European society, to consider that power is localised in the hands of the government and that it is exercised through a certain number of particular institutions, such as the administration, the police, the army, and the apparatus of the state. One knows that all these institutions are made to elaborate and to transmit a certain number of decisions, in the name of the nation or of the state, to have them applied and to punish those who don’t obey. But I believe that political power also exercises itself through the mediation of a certain number of institutions which look as if they have nothing in common with the political power, and as if they are independent of it, while they are not.
    One knows this in relation to the family; and one knows that the university and in a general way, all teaching systems, which appear simply to disseminate knowledge, are made to maintain a certain social class in power; and to exclude the instruments of power of another social class.
    Institutions of knowledge, of foresight and care, such as medicine, also help to support the political power. It’s also obvious, even to the point of scandal, in certain cases related to psychiatry
    It seems to me that the real political task in a society such as ours is to criticise the workings of institutions, which appear to be both neutral and independent; to criticise and attack them in such a manner that the political violence which has always exercised itself obscurely through them will be unmasked, so that one can fight against them.
    This critique and this fight seem essential to me for different reasons: firstly, because political power goes much deeper than one suspects; there are centres and invisible, little-known points of support; its true resistance, its true solidity is perhaps where one doesn’t expect it. Probably it’s insufficient to say that behind the governments, behind the apparatus of the State, there is the dominant class; one must locate the point of activity, the places and forms in which its domination is exercised. And because this domination is not simply the expression in political terms of economic exploitation, it is its instrument and, to a large extent, the condition which makes it possible; the suppression of the one is achieved through the exhaustive discernment of the other. Well, if one fails to recognise these points of support of class power, one risks allowing them to continue to exist; and to see this class power reconstitute itself even after an apparent revolutionary process.  
  `,
  },
};

//https://www.rev.com/blog/transcripts/donald-trump-joe-biden-1st-presidential-debate-transcript-2020
export const Trump_v_Biden: Input = {
  prompt: "Is the economy doing better?",
  intro: dedent`  
    Good evening from the Health Education Campus of Case Western Reserve University and the Cleveland Clinic. I’m Chris Wallace of Fox News and I welcome you to the first of the 2020 Presidential Debates between President Donald J. Trump and former Vice President Joe Biden. This debate is sponsored by the Commission on Presidential debates. The Commission has designed the format, six roughly 15 minute segments with two minute answers from each candidate to the first question, then open discussion for the rest of each segment. Both campaigns have agreed to these rules. For the record, I decided the topics and the questions in each topic. I can assure you none of the questions has been shared with the Commission or the two candidates.
    This debate is being conducted under health and safety protocols designed by the Cleveland Clinic, which is serving as the Health Security advisor to the Commission for all four debates. As a precaution, both campaigns have agreed the candidates will not shake hands at the beginning of tonight’s debate. The audience here in the hall has promised to remain silent. No cheers, no boos, or other interruptions so we, and more importantly you, can focus on what the candidates have to say. No noise except right now, as we welcome the Republican nominee, President Trump, and the Democratic nominee Vice President Biden.`,
  summary: dedent`
    The debate was marked by interruptions, personal attacks, and a lack of substantive policy discussions. Both candidates frequently interrupted and talked over each other, making it difficult for Wallace to maintain order.
    Some of the key topics discussed during the debate included the handling of the COVID-19 pandemic, healthcare, race relations, and the Supreme Court. Trump defended his administration's response to the pandemic, while Biden criticized Trump's handling of the crisis and advocated for increased testing and contact tracing.
    The candidates also clashed over healthcare, with Biden advocating for the expansion of the Affordable Care Act, and Trump promising to repeal and replace the law with a new plan. Race relations were also a contentious topic, with Biden accusing Trump of fanning the flames of racial division and Trump touting his record on criminal justice reform.
  `,
  prev: {
    side: "yes",
    name: "Donald Trump",
    credentials: "US President",
    message: dedent`
      So we built the greatest economy in history. We closed it down because of the China plague. When the plague came in, we closed it down, which was very hard psychologically to do. He didn’t think we should close it down and he was wrong. Again, two million people would be dead now instead of… Still, 204,000 people is too much. One person is too much. Should have never happened from China. But what happened is we closed it down and now we’re reopening and we’re doing record business. We had 10.4 million people in a four month period that we’ve put back into the workforce. That’s a record the likes of which nobody’s ever seen before. And he wants to close down the… He will shut it down again. He will destroy this country.
      A lot of people, between drugs and alcohol and depression, when you start shutting it down, you take a look at what’s happening at some of your Democrat-run states where they have these tough shutdowns. And I’m telling you it’s because they don’t want to open it. One of them came out last week, you saw that, “Oh, we’re going to open up on November 9th.” Why November 9th? Because it’s after the election. They think they’re hurting us by keeping them closed. They’re hurting people. People know what to do. They can social distance. They can wash their hands, they can wear masks. They can do whatever they want, but they got to open these states up.
      When you look at North Carolina, when you look, and these governors are under siege, Pennsylvania, Michigan, and a couple of others, you got to open these states up. It’s not fair. You’re talking about almost it’s like being in prison. And you look at what’s going on with divorce, look at what’s going on with alcoholism and drugs. It’s a very, very sad thing. And he’ll close down the whole country. This guy will close down the whole country and destroy our country. Our country is coming back incredibly well, setting records as it does it. We don’t need somebody to come in and say, “Let’s shut it down.”    
    `,
  },
  last: {
    side: "no",
    name: "Joe Biden",
    credentials: "Former US Vice-President",
    message: dedent`
      The difference is millionaires and billionaires like him in the middle of the COVID crisis have done very well. Billionaires have made another $300 billion because of his profligate tax proposal, and he only focused on the market. But you folks at home, you folks living in Scranton and Claymont and all the small towns and working class towns in America, how well are you doing? This guy paid a total of $750 in taxes.
      The fact is that he has in fact, worked on this in a way that he’s going to be the first president of the United States to leave office, having fewer jobs in his administration than when he became president. Fewer jobs than when he became president. First one in American history.
      Secondly, the people who have lost their jobs are those people who have been on the front lines. Those people who have been saving our lives, those people who have been out there dying. People who’ve been putting themselves in the way to make sure that we could all try to make it. And the idea that he is insisting that we go forward and open when you have almost half the states in America with a significant increase in COVID deaths and COVID cases in the United States of America, and he wants to open it up more. Why is he want to open it up? Why does he take care of the… You can’t fix the economy until you fix the COVID crisis. And he has no intention of doing anything about making it better for you all at home in terms of your health and your safety.
      Schools. Why aren’t schools open? Because it costs a lot of money to open them safely. They were going to give, his administration going to give the teachers and school students masks, and then they decided no, couldn’t do that because it’s not a national emergency. Not a national emergency. They’ve done nothing to help small businesses. Nothing. They’re closing. One in six is now gone. He ought to get on the job and take care of the needs of the American people so we can open safely.`,
  },
};

export const Oxxxy_v_Dizaster: Input = {
  prompt: "Is Oxxxymiron the real alpha?",
  intro: dedent`
    The  battle was announced on 14 September, 2017 on KOTD YouTube channel and took place one month after as the main event for the World Domination VII in Los-Angeles.
    It’s been a long-awaited battle as Oxxxymiron attracted Dizaster’s attention on twitter in 2015 after his battle vs Johnyboy at Versus Battle hit record numbers (1 million views in the first 24 hours and 15m in 3 days).
    Just a couple of days after that battle was released, they arranged to battle each other:
  `,
  summary: "",
  prev: {
    side: "yes",
    name: "Oxxxy",
    credentials: "Famous Russian Rapper, Oxford University educated",
    message: dedent`
      Вот скажи мне, американец, в чём сила?
      You’re about to see a Russian air strike on Syrian ranks
      They inferior to amphibious Siberian tanks
      You're nothing but a civilian with silly old blanks
      Who's really up his own ass like Azealia Banks
      Did I pronounce that right, or is my accent too thick?
      I got a license to kill this Arab-American pig
      You fucking arrogant prick, think you better than this?
      But you never got big
      That is why you battling, bitch
      You've been rapping all your life and you got no shows, Diz
      And if that is not a punchline, I don't know what is
      You know what rhymes with "Dizaster"?
      Umm, I don't know, "putting 'featuring Eminem' on your Twitter name to get chicks faster"?
      How fucking corny was that?
      You must be horny as hell
      How the fuck can you not get laid if you got photos with Drake?
      And how the fuck are you still broke
      When you're cosigned by the biggest?
      You must've done too many drugs
      And couldn't handle your business
      Man, I also used to do lines after having my Guinness
      But I walked away from Vice like I'm Gavin McInnes
      All you learned in life, is how to fight and rhyme insults
      But you praise yourself online like you're some high divine princess
      "I'm inspiring the young!"
      What are you, Lady Diana? Quit this!
      All you do is battle guys for half the price of my slippers
      But you know what? Fuck my album sales!
      And fuck my accolades!
      And fuck every single fake fan for his lack of faith!
      I do bring in the numbers, you can't relate
      But that's irrelevant, I'll bury you in L.A. today, Habibi
      You know, listen, listen, yo yo! It's gonna get serious
      It's gonna get serious and I apologize in advance, I don't, look
      You're an American Muslim Arab, right?
      Let me ask you something that's simple but so lethal:
      How does it feel to hold up a flag that's covered in the blood of your own people?
      Two millions Muslims or Arabs killed by the US in 15 years
      Shit, who cares? You still rep the flag like Britney Spears
      Everyone here's seen the trailer, put your pen aside
      For views' sake, you shit on your parents genocide
      You parasite, apple pie eating pancake type, yankee dyke
      Who measures dick's height in Fahrenheit!
      Bare in mind, you're traitor to your Arab kind
      I'll digest this faggot's hype like a phagocyte
      Check it on Wikipedia, bro!
      This guy had a battle in Berlin against the guy called Tierstar
      Who is both African and Russian
      So he did the same old racial shit instead of an intelligent discussion
      "Your African side says, 'I miss Big Poppa'
      Your Russian side says 'Bring this vodka!'"
      You might also like
      Марина Обойкина (Marina Oboykina)
      Кишлак (Kishlak)
      ЯЛРС (ILDB)
      SODA LUV
      Город под подошвой (City Under the Sole)
      Your American side is battling me now in L.A
      At the same time as GI's blow your cousins away
      While your Arabic side is turning your brothers to hate
      Raised on pics of Abu Ghraib in the Guantanamo Bay
      And I'm not paid by fucking Russia Today, Mr. Vladimir and FSB for sounding this way
      I don't like the Russian goverment, that's powerplay
      But it was coward USA that taught them how to behave
      And bully States into appeasement
      So fuck your home, Dizaster! Fuck its role as the world policeman!
      'Cause all cops are bastards
      Fuck your moral high ground of moron thugs!
      Fuck your war on terror and fuck your war on drugs!
      Fuck McDonald’s and Disney! Fuck American literature!
      Ben & Jerry, Tom and Jerry, Ford and Henry Kissinger!
      Fuck the Federal Reserve, 'cause they bury the poorest!
      And for Christ's sake, fuck all the loud American tourists!
      And I know what he's thinking:
      "Aah, that's not me, I'm not close-minded
      I've travelled the world, I'm different, I am so enlightened."
      Well, you're still fucking American, right?
      So you may not care, but you still carry the stereotype
      You're like a good cop: you're still a cop, that's drama enough
      What do we care who bombs us: Clinton, Bush, Obama or Trump?
      You know you try to standartize the world to see it normalized
      Why? Why don't you stick inside, stay inside your turf and keep your globalized reich?
      You wanna see my country burn? Wanna see it Balkanized? Fine
      The only shit you'll see in return is more organized crime
      So, if you thought that we were chumps, you were high on mushrooms
      If you thought that I'm a chump, you should try Ayahuasca
      I got brothers in this club, that would love to rush ya
      I'ma turn Mount Rushmore into MOTHER RUSSIA!
      And before I finish my round, look, I'm kinda puzzled
      'Cause your dad wears the hijab but your mother doesn't
      Your son wears a muzzle, your brother likes Assad
      Your lover's called Hassan and your father is your cousin
      Time!`,
  },
  last: {
    side: "no",
    name: "Dizaster",
    credentials: "American Rapper",
    message: dedent`
      God fucking damn! What is this?
      This guy just gave me the political business
      You're a fucking superstar from Russia
      I thought you came here to fuck some bitches
      What a fucking bunch of fucking moronic militants!
      "The blood of your own flag!!!"
      I was born in America, you idiot!
      Hold on, if this seems like I'm about to go long
      Don't you, fucking bitch!
      I only ask for unlimited, not so I could rap forever
      So y'all can slowly hear this stuff I spit
      So today, I'ma take my time with what I say:
      I ain't rushin' through my shit!
      If you plan to take over, you gotta be way more organized
      You thought this is the Ukraine border
      You tried to charge straight forward
      You're tryin' to get one of your hackers to get in the mainframe station and override
      But bitch, this is California, and this state is fortified
      You gon' make me take this fucking frail Russian mail-order bride
      And bust his face open wide
      I pull the shank out and fish fillet both his eyes
      So there's a big enough space between them both to let the blade go inside
      I will cave in your skull from the side
      I will fucking… I will fucking…
      Break your nose bone like Kano causing your whole face to divide
      Yeah, blame the outside
      I will sent you to visit the angels so when you come back you'll be like Goku rockin' a stupid-ass looking halo when he died
      Look, aside from the battle rap, you're a real artist
      And as a rapper, I could respect that
      'Cause just like every other industry rapper
      You only doin' what you're best at
      Soon as you get depressed, you go and get yourself a neck tat
      It says 1703? And those numbers mean something
      See, most people might quite not understand it
      But I studied the Gregorian calendar, so I know why he has it
      It's ancient mathematics
      The numbers spell out a phrase, combined and subtracted
      It says… "I am a faggot!"
      Aight, since people love the Russian accent
      I should try to talk like you, then
      Look, I know you think this battle good look for you… Нет
      Not where you've been
      Maybe 'cause foreigner you think in your little head this the reason you should win
      But, to tell you truth, this is not good position to be put in
      I said yo, lighten up, we're joking, why you're acting so hard for?
      Y'all don't want war
      You keep all your pretty hydrogen bombs stored somewhere offshore
      'Cause the only thing we know y'all for is vodka bottle and blond whore
      You come from a world where foreign exchange students sucking dicks in an American college dorm is considered an art form
      Russian bitches were born to suck dick
      You can see the features in their jaw bone
      This is an onslaught, someone grab the popcorn
      Why did y'all expect him to be hardcore
      When Russians are all known for soft porn?
      Dawg, your body is built like a lesbian wussy
      I'm a fucking veteran, they fed me a rookie
      And even though we speak two different tongues
      He knows not to do anything extra to push me
      'Cause one thing we all understand universally is body language
      And yours says you a pussy
      Listen, I'm really out here rappin for y'all
      This all you have for me? Nah!
      I'm a Rap God, been out here for 17 years strong
      And still haven't managed to fall
      Plus, we seen what happened to Chernobyl
      You people don't know how to handle disasters at all
      But enough about Russian America, let's bring Oxxxy in
      How they brought him into Oxford and they offered him a job
      But he ain't want it, 'cause Ox was chillin'
      On amoxicillin, imagine how Ox was feelin'
      Knowing I was about to body him
      Stock pile of Klonopin and antioxidants
      But wait, Drago, this is the part where Rocky wins
      Bars on top of bars at the Roxy, I'm boxing that Oxxxy in
      Yeah, if there's squad with him
      And they pullin' out the choppers then
      Wo-hoo hoppin' out of the car, I'm sendin' a hundred shots at them
      I don't give a fuck who it's aimed at, I'm killin' all of 'em
      Bitch, this is payback for what y'all did to Denzel Washington!`,
  },
};
