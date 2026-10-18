# Random Sample of Task Timelines

**Generated:** 2026-01-08T08:27:11.896Z

**Total Tasks:** 10

---

## Task 1: T233774 - Netbox: tracking of hardware errors / grouping servers in order/batches

- **URL:** https://phabricator.wikimedia.org/T233774
- **Status:** Closed, Invalid
- **Priority:** Medium
- **Created:** 2019-09-25 07:21:29 (UTC+0)

**Timeline Items with Content:** 3

**Item 1: Volans added subscribers: faidon, Volans.** 2019-10-31 15:06:10 (UTC+0)

In Netbox we can already filter devices by purchase date, support expiry date and procurement ticket. That should be enough to pinpoint the batch as far as I can tell.  
In this specific case for example picking the procurement ticket and the purchase date from Netbox for db1075 you could:

* search for the ticket: <https://netbox.wikimedia.org/dcim/devices/?cf%5Fticket=T118174>
* search for the date (need to be formatted compared to how is showed in the UI): <https://netbox.wikimedia.org/dcim/devices/?cf%5Fpurchase%5Fdate=2016-03-02>

Those filters are available in the UI in the devices page list ( <https://netbox.wikimedia.org/dcim/devices/> ) on the right.  
[@MoritzMuehlenhoff](/p/MoritzMuehlenhoff/) let me know if you think anything is missing that would be useful.

[CODE] Pointing out that this feature already exists
[CODE] Determining if we need to actually do the work

**Item 2: faidon added a comment.** 2019-10-31 17:03:24 (UTC+0)

Indeed, and in fact procurement task alone would be enough to identify the batch. Is that what you were looking for [@MoritzMuehlenhoff](/p/MoritzMuehlenhoff/)? How could we make this more visible?

**Item 3: MoritzMuehlenhoff added a comment.** 2019-11-06 09:15:18 (UTC+0)

Ack, searching by procurement properly addresses the batching aspect, I missed that before.

[THEME] Early exit for unneeded evolution


## Task 2: T293726 - eqiad: patch 2nd Equinix IXP

- **URL:** https://phabricator.wikimedia.org/T293726
- **Status:** Closed, Resolved
- **Priority:** Medium
- **Created:** 2021-10-19 07:27:37 (UTC+0)

**Timeline Items with Content:** 6

**Item 1: Jclark-ctr added a comment.** 2021-10-22 20:06:21 (UTC+0)

Cable has been run shows link. netbox has not been updated yet  
#2009 15m. pp219588361 <-> to cr1-eqiad:xe-3/0/6.

**Item 2: Dzahn subscribed.** 2021-10-22 21:23:15 (UTC+0)

The interface has been disabled because this started a partial outage, which has been resolved now.

**Item 3: Legoktm added a project: Sustainability (Incident Followup). | Legoktm subscribed.** 2021-10-23 00:30:17 (UTC+0)

I'm tagging this with [Sustainability (Incident Followup)](/project/view/4758/) because somehow the above cable addition caused <https://wikitech.wikimedia.org/wiki/Incident%5Fdocumentation/2021-10-22%5Feqiad%5Freturn%5Fpath%5Ftimeouts> which has the following actionable:

* Investigate & document why adding a new patch cable to the Equinix IX ports caused return path issues

If it's better to discuss that in a separate task feel free to fork it.

[CODE] Tag ticket as linked to an incident. (it was created before)

**Item 4: ayounsi added a comment.** 2021-10-25 13:37:59 (UTC+0)

Giving more details on our current process and what happened here.

When configuring a new circuit, we enable the interface on our side ahead of time, so DCops can check if there is light/link and if not either roll it, or follow up with the datacenter to check the X-connect.  
Additionally we pre-configure the IPs on our side when communicated by the provider to save time and make the turn up smoother (this is even more true when at the same time provisioning all the drmrs circuits).  
Doing so is impact-less for all the usual circuits turn up (transit, transport, new peering) as they require BGP to be configured (in a 2nd time) to send prod traffic.

Then comes this "special" case.

Special as it's the first time we configure a new circuit in that way.  
Adding a 2nd L3 port to the same IXP vlan on cr1\. cr2-eqiad already have an interface exchanging prod traffic.  
Additionally, Equinix requires a turn up call, and put us in a temporary "quarantine" vlan until then.

What happened is that as the port got patched through, the interface went up, so did the configured IP.  
From then cr1-eqiad thought it could reach IX peers in the 206.126.236.0/22 range as it thought it had L2 adjacency.

In parallel, cr2 is advertising prefixes learned from IX peers to cr1 with that IX peer IP as next hop.

Which mean when cr1 was receiving outbound traffic (eg. from half the access switches) toward an IX peer, it was sending it to that "quarantine" vlan, and thus the traffic was getting discarded.

A process change I could think of to prevent future occurrence is to not pre-configure IPs on links ahead of time.  
The same issue would probably have triggered during the turn up call, but at least it would have been rolled back faster.  
Another options could be to test circuits in a dedicated VRF, but that seems overkill to change processes for all the turn up while only 1 usecase can be problematic.  
Another possibility to reduce recovery time is to !log all circuits connections (and removal).

[CODE] Details about how the work for this task caused the incident

**Item 5: cmooney added a comment.** 2021-10-28 09:49:55 (UTC+0)

Thanks for the run down Arzhel. Unfortunate incident, easily understood in hindsight but a quirky edge case - I can understand how we overlooked the potential for it to happen beforehand.00

> A process change I could think of to prevent future occurrence is to not pre-configure IPs on links ahead of time.

+1 on that. It's rare enough we have all the circumstances for this problem, but keeping IPs off interfaces in Netbox should prevent it. And still allow us to validate interface status / light levels for new circuits.

The VRF option is also there, but I agree it is probably overkill. DC-Ops ! logging new WAN circuit connections is probably not a bad idea either.

[CODE] Evaluate if these changes are useful or not. Risk analysis

**Item 6: • Cmjohnson closed this task as Resolved.** 2021-11-03 16:06:55 (UTC+0)

If there is a need to keep this open in DC-OPS please re-open

[CODE] Communicate new task status

## Task 3: T111828 - ORES/Wikilabels deploy checklist

- **URL:** https://phabricator.wikimedia.org/T111828
- **Status:** Closed, Invalid
- **Priority:** Needs Triage
- **Created:** 2015-09-08 17:00:23 (UTC+0)

**Timeline Items with Content:** 2

**Item 1: Halfak added a subscriber: Ladsgroup.** 2016-07-28 14:32:40 (UTC+0)

[@Ladsgroup](/p/Ladsgroup/), do we still need this since we did [T106271](/T106271) ?

**Item 2: Ladsgroup added a comment.** 2016-07-28 17:30:17 (UTC+0)

Agreed

[CODE] There is other work going on that might overlap, making this work obsolete (though it changed it, likely in another way)
[THEME] Always changing environment


## Task 4: T296699 - Pool eventgate-main in both datacenters (active/active)

- **URL:** https://phabricator.wikimedia.org/T296699
- **Status:** Closed, Resolved
- **Priority:** Medium
- **Created:** 2021-11-30 00:06:32 (UTC+0)

**Timeline Items with Content:** 8

**Item 1: Legoktm added a subscriber: dcausse.** 2021-11-30 00:09:46 (UTC+0)

[@dcausse](/p/dcausse/) the $kafka\_reporting\_topic variable is still in puppet (<https://gerrit.wikimedia.org/g/operations/puppet/+/97421d5ac1f1a5082cc8f42b02bf80dc017e7497/modules/profile/manifests/query%5Fservice/updater.pp#14>) - can you confirm that it's no longer used?

[CODE] Getting an expert

**Item 2: dcausse added a comment.** 2021-11-30 07:52:17 (UTC+0)

> In [T296699#7536195](/T296699#7536195), [@Legoktm](/p/Legoktm/) wrote:
> 
> [@dcausse](/p/dcausse/) the $kafka\_reporting\_topic variable is still in puppet (<https://gerrit.wikimedia.org/g/operations/puppet/+/97421d5ac1f1a5082cc8f42b02bf80dc017e7497/modules/profile/manifests/query%5Fservice/updater.pp#14>) - can you confirm that it's no longer used?

Indeed it is no longer used for production wdqs machines. We kept wdqs1010 (a test machine) running the old updater in case we had to rollback. I think you can consider it is no longer used and move forward with event-gate being active/active.  
I prepared a patch to switch wdqs1010 to not rely on this puppet code (<https://gerrit.wikimedia.org/r/c/operations/puppet/+/742670>) in case it annoys us with lag alerts, but I think wdqs test machines have the lag alert disabled.

**Item 3: Legoktm added a comment.** 2021-11-30 20:58:44 (UTC+0)

Ack, thanks!

I sent a heads-up to the ops list about this just in case some other application has started assuming it being pooled in only a single DC. If no one says anything, I think we can do this in a few days.

**Item 4: Ottomata subscribed.** 2021-11-30 22:41:44 (UTC+0)

+1

[CODE] Aggreement

**Item 5: Stashbot added a comment.** 2021-12-14 18:25:32 (UTC+0)

[Mentioned in SAL (#wikimedia-operations)](https://sal.toolforge.org/log/WEsxun0B1jz%5FIcWuSIkZ) \[2021-12-14T18:25:31Z\] <ottomata> repooling eventgate-main discovery to include codfw - [T296699](/T296699) \- confctl --object-type discovery select 'dnsdisc=eventgate-main,name=codfw' set/pooled=true

**Item 6: Ottomata added a comment.** 2021-12-14 18:26:24 (UTC+0)

Ran

root@puppetmaster1001:~# confctl --object-type discovery select 'dnsdisc=eventgate-main,name=codfw' set/pooled=true
eventgate-main/codfw: pooled changed False => True

root@puppetmaster1001:~# confctl --object-type discovery select 'dnsdisc=eventgate-main' get
{"codfw": {"pooled": true, "references": [], "ttl": 300}, "tags": "dnsdisc=eventgate-main"}
{"eqiad": {"pooled": true, "references": [], "ttl": 300}, "tags": "dnsdisc=eventgate-main"}

[CODE] Communicate that the non-code evolution has been run (configuration change)

**Item 7: odimitrijevic subscribed.** 2022-01-17 17:13:40 (UTC+0)

[@Ottomata](/p/Ottomata/) is this complete?

[CODE] Communicate to check if this should have been resolved (likely not immediately resolved in case any issues arose and forgotten about)

**Item 8: Ottomata closed this task as Resolved. | Ottomata claimed this task.** 2022-01-18 03:12:56 (UTC+0)

Yup should be!

[CODE] Resolution aggreement


## Task 5: T248506 - Add linecard diversity to the router-to-router interconnect in codfw

- **URL:** https://phabricator.wikimedia.org/T248506
- **Status:** Closed, Resolved
- **Priority:** Medium
- **Created:** 2020-03-25 19:48:31 (UTC+0)

**Timeline Items with Content:** 2

**Item 1: ayounsi subscribed.** 2020-03-26 10:40:18 (UTC+0)

As data point, FPC0 got purchased on 2014 and FPC5 in 2013 so it's also time to replace them.

[CODE] Additional info to help decide which evolution path (from description) to choose

**Item 2: ayounsi closed this task as Resolved. | ayounsi claimed this task.** 2022-03-18 07:25:26 (UTC+0)

Child task is completed enough so this is not an issue anymore.

[CODE] Work towards this task outside of this task
[THEME] Incident motivated understanding of a scenario, and this task is largely what to do about it (can do more than one thing, don't know which is best initially)


## Task 6: T162996 - Disallow blocked users on mediawiki to create accounts on phabricator

- **URL:** https://phabricator.wikimedia.org/T162996
- **Status:** Closed, Resolved
- **Priority:** Medium
- **Created:** 2017-04-14 13:16:54 (UTC+0)

**Timeline Items with Content:** 21

**Item 1: Reedy added a comment.** 2017-05-12 14:13:54 (UTC+0)

Offshoot of this... <https://phabricator.wikimedia.org/p/Fiona1213/> was blocked onwiki back in January <https://www.mediawiki.org/w/index.php?title=User:Fiona1213> but had created a phabricator account before that

Then today it started changing tasks that looked suspicious, so I disabled the account...

[CODE] Risk of this issue happening in other areas
[THEME] Beyond just the narrow incident which happened

**Item 2: Aklapper added a comment.** 2017-05-12 16:03:39 (UTC+0)

Thanks. Been looking for a quick way to check existing accounts but <https://phabricator.wikimedia.org/conduit/method/user.search/> does not support providing a list of associated "MediaWiki User" accounts, and screenscraping Phab user pages does not sound feasible. :/

[CODE] Seeking ideas

**Item 3: greg subscribed.** 2017-05-12 16:56:57 (UTC+0)

(To answer the task's title question: No.)

**Item 4: Reedy added a comment.** 2017-05-12 21:43:38 (UTC+0)

> In [T162996#3259068](/T162996#3259068), [@greg](/p/greg/) wrote:
> 
> (To answer the task's title question: No.)

Heh.

Of course, we have two levels of this:

* If a user is blocked (on mediawiki wiki at least/globally), they shouldn't then be able to create accounts on phabricator
* If a user already had an account, and then they get globally blocked/blocked on mediawiki wiki, they should then be disabled on phabricator

Plus, then for the latter, if/when they are unblocked, the phab account could potentially be unblocked then....

So we need some sort of synchronisation one way or another... Potentially? On a cronjob..

> In [T162996#3258884](/T162996#3258884), [@Aklapper](/p/Aklapper/) wrote:
> 
> Thanks. Been looking for a quick way to check existing accounts but <https://phabricator.wikimedia.org/conduit/method/user.search/> does not support providing a list of associated "MediaWiki User" accounts, and screenscraping Phab user pages does not sound feasible. :/

How's your SQL? ;) I'm not familiar with the phabricator schema, but shouldn't be too hard with access to either the labs instance, or more preferably, productions mysql slave.

I don't mind having a look at the hackathon, and we can probably get opsen to give me access easy enough to poke around further

I wonder if we could use conduit to do it instead.

[CODE] Posing ways to evolve

**Item 5: Zppix subscribed.** 2017-05-12 21:48:33 (UTC+0)

Maybe have a bot that looks at special:blockedusers (or whatever the special page is), and block the user on phab if the bot sees an account with the same username (possible even allow the bot to use CU tool and verify its the same user using ip as well to prevent some false-positives)

**Item 6: Peachey88 added a comment.** 2017-05-13 09:24:29 (UTC+0)

As for the original question: Shouldn't we be blocking the creation of the account during the OAuth process? compared to do hacky other methods?

As for users that become blocked after the account gets created that would need further discussion

**Item 7: Aklapper added a comment.** 2017-05-13 16:18:46 (UTC+0)

> In [T162996#3259875](/T162996#3259875), [@Zppix](/p/Zppix/) wrote:
> 
> Maybe have a bot that looks at special:blockedusers (or whatever the special page is), and block the user on phab if the bot sees an account with the same username (possible even allow the bot to use CU tool and verify its the same user using ip as well to prevent some false-positives)

No need for such wild assumptions.   
MediaWiki offers API, no need for "special pages". "Same username" is error-prone and many Phab accounts are linked to their mw.org accounts anyway so information is often already available. No need for checking any IPs either.

[CODE] Bringing expertise and knowledge

**Item 8: Reedy added a comment.** 2017-05-13 16:25:46 (UTC+0)

Indeed. We show the linked user on the profile, so it's store in some field somewhere

I guess we should probably consider doing similar/same for wikitech to phab too

**Item 9: zhuyifei1999 subscribed.** 2017-05-13 18:18:52 (UTC+0)

> In [T162996#3260256](/T162996#3260256), [@Peachey88](/p/Peachey88/) wrote:
> 
> As for the original question: Shouldn't we be blocking the creation of the account during the OAuth process? compared to do hacky other methods?

FWIW, a blocked user was not able to use OAuth till [T156803: Handle blocked users consistently](/T156803). What we could do is check the blocked field of JWT (I don't remember what that is)

**Item 10: Aklapper added a comment.** 2017-05-13 19:40:06 (UTC+0)

> In [T162996#3259867](/T162996#3259867), [@Reedy](/p/Reedy/) wrote:
> 
> How's your SQL? ;)

Primest! ;)   
\[phabricator\_user\] SELECT user.username, user\_externalaccount.accountURI FROM user JOIN user\_externalaccount WHERE user\_externalaccount.accountType = "mediawiki" AND user.isDisabled = 0 AND user\_externalaccount.userPHID = user.phid;   
accountType is either mediawiki or ldap.  
Output: username is the Phab username. accountURI is like https://www.mediawiki.org/wiki/User:Malyacko.   
Strip URL part before colon, then feed those \~10000 accounts into the [MediaWiki API](https://www.mediawiki.org/w/api.php?action=query&list=users&ususers=Malyacko&usprop=blockinfo), then check for blockexpiry or such in the JSON output, then disable the corresponding Phab account. Basically.



**Item 11: Peachey88 added a subscriber: • mmodell.** 2017-05-14 04:01:25 (UTC+0)

> In [T162996#3260603](/T162996#3260603), [@zhuyifei1999](/p/zhuyifei1999/) wrote:
> 
>> In [T162996#3260256](/T162996#3260256), [@Peachey88](/p/Peachey88/) wrote:
>> 
>> As for the original question: Shouldn't we be blocking the creation of the account during the OAuth process? compared to do hacky other methods?
> 
> FWIW, a blocked user was not able to use OAuth till [T156803: Handle blocked users consistently](/T156803). What we could do is check the blocked field of JWT (I don't remember what that is)

That would stop creation by the looks, Although I would vaguely guessing that we don't recheck the OAuth status unless they log out and back in, so we would have to work out something to cover the case were they get blocked after as well.

[@mmodell](/p/mmodell/) [@demon](/p/demon/) Do you guys have thoughts on this task?

**Item 12: • mmodell added a comment.** 2017-05-24 19:50:58 (UTC+0)

> In [T162996#3260863](/T162996#3260863), [@Peachey88](/p/Peachey88/) wrote:
> 
> That would stop creation by the looks, Although I would vaguely guessing that we don't recheck the OAuth status unless they log out and back in, so we would have to work out something to cover the case were they get blocked after as well.

Indeed I believe that we only validate the oauth token on login and then the phabricator session lives essentially forever. A cron job that disables phabricator users would take care of the sessions but it might leave a window of time where the user is blocked on wiki and still has an active account / session on phabricator.

**Item 13: Aklapper added a comment.** 2017-05-24 21:15:24 (UTC+0)

...which would still be a way shorter window of time than the current one, if I get it right?

**Item 14: Peachey88 added a comment.** 2017-06-17 21:42:37 (UTC+0)

[T168142: Cleanup phabricator.wikimedia.org uploaded files, WP zero abuse](/T168142)

**Item 15: • mmodell added a comment.** 2017-06-18 07:05:30 (UTC+0)

After poking at the code for a bit, I came to the following conclusions:

1. It's easy to prevent blocked users from authenticating at all in phabricator. This would also prevent blocked users from creating accounts.  
   * To do this, simply add another condition in [PhutilMediaWikiAuthAdapter :: decodeAndVerifyJWT()](https://phabricator.wikimedia.org/source/phab-extensions/browse/wmf%252Fstable/src/oauth/PhutilMediaWikiAuthAdapter.php;721eca9b64cc38b495a255bad46cbe11f3d5c390$136-166), throwing an exception if $identity->blociked is true.
2. It doesn't look like there is a way to prevent registering without ALSO preventing login. I think it's probably fine though. IMO blocked users should be locked out of phabricator but maybe some of you will disagree with this?

**Item 16: Aklapper added a comment.** 2017-06-18 09:57:43 (UTC+0)

> In [T162996#3358089](/T162996#3358089), [@mmodell](/p/mmodell/) wrote:
> 
> 1. It doesn't look like there is a way to prevent registering without ALSO preventing login. I think it's probably fine though. IMO blocked users should be locked out of phabricator but maybe some of you will disagree with this?

I don't. :) Thanks for D687 (and happy to see it's a short change)!

**Item 17: Paladox added a comment.** 2017-06-18 12:44:28 (UTC+0)

> In [T162996#3358089](/T162996#3358089), [@mmodell](/p/mmodell/) wrote:
> 
> After poking at the code for a bit, I came to the following conclusions:
> 
> 1. It's easy to prevent blocked users from authenticating at all in phabricator. This would also prevent blocked users from creating accounts.  
>   * To do this, simply add another condition in [PhutilMediaWikiAuthAdapter :: decodeAndVerifyJWT()](https://phabricator.wikimedia.org/source/phab-extensions/browse/wmf%252Fstable/src/oauth/PhutilMediaWikiAuthAdapter.php;721eca9b64cc38b495a255bad46cbe11f3d5c390$136-166), throwing an exception if $identity->blociked is true.
> 2. It doesn't look like there is a way to prevent registering without ALSO preventing login. I think it's probably fine though. IMO blocked users should be locked out of phabricator but maybe some of you will disagree with this?

Im guessing users who create an account through wiki tech which uses ldap will be unaffected by this since blocking users wikitech side should prevent users from logging into Phabricator (since it uses ldap)?

**Item 18: • mmodell added a comment.** 2017-06-18 17:24:35 (UTC+0)

That depends - if ldap on wikitech respects blocked status, I have not tested that.

**Item 19: zhuyifei1999 added a comment.** 2017-06-18 22:27:11 (UTC+0)

> In [T162996#3358494](/T162996#3358494), [@mmodell](/p/mmodell/) wrote:
> 
> That depends - if ldap on wikitech respects blocked status, I have not tested that.

AFAIK, [not automatically](https://wikitech.wikimedia.org/wiki/Help:Disabling%5Fan%5Faccount).

**Item 20: • mmodell added a comment.** 2017-06-22 00:16:42 (UTC+0)

The patch to oauth is deployed. I've confirmed that it did not break logins but I haven't tested to be sure that it does block logins for accounts which are blocked.

**Item 21: • mmodell closed this task as Resolved.** 2017-06-23 04:25:38 (UTC+0)

Created a separate task to address wikitech. This task is now resolvable.

[CODE] Work beyond this exact task (new task)
[THEME] An issue is stated and there is much effort to understand what is the right way to evolve

## Task 7: T126552 - Jenkins files under /var/lib/jenkins/config-history/config need to be garbage collected

- **URL:** https://phabricator.wikimedia.org/T126552
- **Status:** Closed, Resolved
- **Priority:** High
- **Created:** 2016-02-10 22:47:54 (UTC+0)

**Timeline Items with Content:** 19

**Item 1: hashar claimed this task.** 2016-02-10 23:01:25 (UTC+0)

On gallium:

find /var/lib/jenkins/config-history/config -type f -wholename '\*/2015\*' -delete

find /var/lib/jenkins/config-history/config -type d -name '2015\*' -delete

[CODE] Low hanging fruit to evolve
[CODE] Bandaid solutions to address immediate issue

**Item 2: hashar added a comment.** 2016-02-10 23:15:45 (UTC+0)

Same for 2014

[CODE] Low hanging fruit to evolve

**Item 3: hashar added a comment.** 2016-02-10 23:17:45 (UTC+0)

Down to 9k entries

[CODE] Communication of resolving many non-software evolution commands

# ls -ld /var/lib/jenkins/config-history/config
drwxrwsr-x 9203

Now we need a bug upstream and a puppetize cron.

[CODE] Doing it right

**Item 4: hashar added a comment.** 2016-02-17 10:06:58 (UTC+0)

The plugin has a few configuration settings in <https://integration.wikimedia.org/ci/configure> :

* Max number of history entries to keep
* Max number of days to keep history entries
* Max number of history entries to show per page
* System configuration exclude file pattern = queue|nodeMonitors|UpdateCenter|global-build-stats
* Do not save duplicate history

[CODE] Explore and report on potential long term fix

**Item 5: hashar added a comment.** 2016-02-17 10:22:08 (UTC+0)

I have manually deleted some old history from 2012/2013\. The plugin no more save them under the job directory but in a global path. Thus: find /var/lib/jenkins/jobs/\*/config-history -delete

I have manually deleted the legacy nodes via: rm -fR /var/lib/jenkins/config-history/nodes/\*\_deleted\_\*

I then tried to add to the system exclude

* nodes/ci-jessie-wikimedia
* ci-jessie-wikimedia

None work. Gotta dig in the code :(

[CODE] Communication of resolving many non-software evolution commands

**Item 6: hashar added a comment.** 2016-02-17 10:38:12 (UTC+0)

The regex is only uses for xml files directly in Jenkins home:

boolean isSaveable(final Saveable item, final XmlFile xmlFile) {

    if (item instanceof TopLevelItem) {
        return true;
    }

    if (xmlFile.getFile().getParentFile().equals(getJenkinsHome())) {
        return checkRegex(xmlFile);
    }

And only match against the base name :-(

private boolean checkRegex(final XmlFile xmlFile) {
    if (excludeRegexpPattern != null) {
        final Matcher matcher = excludeRegexpPattern.matcher(xmlFile.getFile().getName());
        return !matcher.find();
    } else {
        return true;
    }
}

[CODE] Communication of road blocks

**Item 7: hashar added a comment.** 2016-02-17 11:57:53 (UTC+0)

Plugin does not track slaves that are either EphemeralNode or AbstractCloudSlave. But that is for plugins implementing cloud based slaves. Nodepool uses the Jenkins core API and that spawns regular slaves. So it is a dead-end.

[CODE] Communication of dead ends

**Item 8: hashar claimed this task.** 2016-02-17 12:19:21 (UTC+0)

Since that has hit /var/lib/jenkins/config-history/config/ and the nodes config as well, lets do the limitation globally. I did:

Max number of history entries to keep: 1000  
Max number of days to keep history entries: 90

We will see in a few days / weeks what is going on.

[CODE] Communication of status, need to wait to see if changes had effect before coming back and doing more work
[THEME] Make changes and then wait to see if more are needed (and if changes were successful)

**Item 9: hashar removed hashar as the assignee of this task.** 2016-02-19 20:27:36 (UTC+0)

I did the immediate clean up but that will pill up again until we have a garbage collector. Deleting files without restart Jenkins apparently confuse the plugins though :-(

Moving bug back to pool.

[CODE] Communication that more work is needed

**Item 10: hashar added a comment.** 2016-06-06 21:57:31 (UTC+0)

In puppet we have a tidy function that is able to garbage collect files matching a wildcard/path.

Example from modules/statistics/manifests/compute.pp:

# Clean up R temporary files which have not been accessed in a week.
tidy { '/tmp':
    matches => 'Rtmp*',
    age     => '1w',
    rmdirs  => true,
    backup  => false,
    recurse => 1,
}

Online doc for puppet 4.5 (we have 3.4.3) <https://docs.puppet.com/puppet/latest/reference/types/tidy.html>

[CODE] Present new potential solution

**Item 11: hashar added a comment.** 2016-07-12 09:47:58 (UTC+0)

The puppet tidy type got merged ( <https://gerrit.wikimedia.org/r/#/c/295641> ). I can not see it being applied on gallium though. Will wait a day or so and check again.

[CODE] Having to wait a few days to see if change is applied

**Item 12: hashar added a comment.** 2016-07-20 19:10:29 (UTC+0)

So puppet.log has:Debug: /User\[mnoushad\]: Autorequiring Group\[wikidev\]

<LONG PAUSE>
Info: /Stage[main]/Role::Ci::Master/Tidy[history of nodepool slaves config]: File does not exist
Info: /Stage[main]/Role::Ci::Master/Tidy[history of nodepool slaves config]: File does not exist
Info: /Stage[main]/Role::Ci::Master/Tidy[history of nodepool slaves config]: File does not exist
Info: /Stage[main]/Role::Ci::Master/Tidy[history of nodepool slaves config]: File does not exist
Info: /Stage[main]/Role::Ci::Master/Tidy[history of nodepool slaves config]: File does not exist
Info: /Stage[main]/Role::Ci::Master/Tidy[history of nodepool slaves config]: File does not exist
Info: /Stage[main]/Role::Ci::Master/Tidy[history of nodepool slaves config]: File does not exist
Info: /Stage[main]/Role::Ci::Master/Tidy[history of nodepool slaves config]: File does not exist
Info: /Stage[main]/Role::Ci::Master/Tidy[history of nodepool slaves config]: File does not exist
Info: /Stage[main]/Role::Ci::Master/Tidy[history of nodepool slaves config]: File does not exist
Info: /Stage[main]/Role::Ci::Master/Tidy[history of nodepool slaves config]: File does not exist
Info: /Stage[main]/Role::Ci::Master/Tidy[history of nodepool slaves config]: File does not exist
Info: /Stage[main]/Role::Ci::Master/Tidy[history of nodepool slaves config]: File does not exist
Info: /Stage[main]/Role::Ci::Master/Tidy[history of nodepool slaves config]: File does not exist
Info: /Stage[main]/Role::Ci::Master/Tidy[history of nodepool slaves config]: File does not exist
Info: /Stage[main]/Role::Ci::Master/Tidy[history of nodepool slaves config]: File does not exist
Info: /Stage[main]/Role::Ci::Master/Tidy[history of nodepool slaves config]: File does not exist
Info: /Stage[main]/Role::Ci::Master/Tidy[history of nodepool slaves config]: File does not exist
Info: Applying configuration version '1469041402'

strace of puppet shows:

lstat("/var/lib/jenkins/config-history/nodes/ci-jessie-wikimedia-187562_deleted_20160719_103741_374/2016-07-19_10-37-41", {st_mode=S_IFDIR|S_ISGID|0775, st_size=4096, ...}) = 0
openat(AT_FDCWD, "/var/lib/jenkins/config-history/nodes/ci-jessie-wikimedia-187562_deleted_20160719_103741_374/2016-07-19_10-37-41", O_RDONLY|O_NONBLOCK|O_DIRECTORY|O_CLOEXEC) = 4
lseek(4, 0, SEEK_SET)                   = 0
getdents(4, /* 3 entries */, 32768)     = 80
getdents(4, /* 0 entries */, 32768)     = 0
close(4)

And obviously the files do not get deleted :(

[CODE] Communication of status (not good)

**Item 13: hashar added a comment.** 2016-07-20 19:45:29 (UTC+0)

Take two with tmpreaper which looks easier / sane :\]

**Item 14: Stashbot subscribed.** 2016-08-07 12:47:33 (UTC+0)

[Mentioned in SAL](https://tools.wmflabs.org/sal/log/AVZlC0GlX4d8bmU7pa7q) \[2016-08-07T12:47:31Z\] <hashar> root cause of CI outage is [T126552](/T126552)

[CODE] These changes caused another incident (or lack of successful changes caused another incident)

**Item 15: Paladox added a comment.** 2016-08-10 21:46:23 (UTC+0)

I am wondering, can we set this as high priority please?

**Item 16: greg added a project: Wikimedia-Incident. | greg subscribed.** 2016-08-10 22:18:25 (UTC+0)

There's not much use in petitioning about specific priority settings. As this only becomes a problem about once every few months, the priority setting is fine. It will be addressed though. The outstanding patch is: <https://gerrit.wikimedia.org/r/#/c/300092/>

Unrelatedly, I'm adding the [Wikimedia-Incident](/tag/wikimedia-incident/) project to this task as this was the cause of at least the outage on Sunday August 7th (see email titled "CI outage (solved)" on the operations mailing list).

[CODE] Relation to incident

**Item 17: hashar raised the priority of this task from Medium to High. | hashar added a project: SRE.** 2016-08-24 10:27:31 (UTC+0)

Would need someone familiar with tmp reaper to review the patch <https://gerrit.wikimedia.org/r/#/c/300092/> and then we can get it deployed and check whether tmp reaper properly clear the files out.

Meanwhile I guess that is blocked on review by [SRE](/tag/sre/)

Setting priority to high since that causes a CI outage every \~ 32k Nodepool instances spawn or once per month.

[CODE] Seeking knowledge
[CODE] Communicating blockers


**Item 18: hashar added a comment.** 2016-09-02 13:57:12 (UTC+0)

<https://gerrit.wikimedia.org/r/#/c/300092/> had a typo and I eventually I found out it would delete the non Nodepool slaves as well.

<https://gerrit.wikimedia.org/r/308165> goes with an hourly cron that uses find -path -delete which is way easier to understand.

[CODE] Correct evolutionary defect
[THEME] You don't always get evolution right on the first try

**Item 19: hashar closed this task as Resolved.** 2016-09-02 14:27:54 (UTC+0)

From the Gerrit change:

on gallium: Notice: /Stage\[main\]/Role::Ci::Master/Cron\[tidy\_jenkins\_ephemeral\_nodes\_configs\]/ensure: created

@gallium:\~# crontab -u jenkins -l | grep history  
35 \* \* \* \* /usr/bin/find /var/lib/jenkins/config-history/nodes -path '/var/lib/jenkins/config-history/nodes/ci-\*' -mmin +60 -delete > /dev/null 2>&1

ran the command manually once: before there were 6409 files, after there were 55 files left

[THEME] There is more than one thing to do after
[THEME] Aggressively communicating status, road blocks, when waiting is necessary, results of changes

## Task 8: T218260 - Decrease timeout for EventBus extension for analytics events

- **URL:** https://phabricator.wikimedia.org/T218260
- **Status:** Closed, Resolved
- **Priority:** High
- **Created:** 2019-03-13 21:04:55 (UTC+0)

**Timeline Items with Content:** 5

**Item 1: • mobrovac subscribed.** 2019-03-13 22:01:02 (UTC+0)

It'd be awesome if we could target 1s, but let's perhaps start with a less-aggressive number, like 5 or 10 and see how it goes.

[CODE] How aggressive (avoid doing one thing that is too much)
[THEME] Risk analysis of moving the bell to far

**Item 2: Ottomata subscribed.** 2019-03-14 13:38:56 (UTC+0)

I wonder if we should also use ?hasty=true mode for mediawiki 'analytics' events? This would use a non-ACKed producer and not ever block the MW waiting for a response.

[CODE] Additional potential evolution, wanting to confirm with others if this is a good idea

**Item 3: • Pchelolo added a comment.** 2019-03-14 13:42:40 (UTC+0)

> I wonder if we should also use ?hasty=true mode for mediawiki 'analytics' events? This would use a non-ACKed producer and not ever block the MW waiting for a response.

Makes sense for analytics events IMHO

> It'd be awesome if we could target 1s, but let's perhaps start with a less-aggressive number, like 5 or 10 and see how it goes.

Even during the high load the response time (when we did get a response) didn't go higher then 100ms, so I think 1 would be ok.

[CODE] How aggressive (avoid doing one thing that isn't enough), but brings in external knowledge of peak event that is relevant here

**Item 4: • Pchelolo closed this task as Resolved. | • Pchelolo edited projects, added Services (done), Platform Team Workboards (Done with CPT); removed Patch-For-Review, Platform Team Workboards (Doing), Services (doing).** 2019-03-25 19:00:58 (UTC+0)

Merged and deployed as a part of SWAT. Resolving.

[CODE] Communication for when deployment happens

**Item 5: Stashbot added a comment.** 2019-03-25 19:13:15 (UTC+0)

[Mentioned in SAL (#wikimedia-operations)](https://tools.wmflabs.org/sal/log/AWm2RWLGA1BDhGjCcrel) \[2019-03-25T19:13:14Z\] <dcausse@deploy1001> Synchronized wmf-config/CommonSettings.php: [T218260](/T218260) (duration: 00m 49s)

[THEME] How far to go for a configurable setting?
[THEME] When many ideas are proposed in a task it can be hard to determine which were actually done

## Task 9: T198901 - Migrate production services to kubernetes using the pipeline

- **URL:** https://phabricator.wikimedia.org/T198901
- **Status:** Closed, Resolved
- **Priority:** Medium
- **Created:** 2018-07-05 18:46:57 (UTC+0)

**Timeline Items with Content:** 8

**Item 1: hashar updated the task description. | hashar mentioned this in T213806: Migrate wikimedia-portals-build to Docker container.** 2019-01-15 17:43:21 (UTC+0)

From the releng meeting, I have added wikimedia/portals to the list.

[CODE] Communication of adding to the scope of the task

**Item 2: Krenair added a comment.** 2019-05-29 13:58:53 (UTC+0)

Is apertium part of the cxserver migration?

[CODE] Communication to see if there is additional scope or not

**Item 3: akosiaris added a comment.** 2019-05-30 19:11:46 (UTC+0)

> In [T198901#5220959](/T198901#5220959), [@Krenair](/p/Krenair/) wrote:
> 
> Is apertium part of the cxserver migration?

No, completely different software.

**Item 4: Krenair added a comment.** 2019-05-30 19:13:08 (UTC+0)

Okay. Is it potentially in-scope i.e. should it appear on one of the lists in this task?

[CODE] Communication of adding to the scope of the task

**Item 5: akosiaris updated the task description. | akosiaris updated the task description. (Show Details)** 2019-05-30 19:18:36 (UTC+0)

Indeed. I added it under TBD. The exact way this will be done will need to be investigated.

[CODE] Still uncertainty surrounding this potential part of evolution

**Item 6: Ottomata added a comment.** 2019-06-05 18:43:28 (UTC+0)

I don't think eventstreams is in k8s, is it?

**Item 7: akosiaris added a comment.** 2019-06-05 18:44:56 (UTC+0)

> In [T198901#5237895](/T198901#5237895), [@Ottomata](/p/Ottomata/) wrote:
> 
> I don't think eventstreams is in k8s, is it?

Indeed it is not. I got carried away due to the other event\* things being in k8s

**Item 8: akosiaris closed this task as Resolved. | akosiaris claimed this task. | akosiaris updated the task description. (Show Details)** 2024-11-13 17:45:15 (UTC+0)

Everything that was in scope has been migrated. While there are some things left under the TBD section, that section was filed 5 years ago and no longer reflects reality. We can create specific tasks for those as needed. I think we can resolve this after all!

[CODE] Deciding this task is done
[THEME] Over time, drift from what originally identified as needing to be  to be done because environment changes, there is a point where drift becomes large enough that the current work should be resolved and new work outlined if there is any

## Task 10: T367350 - [k8s,infra] Verify that kyverno policies are evaluated only for namespaced resources

- **URL:** https://phabricator.wikimedia.org/T367350
- **Status:** Closed, Resolved
- **Priority:** High
- **Created:** 2024-06-12 18:54:57 (UTC+0)

**Timeline Items with Content:** 2

**Item 1: aborrero changed the task status from Open to In Progress. | aborrero triaged this task as High priority. | aborrero added a project: User-aborrero.** 2024-06-13 09:05:51 (UTC+0)

In the upstream docs:

> Policies can be defined as cluster-wide resources (using the kind ClusterPolicy) or namespaced resources (using the kind Policy). As expected, namespaced policies will only apply to resources within the namespace in which they are defined while cluster-wide policies are applied to matching resources across all namespaces. Otherwise, there is no difference between the two types.

source: <https://kyverno.io/docs/kyverno-policies/>

With this information, the theory in this ticket loses some weight. But I'll keep the ticket open while I do additional research. I'm also considering to contact upstream about this theory.

[CODE] Investigate before evolving
[CODE] Answering question posed in the description, deciding priority with answer
[THEME] Investigate before evolving (and answering priority)

**Item 2: aborrero closed this task as Resolved.** 2024-06-17 11:56:48 (UTC+0)

None of my poking around have demonstrated that the upstream claim is false.

[CODE] Decide to stop evolving
[THEME] Short-circuit need for evolution after investigation

