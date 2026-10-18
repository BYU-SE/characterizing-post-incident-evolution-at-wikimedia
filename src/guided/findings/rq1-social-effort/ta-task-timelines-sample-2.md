# Random Sample of Task Timelines

**Generated:** 2025-12-09T14:02:35.339Z

**Total Tasks:** 10

---

## Task 1: T181067 - Parallelize scap for ORES

- **URL:** https://phabricator.wikimedia.org/T181067
- **Status:** Closed, Resolved
- **Priority:** Needs Triage
- **Created:** 2017-11-21 16:25:06 (UTC+0)

**Timeline Items with Content:** 2

**Item 1: Halfak claimed this task.** 2017-11-21 16:25:17 (UTC+0)

<https://gerrit.wikimedia.org/r/392671>

**Item 2: awight closed this task as Resolved. | awight subscribed.** 2017-11-28 17:03:56 (UTC+0)

Confirmed working!

[CODE]: Communication, feedback that it is working.
[THEME]: There is interest from more parties than just the one who claimed the task.


## Task 2: T295008 - MediaWiki uploads files to Swift in eqiad and codfw in serial, not parallel

- **URL:** https://phabricator.wikimedia.org/T295008
- **Status:** Open, Needs Triage
- **Priority:** Needs Triage
- **Created:** 2021-11-04 07:49:39 (UTC+0)

**Timeline Items with Content:** 3

**Item 1: tstarling added a comment.** 2024-03-08 05:32:08 (UTC+0)

This seems to be on purpose, twice over. FileBackendMultiWrite::doOperationsInternal() does the master write first, and then proceeds with the replica write only if the master write succeeded. This is an effort to keep them consistent. Maybe overkill? It's not like the primary write is reverted if the replica write fails, so they won't be consistent anyway if the data stores are unreliable.

The write to the replica can be deferred to post-send, but that is explicitly disabled in production with 'replication' => 'sync'.

[CODE]: Communication: Reporting on an (very late) investigation

**Item 2: aaron added a comment.** 2024-03-19 22:03:38 (UTC+0)

I think the intent was to have better consistency for doOperations() calls with only a single-step file operation (e.g. not move for swift). If a PUT request fails in the master backend, then not trying it on the second backend keeps things consistent. This doesn't cover the edge case of a non-answer (e.g. timeout or 503) where the objects where ultimately saved.

I don't see a fundamental reason that it can just be totally concurrent, as long as all the assessibility/precheck are still done first as normal. I suppose that resulting status could just come from the master backend results.

[CODE]: Communication: Discussion of investigation findings, and what that means for the ticket going forward.
[CODE]: Communication: Discussion of ticket goal and purpose and satisfiability.
[THEME]: Ticket's wording is "this behavior is coded, and we could do X new behavior". So discussion is largely about the goal of the system

**Item 3: aaron added a comment.** 2024-05-28 16:27:38 (UTC+0)

[@tstarling](/p/tstarling/) [@Bawolff](/p/Bawolff/) If either of you want to take this on, it seems like a worthwhile task. I could help with review.

[CODE]: Seeking an owner. But its been years, so is it urgent.
[CODE]: Difference between "urgent" and "worthwhile". I'm assuming worthwhile is why they haven't just closed it.


## Task 3: T95559 - Disable LDAP and enable admin puppet module on labstore100[12]

- **URL:** https://phabricator.wikimedia.org/T95559
- **Status:** Closed, Duplicate
- **Priority:** High
- **Created:** 2015-04-09 15:11:49 (UTC+0)

**Timeline Items with Content:** 3

**Item 1: coren added a comment.** 2015-04-16 21:00:39 (UTC+0)

This will have to be done otherwise as many users are members of more than eight groups and NFS needs to be able to check group membership for permissions. Investigating alternatives.

[CODE]: Risk assessment
[CODE]: Looking for alternatives to the plan already defined by the ticket (it is not written as open ended)

**Item 2: coren added a comment.** 2015-04-30 13:42:46 (UTC+0)

A good summary of the issue:

NFS's protocol places a hard limit on the number of supplemental groups that can be sent along a transaction for permission checks (8, 12 or 16 depending on a number of negociated things at mount such as version of server and client, packet size, etc). As we use group membership for membership to projects, service groups, and a number of other things, pretty much all users have more than 8 groups and most have more than 12 or 16.

This breaks NFS permission checks.

The NFS server provides another mechanism to check for group permissions to entirely circumvent that protocol limitation: check for what groups a user is a member of on the _server_ side. That does, however, require that the server has access to the group list and the users that are member of those groups.

Short story: the NFS server must "see" the groups and users from LDAP.

The attached patch includes the absolute minimum nslcd config to have both ldap users and groups visible via get\*ent() without (a) interfering with puppet managing named accounts, and (b) without having an impact on server security and authorization.

(a) is done by renaming the accounts to their numeric ids. So that the account 'marc' coming from ldap is named '2138' on labstore\*, for instance (likewise with the groups). Because nsswitch.conf is configured to use files before ldap, puppet is free to manage an account named 'marc' in /etc/passwd without interference.

(b) is done by:

* not getting the shadow table from ldap at all;
* forcibly setting the shell of ldap accounts to /dev/null; and
* not enabing PAM logins for LDAP accounts

[CODE]: Risk explanation, justification for investment

**Item 3: faidon subscribed.** 2015-05-05 15:45:45 (UTC+0)

I don't have any comments on the issue at hand yet, but a couple of meta-issues:

* This description should be in the commit message (and should have been in the first place, as the commit was very confusing by itself)
* I don't understand why this is a separate task from [T87870](/T87870). Given that this wasn't created as a subtask either and I wasn't manually added to Cc, I totally missed the summary until now where I accidentally bumped into this :(

[CODE]: Feedback on the attached patch which may be considered an MVP/example/potential real solution, hard to tell.
[CODE]: Assessment of duplication of work, or why this task wasn't organized a certain way
[THEME]: Organization of work can play an impact on visibility to get feedback on change or make sure it isn't duplicated

## Task 4: T217924 - Make canary wait time configurable

- **URL:** https://phabricator.wikimedia.org/T217924
- **Status:** Closed, Resolved
- **Priority:** Medium
- **Created:** 2019-03-08 21:36:20 (UTC+0)

**Timeline Items with Content:** 10

**Item 1: jijiki edited projects, added SRE; removed Patch-For-Review. | jijiki added a subscriber: mark.** 2020-01-15 18:24:22 (UTC+0)

[@thcipriani](/p/thcipriani/) as per our discussion, we can consider merging and testing first for syncing files and then on the train. How does that sound?

[CODE]: External context, confirming decisions that were made so there is a record log
[CODE]: Steps to reduce risk of change
[THEME]: Need to test multiple times to reduce some types of risks

**Item 2: jijiki added a comment.** 2020-01-22 10:51:02 (UTC+0)

[@thcipriani](/p/thcipriani/) ping! :)

[CODE]: Communication: Notify a particular party (one that was already invested)

**Item 3: thcipriani added a comment.** 2020-01-22 16:10:04 (UTC+0)

> In [T217924#5822404](/T217924#5822404), [@jijiki](/p/jijiki/) wrote:
> 
> [@thcipriani](/p/thcipriani/) ping! :)

pong!

> In [T217924#5806546](/T217924#5806546), [@jijiki](/p/jijiki/) wrote:
> 
> [@thcipriani](/p/thcipriani/) as per our discussion, we can consider merging and testing first for syncing files and then on the train. How does that sound?

The idea to apply this first to scap sync-\* and then to scap sync? That sounds fine in terms of rollout. In terms of the code all these mechanisms for syncing follow a similar pattern (from AbstractSync), so it may end up tricky to apply this only to sync-file and not, e.g., sync-wikiversions.

Also, per our discussion, we should be able to use the utils.ask/utils.confirm functions to tell folks:

1. It's sync'd on canaries
2. We've run the smoke tests against canaries/checked logstash on the canaries

And then have folks continue with rollout from there.

[CODE]: Communication: Confirm seen information
[CODE]: Minimizing risk associated with deployments
[THEME]: Handling known risks

**Item 4: jijiki added a comment.** 2020-01-23 17:33:19 (UTC+0)

If it is a lot of work to limit when \--canary-wait-time is available, we could do a graceful rollout, by asking deployers, via utils.ask/utils.confirm), to try this flag on, say, scap sync-\*. When we are happy with the results, we can move forward, and change the message. It is not ideal, but it is a quick way to push this to prod. How does that sound?

[CODE]: Ideas to mitigate identified risk

**Item 5: jijiki added a comment.** 2020-02-07 10:57:43 (UTC+0)

shall we move this forward?

**Item 6: jijiki added a comment.** 2020-02-28 14:41:04 (UTC+0)

Great we merged this patch! Do we have a plan of how we will communicate this to the deployers when we release scap as well as how to test that it is all good in production? Thank you!

[CODE]: Next steps, after code evolution is notification

**Item 7: • LarsWirzenius added a comment.** 2020-02-28 16:04:13 (UTC+0)

I had a discussion with Tyler just now. We plan the following:

* add to docs/ in the source tree; this ends up in doc.wikimedia.org
* add to debian/changelog in the source tree
* update the wikitech Scap page
* notify ops list
* notify wikitech-l list
* have it mentioned in Scrum of Scrums

Further, we plan on me making a new release soon, so we can get this into use sooner rather than later, and to give me more chance to practice the scap release process.

Re testing that all is good in production? Can you expand on what you have in mind?

[CODE]: External context

**Item 8: jijiki added a comment.** 2020-02-28 16:09:55 (UTC+0)

> In [T217924#5926912](/T217924#5926912), [@LarsWirzenius](/p/LarsWirzenius/) wrote:
> 
> I had a discussion with Tyler just now. We plan the following:
> 
> * add to docs/ in the source tree; this ends up in doc.wikimedia.org
> * add to debian/changelog in the source tree
> * update the wikitech Scap page
> * notify ops list
> * notify wikitech-l list
> * have it mentioned in Scrum of Scrums

Great!

> Further, we plan on me making a new release soon, so we can get this into use sooner rather than later, and to give me more chance to practice the scap release process.
> 
> Re testing that all is good in production? Can you expand on what you have in mind?

We have tested this in non production environments but what I was going for was before announcing to lists etc, to have a go when deploying minor changes with scap, and then possibly in a group 0 train release. If that is all good, we can go ahead and let deployers know they can start using it

Thank you!

**Item 9: • LarsWirzenius added a comment.** 2020-03-23 14:15:39 (UTC+0)

I'm thinking the following now:

* make a release with --canary-wait-times -- hopefully this week  
   * only --canary-wait-times and a build-time acceptance test suite as the only changes
* SRE builds new package, installs on relevant servers
* wait for train to have deployed with new version
* if train has scap related problems, roll back to previous scap release  
   * either revert changes and make new release, or SRE downgrades, depending on which is easier for SRE
* if train went well as far as scap goes, announce --canary-wait-times change to scap users

How does that sound?

[CODE]: Refinement of announcement (evolution final steps)

**Item 10: • LarsWirzenius closed this task as Resolved.** 2020-07-14 14:53:32 (UTC+0)

\--canary-wait-time has been included in a release and announced to the public and used on multiple trains now. Closing task.

[CODE]: Communication of deploy

## Task 5: T199443 - Remove `kafka-mirror` unit from main kafka cluster

- **URL:** https://phabricator.wikimedia.org/T199443
- **Status:** Closed, Resolved
- **Priority:** Low
- **Created:** 2018-07-12 13:45:22 (UTC+0)

**Timeline Items with Content:** 3

**Item 1: elukey subscribed.** 2018-07-23 07:55:04 (UTC+0)

So this kafka-mirror instance is defined as follows:

elukey@kafka1001:~$ sudo systemctl cat kafka-mirror
# /lib/systemd/system/kafka-mirror.service
[Unit]
Description=Kafka MirrorMaker - All Instances

[Service]
Type=oneshot
RemainAfterExit=true
ExecStart=/bin/true
ExecReload=/bin/true

And this is a regular mirror maker instance:

elukey@kafka1001:~$ sudo systemctl cat kafka-mirror-main-codfw_to_main-eqiad@0.service
# /lib/systemd/system/kafka-mirror-main-codfw_to_main-eqiad@0.service
# NOTE: This file is managed by Puppet.

[Unit]
Description=Kafka MirrorMaker Instance of main-codfw_to_main-eqiad@0

[Service]
User=kafka
Group=kafka

[..]

[Install]
WantedBy=kafka-mirror.service multi-user.target

The kafka-mirror unit is only a catch all to restart all the mirror maker instance on the same host in one go. It was probably stopped during the outage but as far as I can see now it seems working everywhere. It is also named kafka-mirror.service - Kafka MirrorMaker - All Instances, so it seems clear enough, I'd keep it without changing it.

[CODE]: Deeper investigation into how a piece of software played a role in the incident
[CODE]: Complex incident, risk of not understanding why this piece of software exists
[THEME]: Investigation before evolving


**Item 2: Ottomata added a comment.** 2018-07-31 18:49:39 (UTC+0)

I created this when we were running multiple MirrorMaker instance on the same box. This service allows you to stop and start all of them at once. As we only have one instance per box everywhere right now, it isn't needed, but in the future if we need to scale the MirrorMaker producer, we may need to spawn more than once instance per box. Let's keep this.

[CODE]: Context for making decisions about next steps, but since it was already marked as resolved, it likely serves as documentation for why things exist in case there are future questions
[THEME]: Documenting decisions thoroughly, especially when there is lack of clarity around the issue (see the IR for how there is an expert but they were on vacation, so things were hard)

**Item 3: • Pchelolo added a comment.** 2018-07-31 18:52:34 (UTC+0)

Ye, I just didn't really know what exactly that is and in the heat of the outage I was a bit confused.

[CODE]: Context from being involved in incident, and explanation of confusion leading to this AI.
[THEME]: Incident experience (including not knowing what is going on) guides the selection of AIs, even though this likely could have been resolved before creating the AI if they had Ottomata's experience that this is necessary.

## Task 6: T146664 - Limit resources used by ORES

- **URL:** https://phabricator.wikimedia.org/T146664
- **Status:** Closed, Resolved
- **Priority:** Medium
- **Created:** 2016-09-26 16:36:40 (UTC+0)

[CODE]: Created before incident

**Timeline Items with Content:** 14


**Item 1: • Fjalapeno added subscribers: Halfak, • Fjalapeno.** 2017-02-14 16:14:32 (UTC+0)

The Reading team is currently investigating whether it needs to procure additional hardware to support the [Mobile-Content-Service](/tag/mobile-content-service/) and other Reading focused\[1\] services through FY2018.

Since the MCS and ORES run on the same hardware, this outcome of this ticket will largely determine the answer to that question.

Is there any update on this conversation? It has been a few months since this was filed so I am not sure if this is still seen as a need.

[@Halfak](/p/Halfak/) have you looked into this at all? I know with annual planning and your proposal for a team this could be on your radar.

\[1\]: Currently just the [Trending-Service](/tag/trending-service/)

[CODE]: Other work going on in parallel
[CODE]: This work can influence what more work gets done
[CODE]: No update on ticket in a while
[CODE]: Planning meetings have additional context that is not included in artifacts, likely where risk and value get decided (so it can be on their radar). This message would signal third party interest / priority.

**Item 2: Halfak added a comment.** 2017-02-14 16:21:50 (UTC+0)

Hey! Thanks for the ping. It turns out that the referenced CPU/memory issues weren't due to ORES over-use at all! Also, in the meantime, we've made several advances in performance/memory footprint of ORES. To my knowledge, we have not had issues.

**Item 3: • GWicke added a comment.** 2017-02-14 17:28:57 (UTC+0)

[@Halfak](/p/Halfak/), the referenced issues were very definitely ORES using almost all memory. Things have certainly improved since, but given the fairly experimental nature a service like ORES will always have more risk of unexpected behavior than most other production services.

**Item 4: • mobrovac added a comment.** 2017-02-14 17:44:12 (UTC+0)

> In [T146664#3025899](/T146664#3025899), [@GWicke](/p/GWicke/) wrote:
> 
> [@Halfak](/p/Halfak/), the referenced issues were very definitely ORES using almost all memory. Things have certainly improved since, but given the fairly experimental nature a service like ORES will always have more risk of unexpected behavior than most other production services.

The last occurrence was on 2017-02-04 when the ORES MW API calls and CP pre-caching requests had to be disabled so as not to bring SCB completely down. FTR, [SRE](/tag/sre/) also agree on moving ORES out of SCB.

**Item 5: Halfak added a comment.** 2017-02-14 18:04:05 (UTC+0)

[@mobrovac](/p/mobrovac/), I'd not been notified about [SRE](/tag/sre/) coming to a conclusion about moving ORES out of SCB. Can you link me to a discussion or a statement about that conclusion?

Regarding the event on 2/4, that was not a threat to bringing SCB down. ORES was operating at the top of its hard-limited capacity because of a severe over-utilization event. Our own backpressure systems were returning 503s as expected and we decided to cut off a user because their behavior was limiting the usefulness of ORES to others. At the peak, combined CPU usage across the SCB nodes was 50-60%. Not great for sustained usage, but certainly not threatening to take SCB down.

**Item 6: Halfak added a comment.** 2017-02-14 18:07:14 (UTC+0)

[@GWicke](/p/GWicke/), I remember looking into that event and determining that it was not ORES using all of the memory, but that there were things we could do to improve (reduce) ORES memory usage. Thus, the advances I referenced earlier. The experimental nature of ORES is about how it interacts with the social production dynamics of our wikis -- not in how it acts as a web service. Running a job queue isn't rocket science and I think our uptime reflects that.

**Item 7: Halfak added a comment.** 2017-02-14 18:11:50 (UTC+0)

So, rather than continue this debate on an unrelated phab task, here's what I propose.

1. [@GWicke](/p/GWicke/), If you think that this ticket is still relevant, please make a statement about how you believe ORES resource usage continues to be roblematic so that we can iterate on solutions.
2. [@Fjalapeno](/p/Fjalapeno/), Please reference [T157222: Estimate ORES capex for FY2017-18](/T157222) for discussions about what hardware resources we'll be investing in for FY2018\. I think \*that\* ticket will be your determining factor in whether or not ORES will running on the same hardware.

**Item 8: • Fjalapeno added a comment.** 2017-02-14 18:19:39 (UTC+0)

[@Halfak](/p/Halfak/) ahh… thanks for the link! Forgot about that ticket when looking around.

**Item 9: • mobrovac added a comment.** 2017-02-14 20:31:24 (UTC+0)

> In [T146664#3026086](/T146664#3026086), [@Halfak](/p/Halfak/) wrote:
> 
> [@mobrovac](/p/mobrovac/), I'd not been notified about [SRE](/tag/sre/) coming to a conclusion about moving ORES out of SCB. Can you link me to a discussion or a statement about that conclusion?

Please stop distorting other people's words. This is honestly getting annoying. Re-post of my earlier comment:

> In [T146664#3026041](/T146664#3026041), [@mobrovac](/p/mobrovac/) wrote:
> 
> FTR, [SRE](/tag/sre/) also **agree** on moving ORES out of SCB.

(bold added)

**Item 10: Halfak added a comment.** 2017-02-14 20:38:12 (UTC+0)

[@mobrovac](/p/mobrovac/), let me try again. Who from [SRE](/tag/sre/) did you talk to? Was that agreement public? Can you link me to any discussion? I'd like to re-hash that conversation since I'm keen on resolving [T157222: Estimate ORES capex for FY2017-18](/T157222)

**Item 11: • mobrovac added a comment.** 2017-02-15 17:08:52 (UTC+0)

> In [T146664#3027004](/T146664#3027004), [@Halfak](/p/Halfak/) wrote:
> 
> [@mobrovac](/p/mobrovac/), let me try again. Who from [SRE](/tag/sre/) did you talk to? Was that agreement public? Can you link me to any discussion? I'd like to re-hash that conversation since I'm keen on resolving [T157222: Estimate ORES capex for FY2017-18](/T157222)

Ok, let's try again :) Ops and Services have brought this up multiple times in our sync-up meetings. There is no written (public) record of it, though. For context, the discussion points were that (a) ORES is much more computationally intensive than the rest of the services hosted there; and (b) it is the only service on SCB that is not stateless. So the consensus has been basically that both in conceptual and practical terms it would be more beneficial for all parties involved if ORES were to be moved to dedicated hardware. In that sense I'm glad to see [T157222: Estimate ORES capex for FY2017-18](/T157222).

**Item 12: Halfak added a comment.** 2017-02-15 17:27:00 (UTC+0)

Great! But note that ORES is stateless unless you consider our cache to be "state". Surely "consensus" can't happen for "all parties" unless I'm involved in the conversation. If I were, I could have probably cleared up some misconceptions and asked the ops reps about how they'd like to move forward with purchasing more hardware. Maybe we can try that discussion again. I'll work that out and make sure we have a rep from services.

**Item 13: Ladsgroup subscribed.** 2017-02-23 22:59:01 (UTC+0)

I don't know about disk quota but regarding RAM. This easily can be added in the puppet using [MemoryHigh= and MemoryMax=](https://www.freedesktop.org/software/systemd/man/systemd.resource-control.html) options in the systemd configs but It's not easily guessable how much ORES is now using (because other services use memory making the total memory useless in this case). In [SRE](/tag/sre/) perspective, how much should be the limit?

**Item 14: awight closed this task as Resolved. | awight claimed this task. | awight subscribed.** 2018-02-26 17:36:14 (UTC+0)

We've moved to a dedicated cluster—the best possible way to limit resources ;-)

[CODE]: The only message after the incident occurred, and sarcastic in that they just solved this problem by not sharing resources so limits on resources aren't going to affect other software



## Task 7: T252503 - Create automatically updated CI test environment

- **URL:** https://phabricator.wikimedia.org/T252503
- **Status:** Closed, Declined
- **Priority:** Medium
- **Created:** 2020-05-12 07:47:46 (UTC+0)

**Timeline Items with Content:** 1

**Item 1: Gehel subscribed.** 2020-05-13 12:34:47 (UTC+0)

We could use wdqs1009, which at the moment automatically deploys the deploy repo. Instead, we could deploy the current master.

[CODE]: Express potential way to evolve, as the task is phrased as a "this is what we would like to have as a goal"


## Task 8: T230783 - Switchover s3 primary database master db1075 -> db1123 - 24th Sept @05:00 UTC

- **URL:** https://phabricator.wikimedia.org/T230783
- **Status:** Closed, Resolved
- **Priority:** Medium
- **Created:** 2019-08-20 10:13:54 (UTC+0)

[CODE]: Created before incident

**Timeline Items with Content:** 13

**Item 1: Marostegui added a comment.** 2019-09-16 12:56:43 (UTC+0)

Reserved window on the deployments calendar: <https://wikitech.wikimedia.org/w/index.php?title=Deployments&type=revision&diff=1837750&oldid=1837737>

**Item 2: Marostegui added a comment.** 2019-09-23 05:12:58 (UTC+0)

db1075 (the current master) crashed yesterday with BBU issues [T233534: db1075 (s3 master) crashed - BBU failure](/T233534).  
db1078 is also part of the same batch of hosts that have had BBU issues [T233569](/T233569) so my idea is to failover db1075 to db1078 as normally planned, get db1075's BBU replaced once the new BBU arrives {T231670} and then fail over back to db1075

[CODE]: After incident
[CODE]: Provide context from the recent failure
[THEME]: Incidents provide important context for how things will fail, how on-going evolution (this task to adjust to maintenance) is affected.

**Item 3: Marostegui added a comment.** 2019-09-23 06:37:01 (UTC+0)

db1123 (current recentchanges, logpager etc) s3 slave is in D8, so thus not affected by the PDU maintenance, so maybe we should failover to thist host instead of db1078 as db1078 is at [T233569: Batch db1074-db1079 hosts having BBU issues](/T233569)

**Item 4: Stashbot added a comment.** 2019-09-23 07:06:30 (UTC+0)

[Mentioned in SAL (#wikimedia-operations)](https://tools.wmflabs.org/sal/log/AW1c8XEOEHTBTPG-WFmP) \[2019-09-23T07:06:29Z\] <marostegui@cumin1001> dbctl commit (dc=all): 'Depool db1123 to change binlog format [T230783](/T230783)', diff saved to <https://phabricator.wikimedia.org/P9145> and previous config saved to /var/cache/conftool/dbconfig/20190923-070628-marostegui.json

**Item 5: Stashbot added a comment.** 2019-09-23 07:08:10 (UTC+0)

[Mentioned in SAL (#wikimedia-operations)](https://tools.wmflabs.org/sal/log/AW1c8vfvEHTBTPG-WFmW) \[2019-09-23T07:08:10Z\] <marostegui> Stop MySQL on db1123 to reboot to change binlog format and kernel - [T230783](/T230783)

**Item 6: Stashbot added a comment.** 2019-09-24 04:13:02 (UTC+0)

[Mentioned in SAL (#wikimedia-operations)](https://tools.wmflabs.org/sal/log/AW1hePz-OwpQ-3PkVNMn) \[2019-09-24T04:13:01Z\] <marostegui> Start pre switchover steps - [T230783](/T230783)

**Item 7: Stashbot added a comment.** 2019-09-24 04:21:23 (UTC+0)

[Mentioned in SAL (#wikimedia-operations)](https://tools.wmflabs.org/sal/log/AW1hgKEnEHTBTPG-W9LG) \[2019-09-24T04:21:22Z\] <marostegui@cumin1001> dbctl commit (dc=all): 'Set weight 0 to db1123 [T230783](/T230783)', diff saved to <https://phabricator.wikimedia.org/P9156> and previous config saved to /var/cache/conftool/dbconfig/20190924-042121-marostegui.json

**Item 8: Stashbot added a comment.** 2019-09-24 05:00:15 (UTC+0)

[Mentioned in SAL (#wikimedia-operations)](https://tools.wmflabs.org/sal/log/AW1hpDVAEHTBTPG-W-ZP) \[2019-09-24T05:00:14Z\] <marostegui> Starting s3 failover from db1075 to db1123 - [T230783](/T230783)

**Item 9: Stashbot added a comment.** 2019-09-24 05:00:36 (UTC+0)

[Mentioned in SAL (#wikimedia-operations)](https://tools.wmflabs.org/sal/log/AW1hpIk0OwpQ-3PkVOnT) \[2019-09-24T05:00:35Z\] <marostegui@cumin1001> dbctl commit (dc=all): 'Set s3 as read-only for maintenance [T230783](/T230783)', diff saved to <https://phabricator.wikimedia.org/P9157> and previous config saved to /var/cache/conftool/dbconfig/20190924-050034-marostegui.json

**Item 10: Stashbot added a comment.** 2019-09-24 05:10:15 (UTC+0)

[Mentioned in SAL (#wikimedia-operations)](https://tools.wmflabs.org/sal/log/AW1hrV13OwpQ-3PkVO6T) \[2019-09-24T05:10:14Z\] <cdanis> [T230783](/T230783) mark DEFAULT not s3 as readonly in etcd etcd dbconfig data

**Item 11: Stashbot added a comment.** 2019-09-24 05:11:49 (UTC+0)

[Mentioned in SAL (#wikimedia-operations)](https://tools.wmflabs.org/sal/log/AW1hrs5tOwpQ-3PkVO-B) \[2019-09-24T05:11:49Z\] <marostegui@cumin1001> dbctl commit (dc=all): 'Promote db1123 to s3 master and remove read-only from s3 [T230783](/T230783)', diff saved to <https://phabricator.wikimedia.org/P9158> and previous config saved to /var/cache/conftool/dbconfig/20190924-051147-marostegui.json

**Item 12: Stashbot added a comment.** 2019-09-24 05:13:08 (UTC+0)

[Mentioned in SAL (#wikimedia-operations)](https://tools.wmflabs.org/sal/log/AW1hsAPgOwpQ-3PkVO%5F7) \[2019-09-24T05:13:08Z\] <cdanis@cumin1001> dbctl commit (dc=all): 're-do [T230783](/T230783) master promotion and set read-write', diff saved to <https://phabricator.wikimedia.org/P9159> and previous config saved to /var/cache/conftool/dbconfig/20190924-051307-cdanis.json

**Item 13: Marostegui added a comment.** 2019-09-24 05:39:46 (UTC+0)

This was done successfully.

read only start: 05:10:14 UTC AM  
read only stop: 05:13:08 UTC AM

total read only time: 2 minutes 54 seconds.

We had a slightly longer read only time compared to the all the previous ones due to some issues with the way we set read-only, those will be followed up at [T233679](/T233679)

Thanks everyone who helped out!

[CODE]: Communication, completed task


## Task 9: T166384 - scap: Investigate scaps handling of InitialiseSettings.php

- **URL:** https://phabricator.wikimedia.org/T166384
- **Status:** Closed, Resolved
- **Priority:** Medium
- **Created:** 2017-05-26 13:29:29 (UTC+0)

**Timeline Items with Content:** 3

**Item 1: • demon subscribed.** 2017-05-26 17:25:37 (UTC+0)

Cf {D654} wherein I want to remove the idea of \--beta-only-change as well.

**Item 2: Seb35 subscribed.** 2017-06-16 16:15:11 (UTC+0)

Note that there is a filemtime( "InitialiseSettings.php" ) in <https://phabricator.wikimedia.org/source/mediawiki-config/browse/master/wmf-config/CommonSettings.php;3d7a96ad4d39b09960f4c212109ff7e129cdc712$159>. I guess it explains why touching InitialiseSettings.php triggered the beginning of the performance issues, possibly some feature flag or parameter was activated at this time. (I didn’t read in details the post-mortem itself.)

[CODE]: Reading postmortem is work, engineer decided not to do
[THEME]: Additional context to support evolution
[THEME]: Incident is only part of the important evolutionary context, perhaps not utilized since it exists in a separate artifact and the relevant context from the incident should likely be in the ticket.

**Item 3: thcipriani closed this task as Resolved. | thcipriani reassigned this task from thcipriani to • demon.** 2017-07-05 16:52:18 (UTC+0)

Now that D654 is landed all of the sync-\* commands should always touch InitialiseSettings.php. It seems that we don't worry so much about [T103886](/T103886) this should be the correct behavior. This will roll with scap 3.6.0-1


## Task 10: T96063 - Migrate Labs NFS storage from RAID6 to RAID10

- **URL:** https://phabricator.wikimedia.org/T96063
- **Status:** Closed, Resolved
- **Priority:** High
- **Created:** 2015-04-14 18:39:06 (UTC+0)

**Timeline Items with Content:** 21

**Item 1: coren triaged this task as Low priority.** 2015-04-14 19:38:54 (UTC+0)

Raid 6 is a performance bottleneck but gives us 66% more effective storage than raid10 would in the current configuration. It doesn't mean that moving away from raid6 is inconceivable, but that doing so has a significant cost (as well as being a complicated operation).

Setting priority to Low since this lives in the nice-to-have domain, and that any investigation for phasing NFS out (which is already in the long-term plans) would imply reconsideration of the backing block devices anyways.

[CODE]: Risk assessment between performance and storage space
[CODE]: Priority assessment with "nice to have"

**Item 2: BBlack added a comment.** 2015-04-14 21:24:15 (UTC+0)

As we've seen, RAID6 has serious performance issues under write heavy load, and isn't especially great at recovering from unclean shutdown (but we could address the latter to some degree with write-intent bitmaps and kernel updates) or disk failure->recovery scenarios.

RAID6 is what we're using in this case, but the same basic arguments apply to all of RAID\[456\], which are all variations on the same theme of parity. Parity recalculation is expensive in terms of physical disk traffic and CPU load, and tends not to scale well. The reason everyone uses RAID6 instead of RAID5 these days mostly boils down to the math, and that same math also indicates that even RAID6 is slowly becoming unacceptable. Note this ACM paper: <http://queue.acm.org/detail.cfm?id=1670144> (quicker/easier zdnet summary here: <http://www.zdnet.com/article/why-raid-6-stops-working-in-2019/> ) . It was written in 2009, and we're now 6/10 years through the remaining 10 year life of RAID6 practicality the author mentions there before we have to move away from RAID6 to something based on triple-parity, because the RAID6 math on capacity vs MTBF vs rebuild time, etc keeps getting worse over time.

Regardless of the above there's always price:perf:space tradeoffs between RAID6 and RAID10, but there's also tradeoffs involve in giving any fixed amount of space to the users in the first place. It would be nice if we had twice the available capacity we do today. If there were a rational reason that we didn't, it would be "why waste the money? Nobody's demanded it that hard yet". But if you did it, users would find ways to expand into it. People tend to size their demands to availability in a lot of cases like these (because in truth, their hard need for space is way lower than their apparent usage of it), and I think the tradeoff is virtually always there at today's storage prices to avoid RAID6 and all of the associated tradeoffs, all of which are negative except for the "more space" bit.

All of the above might have different answers if we were using hardware-based enterprise-grade external RAID arrays with dedicated high-performance controllers and caches. But we're not (and I don't think I'd recommend that, either!). We're using Linux software RAID.

Even in the RAID10 world, there are similar looming issues for mirroring based on disk capacity + failure rate math. The short answers there are: write intent bitmaps help in that case (as they do in every such case) to speed rebuild times, and that using a larger count of smaller disks rather than a smaller count of larger disks still helps with those tradeoffs without significant caveat in the RAID10 world as well. You can also start putting hot spare drives in place (to reduce the total loss-of-redundancy window by taking human reaction + physical stuff out of the window), and then later on in the global timeline of these factors, you really have to start considering triple-mirroring for large datasets where periodic backups and hot spares are insufficient protection.

[CODE]: Background context

**Item 3: yuvipanda raised the priority of this task from Low to Medium.** 2015-05-05 23:00:25 (UTC+0)

So right now, we have five shelves of disks, and

/dev/mapper/store-now    40T   11T   30T  27% /srv/project

So about 72% free. What's preventing us from moving to RAID10 and taking the hit on space lost? I guess it'll be a slow operation involving a lot of juggling, but [@BBlack](/p/BBlack/) makes a convincing case that this is the way to move forward (we've had disk corruption with unclean shutdown already).

**Item 4: mark added a comment.** 2015-05-07 09:36:49 (UTC+0)

> In [T96063#1207581](/T96063#1207581), [@coren](/p/coren/) wrote:
> 
> Raid 6 is a performance bottleneck but gives us 66% more effective storage than raid10 would in the current configuration. It doesn't mean that moving away from raid6 is inconceivable, but that doing so has a significant cost (as well as being a complicated operation).
> 
> Setting priority to Low since this lives in the nice-to-have domain, and that any investigation for phasing NFS out (which is already in the long-term plans) would imply reconsideration of the backing block devices anyways.

With the current stability and performance problems of NFS with RAID6, this is definitely not a "nice to have" but something that needs to be fixed ASAP. Storage capacity is far, FAR less important than stability at this point.

[CODE]: Reprioritization, assessment of risk is that one of these tradeoffs is more important right now.

**Item 5: coren added a comment.** 2015-05-08 02:50:57 (UTC+0)

> In [T96063#1268232](/T96063#1268232), [@mark](/p/mark/) wrote:
> 
> With the current stability and performance problems of NFS with RAID6, this is definitely not a "nice to have" but something that needs to be fixed ASAP. Storage capacity is far, FAR less important than stability at this point.

Given that the plans that necessitated the overprovisioning (a seperate Labs in codfw) no longer exists, we do indeed have sufficient space to use raid10 rather than raid6 (60T suffices for primary storage and snapshots, the extra 30T were needed if we had cross-DC storage replicated).

Migrating the logical volumes between raid6 and raid10 will be a several-step manoeuvre as we need to succesively evacuate the individual raid devices (being 1:1 with physical shelves), bebuild the array as raid10, and move the volume from pv subset to pv subset. This can be done while the filesystem is live, but is both a delicate operation and very I/O intensive (on the plus side, the writes to the new pv will not be amplified by the raid6 setup).

Because the actually available number of pe will diminish after each successive conversion, the actual number of operations will likely need to increase (think towers of hanoi).

**Item 6: mark added a project: Cloud-VPS.** 2015-05-08 08:30:33 (UTC+0)

[@coren](/p/coren/): Where can I see the mapping of raid array (md125 etc) to shelf? Is this documented?

**Item 7: coren added a comment.** 2015-05-08 11:17:04 (UTC+0)

[@mark](/p/mark/): It's in the slides (<https://commons.wikimedia.org/wiki/File:WMF%5FLabs%5Fstorage%5Fpresentation.pdf>) but also ridiculously straightforward: shelves are mapped 1:1 to /dev/md/slice\[1-5\].

**Item 8: coren added a comment.** 2015-05-08 11:19:55 (UTC+0)

A note: while it will probably increase the amount of necessary juggling, the entire setup would be _immensely_ improved with raid10 if - rather than one shelf one array - we put 6/6 drives per array on /consecutive/ shelves (so 1-2, 2-3, 3-4, 4-5, 5-1). One average, this will not generally improve disk bandwidth but it will make the arrays imprevious to loosing a shelf briefly.

**Item 9: mark added a comment.** 2015-05-08 11:53:54 (UTC+0)

Can you work out a plan, and list all the individual steps (ideally with command line invocations) on this ticket?

**Item 10: coren added a comment.** 2015-05-11 15:10:21 (UTC+0)

The plan is to gradually evacuate the pv on individual raid arrays with pvmove, reconfigure the freed raid arrays with raid 10, and recreate pv on the new arrays to be used as destination for further moves. slice5 is currently mostly empty already, and slice1 is currently allocated only to the (now obsolete) safety copy (pre-thin volumes) store/project. So:

1. drop the store/project volume
2. remove slice1 pv
3. pvmove the contents of slice5 away
4. drop slice5 pv
5. create the new 'slice51' array accross the end of slice5/start of slice1
6. pvmove what is left on slice2 away (most was the rest of store/project, the rest fits)
7. drop slice2
8. create 'slice12' (end of slice1, start of slice2)

At this point, we don't have _quite_ enough room for removing another pv with the volume sizes as they are. We can safely shave approximately 12T off the thin pool without risking running out of space - freeing most of slice4

1. pvmove slice4 away (slice3 is the busiest, keeping for last)
2. drop slice4
3. create 'slice45'
4. pvmove slice3 away (this leaves us with roughly 4t to spare)
5. drop slice4
6. create slice23 and slice34
7. restore the thin pool size

A further optimization may be possible at that point by moving around store/journal to live on the least use slice.

[CODE]: Define the actual evolution steps

**Item 11: coren added a comment.** 2015-05-11 15:47:31 (UTC+0)

An alternative plan, based on input from [@mark](/p/mark/), that front loads the thin pool move to give performance improvement earlier. With a bit of extra juggling (because it's a bit harder to free the second slice in that scenario):

1. drop the store/project volume
2. remove slice1 pv
3. pvmove the contents of slice5 away to free room on slice2
4. drop slice5 pv
5. create slice51
6. reduce the store/space thin pool to 20T
7. pvmove the tail end of store/space from slice4 to slice51
8. drop slice4 pv
9. create slice45
10. pvmove tail end of slice3 to what is left of slice51
11. pvmove rest of slice3 to slice45
12. drop slice3 pv
13. create slice34
14. pvmove remainder of slice2 to slice34
15. drop slice2 pv
16. create slice12 and slice23
17. restore thin pool size

[CODE]: Define alternative evolution steps

**Item 12: mark added a comment.** 2015-05-13 09:58:39 (UTC+0)

This seems reasonable yes. Let's move ahead with this after the new backups have finished (codfw + eqiad).

**Item 13: coren claimed this task. | coren moved this task from To Do to Doing on the Labs-Sprint-101 board.** 2015-06-08 14:36:56 (UTC+0)

Starting this, gingerly, for the parts which are not on (the currently overloaded) slice3

**Item 14: coren changed the task status from Open to Stalled.** 2015-06-08 15:21:31 (UTC+0)

Process halted for now (mid step 3): the temporary backup snapshot made for [T101011](/T101011) lives on slice5 and, because it is a live snapshot, cannot be moved.

This can be resumed as soon as the snapshot is dropped at the conclusion of the rsync (this is the last lv on that pv)

**Item 15: coren added a comment.** 2015-06-16 17:50:21 (UTC+0)

The backup is complete, and the snapshot has been removed - freeing slice5 completely.

Resuming now at step 4.

**Item 16: coren added a comment.** 2015-06-16 18:34:28 (UTC+0)

Problem in step 6:

# lvreduce -L 22T store/space
  Thin pool volumes cannot be reduced in size yet.

Where "yet" means "ever" because [CLOSED WONTFIX](https://bugzilla.redhat.com/show%5Fbug.cgi?id=812731) upstream,

Recalculating the necessary volume moves; this remains doable but may now require intermediate steps and a temporary pv.

**Item 17: coren added a comment.** 2015-06-16 19:11:20 (UTC+0)

Now needs to be:

1. pvmove journal, keys, tmeta and the tail end of space from slice2 to slice51 \[1189581 free pe on slice51\]
2. remove slice2 pv
3. create slice12 pv \[4050187 pe available for 51+12\]
4. add dumps pv (from the internal controller) \[2383838 extra pe\]
5. pvmove first 2383838 extents from slice3 to dumps
6. pvmove remaining 2383839 extents from slice3 to slice12 \[476767 free left\]
7. remove slice3 pv
8. create slice23 pv
9. pvmove slice4: 1189581->slice51, 476767->slice12, 2860606->slice23 \[240723 left\]
10. create pv from free "half" of ex-slice5 \[1430303 pe\]
11. pvmove 240723 remaining of slice4 to that temp pv
12. remove slice4
13. create slice34
14. pvmove temp pv to slice34
15. remove temp pv
16. create slice45
17. pvmove dumps pv to slice34, slice45

Phew.

[CODE]: Evolution plan changes due to discovery during evolution.

**Item 18: coren added a comment.** 2015-06-16 22:28:36 (UTC+0)

journal, keys and tmeta migrated to slice51

After some wrangling with block io sizes (thin lvm volumes refuse block transations bigger than the page size), the move of space from slice2 to slice51 is now in progress, at a glacial pace.

(examination of the lvm mirror code used to copy the data shows that it serializes reads and writes with barriers, so the per-block latency is very high)

There is a screen running on labstore1001 with the pvmove, and ongoing status.

**Item 19: mark added a comment.** 2015-06-17 10:20:28 (UTC+0)

> In [T96063#1372238](/T96063#1372238), [@coren](/p/coren/) wrote:
> 
> journal, keys and tmeta migrated to slice51
> 
> After some wrangling with block io sizes (thin lvm volumes refuse block transations bigger than the page size), the move of space from slice2 to slice51 is now in progress, at a glacial pace.
> 
> (examination of the lvm mirror code used to copy the data shows that it serializes reads and writes with barriers, so the per-block latency is very high)
> 
> There is a screen running on labstore1001 with the pvmove, and ongoing status.

I think this was largely because the underlying new RAID10 md device was also doing a resync, at a glacier pace of 1000 KB/s as well. I attempted pausing it, but it automatically restarted. It seems very suboptimal to have both running at once, so I've aborted the pvmove instead, using:

pvmove --abort

And the resync is now going much faster. After that completes, we can restart the pvmove using:

pvmove --verbose /dev/md124 /dev/md122

**Item 20: mark added a comment.** 2015-06-17 11:04:37 (UTC+0)

> In [T96063#1373448](/T96063#1373448), [@mark](/p/mark/) wrote:
> 
> I think this was largely because the underlying new RAID10 md device was also doing a resync, at a glacier pace of 1000 KB/s as well. I attempted pausing it, but it automatically restarted. It seems very suboptimal to have both running at once, so I've aborted the pvmove instead, using:

This did speed up the resync a lot, but it was still going to take 1-2 days. Therefore I've restarted the pvmove, which I think allows the entire migration to finish sooner and be better overall. But before we take any steps after this first pvmove, let's reevaluate if we want to finish for the resync or not. If the next steps don't affect this raid array, they can happen in parallel.

**Item 21: coren added a comment.** 2015-06-21 14:19:42 (UTC+0)

The filesystem crashed caused us to... improvise around this plan a great deal. All but one project has been switched to a restored backup on raid10 - what remains to do now is to clean up the rest of the shelves once all that can be salvaged has been and raid10 them.


