# Random Sample of Task Timelines

**Generated:** 2026-01-04T05:22:38.887Z

**Total Tasks:** 10

---

## Task 1: T363609 - Elasticsearch: Alert on upstream errors for MW API

- **URL:** https://phabricator.wikimedia.org/T363609
- **Status:** Closed, Resolved
- **Priority:** High
- **Created:** 2024-04-26 21:41:28 (UTC+0)

**Timeline Items with Content:** 1

**Item 1: bking closed this task as Resolved. | bking moved this task from In Progress to Done on the Data-Platform-SRE (2024.04.15 - 2024.05.05) board.** 2024-05-03 14:02:30 (UTC+0)

Per the above CR, alerts are now in place. As such, I'm closing out this ticket.

[CODE]: Communicating completion


## Task 2: T220775 - Create a a compiler "diff" job for site configuration in mediawiki-config.git repo

- **URL:** https://phabricator.wikimedia.org/T220775
- **Status:** Closed, Resolved
- **Priority:** Low
- **Created:** 2019-04-11 23:05:38 (UTC+0)

**Timeline Items with Content:** 6

**Item 1: Jdforrester-WMF added a comment.** 2019-05-02 01:05:49 (UTC+0)

Initial stabs at this starting in <https://gerrit.wikimedia.org/r/c/operations/mediawiki-config/+/507726/>

[CODE]: MVP seeking feedback

**Item 2: Addshore subscribed.** 2019-09-08 18:12:40 (UTC+0)

I think this and [T208493](/T208493) are essentially dupes of each other.

**Item 3: Ladsgroup subscribed.** 2019-11-07 10:45:33 (UTC+0)

I recommend declining this in favor of [T223602: Define variant Wikimedia production config in compiled, static files](/T223602)

**Item 4: Jdforrester-WMF added a comment.** 2019-11-08 14:18:51 (UTC+0)

I consider this to be part of that?

**Item 5: Ladsgroup added a comment.** 2019-11-08 16:09:32 (UTC+0)

> In [T220775#5647672](/T220775#5647672), [@Jdforrester-WMF](/p/Jdforrester-WMF/) wrote:
> 
> I consider this to be part of that?

Yup, that's true.


**Item 6: Krinkle closed this task as Resolved. | Krinkle claimed this task.** 2022-05-17 23:02:41 (UTC+0)

Re-titled to be about the problem described in the task description, and that's something since solved by [@Jdforrester-WMF](/p/Jdforrester-WMF/). The merged task is about something else.

[CODE]: Figuring out what work is overlapping and if its disparate, how does it differ


## Task 3: T296295 - Revise and improve Graphite backfill procedure

- **URL:** https://phabricator.wikimedia.org/T296295
- **Status:** Closed, Declined
- **Priority:** Needs Triage
- **Created:** 2021-11-23 13:07:04 (UTC+0)

**Timeline Items with Content:** 1

**Item 1: lmata closed this task as Declined. | lmata subscribed.** 2024-10-30 18:50:40 (UTC+0)

I am closing this task as Graphite is under active deprecation. Existing metrics are being actively migrated to Prometheus. The SRE Observability team asks that no new metrics be deployed to Graphite, as the service will be transitioned to a read-only state in EoQ3 FY2024/25 (\~Spring 2025).

For additional details, please see the tracking task Graphite/Deprecation Roadmap: (<https://wikitech.wikimedia.org/wiki/Graphite/Deprecation%5FRoadmap>) or the [T228380: Tech debt: sunsetting of Graphite](/T228380).

[CODE] Deciding not to do work anymore (after a long time)

## Task 4: T197172 - Improve outbound mail service alerting

- **URL:** https://phabricator.wikimedia.org/T197172
- **Status:** Closed, Invalid
- **Priority:** High
- **Created:** 2018-06-13 18:52:53 (UTC+0)

**Timeline Items with Content:** 2

**Item 1: akosiaris removed a project: SRE. | akosiaris subscribed.** 2023-03-14 17:46:58 (UTC+0)

Removing [SRE](/tag/sre/), this has been already triaged to a specific subteam.

**Item 2: joanna_borun closed this task as Invalid. | joanna_borun subscribed.** 2024-02-12 15:50:03 (UTC+0)

Works with current setup if there are any outstanding issues please reopen or create new task with details.


## Task 5: T199441 - Document the process for hard-deleting topics in kafka

- **URL:** https://phabricator.wikimedia.org/T199441
- **Status:** Closed, Resolved
- **Priority:** Medium
- **Created:** 2018-07-12 13:42:07 (UTC+0)

**Timeline Items with Content:** 1

**Item 1: elukey added a comment.** 2018-07-23 17:37:25 (UTC+0)

Just created <https://wikitech.wikimedia.org/wiki/Kafka/Administration#Delete%5Fa%5Ftopic>, should be enough!

[CODE] Non-evolutionary work.


## Task 6: T199763 - Special:Log UnexpectedValueException after changes in HTMLTitleTextField and MapCacheLRU

- **URL:** https://phabricator.wikimedia.org/T199763
- **Status:** Closed, Resolved
- **Priority:** Needs Triage
- **Created:** 2018-07-17 02:59:43 (UTC+0)

**Timeline Items with Content:** 6

**Item 1: • Prtksxna added a comment.** 2018-07-17 04:25:22 (UTC+0)

git bisect points to [rMW7a25cd388c8a: Convert Title::getTitleCache() to using MapCacheLRU](/rMW7a25cd388c8adcce60f4c055295baed71e730616).

**Item 2: Krinkle added a comment.** 2018-07-17 04:45:03 (UTC+0)

The commit in question (correctly) enforces a restriction that was previously implied. The restriction being that: cache keys cannot be null. Many code paths were already enforcing this in their own code, but it seems we found one method used on Special:Log that wasn't accounting for this.

As such, it causes the exception to be thrown. We can temporarily revert that, but ultimately the commit can't be improved or done differently.

The HTMLTitleTextField class is passing null as a title to validate() which goes unfiltered and makes its way to Title::newFromTextThrow. That method happens to work by accident, because it is interpreting null as "Null" and treating that as if it was an article page name (e.g. \[\[Null\]\]), and says it is "valid".

That code is broken and needs to be fixed.

To confirm this I have restored my MediaWiki install to before [f88a5a18155a](/rMWf88a5a18155a0f9fa64683feabefef83bffa85a3) (git checkout -b test 33912421), and confirmed Special:Log still works, and then cherry-picked [7a25cd388c8a](/rMW7a25cd388c8adcce60f4c055295baed71e730616) (git cherry-pick 7a25cd388c8a), and confirmed Special:Log still works.

**Item 3: zeljkofilipin subscribed.** 2018-07-17 09:46:05 (UTC+0)

[Special:Log](https://en.wikipedia.beta.wmflabs.org/wiki/Special:Log) works for me, [446228](https://gerrit.wikimedia.org/r/c/mediawiki/core/+/446228) is merged, can this be resolved?

**Item 4: • Prtksxna added a comment.** 2018-07-17 09:50:11 (UTC+0)

To fully fix the issue, we need to fix HTMLTitleTextField (<https://gerrit.wikimedia.org/r/#/c/446216/>) and then revert the revert of [rMW7a25cd388c8a: Convert Title::getTitleCache() to using MapCacheLRU](/rMW7a25cd388c8adcce60f4c055295baed71e730616).

**Item 5: zeljkofilipin added a comment.** 2018-07-17 10:21:08 (UTC+0)

Is it still blocking [T191059: 1.32.0-wmf.13 deployment blockers](/T191059)?

**Item 6: matmarex added a comment.** 2018-07-17 14:54:02 (UTC+0)

I think it is not blocking the deployment any more, we need to do some more work to clean up the tech debt, but master is in a stable state right now.


## Task 7: T172480 - Add a jobrunner server to the Scap canary pool

- **URL:** https://phabricator.wikimedia.org/T172480
- **Status:** Open, Low
- **Priority:** Low
- **Created:** 2017-08-04 03:40:08 (UTC+0)

**Timeline Items with Content:** 2

**Item 1: greg edited projects, added Release-Engineering-Team (Kanban); removed Release-Engineering-Team (Next). | greg subscribed.** 2017-09-29 22:46:05 (UTC+0)

Adding our [Release-Engineering-Team (Kanban)](/project/view/2769/) project as we would like to work on this in the coming quarter or two (no promises though, this is not a "goal" only "other hoped for work").

[CODE] communication of priority

**Item 2: Krinkle added a comment.** 2019-04-20 19:43:50 (UTC+0)

This task was referenced as actionable for aa recent incident.

<https://wikitech.wikimedia.org/wiki/Incident%5Fdocumentation/20190417-Jobqueue>

[CODE] communication of link to incident (upwards)


## Task 8: T218268 - eventgate-analytics k8s pods occasionally can't produce to kafka

- **URL:** https://phabricator.wikimedia.org/T218268
- **Status:** Closed, Resolved
- **Priority:** High
- **Created:** 2019-03-13 21:40:55 (UTC+0)

**Timeline Items with Content:** 14

**Item 1: Ottomata added a subscriber: akosiaris.** 2019-03-13 21:41:17 (UTC+0)

[@akosiaris](/p/akosiaris/) let's try to figure this out tomorrow. :)

**Item 2: Stashbot subscribed.** 2019-03-13 22:00:09 (UTC+0)

[Mentioned in SAL (#wikimedia-operations)](https://tools.wmflabs.org/sal/log/AWl5EeHSA1BDhGjCSBP3) \[2019-03-13T22:00:08Z\] <otto@deploy1001> Synchronized wmf-config/InitialiseSettings.php: Disabling api-request logging to eventgate-analytics for group0 wikis until we solve [T218268](/T218268) (duration: 00m 56s)

**Item 3: akosiaris added a comment.** 2019-03-14 06:42:10 (UTC+0)

Do we have logs of this happening?

**Item 4: Ottomata added a comment.** 2019-03-14 13:37:52 (UTC+0)

<https://logstash.wikimedia.org/app/kibana#/doc/logstash-%2A/logstash-2019.03.13/eventgate?id=AWl4sxguNBo9dX1kfcii&%5Fg=%28refreshInterval:%28'$$hashKey':'object:1664',display:Off,pause:!f,section:0,value:0%29,time:%28from:'2019-03-13T18:00:00.000Z',mode:absolute,to:'2019-03-13T21:00:00.000Z'%29%29>

{
  "_index": "logstash-2019.03.13",
  "_type": "eventgate",
  "_id": "AWl4sxguNBo9dX1kfcii",
  "_score": 1,
  "_source": {
    "err_errno": -1,
    "source_host": "10.64.64.93",
    "level": "ERROR",
    "err_code": -1,
    "pid": 140,
    "err_origin": "local",
    "type": "eventgate",
    "message": "event 32d56482-45cc-11e9-be6d-1418776134a1 of schema at /mediawiki/api/request/0.0.1 destined to stream mediawiki.api-request encountered an error: message timed out",
    "version": "1.0",
    "normalized_message": "event 32d56482-45cc-11e9-be6d-1418776134a1 of schema at /mediawiki/api/request/0.0.1 destined to stream mediawiki.api-request encountered an error: message timed out",
    "tags": [
      "input-gelf-12201",
      "es",
      "gelf",
      "normalized_message_untrimmed"
    ],
    "err_message": "message timed out",
    "@timestamp": "2019-03-13T20:16:36.049Z",
    "err_name": "Error",
    "host": "eventgate-analytics-production-5d866bc9dd-nc2qk",
    "@version": "1",
    "gelf_level": "3",
    "err_stack": "Error: Local: Message timed out"
  },
  "fields": {
    "@timestamp": [
      1552508196049
    ]
  }
}

What is especially strange here is that this only happen on one(ish?) random pod at a time after an upgrade. However, the service won't be 'ready' until it has initiated its Kafka producer connection, so it must have been able to talk to Kafka on startup. Now that I think of that, it seems unlikely that this is a random pod network problem, unless the network stops working after service startup. Perhaps this is too much load and the local producer queues are too full waiting for Kafka to ACK messages? Possible, but I believe that Petr and I saw this happen even when we only had the low volume group0 wikis enabled.

I'm going to poke around with some service upgrade/restarts and see if I can reproduce without any MW logging turned on.

**Item 5: akosiaris added a comment.** 2019-03-15 07:40:48 (UTC+0)

I can not rule out a networking issue but it seems improbable, as after all the logs did make it to logstash. Also the destination host is missing from the log making it more difficult to double check things.

**Item 6: Ottomata added a comment.** 2019-03-21 22:59:27 (UTC+0)

I don't know much more, but I have a lot more data!

Here is a staging pod with trace logging enabled reproducing the problem:  
<https://logstash.wikimedia.org/goto/2c7aa00c769053662687249881871c91>

The pod starts, and then I send the first POST at 2019-03-21T22:29:33\. rdkafka then to get stuck in a loop of metadata requests and failures for abaout 1m48 seconds. Logs here include:

Topic staging.test.event [0]: leader is down: re-query
kafka-jumbo1002.eqiad.wmnet:9092/1002: Sent MetadataRequest (v2, 67 bytes @ 0, CorrId 25)
kafka-jumbo1002.eqiad.wmnet:9092/1002: Received MetadataResponse (v2, 345 bytes, CorrId 25, rtt 57.27ms)
Topic staging.test.event partition 0 Leader 1003
kafka-jumbo1002.eqiad.wmnet:9092/1002: 1/1 requested topic(s) seen in metadata
Topic staging.test.event [0]: leader is down: re-query

...  
and so on. It does this until 2019-03-21T22:31:20 when it logs

kafka-jumbo1003.eqiad.wmnet:9092/1003: failed: err: Local: Broker transport failure: (errno: Connection timed out)

From what I can tell, those the Local timeouts like this happen because the broker closes an idle connection. All of the open broker connections timeout and are disconnected at about this time. Then we get reconnects for all the brokers happening at 2019-03-21T22:31:21

kafka-jumbo1005.eqiad.wmnet:9092/1005: Connecting to ipv6#[2620:0:861:103:10:64:32:160]:9092 (plaintext) with socket 28

Once they all reconnect, finally at rdkafka sends the produce request:

kafka-jumbo1003.eqiad.wmnet:9092/1003: Sent ProduceRequest (v3, 326 bytes @ 0, CorrId 2)
kafka-jumbo1003.eqiad.wmnet:9092/1003: staging.test.event [0]: Produce MessageSet with 1 message(s) (239 bytes, ApiVersion 3, MsgVersion 2)
kafka-jumbo1003.eqiad.wmnet:9092/1003: staging.test.event [0] 1 message(s) in xmit queue (1 added from partition queue)
kafka-jumbo1003.eqiad.wmnet:9092/1003: staging.test.event [0]: MessageSet with 1 message(s) delivered
kafka-jumbo1003.eqiad.wmnet:9092/1003: Received ProduceResponse (v3, 54 bytes, CorrId 2, rtt 94.33ms)
All 1 out of 1 events were accepted.

Now we just have to figure out why rdkafka is sometimes getting stuck because of Topic staging.test.event \[0\]: leader is down: re-query for 1-2 minutes....

**Item 7: Ottomata added a comment.** 2019-03-22 17:23:54 (UTC+0)

I tcpdumped while reproducing this on kubestage1001 and the kafka brokers. I could see the looped metadata requests going through fine, but the topic partition leader on kafka-jumbo1003 did not receive any traffic between the initial producer connection, and when the produce request is finally sent about 2 minutes after the HTTP POST. Here's the tcp dump lines 2 minutes apart from kubestage1001:

17:05:39.985011 IP kubernetes-pod-10-64-75-18.eqiad.wmnet.57250 > kafka-jumbo1003.eqiad.wmnet.9092: Flags [.], ack 557, win 62, options [nop,nop,TS val 1666777933 ecr 4257697771], length 0
E..4M.@.?.~.
@K.
@.c..#...N...1D...>p......
cY.M..O.

17:07:50.725284 IP kubernetes-pod-10-64-75-18.eqiad.wmnet.57718 > kafka-jumbo1003.eqiad.wmnet.9092: Flags [S], seq 2270592047, win 29200, options [mss 1460,sackOK,TS val 1666810618 ecr 0,nop,wscale 9], length 0
E..<..@.?...
@K.
@.c.v#..V|/......r.p#.........
cY.........

Topic staging.test.event \[0\]: leader is down: re-query happens in the main rdkafka thread, while all the other metadata requests happen in either the broker or broker/bootstrap specific threads. It's as if the main thread sees kafka-jumbo1003 as down and tells the bootstrap threads to re-query for leadership assuming that Kafka will have rebalanced the leader. Since Kafka hasn't (there's nothing wrong with 1003), the partition leadership metadata returned is the same (1003 is still the leader), and the main thread is told to produce to 1003 again. It still sees 1003 as down (why we don't know). Thus the loop between main thread: leader is down and metadata re-query.

Also, examining the logs again and from the fact that no traffic is sent to kafka-jumbo1003 in this period, 1003 is never sent a metadata request. And suspiciously neither is kafka-jumbo1006\. (Just checked, they are in different rows: 1003 is in Row B and 1006 is in row D.)

So so so , WHY does the main thread see 1003 (and possibly 1006) as down???

**Item 8: Ottomata added a comment.** 2019-03-22 17:38:13 (UTC+0)

Interesting fact: kafka-jumbo1003 and kafka-jumbo1006 are the only brokers in this cluster that are not in Row A or Row B. kubestage1001 is in Row A and kubestage1002 is in Row B. Could there be some very sneaky and intermittent network troubles between k8s nodes and hosts in different rows?

**Item 9: Ottomata added a comment.** 2019-03-22 18:31:02 (UTC+0)

Ohooohooooo! Could this be related to IPv6? On a [successful run](https://logstash.wikimedia.org/goto/1a4ba12d778db9ae95d75db810b24d91), here's the connect message for kafka-jumbo1003:

kafka-jumbo1003.eqiad.wmnet:9092/bootstrap: Connected to ipv4#10.64.16.99:9092

But for an [unsuccessful run](https://logstash.wikimedia.org/goto/5476af43d62b0442a89481279b071339), the startup connect attempt is:

kafka-jumbo1003.eqiad.wmnet:9092/1003: Connecting to ipv6#[2620:0:861:102:10:64:16:99]:9092 (plaintext) with socket 27

And then two minutes later, the successful connect attempt:

kafka-jumbo1003.eqiad.wmnet:9092/1003: Connected to ipv4#10.64.16.99:9092

**Item 10: Ottomata added a comment.** 2019-03-22 19:02:48 (UTC+0)

From <https://github.com/edenhill/librdkafka/wiki/FAQ>

> librdkafka will use the system resolver to resolve the broker hostname. \[...\] librdkafka will, in a round-robin fashion, attempt to connect to all addresses the hostname resolves to. If the broker is only listening to the IPv4 address then the clients connection attempt to the IPv6 address will fail.
> 
> To limit the address families the clients connects to, set the broker.address.family configuration property to v4 or v6.

Kafka brokers are listening on IPv4 and IPv6 addresses:

[@kubestage1002:/home/otto] $ dig kafka-jumbo1003.eqiad.wmnet  ANY | grep -A 2 ';; ANSWER SECTION'
;; ANSWER SECTION:
kafka-jumbo1003.eqiad.wmnet. 1618 IN	AAAA	2620:0:861:102:10:64:16:99
kafka-jumbo1003.eqiad.wmnet. 1343 IN	A	10.64.16.99

[@kubestage1002:/home/otto] $ telnet 10.64.16.99 9092
Trying 10.64.16.99...
Connected to 10.64.16.99.
Escape character is '^]'.

[@kubestage1002:/home/otto] $ telnet 2620:0:861:102:10:64:16:99 9092
Trying 2620:0:861:102:10:64:16:99...
Connected to 2620:0:861:102:10:64:16:99.
Escape character is '^]'.

I tried logging into the container as root and installing telnet there to test this from the pod directly, but:

root@eventgate-analytics-staging-7bbc67c749-tfwwv:/srv/service# apt-get install telnet
Reading package lists... Done
Building dependency tree
Reading state information... Done
E: Unable to locate package telnet
root@eventgate-analytics-staging-7bbc67c749-tfwwv:/srv/service# apt-get update
0% [Connecting to mirrors.wikimedia.org (2620:0:861:1:208:80:154:15)] [Connecting to security.debian.org (2610:148:1f10:3::73)] [Connecting to apt.wikimedia.org (2620:0:861:1:208:80:154:22)]

apt-get update couldn't connect to the apt source IPv6 addresses.

I just tried the suggested librdkafka work around of setting broker.address.family: v4, and I can't reproduce this problem anymore.

[@akosiaris](/p/akosiaris/) \_joe\_ suggested that perhaps there is some IPv6 Calico issue here?

**Item 11: akosiaris added a comment.** 2019-03-26 14:51:02 (UTC+0)

> In [T218268#5049090](/T218268#5049090), [@Ottomata](/p/Ottomata/) wrote:
> 
> apt-get update couldn't connect to the apt source IPv6 addresses.

Nor IPv4 for that matter. The apt repos are not in the whitelist\[1\] (on purpose, aside from debugging, why would they be?

> I just tried the suggested librdkafka work around of setting broker.address.family: v4, and I can't reproduce this problem anymore.
> 
> [@akosiaris](/p/akosiaris/) \_joe\_ suggested that perhaps there is some IPv6 Calico issue here?

From the looks of it, we never added the IPv6 kafka broker IPs in [29f615c779](/rOPUP29f615c7799e4ab76cd54cf14ad55e452e9fda70), so I think this is it. I 'll add and let's see if we found the root cause.

\[1\] <https://github.com/wikimedia/puppet/blob/production/modules/calico/data/default-kubernetes-policy.yaml>

**Item 12: Ottomata added a comment.** 2019-03-26 14:53:25 (UTC+0)

OF COURSE! Thank you Alex.

Since (IIUC), the preferred default is that all servers get IPv6 addies, we should remember to in general include both IPv4 and IPv6 in all networking rules too, ya?

**Item 13: Ottomata added a comment.** 2019-03-26 15:47:50 (UTC+0)

After ^:

kafka-jumbo1003.eqiad.wmnet:9092/bootstrap: Connected to ipv6#[2620:0:861:102:10:64:16:99]:9092

Looks good!

**Item 14: akosiaris closed this task as Resolved.** 2019-03-26 21:39:51 (UTC+0)

Resolving, feel free to reopen


## Task 9: T211029 - Sort out only one ideal hiera mechanism for Cloud VPS

- **URL:** https://phabricator.wikimedia.org/T211029
- **Status:** Open, Low
- **Priority:** Low
- **Created:** 2018-12-03 16:31:30 (UTC+0)

**Timeline Items with Content:** 5

**Item 1: bd808 subscribed.** 2018-12-03 17:16:14 (UTC+0)

Each of the existing 3 mechanisms has problems that keep it from being ideal today:

* Wikitech's Hiera: namespace is dependent on [MediaWiki-extensions-OpenStackManager](/tag/mediawiki-extensions-openstackmanager/) which has been proposed to be undeployed ([T161553](/T161553))
* operations/puppet.git requires a +2 and manual merge step by a production root user to make a change live (unless the project is using a project local puppetmaster and maintaining local commits). This does not scale well and can take days/weeks/months to occur.
* The Horizon puppet dashboard does not provide any audit logs about who made changes and when.

Of the two alternate proposals offered so far by [@Krenair](/p/Krenair/), proposal (a) of adding some kind of version control/logging to the Horizon system is probably the least technically challenging. I believe it would be possible to use [django-reversion](https://django-reversion.readthedocs.io/en/stable/) to add history to the existing system. Performance could be greatly improved at the cost of some user friendliness by removing the existing system of showing Puppet modules and instead only exposing the raw YAML editing experience. This is a regression from the existing functionality, but it matches the user experience of the other existing competing systems (git and wikitech).

Proposal (b) would be more technically complex to implement as it would require changes in the Cloud-wide Puppetmasters to provision and update the various git repos created. It would also require similar changes to all project local Puppetmasters. Finally it would require a new integration with Gerrit that ideally would use some sort of reconciliation loop functionality to fix broken broken permissions when real-time project adminship change events were missed or mishandled. Conversely, work towards per-project hiera configuration via git would likely also move us closer to per-project Puppet manifest management as well which could be a very useful feature for Cloud VPS projects generally as managing provisioning of unique services using the shared operations/puppet.git repository suffers from the same scaling problems as managing hiera settings there.

[CODE] Reviewing existing solutions
[THEME] Investigation before evolving (determining which solution that is already done is worth standardizing)

**Item 2: Krenair added a comment.** 2018-12-03 17:29:37 (UTC+0)

> In [T211029#4794695](/T211029#4794695), [@bd808](/p/bd808/) wrote:
> 
> * The Horizon puppet dashboard does not provide any audit logs about who made changes and when.

Also the performance of the UI.

> In [T211029#4794695](/T211029#4794695), [@bd808](/p/bd808/) wrote:
> 
> Of the two alternate proposals offered so far by [@Krenair](/p/Krenair/), proposal (a) of adding some kind of version control/logging to the Horizon system is probably the least technically challenging. I believe it would be possible to use [django-reversion](https://django-reversion.readthedocs.io/en/stable/) to add history to the existing system. Performance could be greatly improved at the cost of some user friendliness by removing the existing system of showing Puppet modules and instead only exposing the raw YAML editing experience. This is a regression from the existing functionality, but it matches the user experience of the other existing competing systems (git and wikitech).

Yeah I'd like to avoid maintaining our own system on top of horizon. git handles versioning for us and is our one of our main development/operations tools, so going through gerrit would be a good idea. It may take a bit of automatic integration work though. I don't care much for the Puppet ENC thing, it'd be easier to find the class I want through grep, and add it via hiera, setting the parameters in hiera.

> In [T211029#4794695](/T211029#4794695), [@bd808](/p/bd808/) wrote:
> 
> Proposal (b) would be more technically complex to implement as it would require changes in the Cloud-wide Puppetmasters to provision and update the various git repos created. It would also require similar changes to all project local Puppetmasters. Finally it would require a new integration with Gerrit that ideally would use some sort of reconciliation loop functionality to fix broken broken permissions when real-time project adminship change events were missed or mishandled. Conversely, work towards per-project hiera configuration via git would likely also move us closer to per-project Puppet manifest management as well which could be a very useful feature for Cloud VPS projects generally as managing provisioning of unique services using the shared operations/puppet.git repository suffers from the same scaling problems as managing hiera settings there.

Yes. I don't want to give the impression that labs projects would ever cease use of the operations/puppet.git repository's production branch, but some of them may want to build on top of it by adding their own hieradata (and potentially manifests later, let's not worry about that for the moment) in their own repository through their own project members' +2s, and these would not be pulled into prod (without someone going through the process of getting the code merged into the production repository with the existing review process that requires). I believe the existing codesearch tools would help people trying to locate hiera stuff used across all projects (?), without requiring anything additional to make it talk to the backend system currently in use by horizon (could also set up a gerrit automatic submodule thing a la mediawiki/extensions.git).


[CODE] Changing anything or adding anything becomes a burden that they have to maintain (why not use existing features)

**Item 3: bd808 added a comment.** 2018-12-03 18:01:55 (UTC+0)

> In [T211029#4794748](/T211029#4794748), [@Krenair](/p/Krenair/) wrote:
> 
>> In [T211029#4794695](/T211029#4794695), [@bd808](/p/bd808/) wrote:
>> 
>> Of the two alternate proposals offered so far by [@Krenair](/p/Krenair/), proposal (a) of adding some kind of version control/logging to the Horizon system is probably the least technically challenging. I believe it would be possible to use [django-reversion](https://django-reversion.readthedocs.io/en/stable/) to add history to the existing system. Performance could be greatly improved at the cost of some user friendliness by removing the existing system of showing Puppet modules and instead only exposing the raw YAML editing experience. This is a regression from the existing functionality, but it matches the user experience of the other existing competing systems (git and wikitech).
> 
> Yeah I'd like to avoid maintaining our own system on top of horizon. git handles versioning for us and is our one of our main development/operations tools, so going through gerrit would be a good idea. It may take a bit of automatic integration work though. I don't care much for the Puppet ENC thing, it'd be easier to find the class I want through grep, and add it via hiera, setting the parameters in hiera.

Git is good at version control and auditable change logs. Gerrit is ... the VCS and code review solution that Wikimedia has on premise today, that's about the nicest thing I can say about it. There is cognitive complexity of moving instance configuration to a different system and interface than instance provisioning. Having both in Horizon is in my opinion nicer for the general user's experience than having to explain how and when to move from Horizon to Gerrit and back again. This is a subjective thing for sure and will be very different for users who are more used to the Foundation's production Puppet usage.

**Item 4: Krenair added a comment.** 2018-12-03 18:07:01 (UTC+0)

> In [T211029#4794916](/T211029#4794916), [@bd808](/p/bd808/) wrote:
> 
>> In [T211029#4794748](/T211029#4794748), [@Krenair](/p/Krenair/) wrote:
>> 
>>> In [T211029#4794695](/T211029#4794695), [@bd808](/p/bd808/) wrote:
>>> 
>>> Of the two alternate proposals offered so far by [@Krenair](/p/Krenair/), proposal (a) of adding some kind of version control/logging to the Horizon system is probably the least technically challenging. I believe it would be possible to use [django-reversion](https://django-reversion.readthedocs.io/en/stable/) to add history to the existing system. Performance could be greatly improved at the cost of some user friendliness by removing the existing system of showing Puppet modules and instead only exposing the raw YAML editing experience. This is a regression from the existing functionality, but it matches the user experience of the other existing competing systems (git and wikitech).
>> 
>> Yeah I'd like to avoid maintaining our own system on top of horizon. git handles versioning for us and is our one of our main development/operations tools, so going through gerrit would be a good idea. It may take a bit of automatic integration work though. I don't care much for the Puppet ENC thing, it'd be easier to find the class I want through grep, and add it via hiera, setting the parameters in hiera.
> 
> Git is good at version control and auditable change logs. Gerrit is ... the VCS and code review solution that Wikimedia has on premise today, that's about the nicest thing I can say about it. There is cognitive complexity of moving instance configuration to a different system and interface than instance provisioning. Having both in Horizon is in my opinion nicer for the general user's experience than having to explain how and when to move from Horizon to Gerrit and back again. This is a subjective thing for sure and will be very different for users who are more used to the Foundation's production Puppet usage.

Creation and control of stuff outside the scope of instances themselves (e.g. creating new instances, powering them off/on, managing wmflabs.org DNS, security groups, and so on and so forth) happens in Horizon (users familiar with other cloud systems or even more traditional VPS hosts should be familiar with this), instance-internal configuration is done with Puppet which we manage separately. Sounds simple enough to me though I might not be the average Cloud VPS user. :)

**Item 5: bd808 added a comment.** 2019-12-18 17:11:14 (UTC+0)

We got one step closer to this as part of [T161553: Remove OpenStackManager from Wikitech](/T161553). The Hiera namespace has been removed from Wikitech and all data that was there migrated to the Horizon interface for managing hiera settings.

Collapsing Horizon's settings and ops/puppet.git settings into one place can really only go in the git->Horizon direction as recognized in "option a)" of [@Krenair](/p/Krenair/)'s original irc thoughts. I guess the open question is do we actually want to do that?

[CODE] Communication, updating a year later about environmental change
[THEME] Having tasks open for a long time means they are susceptible to many external changes that affect their context (e.g. how much lift there is)


## Task 10: T211202 - tools-k8s-master-01 - etcd errors

- **URL:** https://phabricator.wikimedia.org/T211202
- **Status:** Closed, Resolved
- **Priority:** Low
- **Created:** 2018-12-05 14:09:05 (UTC+0)

**Timeline Items with Content:** 3

**Item 1: • Bstorm added subscribers: zhuyifei1999, • Bstorm, bd808.** 2018-12-05 15:55:14 (UTC+0)

I heard that this was installed there incorrectly in the past and isn't needed. However, I've heard a lot of things, 😁

[CODE] Communicating lost knowledge, seeking info

**Item 2: • GTirloni added a comment.** 2018-12-12 14:52:53 (UTC+0)

tools-k8s-master-01:~$ systemctl status etcd
● etcd.service - etcd
   Loaded: loaded (/lib/systemd/system/etcd.service; enabled)
   Active: activating (auto-restart) (Result: exit-code) since Wed 2018-12-12 14:42:06 UTC; 2s ago
  Process: 26899 ExecStart=/usr/bin/etcd (code=exited, status=1/FAILURE)
 Main PID: 26899 (code=exited, status=1/FAILURE)

Dec 12 14:42:06 tools-k8s-master-01 systemd[1]: Unit etcd.service entered failed state.

Dec 12 14:43:07 tools-k8s-master-01 systemd[1]: Starting etcd...
Dec 12 14:43:07 tools-k8s-master-01 systemd[1]: Started etcd.
Dec 12 14:43:07 tools-k8s-master-01 etcd[26959]: recognized and used environment variable ETCD_ADVERTISE_CLIENT_URLS=https://tools-k8s-master-01.tools.eqiad.wmflabs:2379
Dec 12 14:43:07 tools-k8s-master-01 etcd[26959]: recognized and used environment variable ETCD_CERT_FILE=/var/lib/etcd/ssl/certs/cert.pem
Dec 12 14:43:07 tools-k8s-master-01 etcd[26959]: recognized and used environment variable ETCD_DATA_DIR=/var/lib/etcd/tools-k8s
Dec 12 14:43:07 tools-k8s-master-01 etcd[26959]: recognized and used environment variable ETCD_INITIAL_ADVERTISE_PEER_URLS=http://tools-k8s-master-01.tools.eqiad.wmflabs:2380
Dec 12 14:43:07 tools-k8s-master-01 etcd[26959]: recognized and used environment variable ETCD_INITIAL_CLUSTER=tools-k8s-master-01=http://tools-k8s-master-01.tools.eqiad.wmflabs:2380
Dec 12 14:43:07 tools-k8s-master-01 etcd[26959]: recognized and used environment variable ETCD_INITIAL_CLUSTER_STATE=existing
Dec 12 14:43:07 tools-k8s-master-01 etcd[26959]: recognized and used environment variable ETCD_KEY_FILE=/var/lib/etcd/ssl/private_keys/server.key
Dec 12 14:43:07 tools-k8s-master-01 etcd[26959]: recognized and used environment variable ETCD_LISTEN_CLIENT_URLS=https://tools-k8s-master-01.tools.eqiad.wmflabs:2379
Dec 12 14:43:07 tools-k8s-master-01 etcd[26959]: recognized and used environment variable ETCD_LISTEN_PEER_URLS=http://tools-k8s-master-01.tools.eqiad.wmflabs:2380
Dec 12 14:43:07 tools-k8s-master-01 etcd[26959]: recognized and used environment variable ETCD_NAME=tools-k8s-master-01
Dec 12 14:43:07 tools-k8s-master-01 etcd[26959]: setting maximum number of CPUs to 2, total number of available CPUs is 2
Dec 12 14:43:07 tools-k8s-master-01 etcd[26959]: the server is already initialized as member before, starting as etcd member...
Dec 12 14:43:07 tools-k8s-master-01 etcd[26959]: listening for peers on http://tools-k8s-master-01.tools.eqiad.wmflabs:2380
Dec 12 14:43:07 tools-k8s-master-01 etcd[26959]: clientTLS: cert = /var/lib/etcd/ssl/certs/cert.pem, key = /var/lib/etcd/ssl/private_keys/server.key, ca = , trusted-ca = , client-cert-auth = false
Dec 12 14:43:07 tools-k8s-master-01 etcd[26959]: stopping listening for peers on http://tools-k8s-master-01.tools.eqiad.wmflabs:2380
Dec 12 14:43:07 tools-k8s-master-01 etcd[26959]: open /var/lib/etcd/ssl/certs/cert.pem: no such file or directory
Dec 12 14:43:07 tools-k8s-master-01 systemd[1]: etcd.service: main process exited, code=exited, status=1/FAILURE
Dec 12 14:43:07 tools-k8s-master-01 systemd[1]: Unit etcd.service entered failed state.

tools-k8s-master-01:~4 dpkg -l | grep etcd
ii  etcd 2.2.1+dfsg-1 amd64 highly-available key value store -- daemon

`
tools-k8s-master-01:/var/lib/etcd$ find . -ls
659128    4 drwx------   6 etcd     etcd         4096 Dec  7  2015 .
659151    4 drwx------   3 etcd     etcd         4096 Jun 21  2017 ./tools-k8s
786790    4 drwx------   4 etcd     etcd         4096 Jun 21  2017 ./tools-k8s/member
786792    4 drwx------   2 etcd     etcd         4096 Jan 15  2018 ./tools-k8s/member/wal
787077 62504 -rw-------   1 etcd     etcd     64000213 Jan 12  2018 ./tools-k8s/member/wal/000000000000017e-000000000806defc.wal
787085 62504 -rw-------   1 etcd     etcd     64000200 Jan  8  2018 ./tools-k8s/member/wal/000000000000017d-0000000007fe83f5.wal
786455 62500 -rw-------   1 etcd     etcd     28511448 Jan 16  2018 ./tools-k8s/member/wal/0000000000000180-000000000817950a.wal
787082 62504 -rw-------   1 etcd     etcd     64000117 Jan 15  2018 ./tools-k8s/member/wal/000000000000017f-00000000080f3a01.wal
787078 62504 -rw-------   1 etcd     etcd     64000163 Jan  5  2018 ./tools-k8s/member/wal/000000000000017c-0000000007f628f1.wal
786791    4 drwx------   2 etcd     etcd         4096 Jan 16  2018 ./tools-k8s/member/snap
787079 3220 -rw-r--r--   1 etcd     etcd      3293972 Jan 16  2018 ./tools-k8s/member/snap/000000000000000c-00000000081acadc.snap
787080 3220 -rw-r--r--   1 etcd     etcd      3293972 Jan 16  2018 ./tools-k8s/member/snap/000000000000000c-00000000081af1ed.snap
787083 3220 -rw-r--r--   1 etcd     etcd      3293972 Jan 16  2018 ./tools-k8s/member/snap/000000000000000c-00000000081aa3cb.snap
786440 3220 -rw-r--r--   1 etcd     etcd      3293972 Jan 16  2018 ./tools-k8s/member/snap/000000000000000c-00000000081b18fe.snap
787081 3220 -rw-r--r--   1 etcd     etcd      3293972 Jan 16  2018 ./tools-k8s/member/snap/000000000000000c-00000000081b400f.snap
659145    4 drwx------   4 etcd     etcd         4096 Dec  6  2015 ./member
659148    4 drwx------   2 etcd     etcd         4096 Dec  6  2015 ./member/wal
659150  316 -rw-------   1 etcd     etcd       316495 Dec  6  2015 ./member/wal/0000000000000000-0000000000000000.wal
659146    4 drwx------   2 etcd     etcd         4096 Dec  6  2015 ./member/snap
786793    4 drwx------   3 etcd     etcd         4096 Dec  7  2015 ./default
786856    4 drwx------   4 etcd     etcd         4096 Dec  7  2015 ./default/member
786861    4 drwx------   2 etcd     etcd         4096 Dec  7  2015 ./default/member/wal
786862  100 -rw-------   1 etcd     etcd        95992 Dec  7  2015 ./default/member/wal/0000000000000000-0000000000000000.wal
786860    4 drwx------   2 etcd     etcd         4096 Dec  7  2015 ./default/member/snap
656809    4 dr-x------   2 etcd     etcd         4096 Jun 29  2017 ./ssl

tools-k8s-master-01$ systemctl disable etcd
Synchronizing state for etcd.service with sysvinit using update-rc.d...
Executing /usr/sbin/update-rc.d etcd defaults
Executing /usr/sbin/update-rc.d etcd disable
insserv: warning: current start runlevel(s) (empty) of script `etcd' overrides LSB defaults (2 3 4 5).
insserv: warning: current stop runlevel(s) (0 1 2 3 4 5 6) of script `etcd' overrides LSB defaults (0 1 6).
Removed symlink /etc/systemd/system/multi-user.target.wants/etcd.service.


tools-k8s-master-01$ puppet agent -t
Info: Using configured environment 'production'
Info: Retrieving pluginfacts
Info: Retrieving plugin
Info: Loading facts
Info: Caching catalog for tools-k8s-master-01.tools.eqiad.wmflabs
Notice: /Stage[main]/Base::Environment/Tidy[/var/tmp/core]: Tidying 0 files
Info: Applying configuration version '1544625989'
Notice: Applied catalog in 10.35 seconds


tools-k8s-master-01$ systemctl status etcd
● etcd.service - etcd
   Loaded: loaded (/lib/systemd/system/etcd.service; static)
   Active: inactive (dead) (Result: exit-code) since Wed 2018-12-12 14:45:48 UTC; 1min 10s ago
 Main PID: 27108 (code=exited, status=1/FAILURE)

Dec 12 14:45:41 tools-k8s-master-01 systemd[1]: etcd.service: main process exited, code=exited, status=1/FAILURE
Dec 12 14:45:41 tools-k8s-master-01 systemd[1]: Unit etcd.service entered failed state.
Dec 12 14:45:48 tools-k8s-master-01 systemd[1]: Stopping etcd...
Dec 12 14:45:48 tools-k8s-master-01 systemd[1]: Stopped etcd.

tools-bastion-03$ kubectl get nodes
NAME                                    STATUS                     AGE
tools-worker-1001.tools.eqiad.wmflabs   Ready                      2y
tools-worker-1002.tools.eqiad.wmflabs   Ready                      2y
tools-worker-1003.tools.eqiad.wmflabs   Ready                      2y
tools-worker-1004.tools.eqiad.wmflabs   Ready                      2y
tools-worker-1005.tools.eqiad.wmflabs   Ready                      2y
tools-worker-1006.tools.eqiad.wmflabs   Ready                      2y
tools-worker-1007.tools.eqiad.wmflabs   Ready                      2y
tools-worker-1008.tools.eqiad.wmflabs   Ready                      2y
tools-worker-1009.tools.eqiad.wmflabs   Ready                      2y
tools-worker-1010.tools.eqiad.wmflabs   Ready,SchedulingDisabled   2y
tools-worker-1011.tools.eqiad.wmflabs   Ready                      2y
tools-worker-1012.tools.eqiad.wmflabs   Ready,SchedulingDisabled   2y
tools-worker-1013.tools.eqiad.wmflabs   Ready                      2y
tools-worker-1014.tools.eqiad.wmflabs   Ready                      2y
tools-worker-1015.tools.eqiad.wmflabs   Ready                      2y
tools-worker-1016.tools.eqiad.wmflabs   Ready                      2y
tools-worker-1017.tools.eqiad.wmflabs   Ready                      2y
tools-worker-1018.tools.eqiad.wmflabs   Ready                      2y
tools-worker-1019.tools.eqiad.wmflabs   Ready                      2y
tools-worker-1020.tools.eqiad.wmflabs   Ready,SchedulingDisabled   2y
tools-worker-1021.tools.eqiad.wmflabs   Ready                      2y
tools-worker-1022.tools.eqiad.wmflabs   Ready,SchedulingDisabled   2y
tools-worker-1023.tools.eqiad.wmflabs   Ready                      2y
tools-worker-1025.tools.eqiad.wmflabs   Ready                      2y
tools-worker-1026.tools.eqiad.wmflabs   Ready                      1y
tools-worker-1027.tools.eqiad.wmflabs   Ready                      1y
tools-worker-1028.tools.eqiad.wmflabs   Ready,SchedulingDisabled   1y

tools-k8s-master-01$ apt remove etcd
Reading package lists... Done
Building dependency tree       
Reading state information... Done
The following packages will be REMOVED:
  etcd
0 upgraded, 0 newly installed, 1 to remove and 3 not upgraded.
After this operation, 58.0 MB disk space will be freed.
Do you want to continue? [Y/n] y
(Reading database ... 65703 files and directories currently installed.)
Removing etcd (2.2.1+dfsg-1) ...
Processing triggers for man-db (2.7.0.2-5) ...

[CODE] Communicating (Providing a record)

**Item 3: • GTirloni added a comment.** 2018-12-12 14:53:22 (UTC+0)

Disabled/removed etcd from tools-k8s-master-01.

[CODE] Communicating (completion of non-code change)
