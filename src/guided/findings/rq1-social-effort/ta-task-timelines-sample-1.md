# Random Sample of Task Timelines

**Generated:** 2025-12-09T13:47:31.107Z

**Total Tasks:** 10

---

## Task 1: T336574 - Review alerting around Wikidata Query Service update pipeline

- **URL:** https://phabricator.wikimedia.org/T336574
- **Status:** Open, Medium
- **Priority:** Medium
- **Created:** 2023-05-12 13:06:53 (UTC+0)

**Timeline Items with Content:** 3

**Item 1: bking subscribed.** 2023-05-18 20:24:42 (UTC+0)

Quick notes here before I forget. Checking my "alerts" email folder for the past year (not the most reliable source), I have:

* 89 alerts with title RdfStreamingUpdaterHighConsumerUpdateLag
* 72 alerts with title RdfStreamingUpdaterFlinkProcessingLatencyIsHigh
* 113 alerts with title RdfStreamingUpdaterFlinkJobUnstable

We'll need to do more in-depth analysis (with [Logstash alerts dashboard](https://logstash.wikimedia.org/app/dashboards#/view/8b1907c0-2062-11ec-85b7-9d1831ce7631?%5Fg=%28filters:!%28%29,refreshInterval:%28pause:!t,value:0%29,time:%28from:now-3d,to:now%29%29&%5Fa=h@7e7a0e9)) to get a better idea of how many of these alerts indicated a real issue. A cursory suggests that RdfStreamingUpdaterHighConsumerUpdateLag is our most relevant alert.

[CODE]: Adding context
[CODE]: Adding next steps and justification for why
[CODE]: Defining and expanding potential scope
[THEME]: Investigation before evolving

**Item 2: bking added a comment.** 2023-05-22 13:45:51 (UTC+0)

Revised totals for alerts in the last year after looking at Logstash:

RdfStreamingUpdaterHighConsumerUpdateLag 373  
RdfStreamingUpdaterFlinkProcessingLatencyIsHigh 63  
RdfStreamingUpdaterFlinkJobUnstable 125

The majority of all three alert types fired during the last outage. As previously stated, RdfStreamingUpdaterHighConsumerUpdateLag seems to be our best indicator, as it only triggered once outside the incident window.

The other two alerts seem to fire fairly frequently, but we'll need further analysis to determine how many of these alerts indicated a real issue.

[CODE]: Reporting back on next steps, and defining new next steps.
[CODE]: Limiting potential scope.

**Item 3: bking added a comment.** 2023-05-31 16:20:05 (UTC+0)

Per today's SRE meeting, the larger SRE org is working on [a comprehensive alert review](https://etherpad.wikimedia.org/p/alert-review-may-2023) . We should work with the SREs to help out and use their methods to review our own alerts.

[CODE]: Meetings are occurring where this is being discussed, not all information is recorded here, but important/relevant context is provided. 
[CODE]: Effort occurring outside of artifacts.
[CODE]: Bringing in more (the right) people.
[THEME]: Talking with experts about running systems.


## Task 2: T121658 - Switch from AOF+RDB to RDB persistence strategy for ORES redis

- **URL:** https://phabricator.wikimedia.org/T121658
- **Status:** Closed, Resolved
- **Priority:** Needs Triage
- **Created:** 2015-12-16 16:54:17 (UTC+0)

**Timeline Items with Content:** 6

**Item 1: gerritbot subscribed.** 2015-12-16 22:58:46 (UTC+0)

Change 259593 had a related patch set uploaded (by Yuvipanda):  
ores: Stop using aof for redis persistance

<https://gerrit.wikimedia.org/r/259593>

**Item 2: gerritbot added a comment.** 2015-12-17 01:09:41 (UTC+0)

Change 259593 merged by Yuvipanda:  
ores: Stop using aof for redis persistance

<https://gerrit.wikimedia.org/r/259593>

**Item 3: gerritbot added a comment.** 2015-12-18 00:12:02 (UTC+0)

Change 259897 had a related patch set uploaded (by Yuvipanda):  
ores: Split cache and queue redis

<https://gerrit.wikimedia.org/r/259897>

**Item 4: gerritbot added a comment.** 2015-12-18 00:20:47 (UTC+0)

Change 259897 merged by Yuvipanda:  
ores: Split cache and queue redis

<https://gerrit.wikimedia.org/r/259897>

**Item 5: Halfak added a comment.** 2015-12-23 04:28:38 (UTC+0)

[@yuvipanda](/p/yuvipanda/), is this done?

[CODE]: Communication: Checking Status

**Item 6: yuvipanda closed this task as Resolved.** 2015-12-23 10:16:08 (UTC+0)

DONE

[CODE]: Communication: Reporting on Status


## Task 3: T181382 - Alert on graphite UDP loss

- **URL:** https://phabricator.wikimedia.org/T181382
- **Status:** Closed, Resolved
- **Priority:** High
- **Created:** 2017-11-27 09:47:25 (UTC+0)

**Timeline Items with Content:** 4

**Item 1: gerritbot subscribed.** 2017-11-27 10:21:30 (UTC+0)

Change 393562 had a related patch set uploaded (by Filippo Giunchedi; owner: Filippo Giunchedi):  
\[operations/puppet@production\] role: alert on statsd inbound udp errors

<https://gerrit.wikimedia.org/r/393562>

**Item 2: gerritbot added a comment.** 2017-11-27 14:14:30 (UTC+0)

Change 393562 merged by Filippo Giunchedi:  
\[operations/puppet@production\] role: alert on statsd inbound udp errors

<https://gerrit.wikimedia.org/r/393562>

**Item 3: gerritbot added a comment.** 2017-11-28 15:52:52 (UTC+0)

Change 393784 had a related patch set uploaded (by Filippo Giunchedi; owner: Filippo Giunchedi):  
\[operations/puppet@production\] role: use scalar() to check statsd udp loss

<https://gerrit.wikimedia.org/r/393784>

**Item 4: gerritbot added a comment.** 2017-11-28 15:55:56 (UTC+0)

Change 393784 merged by Filippo Giunchedi:  
\[operations/puppet@production\] role: use scalar() to check statsd udp loss

<https://gerrit.wikimedia.org/r/393784>


## Task 4: T85939 - Investigate job queue retries for Parsoid jobs

- **URL:** https://phabricator.wikimedia.org/T85939
- **Status:** Closed, Duplicate
- **Priority:** Medium
- **Created:** 2015-01-06 18:32:09 (UTC+0)

**Timeline Items with Content:** 2

**Item 1: ssastry subscribed.** 2015-02-07 05:23:48 (UTC+0)

This again happened today .. with another bug in Parsoid causing an infinite loop on 2 enwiki pages (and yesterday on 3 plwiki pages). The job queue relentlessly retried the two pages over the last 8 hours which required 2 restarts and a hotfix to be deployed to fix the infinite loop.

[CODE]: Recording reoccurrence
[THEME]: Increasing risk assessment - same thing happens in another way, and the cost of the ticket not being addressed yet.

**Item 2: aaron subscribed.** 2015-06-03 21:58:27 (UTC+0)

I thought this was looked into and there was nothing odd about job retries (actually I recall finding/fixing a bug that made it 1 less than it should be).

[CODE]: Finding additional related work
[CODE]: Reporting on if work needs to be actually be done
[THEME]: Stop unnecessary work.

## Task 5: T119759 - Investigate why disabling an uplink port did not deprioritize VRRP on cr2-eqiad

- **URL:** https://phabricator.wikimedia.org/T119759
- **Status:** Closed, Resolved
- **Priority:** Medium
- **Created:** 2015-11-27 13:30:42 (UTC+0)

**Timeline Items with Content:** 2

**Item 1: mark added a comment.** 2016-11-03 16:29:51 (UTC+0)

It's actually working as designed. Our current configuration looks like:

track {
    interface ae4.1004 {
        bandwidth-threshold 20g priority-cost 50;
        bandwidth-threshold 30g priority-cost 30;
    }
}

This states that if the bandwidth drops _below_ 30G, a priority cost should be incurred. Because the normal bandwidth is 40G, and only one port was disabled, the new bandwidth became 30G, not enough to incur a priority cost.

[CODE]: Reporting on if work needs to be actually be done, suggests that the configuration is the intended behavior and the behavior that occurred in one part of the system was intended.
[THEME]: Stop unnecessary work.
[THEME]: Investigation before evolving (At the time of incident analysis and AI selection, some simple investigative work hasn't been done yet, and so extra AIs are always proposed.)

**Item 2: faidon closed this task as Resolved. | faidon claimed this task. | faidon subscribed.** 2017-01-09 01:18:45 (UTC+0)

Resolving as per the above.

[CODE]: Deciding not to do any more work. (Task was to investigate, and investigation either leads to further work or not).
[THEME]: De-risk by investigating when there are unknowns (or at least respond to unknowns), instead of proposing work from the get-go.
[THEME]: Investigation before evolving

## Task 6: T158054 - Create a controlled and ongoing CI pipeline test job that we can alert on

- **URL:** https://phabricator.wikimedia.org/T158054
- **Status:** Closed, Declined
- **Priority:** Needs Triage
- **Created:** 2017-02-14 13:43:09 (UTC+0)

**Timeline Items with Content:** 6

**Item 1: hashar added a comment.** 2017-02-16 20:37:45 (UTC+0)

Ok here the random crap idea.

In Nodepool define a new label attached to an image and with a number of ready instance set to zero.

Craft a job on Jenkins that run on some not Nodepool slave. Make it spawn a child job that runs on the label defined above. Have the parent to timeout after X minutes and report back to IRC / email whatnot.

The gotcha: if the job is triggered by the Jenkins scheduler, I don't think Nodepool will notice there is demand for the associated label. Nodepool checks the demand by asking the Zuul gearman server. Gotta verify that part.

[CODE]: Proposing idea to solve, setting next steps

**Item 2: hashar added a comment.** 2017-02-16 21:07:44 (UTC+0)

Tested. A job scheduled directly by Jenkins bypass the Zuul gearman server as expected and thus Nodepool cant find there is demand for it. The build completion does emit an event over ZeroMQ and Nodepool garbage collect the instance as expected.

Plan B: get Zuul to run the job on a timer. But that is a bit scarier.

[CODE]: Reporting back on next steps

**Item 3: gerritbot subscribed.** 2017-02-16 21:29:22 (UTC+0)

Change 338179 had a related patch set uploaded (by Hashar):  
(WIP) Timed build from Zuul

<https://gerrit.wikimedia.org/r/338179>

**Item 4: hashar added a comment.** 2017-02-16 21:30:11 (UTC+0)

<https://gerrit.wikimedia.org/r/338179> is an implementation of plan B. The commit message explains it all but I dont think it is going to work properly.

**Item 5: gerritbot added a comment.** 2017-02-17 20:35:28 (UTC+0)

Change 338179 abandoned by Hashar:  
(WIP) Timed build from Zuul

<https://gerrit.wikimedia.org/r/338179>

**Item 6: hashar closed this task as Declined.** 2021-03-31 09:29:09 (UTC+0)

This was notably to ensure Nodepool was working reliably. At the time Chase went with an end to end test on WMCS infra to ensure that images were bootable and some monitoring on that side which addressed the concern.

The infra has changed since then and we at least have some alerts when the queue grows up. That is sufficient.

[CODE]: Deciding not to do further work.
[THEME]: Largely one person just reporting on their progress, not a true discussion between people. But the reporting on their progress is social effort, to ensure knowledge isn't with an individual, but instead recorded for anyone.

## Task 7: T100375 - Improve user experience of Two-Factor process

- **URL:** https://phabricator.wikimedia.org/T100375
- **Status:** Open, High
- **Priority:** High
- **Created:** 2015-05-25 21:58:24 (UTC+0)

**Timeline Items with Content:** 2

**Item 1: TheDJ subscribed.** 2016-11-18 15:06:33 (UTC+0)

Description of the Github flow: <https://help.github.com/articles/configuring-two-factor-authentication-via-a-totp-mobile-app/>  
Description of the Google flow: <https://www.authy.com/tutorials/enable-2-step-verification-gmail/>

**Item 2: Dereckson triaged this task as High priority. | Dereckson subscribed.** 2017-05-04 15:15:22 (UTC+0)

I'd like we invest time for that. Currently, we're asking users to setup 2FA, and they do stupid stuff like wipe their phone.

I've just tested the GitHub flow, I got three strong hints I need to backup the codes: 1\. web / setup 2 factor 2\. web / immediately after 3\. mail. It also offers SMS alternative, but this part is perhaps less important than secure the scratch codes, and SMS can't be considered as highly trustable,

[CODE]: Confirm that this is worth investment in (opinion)
[THEME]: Is it really high if its not getting done?


## Task 8: T114363 - Deploy Phabricator with scap3

- **URL:** https://phabricator.wikimedia.org/T114363
- **Status:** Closed, Resolved
- **Priority:** High
- **Created:** 2015-10-01 13:33:41 (UTC+0)

**Timeline Items with Content:** 14

**Item 1: • mmodell added subtasks: T125853: Move /srv/phab/repos to /srv/repos, T125851: Refactor phabricator module in puppet to remove git tag pinning behavior.** 2016-02-04 18:23:50 (UTC+0)

Added subtasks related to <https://wikitech.wikimedia.org/wiki/Incident%5Fdocumentation/20160204-Phabricator>

[CODE]: Work is composable

**Item 2: ArielGlenn added a comment.** 2016-02-15 14:54:40 (UTC+0)

<https://gerrit.wikimedia.org/r/#/c/270741/> I've done this so we can have puppet enabled on that box (which it now is). phab-related changes wil of course hot be applied. We can revert when this task is resolved.

[CODE]: Temporary steps to actually do evolution

**Item 3: • mmodell added a comment.** 2016-02-15 16:00:47 (UTC+0)

[@ArielGlenn](/p/ArielGlenn/): That's awesome, thanks!

**Item 4: ArielGlenn added a comment.** 2016-02-15 16:05:29 (UTC+0)

Well sadly it failed, because sshd. But we did get a puppet run out of it, so we're up to date for today.

**Item 5: gerritbot subscribed.** 2016-02-17 23:51:48 (UTC+0)

Change 271442 had a related patch set uploaded (by 20after4):  
Install the scap package from deb instead of trebuchet

<https://gerrit.wikimedia.org/r/271442>

**Item 6: gerritbot added a comment.** 2016-02-18 00:01:29 (UTC+0)

Change 271442 merged by Rush:  
Install the scap package from deb instead of trebuchet

<https://gerrit.wikimedia.org/r/271442>

**Item 7: gerritbot added a comment.** 2016-03-02 21:57:14 (UTC+0)

Change 274502 had a related patch set uploaded (by 20after4):  
Add a deployment source for phabricator deployment from tin/mira

<https://gerrit.wikimedia.org/r/274502>

**Item 8: gerritbot added a comment.** 2016-03-04 06:38:23 (UTC+0)

Change 274905 had a related patch set uploaded (by 20after4):  
Ferm rule: allow deployment hosts to connect to iridium ssh (for scap)

<https://gerrit.wikimedia.org/r/274905>

**Item 9: gerritbot added a comment.** 2016-03-04 17:00:49 (UTC+0)

Change 274905 abandoned by 20after4:  
Ferm rule: allow deployment hosts to connect to iridium ssh (for scap)

Reason:  
duplicated by mistake, I'm sorry

<https://gerrit.wikimedia.org/r/274905>

**Item 10: gerritbot added a comment.** 2016-03-22 20:35:54 (UTC+0)

Change 274502 merged by Dzahn:  
Add a deployment source & target class for phabricator

<https://gerrit.wikimedia.org/r/274502>

**Item 11: gerritbot added a comment.** 2016-04-12 16:18:25 (UTC+0)

Change 282186 had a related patch set uploaded (by Thcipriani):  
scap: add configuration for phabricator

<https://gerrit.wikimedia.org/r/282186>

**Item 12: gerritbot added a comment.** 2016-04-12 16:38:53 (UTC+0)

Change 282186 merged by Giuseppe Lavagetto:  
scap: add configuration for phabricator

<https://gerrit.wikimedia.org/r/282186>

**Item 13: gerritbot added a comment.** 2016-04-14 18:14:02 (UTC+0)

Change 283494 had a related patch set uploaded (by 20after4):  
scap: add deployment configuration for phabricator

<https://gerrit.wikimedia.org/r/283494>

**Item 14: gerritbot added a comment.** 2016-04-14 22:23:04 (UTC+0)

Change 283494 merged by Dzahn:  
scap: add configuration for phabricator

<https://gerrit.wikimedia.org/r/283494>


## Task 9: T200412 - PageTriage requires ORES to be installed

- **URL:** https://phabricator.wikimedia.org/T200412
- **Status:** Closed, Resolved
- **Priority:** Needs Triage
- **Created:** 2018-07-26 10:00:24 (UTC+0)

**Timeline Items with Content:** 14

**Item 1: gerritbot subscribed.** 2018-07-26 10:09:58 (UTC+0)

Change 448009 had a related patch set uploaded (by Zfilipin; owner: Zfilipin):  
\[operations/mediawiki-config@master\] Revert "group1 wikis to 1.32.0-wmf.14"

<https://gerrit.wikimedia.org/r/448009>

**Item 2: gerritbot added a project: Patch-For-Review.** 2018-07-26 10:09:59 (UTC+0)

Change 448009 **merged** by jenkins-bot:  
\[operations/mediawiki-config@master\] Revert "group1 wikis to 1.32.0-wmf.14"

<https://gerrit.wikimedia.org/r/448009>

**Item 3: zeljkofilipin assigned this task to Ladsgroup.** 2018-07-26 10:19:26 (UTC+0)

[10:15:57] <Amir1>	 zeljkof: I know what's going on and I can fix it
[10:16:09] <Amir1>	 do you want me to make the patch and fix and deploy?
[10:16:12] <zeljkof>	 Amir1: I was just about to ping you
[10:16:13] <zeljkof>	 please do
[10:16:42] <zeljkof>	 Amir1: yes, please fix it so I can deploy .14 to group 1 as soon as possible
[10:16:49] <Amir1>	 sure

[CODE]: Add external context

**Item 4: gerritbot added a comment.** 2018-07-26 10:23:42 (UTC+0)

Change 448015 had a related patch set uploaded (by Ladsgroup; owner: Amir Sarabadani):  
\[operations/mediawiki-config@master\] Enable ORES on test2wiki

<https://gerrit.wikimedia.org/r/448015>

**Item 5: Stashbot subscribed.** 2018-07-26 10:26:50 (UTC+0)

[Mentioned in SAL (#wikimedia-operations)](https://tools.wmflabs.org/sal/log/AWTWIHhPwY2u4JUTYzzh) \[2018-07-26T10:26:49Z\] <Amir1> ladsgroup@mwmaint1001:\~$ mwscript extensions/WikimediaMaintenance/createExtensionTables.php --wiki=test2wiki ores ([T200412](/T200412))

**Item 6: gerritbot added a comment.** 2018-07-26 10:28:27 (UTC+0)

Change 448015 **merged** by jenkins-bot:  
\[operations/mediawiki-config@master\] Enable ORES on test2wiki

<https://gerrit.wikimedia.org/r/448015>

**Item 7: Stashbot added a comment.** 2018-07-26 10:33:36 (UTC+0)

[Mentioned in SAL (#wikimedia-operations)](https://tools.wmflabs.org/sal/log/AWTWJqwJoDEJc1hA7zmo) \[2018-07-26T10:33:35Z\] <ladsgroup@deploy1001> Synchronized wmf-config/InitialiseSettings.php: SWAT: \[\[gerrit:448015|Enable ORES on test2wiki ([T200412](/T200412))\]\] (duration: 00m 55s)

**Item 8: Ladsgroup added a comment.** 2018-07-26 10:34:54 (UTC+0)

[@zeljkofilipin](/p/zeljkofilipin/) Now, you should not see such error when you deploy to group1\. Do you want to give it a try?

[CODE]: Communication, updating people who care

**Item 9: zeljkofilipin added a comment.** 2018-07-26 10:38:35 (UTC+0)

[@Ladsgroup](/p/Ladsgroup/) sure, let's try it.

**Item 10: zeljkofilipin closed this task as Resolved.** 2018-07-26 10:51:58 (UTC+0)

group1 wikis are at 1.32.0-wmf.14, I don't see the error in logs any more. Thanks [@Ladsgroup](/p/Ladsgroup/)!

**Item 11: awight added subscribers: SBisson, awight.** 2018-08-01 18:09:51 (UTC+0)

[@SBisson](/p/SBisson/) Should we tag <https://gerrit.wikimedia.org/r/#/c/mediawiki/extensions/PageTriage/+/448098/> with this task?

[CODE]: Assigning work

**Item 12: gerritbot added a comment.** 2018-08-01 18:16:07 (UTC+0)

Change 448098 had a related patch set uploaded (by Sbisson; owner: Sbisson):  
\[mediawiki/extensions/PageTriage@master\] Soften the dependency on the ORES extension

<https://gerrit.wikimedia.org/r/448098>

**Item 13: SBisson added a comment.** 2018-08-01 18:16:35 (UTC+0)

> In [T200412#4469921](/T200412#4469921), [@awight](/p/awight/) wrote:
> 
> [@SBisson](/p/SBisson/) Should we tag <https://gerrit.wikimedia.org/r/#/c/mediawiki/extensions/PageTriage/+/448098/> with this task?

Done. It's not the fix that was chosen for this but I would have helped.

**Item 14: gerritbot added a comment.** 2018-08-01 18:45:48 (UTC+0)

Change 448098 **merged** by jenkins-bot:  
\[mediawiki/extensions/PageTriage@master\] Soften the dependency on the ORES extension

<https://gerrit.wikimedia.org/r/448098>


## Task 10: T172480 - Add a jobrunner server to the Scap canary pool

- **URL:** https://phabricator.wikimedia.org/T172480
- **Status:** Open, Low
- **Priority:** Low
- **Created:** 2017-08-04 03:40:08 (UTC+0)

**Timeline Items with Content:** 2

**Item 1: greg edited projects, added Release-Engineering-Team (Kanban); removed Release-Engineering-Team (Next). | greg subscribed.** 2017-09-29 22:46:05 (UTC+0)

Adding our [Release-Engineering-Team (Kanban)](/project/view/2769/) project as we would like to work on this in the coming quarter or two (no promises though, this is not a "goal" only "other hoped for work").

[CODE]: Suggesting that they will take this work on

**Item 2: Krinkle added a comment.** 2019-04-20 19:43:50 (UTC+0)

This task was referenced as actionable for aa recent incident.

<https://wikitech.wikimedia.org/wiki/Incident%5Fdocumentation/20190417-Jobqueue>

[CODE]: Referring back to incident