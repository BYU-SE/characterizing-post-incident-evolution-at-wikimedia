# Random Sample of Code Review Messages

**Generated:** 2026-02-07T21:38:58.068Z

**Total Code Reviews:** 60

---

## Review 1: 587402 - Remove the last use of dropTable in schema updater

- **URL:** https://gerrit.wikimedia.org/r/c/587402
- **Author:** امیر سرآبادانی (@ladsgroup) <Ladsgroup@gmail.com>
- **Project:** mediawiki/extensions/Wikibase
- **Branch:** master
- **Status:** MERGED
- **Created:** 2020-04-08 06:11:55.000000000
- **Updated:** 2020-04-08 08:55:15.000000000

**Commit Message:**

```
Remove the last use of dropTable in schema updater

Bug: T249598
Change-Id: I84f5fe6836a89352c3ff19c9a985ca359a5bf74d
```

**Messages:** 11
**Inline Comments:** 0

**Message 1: امیر سرآبادانی (@ladsgroup)** - 4/8/2020, 6:11:55 AM
Uploaded patch set 1.

**Message 2: SonarQube Bot (@sonarqubebot)** - 4/8/2020, 6:23:26 AM
Patch Set 1: Verified+1

✔ Quality gate passed!


* ✔ reliability rating
* ✔ security rating
* ✔ maintainability rating
* ✔ coverage
* ✔ duplicated lines density

Report: https://sonarcloud.io/dashboard?id=mediawiki-extensions-Wikibase&branch=587402-1 Please give feedback and report false positives at https://www.mediawiki.org/wiki/Talk:Continuous_integration/Codehealth_Pipeline

**Message 3: امیر سرآبادانی (@ladsgroup)** - 4/8/2020, 6:24:05 AM
Uploaded patch set 2: Commit message was updated.

**Message 4: SonarQube Bot (@sonarqubebot)** - 4/8/2020, 6:35:15 AM
Patch Set 2: Verified+1

✔ Quality gate passed!


* ✔ reliability rating
* ✔ security rating
* ✔ maintainability rating
* ✔ coverage
* ✔ duplicated lines density

Report: https://sonarcloud.io/dashboard?id=mediawiki-extensions-Wikibase&branch=587402-2 Please give feedback and report false positives at https://www.mediawiki.org/wiki/Talk:Continuous_integration/Codehealth_Pipeline

**Message 5:** 🤖 4/8/2020, 6:45:15 AM - Verified+2: Main test build succeeded
**Message 6: DannyS712 (@dannys712-main)** - 4/8/2020, 7:26:29 AM
Patch Set 2: Code-Review+1

LGTM

**Message 7: Lucas Werkmeister (WMDE) (@lucaswerkmeister-wmde)** - 4/8/2020, 8:21:06 AM
Patch Set 2: Code-Review+2

**Message 8:** 🤖 4/8/2020, 8:21:11 AM - -Verified: Starting gate
**Message 9:** 🤖 4/8/2020, 8:40:53 AM - Verified+2: Gate pipeline
**Message 10:** 🤖 4/8/2020, 8:40:54 AM - Change has been successfully merged by j...
**Message 11:** 🤖 4/8/2020, 8:55:15 AM - Post-: Post-merge build succeeded.

## Review 2: 619850 - Reorganize repo schema scripts

- **URL:** https://gerrit.wikimedia.org/r/c/619850
- **Author:** امیر سرآبادانی (@ladsgroup) <Ladsgroup@gmail.com>
- **Project:** mediawiki/extensions/Wikibase
- **Branch:** master
- **Status:** MERGED
- **Created:** 2020-08-12 20:56:45.000000000
- **Updated:** 2020-08-18 16:09:37.000000000

**Commit Message:**

```
Reorganize repo schema scripts

Basically making it similar to core:
 - Let's have one place for tables repo registers and its
   current schema.
 - Let's move all archives to a dedicated directory to avoid cluttering
   the schema and the files that matters (current schema).
 - Let's split sql files based on their db type, this would allow us in
   near future take advantage of abstract schema and schema changes (T191231)
   This would also paves the way on adding Postgres support.

Bug: T205094
Change-Id: I9366a1aa3f8bf42381b633461822cafb2d15c6be
```

**Messages:** 41
**Inline Comments:** 2

**Message 1: امیر سرآبادانی (@ladsgroup)** - 8/12/2020, 8:56:45 PM
Uploaded patch set 1.

**Message 2: SonarQube Bot (@sonarqubebot)** - 8/12/2020, 9:09:11 PM
Patch Set 1:

(8 comments)

❌ Quality gate failed


* ✔ reliability rating
* ✔ security rating
* ✔ maintainability rating
* ❌ coverage (0.0 is less than 80)
* ✔ duplicated lines density

Report: https://sonarcloud.io/dashboard?id=mediawiki-extensions-Wikibase&branch=619850-1

This patch can still be merged. Please give feedback and report false positives at https://www.mediawiki.org/wiki/Talk:Continuous_integration/Codehealth_Pipeline

**Message 3:** 🤖 8/12/2020, 9:16:51 PM - Verified-1: Main test build failed
**Message 4: امیر سرآبادانی (@ladsgroup)** - 8/12/2020, 10:27:10 PM
Uploaded patch set 2.

**Message 5: SonarQube Bot (@sonarqubebot)** - 8/12/2020, 10:38:04 PM
Patch Set 2:

(8 comments)

❌ Quality gate failed


* ✔ reliability rating
* ✔ security rating
* ✔ maintainability rating
* ❌ coverage (0.0 is less than 80)
* ✔ duplicated lines density

Report: https://sonarcloud.io/dashboard?id=mediawiki-extensions-Wikibase&branch=619850-2

This patch can still be merged. Please give feedback and report false positives at https://www.mediawiki.org/wiki/Talk:Continuous_integration/Codehealth_Pipeline

**Message 6:** 🤖 8/12/2020, 10:45:58 PM - Verified-1: Main test build failed
**Message 7: امیر سرآبادانی (@ladsgroup)** - 8/12/2020, 10:51:34 PM
Uploaded patch set 3.

**Message 8: SonarQube Bot (@sonarqubebot)** - 8/12/2020, 11:02:05 PM
Patch Set 3:

(8 comments)

❌ Quality gate failed


* ✔ reliability rating
* ✔ security rating
* ✔ maintainability rating
* ❌ coverage (0.0 is less than 80)
* ✔ duplicated lines density

Report: https://sonarcloud.io/dashboard?id=mediawiki-extensions-Wikibase&branch=619850-3

This patch can still be merged. Please give feedback and report false positives at https://www.mediawiki.org/wiki/Talk:Continuous_integration/Codehealth_Pipeline

**Message 9:** 🤖 8/12/2020, 11:11:28 PM - Verified-1: Main test build failed
**Message 10: امیر سرآبادانی (@ladsgroup)** - 8/12/2020, 11:14:15 PM
Uploaded patch set 4.

**Message 11: SonarQube Bot (@sonarqubebot)** - 8/12/2020, 11:23:33 PM
Patch Set 4:

(8 comments)

❌ Quality gate failed


* ✔ reliability rating
* ✔ security rating
* ✔ maintainability rating
* ❌ coverage (0.0 is less than 80)
* ✔ duplicated lines density

Report: https://sonarcloud.io/dashboard?id=mediawiki-extensions-Wikibase&branch=619850-4

This patch can still be merged. Please give feedback and report false positives at https://www.mediawiki.org/wiki/Talk:Continuous_integration/Codehealth_Pipeline

**Message 12:** 🤖 8/12/2020, 11:36:13 PM - Verified-1: Main test build failed
**Message 13: امیر سرآبادانی (@ladsgroup)** - 8/12/2020, 11:38:00 PM
Uploaded patch set 5.

**Message 14: SonarQube Bot (@sonarqubebot)** - 8/12/2020, 11:47:28 PM
Patch Set 5:

(8 comments)

❌ Quality gate failed


* ✔ reliability rating
* ✔ security rating
* ✔ maintainability rating
* ❌ coverage (0.0 is less than 80)
* ✔ duplicated lines density

Report: https://sonarcloud.io/dashboard?id=mediawiki-extensions-Wikibase&branch=619850-5

This patch can still be merged. Please give feedback and report false positives at https://www.mediawiki.org/wiki/Talk:Continuous_integration/Codehealth_Pipeline

**Message 15:** 🤖 8/13/2020, 12:00:03 AM - Verified-1: Main test build failed
**Message 16: امیر سرآبادانی (@ladsgroup)** - 8/13/2020, 12:02:05 AM
Uploaded patch set 6.

**Message 17: SonarQube Bot (@sonarqubebot)** - 8/13/2020, 12:12:43 AM
Patch Set 6:

(8 comments)

❌ Quality gate failed


* ✔ reliability rating
* ✔ security rating
* ✔ maintainability rating
* ❌ coverage (0.0 is less than 80)
* ✔ duplicated lines density

Report: https://sonarcloud.io/dashboard?id=mediawiki-extensions-Wikibase&branch=619850-6

This patch can still be merged. Please give feedback and report false positives at https://www.mediawiki.org/wiki/Talk:Continuous_integration/Codehealth_Pipeline

**Message 18:** 🤖 8/13/2020, 12:21:21 AM - Verified-1: Main test build failed
**Message 19: امیر سرآبادانی (@ladsgroup)** - 8/13/2020, 12:46:01 AM
Uploaded patch set 7.

**Message 20: SonarQube Bot (@sonarqubebot)** - 8/13/2020, 12:56:56 AM
Patch Set 7:

(8 comments)

❌ Quality gate failed


* ✔ reliability rating
* ✔ security rating
* ✔ maintainability rating
* ❌ coverage (0.0 is less than 80)
* ✔ duplicated lines density

Report: https://sonarcloud.io/dashboard?id=mediawiki-extensions-Wikibase&branch=619850-7

This patch can still be merged. Please give feedback and report false positives at https://www.mediawiki.org/wiki/Talk:Continuous_integration/Codehealth_Pipeline

**Message 21:** 🤖 8/13/2020, 1:08:47 AM - Verified-1: Main test build failed
**Message 22: امیر سرآبادانی (@ladsgroup)** - 8/13/2020, 9:28:35 AM
Uploaded patch set 8.

**Message 23: SonarQube Bot (@sonarqubebot)** - 8/13/2020, 9:39:34 AM
Patch Set 8:

(8 comments)

❌ Quality gate failed


* ✔ reliability rating
* ✔ security rating
* ✔ maintainability rating
* ❌ coverage (0.0 is less than 80)
* ✔ duplicated lines density

Report: https://sonarcloud.io/dashboard?id=mediawiki-extensions-Wikibase&branch=619850-8

This patch can still be merged. Please give feedback and report false positives at https://www.mediawiki.org/wiki/Talk:Continuous_integration/Codehealth_Pipeline

**Message 24:** 🤖 8/13/2020, 9:51:01 AM - Verified+2: Main test build succeeded

[CODE] Patchsets to get build working

**Message 25: Lucas Werkmeister (WMDE) (@lucaswerkmeister-wmde)** - 8/13/2020, 11:29:21 AM
Patch Set 8:

I’m confused – is it intentional that in the lib tests, the path to AddNormalizedTermsTablesDDL.sql is updated, but in the repo tests, that part is dropped completely? (I assume that’s because the new terms tables are now used by default? But since you can still disable them through LocalSettings, shouldn’t the tests still ensure that the terms tables exist even on wikis without new terms tables?)

**Message 26: امیر سرآبادانی (@ladsgroup)** - 8/13/2020, 11:47:28 AM
Patch Set 8:

> Patch Set 8:
> 
> I’m confused – is it intentional that in the lib tests, the path to AddNormalizedTermsTablesDDL.sql is updated, but in the repo tests, that part is dropped completely? (I assume that’s because the new terms tables are now used by default? But since you can still disable them through LocalSettings, shouldn’t the tests still ensure that the terms tables exist even on wikis without new terms tables?)

Your confusion is pretty warranted but it's intentional. Let me explain:
 - The lib tests don't run or test in context of mediawiki, they load up an sqlite instance in memory and run code and check the result, it needs the sql path to use them.
 - The other tests added these loading sql files because back then, we hadn't wired new term store tables with default instances and still we wanted to test these under new term store too. But since then, it has been wired and will be created regardless of your LocalSettings config (in fact these tests change these configs for test purposes to make sure it works both in new and old term store) if you disable it, the tables will be empty but they will be there. So it's not needed anymore.

**Message 27: Lucas Werkmeister (WMDE) (@lucaswerkmeister-wmde)** - 8/17/2020, 10:23:48 AM
Patch Set 8:

Okay, that means that the repo tests part could also be done in a separate change, right? That would make it clearer to me :)

**Message 28: امیر سرآبادانی (@ladsgroup)** - 8/17/2020, 12:07:34 PM
Patch Set 8:

> Patch Set 8:
> 
> Okay, that means that the repo tests part could also be done in a separate change, right? That would make it clearer to me :)

Yeah, it sorta grew organically, I need to update them, I thought if they are not there, I wouldn't need to update them :D I will fix it.

[CODE] Expert feedback
[THEME] Feedback cycle

**Message 29: امیر سرآبادانی (@ladsgroup)** - 8/17/2020, 12:36:57 PM
Uploaded patch set 9.

**Message 30: SonarQube Bot (@sonarqubebot)** - 8/17/2020, 12:47:01 PM
Patch Set 9:

(8 comments)

❌ Quality gate failed


* ✔ reliability rating
* ✔ security rating
* ✔ maintainability rating
* ❌ coverage (0.0 is less than 80)
* ✔ duplicated lines density

Report: https://sonarcloud.io/dashboard?id=mediawiki-extensions-Wikibase&branch=619850-9

This patch can still be merged. Please give feedback and report false positives at https://www.mediawiki.org/wiki/Talk:Continuous_integration/Codehealth_Pipeline

**Message 31:** 🤖 8/17/2020, 12:58:24 PM - Verified+2: Main test build succeeded (11 jobs)
**Message 32: Lucas Werkmeister (WMDE) (@lucaswerkmeister-wmde)** - 8/18/2020, 10:23:15 AM
Patch Set 9:

(1 comment)

just one nitpick

> **Inline Comments (1):**
>
> **repo/tests/phpunit/includes/Store/Sql/Terms/DatabaseTermsCollisionDetectorTest.php:85** - Lucas Werkmeister (WMDE)
> extra slash here
>

[CODE] Expert nit
[THEME] Feedback cycle

**Message 33: امیر سرآبادانی (@ladsgroup)** - 8/18/2020, 10:36:08 AM
Uploaded patch set 10.

**Message 34: امیر سرآبادانی (@ladsgroup)** - 8/18/2020, 10:36:14 AM
Patch Set 10:

(1 comment)

> **Inline Comments (1):**
>
> **repo/tests/phpunit/includes/Store/Sql/Terms/DatabaseTermsCollisionDetectorTest.php:85** - Ladsgroup
> Done
>

**Message 35: SonarQube Bot (@sonarqubebot)** - 8/18/2020, 10:53:33 AM
Patch Set 10:

(8 comments)

❌ Quality gate failed


* ✔ reliability rating
* ✔ security rating
* ✔ maintainability rating
* ❌ coverage (0.0 is less than 80)
* ✔ duplicated lines density

Report: https://sonarcloud.io/dashboard?id=mediawiki-extensions-Wikibase&branch=619850-10

This patch can still be merged. Please give feedback and report false positives at https://www.mediawiki.org/wiki/Talk:Continuous_integration/Codehealth_Pipeline

**Message 36:** 🤖 8/18/2020, 10:59:04 AM - Verified+2: Main test build succeeded (11 jobs)
**Message 37: Lucas Werkmeister (WMDE) (@lucaswerkmeister-wmde)** - 8/18/2020, 2:42:52 PM
Patch Set 10: Code-Review+2

**Message 38:** 🤖 8/18/2020, 2:43:11 PM - -Verified: Starting gate
**Message 39:** 🤖 8/18/2020, 3:30:44 PM - Verified+2: Gate pipeline (13 jobs)
**Message 40:** 🤖 8/18/2020, 3:30:44 PM - Change has been successfully merged by j...
**Message 41:** 🤖 8/18/2020, 4:09:37 PM - Post-: Post-merge build succeeded. (3 jobs)

## Review 3: 443001 - Enable smater logging for wdqs

- **URL:** https://gerrit.wikimedia.org/r/c/443001
- **Author:** Smalyshev (@smalyshev) <smalyshev@gmail.com>
- **Project:** operations/puppet
- **Branch:** production
- **Status:** MERGED
- **Created:** 2018-06-28 23:10:12.000000000
- **Updated:** 2018-07-02 17:17:39.000000000

**Commit Message:**

```
Enable smater logging for wdqs

Do not log stack traces for frequent flyer exceptions and log less
of the stack for others.
Requires Blazegraph patch due to new Janino depenency.

Bug: T197645
Change-Id: Ic82518834287fe18a2918af019f9d8cd597ff056
Depends-On: Ie669809f36ecb8b681bb0c05c80050c0b4f8f91d
```

**Messages:** 22
**Inline Comments:** 6

**Message 1: Smalyshev (@smalyshev)** - 6/28/2018, 11:10:12 PM
Uploaded patch set 1.

**Message 2:** 🤖 6/28/2018, 11:10:43 PM - Verified-1: Main test build failed
**Message 3: Smalyshev (@smalyshev)** - 6/28/2018, 11:11:41 PM
Uploaded patch set 2.

**Message 4:** 🤖 6/28/2018, 11:12:09 PM - Verified+2: Main test build succeeded
**Message 5: Smalyshev (@smalyshev)** - 6/29/2018, 4:41:34 AM
Patch Set 2:

(1 comment)

> **Inline Comments (1):**
>
> **modules/wdqs/manifests/init.pp:136** - Smalyshev
> not sure 1 is necessary here anymore since most verbose ones are to be excluded anyway... but we can change it if it's not good
>

[CODE] Expert feedback

**Message 6: Gehel (@gehel)** - 6/29/2018, 9:23:17 AM
Patch Set 2:

(3 comments)

> **Inline Comments (3):**
>
> **modules/wdqs/manifests/init.pp:136** - Gehel
> I'm wondering if a single line of stacktrace is sufficient to understand the issue. I think it is safer to start by removing all the large stack traces in a first step.
>
> **modules/wdqs/manifests/logback_config.pp:2** - Gehel
> We should take this opportunity to add parameter constraints on this defined type: https://puppet.com/docs/puppet/5.4/lang_data_type.html
>
> **modules/wdqs/manifests/logback_config.pp:4** - Gehel
> We should probably make `$pattern` a mandatory parameter and move the pattern definition to the caller.
>

[CODE] Expert feedback

**Message 7: Gehel (@gehel)** - 6/29/2018, 9:35:37 AM
Uploaded patch set 3.


[CODE] Expert feedback
[THEME] Feedback cycle

**Message 8:** 🤖 6/29/2018, 9:36:08 AM - Verified-1: Main test build failed
**Message 9: Gehel (@gehel)** - 6/29/2018, 9:36:15 AM
Patch Set 3:

(2 comments)

> **Inline Comments (2):**
>
> **modules/wdqs/manifests/logback_config.pp:2** - Gehel
> Done
>
> **modules/wdqs/manifests/logback_config.pp:4** - Gehel
> Done
>

**Message 10: Gehel (@gehel)** - 6/29/2018, 9:42:40 AM
Uploaded patch set 4.

**Message 11:** 🤖 6/29/2018, 9:43:23 AM - Verified-1: Main test build failed
**Message 12: Gehel (@gehel)** - 6/29/2018, 9:46:40 AM
Patch Set 4:

puppet compiler looks happy: https://puppet-compiler.wmflabs.org/compiler02/11616/

We just need to decide on keeping just 1 line of stacktrace or more.

**Message 13: Gehel (@gehel)** - 6/29/2018, 9:48:10 AM
Uploaded patch set 5.

**Message 14:** 🤖 6/29/2018, 9:48:43 AM - Verified+2: Main test build succeeded
**Message 15: Smalyshev (@smalyshev)** - 6/29/2018, 6:40:16 PM
Patch Set 5: Code-Review+1

**Message 16: Gehel (@gehel)** - 7/2/2018, 12:47:54 PM
Patch Set 5: Code-Review-1

Looks good, but we need to wait for the next release of WDQS which will include janino.

[CODE] Delay for dependency release

**Message 17: Gehel (@gehel)** - 7/2/2018, 5:08:25 PM
Patch Set 6: Patch Set 5 was rebased

**Message 18:** 🤖 7/2/2018, 5:08:59 PM - Verified+2: Main test build succeeded
**Message 19: Gehel (@gehel)** - 7/2/2018, 5:11:23 PM
Patch Set 6: Code-Review+2

**Message 20: Gehel (@gehel)** - 7/2/2018, 5:11:51 PM
Patch Set 7: Patch Set 6 was rebased

**Message 21:** 🤖 7/2/2018, 5:12:20 PM - Verified+2: Main test build succeeded
**Message 22: Gehel (@gehel)** - 7/2/2018, 5:17:39 PM
Change has been successfully merged by Gehel


## Review 4: 267196 - KafkaHandler: allow customizing timeouts

- **URL:** https://gerrit.wikimedia.org/r/c/267196
- **Author:** MaxSem (@maxsem) <maxsem.wiki@gmail.com>
- **Project:** mediawiki/core
- **Branch:** master
- **Status:** MERGED
- **Created:** 2016-01-29 00:23:57.000000000
- **Updated:** 2016-01-29 19:36:00.000000000

[CODE] "it will not respect the timeout you pass it from the invokation." noticed bug
[CODE] This change seems to have come out of investigation, not initially proposed


**Commit Message:**

```
KafkaHandler: allow customizing timeouts

Bug: T125084
Change-Id: I8f01fa61d916aeaa831a84e12b6fae08d04ca046
```

**Messages:** 12
**Inline Comments:** 1

**Message 1: MaxSem (@maxsem)** - 1/29/2016, 12:23:57 AM
Uploaded patch set 1.

**Message 2:** 🤖 1/29/2016, 12:28:19 AM - Verified-1: Main test build failed
**Message 3: MaxSem (@maxsem)** - 1/29/2016, 12:30:15 AM
Uploaded patch set 2.

**Message 4:** 🤖 1/29/2016, 12:35:04 AM - Verified+2: Main test build succeeded
**Message 5: Ebernhardson (@ebernhardson)** - 1/29/2016, 1:42:11 AM
Patch Set 2:

(1 comment)

minor suggestion, but overall looks good. thanks!

> **Inline Comments (1):**
>
> **includes/debug/logger/monolog/KafkaHandler.php:105** - Ebernhardson
> i doubt we would ever have a good reason to have a timeout >= 1s. How about we only support usec, name the option sendTimeoutUSec
>


[CODE] Expert feedback

**Message 6: MaxSem (@maxsem)** - 1/29/2016, 2:01:22 AM
Uploaded patch set 3.

[THEME] Feedback cycle

**Message 7:** 🤖 1/29/2016, 2:05:49 AM - Verified+2: Main test build succeeded
**Message 8: Ebernhardson (@ebernhardson)** - 1/29/2016, 7:00:42 PM
Patch Set 3: Code-Review+2

**Message 9:** 🤖 1/29/2016, 7:01:08 PM - -Verified: Starting gate
**Message 10:** 🤖 1/29/2016, 7:16:03 PM - Verified+2: Gate pipeline
**Message 11:** 🤖 1/29/2016, 7:16:05 PM - Change has been successfully merged into...
**Message 12:** 🤖 1/29/2016, 7:36:00 PM - Post-: Post-merge build succeeded.

## Review 5: 609571 - Depool eqsin

- **URL:** https://gerrit.wikimedia.org/r/c/609571
- **Author:** joe (@oblivian) <glavagetto@wikimedia.org>
- **Project:** operations/dns
- **Branch:** master
- **Status:** MERGED
- **Created:** 2020-07-05 11:35:08.000000000
- **Updated:** 2020-07-06 07:44:26.000000000

**Commit Message:**

```
Depool eqsin

To work on restoring cr3-eqsin.

Change-Id: Ia3ab069cd8c05ffda5b6862c02eb65535a99536f
Bug: T257154
```

**Messages:** 7
**Inline Comments:** 0

**Message 1: joe (@oblivian)** - 7/5/2020, 11:35:08 AM
Uploaded patch set 1.

**Message 2:** 🤖 7/5/2020, 11:35:35 AM - Verified+2: Main test build succeeded
**Message 3: Arzhel (@ayounsi)** - 7/6/2020, 5:47:02 AM
Patch Set 2: Commit message was updated.

**Message 4:** 🤖 7/6/2020, 5:47:29 AM - Verified+2: Main test build succeeded
**Message 5: Arzhel (@ayounsi)** - 7/6/2020, 6:54:35 AM
Patch Set 2: Code-Review+2

**Message 6: Arzhel (@ayounsi)** - 7/6/2020, 6:54:46 AM
Change has been successfully merged by Ayounsi

**Message 7: Arzhel (@ayounsi)** - 7/6/2020, 7:44:26 AM
Created a revert of this change as I344f99f851c63862f09b26e3ef586999ed64c5c6


## Review 6: 865023 - gerrit: raise H2 compaction time

- **URL:** https://gerrit.wikimedia.org/r/c/865023
- **Author:** Antoine Musso (@hashar) <hashar@free.fr>
- **Project:** operations/puppet
- **Branch:** production
- **Status:** MERGED
- **Created:** 2022-12-06 08:13:50.000000000
- **Updated:** 2022-12-09 15:32:15.000000000

**Commit Message:**

```
gerrit: raise H2 compaction time

For caches backed up by a disk, Gerrit uses the H2 Database. It is also
used to keep track of files that have been reviewed in
`account_patch_reviews.h2.db`.

When doing the Gerrit 3.4 > 3.5 upgrade, the online reindexing of all
changes caused some entries to be added to two of the largest caches
`gerrit_file_diff` (8G) and `git_file_diff` (11G). That has lead to the
disk (40G) filling up entirely and turned the maintenance window to an
outage.

The disk size reported by Gerrit were respectively 157M and 158M which
has lead me to believe the files were not vacuumed to reclaim freed data
blocks. A gzip of one of the file yields a 32MBytes archive, a good
indication the large files are mostly empty.

We have most probably been carrying out the caches from a server to
another one since we first installed Gerrit (2010?). The H2 databases
are compacted upon disconnection and only allows a 200 milliseconds
window for that. That is not enough.

We can allocate 15 seconds (15 000 milliseconds) to the driver by
passing to the jdbc URL `;MAX_COMPACT_TIME`. The URL is in the Gerrit
java code and not configurable though. I found out H2 looks up settings
down to system properties in camel case. Thus the equivalent of
`MAX_COMPACT_TIME` is the property `h2.maxCompactTime`.

To activate the setting, the Gerrit JVM will have to be restarted. Upon
the next restart, H2 should then further compact the files.

NOTE: Gerrit currently takes a long time to shutdown and ends up being
SIGKILL by systemd after 90 seconds. It is a different problem though.

Bug: T323754
Hosts: O:gerrit
Change-Id: I0b141bcbf509d8e5e0614d14d3b817afbe25a0a1
```

**Messages:** 7
**Inline Comments:** 3

**Message 1: Antoine Musso (@hashar)** - 12/6/2022, 8:13:50 AM
Uploaded patch set 1.

**Message 2:** 🤖 12/6/2022, 8:16:39 AM - Verified+2: Main test build succeeded (1 job)
**Message 3: Antoine Musso (@hashar)** - 12/6/2022, 8:17:24 AM
Patch Set 1:

(1 comment)

> **Inline Comments (1):**
>
> **Patchset:** - Hashar
> This follow up Gerrit disk being filed up when doing the 3.4 > 3.5 upgrade. I have provided a summary of my rational in the commit message, there are additional details on the task at T323754.
> 
> Once merged in Puppet, we will have to restart Gerrit once to have it taken in account and a second time to have the compaction triggered with the new 15 seconds window.   Gerrit typically restarts in a minute or so.
>

[CODE] Incident context

**Message 4: Daniel Zahn (@dzahn)** - 12/6/2022, 6:23:28 PM
Patch Set 1:

(1 comment)

> **Inline Comments (1):**
>
> **Patchset:** - Dzahn
> Hi Antoine, how about this. I just merge this and you can do the restarts, using your privileges as gerrit-root member, at a time that is convenient for you. Would that be fine?
>

[CODE] Communication of deploy strategy as a result of the evolutoin

**Message 5: Daniel Zahn (@dzahn)** - 12/7/2022, 9:22:39 PM
Patch Set 1: Code-Review+2

**Message 6: Daniel Zahn (@dzahn)** - 12/7/2022, 9:22:42 PM
Change has been successfully rebased and submitted as 7f6215e039d90840f4617c1e8278e1dd51abf2ea

**Message 7: Antoine Musso (@hashar)** - 12/9/2022, 3:32:15 PM
Patch Set 2:

(1 comment)

> **Inline Comments (1):**
>
> **Patchset:** - Hashar
> I have restarted Gerrit twice and confirmed it has fixed the issue. The H2 database files have been compacted successfully T323754#8454316
>


## Review 7: 619555 - Reorganize client schema scripts

- **URL:** https://gerrit.wikimedia.org/r/c/619555
- **Author:** امیر سرآبادانی (@ladsgroup) <Ladsgroup@gmail.com>
- **Project:** mediawiki/extensions/Wikibase
- **Branch:** master
- **Status:** MERGED
- **Created:** 2020-08-11 19:38:58.000000000
- **Updated:** 2020-08-18 15:49:31.000000000

**Commit Message:**

```
Reorganize client schema scripts

Basically making it similar to core:
 - Let's have one place for table(s) WikibaseClient registers and its
   current schema.
 - Let's move all archives to a dedicated directory to avoid cluttering
   the schema and the file that matters (current schema).
 - Let's split sql files based on their db type, this would allow us in
   near future take advantage of abstract schema and schema changes (T191231)
   This would also paves the way on adding Postgres support.

Bug: T205094
Change-Id: I0f8644d3050827fc447ae933fab757b911dd1138
```

**Messages:** 19
**Inline Comments:** 3

**Message 1: امیر سرآبادانی (@ladsgroup)** - 8/11/2020, 7:38:58 PM
Uploaded patch set 1.

**Message 2: امیر سرآبادانی (@ladsgroup)** - 8/11/2020, 7:48:38 PM
Uploaded patch set 2.

**Message 3: امیر سرآبادانی (@ladsgroup)** - 8/11/2020, 7:54:39 PM
Uploaded patch set 3.

**Message 4: امیر سرآبادانی (@ladsgroup)** - 8/11/2020, 7:59:21 PM
Patch Set 3:

If client looks okay to you, I'd move to repo but let's have a shared understanding of db schema updates first.

**Message 5: SonarQube Bot (@sonarqubebot)** - 8/11/2020, 8:03:46 PM
Patch Set 3:

❌ Quality gate failed


* ✔ reliability rating
* ✔ security rating
* ✔ maintainability rating
* ❌ coverage (0.0 is less than 80)
* ✔ duplicated lines density

Report: https://sonarcloud.io/dashboard?id=mediawiki-extensions-Wikibase&branch=619555-3

This patch can still be merged. Please give feedback and report false positives at https://www.mediawiki.org/wiki/Talk:Continuous_integration/Codehealth_Pipeline

**Message 6:** 🤖 8/11/2020, 8:13:38 PM - Verified+2: Main test build succeeded
**Message 7: Lucas Werkmeister (WMDE) (@lucaswerkmeister-wmde)** - 8/12/2020, 10:23:52 AM
Patch Set 3: Code-Review+1

Looks good to me, suggested a minor improvement at I5411ffeef3.

**Message 8: Michael Große (@migr)** - 8/12/2020, 3:10:18 PM
Patch Set 3:

(1 comment)

> **Inline Comments (1):**
>
> **client/includes/Usage/Sql/SqlUsageTrackerSchemaUpdater.php:98** - Michael Große
> I'm surprised that phpcs (or phan?) is not complaining about this missing trailing comma?
>

**Message 9: امیر سرآبادانی (@ladsgroup)** - 8/12/2020, 3:22:31 PM
Patch Set 3:

(1 comment)

> **Inline Comments (1):**
>
> **client/includes/Usage/Sql/SqlUsageTrackerSchemaUpdater.php:98** - Ladsgroup
> trailing comma would make sense for cases that's going to increase in future but this one is not going to have new members added to it later. For example adding such think would break js and json. It's rather style IMO
>

**Message 10: Lucas Werkmeister (WMDE) (@lucaswerkmeister-wmde)** - 8/12/2020, 3:42:12 PM
Patch Set 3:

(1 comment)

> **Inline Comments (1):**
>
> **client/includes/Usage/Sql/SqlUsageTrackerSchemaUpdater.php:98** - Lucas Werkmeister (WMDE)
> Personally, I’m now in the camp of “just always add the trailing comma, even if we think there will never be another element”, but yes, that’s why it’s not a phpcs rule at the moment. (I seem to remember a discussion with Thiemo about this, probably somewhere on Gerrit, but I have no idea how to find that now.)
> 
> (That said, JavaScript has allowed trailing commas in arrays for ages. It’s only JSON that objects.)
>

**Message 11: Lucas Werkmeister (WMDE) (@lucaswerkmeister-wmde)** - 8/17/2020, 10:24:25 AM
Patch Set 3:

If nobody else objects (or +2s), I’ll try to merge this tomorrow (after the branch cut).

**Message 12: امیر سرآبادانی (@ladsgroup)** - 8/18/2020, 10:36:08 AM
Uploaded patch set 4: Patch Set 3 was rebased.

**Message 13: SonarQube Bot (@sonarqubebot)** - 8/18/2020, 10:52:18 AM
Patch Set 4:

❌ Quality gate failed


* ✔ reliability rating
* ✔ security rating
* ✔ maintainability rating
* ❌ coverage (0.0 is less than 80)
* ✔ duplicated lines density

Report: https://sonarcloud.io/dashboard?id=mediawiki-extensions-Wikibase&branch=619555-4

This patch can still be merged. Please give feedback and report false positives at https://www.mediawiki.org/wiki/Talk:Continuous_integration/Codehealth_Pipeline

**Message 14:** 🤖 8/18/2020, 10:59:09 AM - Verified+2: Main test build succeeded (11 jobs)
**Message 15: Lucas Werkmeister (WMDE) (@lucaswerkmeister-wmde)** - 8/18/2020, 2:43:03 PM
Patch Set 4: Code-Review+2

**Message 16:** 🤖 8/18/2020, 2:43:09 PM - -Verified: Starting gate
**Message 17:** 🤖 8/18/2020, 3:30:37 PM - Verified+2: Gate pipeline (13 jobs)
**Message 18:** 🤖 8/18/2020, 3:30:37 PM - Change has been successfully merged by j...
**Message 19:** 🤖 8/18/2020, 3:49:31 PM - Post-: Post-merge build succeeded. (3 jobs)

## Review 8: 547283 - check_private_data: ignore comments on private.dblist

- **URL:** https://gerrit.wikimedia.org/r/c/547283
- **Author:** Jaime Crespo (@jynus) <jcrespo@wikimedia.org>
- **Project:** operations/puppet
- **Branch:** production
- **Status:** MERGED
- **Created:** 2019-10-30 19:12:20.000000000
- **Updated:** 2019-11-04 15:28:53.000000000

**Commit Message:**

```
check_private_data: ignore comments on private.dblist

Because of the following mediawiki-config change:

https://gerrit.wikimedia.org/r/c/operations/mediawiki-config/+/545411

private.dblist may now contain comments. Ignore those
on load.

Bug: T223602
Change-Id: I8eee99394379b265a993bf7b4d02dbf5abb643c0
```

**Messages:** 27
**Inline Comments:** 0

**Message 1: Jaime Crespo (@jynus)** - 10/30/2019, 7:12:20 PM
Uploaded patch set 1.

**Message 2:** 🤖 10/30/2019, 7:14:25 PM - Verified-1: Main test build failed
**Message 3: Jaime Crespo (@jynus)** - 10/30/2019, 7:16:20 PM
Uploaded patch set 2.

**Message 4: Jaime Crespo (@jynus)** - 10/30/2019, 7:16:56 PM
Patch Set 2:

I thought lstrip was a global function? Mixing PHP maybe?

**Message 5: Jaime Crespo (@jynus)** - 10/30/2019, 7:17:34 PM
Topic backups removed

**Message 6: Jaime Crespo (@jynus)** - 10/30/2019, 7:17:44 PM
Topic set to labs-filtering

**Message 7: Jaime Crespo (@jynus)** - 10/30/2019, 7:18:27 PM
Topic labs-filtering removed

**Message 8:** 🤖 10/30/2019, 7:18:30 PM - Verified+2: Main test build succeeded
**Message 9: Jaime Crespo (@jynus)** - 10/30/2019, 7:18:36 PM
Topic set to wikireplicas-filtering

**Message 10: Jdforrester (🙄) (@jforrester)** - 10/30/2019, 7:49:59 PM
Patch Set 2: Code-Review+1

**Message 11: Bryan Davis 🦄 (@bd808)** - 10/30/2019, 8:11:26 PM
Patch Set 2: Code-Review+1

Should work well for skipping full line comments

**Message 12: Jaime Crespo (@jynus)** - 10/31/2019, 6:55:39 AM
Patch Set 2:

> Patch Set 2: Code-Review+1
> 
> Should work well for skipping full line comments

Question: are in-line comments allowed now? Should we skip tabs or other special characters? Where is documented a well-formed dblist to parse it correctly?

**Message 13: Jdforrester (🙄) (@jforrester)** - 10/31/2019, 3:45:14 PM
Patch Set 2:

> Patch Set 2:
> 
> > Patch Set 2: Code-Review+1
> > 
> > Should work well for skipping full line comments
> 
> Question: are in-line comments allowed now?

Yes, they've always been allowed, but there aren't any uses of this right now.

> Should we skip tabs or other special characters? Where is documented a well-formed dblist to parse it correctly?

You must be new here if you think config hacks have documentation. ;-) 

https://gerrit.wikimedia.org/r/plugins/gitiles/operations/mediawiki-config/+/master/multiversion/MWWikiversions.php#77

Blank lines are allowed (and ignored); lines with a "#" in them are trimmed to before the "#"; lines with "%%"s in them used in "real" code paths and not pre-generated will throw errors.

**Message 14: Jaime Crespo (@jynus)** - 10/31/2019, 4:05:58 PM
Patch Set 2:

> Patch Set 2:
> 
> > Patch Set 2:
> > 
> > > Patch Set 2: Code-Review+1
> > > 
> > > Should work well for skipping full line comments
> > 
> > Question: are in-line comments allowed now?
> 
> Yes, they've always been allowed, but there aren't any uses of this right now.
> 
> > Should we skip tabs or other special characters? Where is documented a well-formed dblist to parse it correctly?
> 
> You must be new here if you think config hacks have documentation. ;-) 
> 
> https://gerrit.wikimedia.org/r/plugins/gitiles/operations/mediawiki-config/+/master/multiversion/MWWikiversions.php#77
> 
> Blank lines are allowed (and ignored); lines with a "#" in them are trimmed to before the "#"; lines with "%%"s in them used in "real" code paths and not pre-generated will throw errors.

For me MWWikiversions.php#77 is enough documentation :-)). Thank for the link- please give me some time to patch that too.

**Message 15: Jaime Crespo (@jynus)** - 10/31/2019, 4:06:08 PM
Patch Set 2: Code-Review-1

**Message 16: Jaime Crespo (@jynus)** - 11/4/2019, 3:05:58 PM
Uploaded patch set 3.

**Message 17:** 🤖 11/4/2019, 3:07:59 PM - Verified+2: Main test build succeeded
**Message 18: Jaime Crespo (@jynus)** - 11/4/2019, 3:08:24 PM
Patch Set 3:

Please re-vote, I will merge and we can test it live also with the T235743 change, before and after filtering.

**Message 19: Jdforrester (🙄) (@jforrester)** - 11/4/2019, 3:21:26 PM
Patch Set 3: Code-Review+1

**Message 20: Bryan Davis 🦄 (@bd808)** - 11/4/2019, 3:23:57 PM
Patch Set 3: Code-Review+1

**Message 21: Jaime Crespo (@jynus)** - 11/4/2019, 3:26:37 PM
Uploaded patch set 4.

**Message 22: Jaime Crespo (@jynus)** - 11/4/2019, 3:27:23 PM
Topic backups removed

**Message 23: Jdforrester (🙄) (@jforrester)** - 11/4/2019, 3:27:30 PM
Patch Set 4: Code-Review+1

**Message 24: Jaime Crespo (@jynus)** - 11/4/2019, 3:27:33 PM
Topic set to wikireplica-filters

**Message 25: Jaime Crespo (@jynus)** - 11/4/2019, 3:28:19 PM
Patch Set 4: Code-Review+2

**Message 26:** 🤖 11/4/2019, 3:28:39 PM - Verified+2: Main test build succeeded
**Message 27: Jaime Crespo (@jynus)** - 11/4/2019, 3:28:53 PM
Change has been successfully merged by Jcrespo


## Review 9: 269561 - Clean up phabricator roles in puppet to remove tag pinning.

- **URL:** https://gerrit.wikimedia.org/r/c/269561
- **Author:** Mukunda Modell (@twentyafterfour) <mmodell@wikimedia.org>
- **Project:** operations/puppet
- **Branch:** production
- **Status:** MERGED
- **Created:** 2016-02-09 23:39:13.000000000
- **Updated:** 2016-03-03 01:17:52.000000000

**Commit Message:**

```
Clean up phabricator roles in puppet to remove tag pinning.

Phabricator is now deployed with scap3, puppet should not
manage the checked out tags on phabricator and related repos.

Bug: T125851
Change-Id: I0bdf3266c85883871e6f9417a1ca77cc317c5906
```

**Messages:** 39
**Inline Comments:** 0

**Message 1: Mukunda Modell (@twentyafterfour)** - 2/9/2016, 11:39:13 PM
Uploaded patch set 1.

**Message 2:** 🤖 2/9/2016, 11:41:09 PM - Verified+2: Main test build succeeded
**Message 3: Mukunda Modell (@twentyafterfour)** - 2/11/2016, 8:04:25 AM
Uploaded patch set 2.

**Message 4:** 🤖 2/11/2016, 8:04:56 AM - Verified-1: Merge Failed.
**Message 5: Mukunda Modell (@twentyafterfour)** - 2/11/2016, 8:12:08 AM
Patch Set 3: Patch Set 2 was rebased

**Message 6:** 🤖 2/11/2016, 8:13:32 AM - Verified+2: Main test build succeeded
**Message 7: Mukunda Modell (@twentyafterfour)** - 2/11/2016, 8:26:02 AM
Uploaded patch set 4.

**Message 8:** 🤖 2/11/2016, 8:28:14 AM - Verified+2: Main test build succeeded
**Message 9: Mukunda Modell (@twentyafterfour)** - 2/11/2016, 8:33:48 AM
Uploaded patch set 5.

**Message 10:** 🤖 2/11/2016, 8:35:13 AM - Verified+2: Main test build succeeded
**Message 11: Mukunda Modell (@twentyafterfour)** - 2/11/2016, 8:39:56 AM
Uploaded patch set 6.

**Message 12:** 🤖 2/11/2016, 8:41:27 AM - Verified+2: Main test build succeeded
**Message 13: Mukunda Modell (@twentyafterfour)** - 2/11/2016, 8:50:02 AM
Uploaded patch set 7.

**Message 14:** 🤖 2/11/2016, 8:51:52 AM - Verified+2: Main test build succeeded
**Message 15: Mukunda Modell (@twentyafterfour)** - 2/11/2016, 10:06:01 AM
Patch Set 7: Code-Review+1

This is fairly thoroughly tested on phab-scap.phabricator.eqiad.wmflabs using deploy.phabricator.eqiad.wmflabs as a puppet master and scap master

**Message 16: Mukunda Modell (@twentyafterfour)** - 2/11/2016, 10:43:06 AM
Uploaded patch set 8.

**Message 17:** 🤖 2/11/2016, 10:44:52 AM - Verified+2: Main test build succeeded
**Message 18: Mukunda Modell (@twentyafterfour)** - 2/11/2016, 10:53:10 AM
Uploaded patch set 9.

**Message 19:** 🤖 2/11/2016, 10:55:32 AM - Verified+2: Main test build succeeded
**Message 20: Mukunda Modell (@twentyafterfour)** - 2/15/2016, 3:27:30 PM
Uploaded patch set 10.

**Message 21:** 🤖 2/15/2016, 3:29:06 PM - Verified+2: Main test build succeeded
**Message 22: BBlack (@bblack)** - 2/17/2016, 11:44:46 PM
Patch Set 10:

There seems to be things in here unrelated to the commitmsg, e.g. the creation of the phab-ssh.service systemd service unit file?  Was this just unpuppetized on the host before?

**Message 23: Mukunda Modell (@twentyafterfour)** - 3/2/2016, 8:39:39 PM
Patch Set 10:

bblack: I removed the unrelated changes. Trying to push the new patch but gerrit is currently rejecting my changes

**Message 24: Mukunda Modell (@twentyafterfour)** - 3/2/2016, 9:10:53 PM
Uploaded patch set 11.

**Message 25: Mukunda Modell (@twentyafterfour)** - 3/2/2016, 9:11:39 PM
Patch Set 11: Code-Review+1

ok I finally got this to rebase cleanly

**Message 26:** 🤖 3/2/2016, 9:11:55 PM - Verified+2: Main test build succeeded
**Message 27: Mukunda Modell (@twentyafterfour)** - 3/2/2016, 9:20:05 PM
Patch Set 11:

creation of "phab-ssh.service systemd service unit file" has been moved to a separate changeset ( https://gerrit.wikimedia.org/r/#/c/274488/1 )

**Message 28: Daniel Zahn (@dzahn)** - 3/2/2016, 9:23:22 PM
Patch Set 11:

thanks, i'm willing to merge this so it can happen during the maintenance period today. just one nitpick, rename the deployment keys to something more generic, so it's obvious they are not your personal ones but shared

**Message 29: Mukunda Modell (@twentyafterfour)** - 3/2/2016, 9:25:34 PM
Uploaded patch set 12.

**Message 30: Mukunda Modell (@twentyafterfour)** - 3/2/2016, 9:26:23 PM
Patch Set 12: Code-Review+1

Done

**Message 31:** 🤖 3/2/2016, 9:26:49 PM - Verified+2: Main test build succeeded
**Message 32: Mukunda Modell (@twentyafterfour)** - 3/2/2016, 9:27:45 PM
Patch Set 12:

someone with root will need to place the private key in ops/private to enable scap3 deployments

**Message 33: Daniel Zahn (@dzahn)** - 3/2/2016, 9:31:17 PM
Patch Set 12: Code-Review+1

**Message 34: Daniel Zahn (@dzahn)** - 3/2/2016, 9:55:56 PM
Patch Set 12:

i added the private key in the private repo on the puppetmaster, as modules/secret/secrets/phabricator/phab_deploy_private_key

**Message 35: Mukunda Modell (@twentyafterfour)** - 3/3/2016, 12:56:36 AM
Patch Set 13: Patch Set 12 was rebased

**Message 36:** 🤖 3/3/2016, 12:58:28 AM - Verified+2: Main test build succeeded
**Message 37: Daniel Zahn (@dzahn)** - 3/3/2016, 1:13:46 AM
Patch Set 13: Code-Review+2

**Message 38: Daniel Zahn (@dzahn)** - 3/3/2016, 1:13:48 AM
Change has been successfully merged into the git repository.

**Message 39:** 🤖 3/3/2016, 1:17:52 AM - Post-: Post-merge build succeeded.

## Review 10: 513105 - nfs-exportd: if auth errors happen, do not proceed

- **URL:** https://gerrit.wikimedia.org/r/c/513105
- **Author:** Bstorm (@bstorm) <bastorm@pm.me>
- **Project:** operations/puppet
- **Branch:** production
- **Status:** MERGED
- **Created:** 2019-05-29 12:45:42.000000000
- **Updated:** 2019-05-29 12:49:02.000000000

**Commit Message:**

```
nfs-exportd: if auth errors happen, do not proceed

It is safer to die (which will alert us eventually), than to blow away
all nfs exports by mistake.

Change-Id: I26fde16083f34d6c14e3945533c31cb89502549e
```

**Messages:** 6
**Inline Comments:** 0

**Message 1: Bstorm (@bstorm)** - 5/29/2019, 12:45:42 PM
Uploaded patch set 1.

**Message 2:** 🤖 5/29/2019, 12:46:21 PM - Verified+2: Main test build succeeded
**Message 3: Arturo Borrero Gonzalez (@aborrero)** - 5/29/2019, 12:48:00 PM
Patch Set 1: Code-Review+1

**Message 4: Andrew Bogott (@andrew)** - 5/29/2019, 12:48:49 PM
Patch Set 1: Code-Review+1

**Message 5: Bstorm (@bstorm)** - 5/29/2019, 12:48:58 PM
Patch Set 1: Code-Review+2

**Message 6: Bstorm (@bstorm)** - 5/29/2019, 12:49:02 PM
Change has been successfully merged by Bstorm


## Review 11: 448022 - Make wikibase-entityid catch EntityIdParsingExceptions

- **URL:** https://gerrit.wikimedia.org/r/c/448022
- **Author:** Addshore 💡🐛 (@addshore) <addshorewiki@gmail.com>
- **Project:** mediawiki/extensions/Wikibase
- **Branch:** master
- **Status:** MERGED
- **Created:** 2018-07-26 11:21:33.000000000
- **Updated:** 2018-07-26 12:34:13.000000000

**Commit Message:**

```
Make wikibase-entityid catch EntityIdParsingExceptions

DataValueDeserializer::__construct docs have been udpated to state
that builders should only really throw InvalidArgumentExceptions

The wikibase-entityid builder now catches the EntityIdParsingException
that was bubbeling up and re throws a InvalidArgumentException, this is
then re thrown as a DeserializationException which is handeled by
SetClaim.

Bug: T200340
Change-Id: Iff73346eeb43a2f39dd1c92271bff48ef64ecbe9
```

**Messages:** 10
**Inline Comments:** 0

**Message 1: Addshore 💡🐛 (@addshore)** - 7/26/2018, 11:21:33 AM
Uploaded patch set 1.

**Message 2:** 🤖 7/26/2018, 11:32:49 AM - Verified-1: Main test build failed
**Message 3: Addshore 💡🐛 (@addshore)** - 7/26/2018, 11:47:05 AM
Uploaded patch set 2.

**Message 4: WMDE-leszek (@wmde-leszek)** - 7/26/2018, 11:57:40 AM
Patch Set 2: Code-Review+1

**Message 5: Jonas Kress (WMDE) (@jk)** - 7/26/2018, 12:11:19 PM
Patch Set 2: Code-Review+2

**Message 6:** 🤖 7/26/2018, 12:11:25 PM - Starting: Starting gate
**Message 7:** 🤖 7/26/2018, 12:17:25 PM - Verified+2: Main test build succeeded
**Message 8:** 🤖 7/26/2018, 12:33:00 PM - Gate: Gate pipeline
**Message 9:** 🤖 7/26/2018, 12:33:00 PM - Change has been successfully merged by j...
**Message 10:** 🤖 7/26/2018, 12:34:13 PM - Post-: Post-merge build succeeded.

## Review 12: 243176 - Varnish: Add lint:ignore:quoted_booleans around a boolean that needs quoting.

- **URL:** https://gerrit.wikimedia.org/r/c/243176
- **Author:** Andrew Bogott (@andrew) <abogott@wikimedia.org>
- **Project:** operations/puppet
- **Branch:** production
- **Status:** MERGED
- **Created:** 2015-10-02 13:44:42.000000000
- **Updated:** 2015-10-02 13:55:53.000000000

**Commit Message:**

```
Varnish: Add lint:ignore:quoted_booleans around a boolean that needs quoting.

Bug: T113783
Change-Id: Icbe2be0235038b40c2584f221ae23a90c1a2ecb6
```

**Messages:** 7
**Inline Comments:** 0

**Message 1: Andrew Bogott (@andrew)** - 10/2/2015, 1:44:42 PM
Uploaded patch set 1.

**Message 2:** 🤖 10/2/2015, 1:45:24 PM - Verified+2: Main test build succeeded
**Message 3: Andrew Bogott (@andrew)** - 10/2/2015, 1:53:03 PM
Patch Set 2: Patch Set 1 was rebased

**Message 4:** 🤖 10/2/2015, 1:53:40 PM - Verified+2: Main test build succeeded
**Message 5: Andrew Bogott (@andrew)** - 10/2/2015, 1:54:23 PM
Patch Set 2: Code-Review+2

**Message 6: Andrew Bogott (@andrew)** - 10/2/2015, 1:54:25 PM
Change has been successfully merged into the git repository.

**Message 7:** 🤖 10/2/2015, 1:55:53 PM - Post-: Post-merge build succeeded.

## Review 13: 619301 - mariadb: Reduce s7 memory usage for dbstore1003

- **URL:** https://gerrit.wikimedia.org/r/c/619301
- **Author:** Jaime Crespo (@jynus) <jcrespo@wikimedia.org>
- **Project:** operations/puppet
- **Branch:** production
- **Status:** MERGED
- **Created:** 2020-08-10 14:36:30.000000000
- **Updated:** 2020-08-10 14:47:54.000000000

**Commit Message:**

```
mariadb: Reduce s7 memory usage for dbstore1003

Reduce the total memory commitment for mariadb instances by
reducing the s7 buffer pool. This will avoid being at over 90%
memory usage and have enough memory for filesystem cache and
per-connection memory.

Bug: T172490
Change-Id: I84a60661acbab803422d36ea667d57e2c52ce8b0
```

**Messages:** 6
**Inline Comments:** 0

**Message 1: Jaime Crespo (@jynus)** - 8/10/2020, 2:36:30 PM
Uploaded patch set 1.

**Message 2: Jaime Crespo (@jynus)** - 8/10/2020, 2:36:58 PM
Patch Set 2: Patch Set 1 was rebased

**Message 3:** 🤖 8/10/2020, 2:37:10 PM - Verified+2: Main test build succeeded
**Message 4:** 🤖 8/10/2020, 2:37:22 PM - Verified+2: Main test build succeeded
**Message 5: Jaime Crespo (@jynus)** - 8/10/2020, 2:47:48 PM
Patch Set 2: Code-Review+2

**Message 6: Jaime Crespo (@jynus)** - 8/10/2020, 2:47:54 PM
Change has been successfully merged by Jcrespo


## Review 14: 242170 - Dequote one more nrpe critical setting

- **URL:** https://gerrit.wikimedia.org/r/c/242170
- **Author:** Andrew Bogott (@andrew) <abogott@wikimedia.org>
- **Project:** operations/puppet
- **Branch:** production
- **Status:** MERGED
- **Created:** 2015-09-29 16:05:04.000000000
- **Updated:** 2015-10-01 20:15:50.000000000

**Commit Message:**

```
Dequote one more nrpe critical setting

Bug: T113783
Change-Id: Id487d41f10ca4cfa37978797b219c5453e605546
```

**Messages:** 7
**Inline Comments:** 0

**Message 1: Andrew Bogott (@andrew)** - 9/29/2015, 4:05:04 PM
Uploaded patch set 1.

**Message 2:** 🤖 9/29/2015, 4:06:23 PM - Verified+2: Main test build succeeded
**Message 3: Andrew Bogott (@andrew)** - 10/1/2015, 8:13:12 PM
Patch Set 2: Patch Set 1 was rebased

**Message 4:** 🤖 10/1/2015, 8:13:55 PM - Verified+2: Main test build succeeded
**Message 5: Andrew Bogott (@andrew)** - 10/1/2015, 8:14:04 PM
Patch Set 2: Code-Review+2

**Message 6: Andrew Bogott (@andrew)** - 10/1/2015, 8:14:06 PM
Change has been successfully merged into the git repository.

**Message 7:** 🤖 10/1/2015, 8:15:50 PM - Post-: Post-merge build succeeded.

## Review 15: 532454 - actions: add generate action

- **URL:** https://gerrit.wikimedia.org/r/c/532454
- **Author:** Volans (@volans) <rcoccioli@wikimedia.org>
- **Project:** operations/software/homer
- **Branch:** master
- **Status:** MERGED
- **Created:** 2019-08-26 20:34:07.000000000
- **Updated:** 2019-08-27 12:25:23.000000000

**Commit Message:**

```
actions: add generate action

* Add implementation of the 'generate' action that will generate the
  compiled configuration for the matching devices and save it in the
  configured directory, one file per device.

Bug: T228388
Change-Id: I5419f26ae1cd036b2ae5bd8f341e9ad3658c4f77
```

**Messages:** 12
**Inline Comments:** 0

**Message 1: Volans (@volans)** - 8/26/2019, 8:34:07 PM
Uploaded patch set 1.

**Message 2:** 🤖 8/26/2019, 8:37:46 PM - Verified-1: Main test build failed
**Message 3: Volans (@volans)** - 8/26/2019, 8:45:51 PM
Uploaded patch set 2.

**Message 4:** 🤖 8/26/2019, 8:54:18 PM - Verified+2: Main test build succeeded
**Message 5: Volans (@volans)** - 8/26/2019, 9:40:50 PM
Uploaded patch set 3: Patch Set 2 was rebased.

**Message 6:** 🤖 8/26/2019, 9:48:30 PM - Verified+2: Main test build succeeded
**Message 7: Arzhel (@ayounsi)** - 8/26/2019, 11:59:16 PM
Patch Set 3: Code-Review+1

**Message 8: Volans (@volans)** - 8/27/2019, 12:21:06 PM
Patch Set 3: Code-Review+2

**Message 9:** 🤖 8/27/2019, 12:21:12 PM - -Verified: Starting gate
**Message 10:** 🤖 8/27/2019, 12:24:21 PM - Verified+2: Gate pipeline
**Message 11:** 🤖 8/27/2019, 12:24:21 PM - Change has been successfully merged by j...
**Message 12:** 🤖 8/27/2019, 12:25:23 PM - Post-: Post-merge build succeeded.

## Review 16: 634191 - role::druid::public::worker: increase connection pool on historicals

- **URL:** https://gerrit.wikimedia.org/r/c/634191
- **Author:** Elukey (@elukey) <ltoscano@wikimedia.org>
- **Project:** operations/puppet
- **Branch:** production
- **Status:** MERGED
- **Created:** 2020-10-15 09:28:19.000000000
- **Updated:** 2020-10-15 14:02:46.000000000

**Commit Message:**

```
role::druid::public::worker: increase connection pool on historicals

We are still seeing temporary stalls on the brokers when data is dropped
from the historicals. In the past we mitigated the issue adding +10
threads to each historical's connection pool, but it was probably not
enough.

Bug: T226035
Change-Id: Iff54649956abe9651c5c8f310bb398c903dc2f1e
```

**Messages:** 7
**Inline Comments:** 1

**Message 1: Elukey (@elukey)** - 10/15/2020, 9:28:19 AM
Uploaded patch set 1.

**Message 2:** 🤖 10/15/2020, 9:28:39 AM - Verified+2: Main test build succeeded (1 job)
**Message 3: Joal (@joal)** - 10/15/2020, 11:31:50 AM
Patch Set 1:

Works for me - I don't know if it'll make a diff :S

**Message 4: Joal (@joal)** - 10/15/2020, 11:31:58 AM
Patch Set 1: Code-Review+1

**Message 5: Tobias Klausmann (@klausman)** - 10/15/2020, 11:57:57 AM
Patch Set 1: Code-Review+2

**Message 6: Elukey (@elukey)** - 10/15/2020, 12:47:07 PM
Change has been successfully rebased and submitted as 69d4a4cd8f9f0e9face0b335cc637ae298802fff by Elukey

**Message 7: Milimetric (@milimetric)** - 10/15/2020, 2:02:46 PM
Patch Set 2:

(1 comment)

> **Inline Comments (1):**
>
> **hieradata/role/common/druid/public/worker.yaml:136** - Milimetric
> in https://druid.apache.org/docs/latest/operations/basic-cluster-tuning.html#connection-pool-sizing they mention for 50 numConnections they would add 10, so for 100 adding 20 seems proportional to that rule of thumb.  It seems to me they imply you would start there and if you have problems increase it, so maybe we were lower than recommended until now.
>


## Review 17: 493769 - osmdb: stage the roles and profiles for virtualizing the servers

- **URL:** https://gerrit.wikimedia.org/r/c/493769
- **Author:** Bstorm (@bstorm) <bastorm@pm.me>
- **Project:** operations/puppet
- **Branch:** production
- **Status:** MERGED
- **Created:** 2019-03-01 23:23:54.000000000
- **Updated:** 2019-03-04 23:57:21.000000000

**Commit Message:**

```
osmdb: stage the roles and profiles for virtualizing the servers

This is for virtualizing labsdb1006 and labsdb1007.  The goal here is
to re-use code from the wikilabels database with the extra pieces in place
for OSM's use case.

Bug: T193264
Change-Id: I1847b122b95331835c6ef1a5f6203f5b0a988ce8
```

**Messages:** 7
**Inline Comments:** 0

**Message 1: Bstorm (@bstorm)** - 3/1/2019, 11:23:54 PM
Uploaded patch set 1.

**Message 2:** 🤖 3/1/2019, 11:24:49 PM - Verified+2: Main test build succeeded
**Message 3: Αλέξανδρος Κοσιάρης (@akosiaris)** - 3/4/2019, 4:48:04 PM
Patch Set 1: Code-Review+1

I haven't audited the files very thoroughly, but approach LGTM

**Message 4: Bstorm (@bstorm)** - 3/4/2019, 10:35:55 PM
Patch Set 2: Patch Set 1 was rebased

**Message 5:** 🤖 3/4/2019, 10:37:19 PM - Verified+2: Main test build succeeded
**Message 6: Bstorm (@bstorm)** - 3/4/2019, 11:57:18 PM
Patch Set 2: Code-Review+2

**Message 7: Bstorm (@bstorm)** - 3/4/2019, 11:57:21 PM
Change has been successfully merged by Bstorm


## Review 18: 295764 - etherpad-restore: Use etherpad1001b

- **URL:** https://gerrit.wikimedia.org/r/c/295764
- **Author:** Αλέξανδρος Κοσιάρης (@akosiaris) <akosiaris@wikimedia.org>
- **Project:** operations/puppet
- **Branch:** production
- **Status:** MERGED
- **Created:** 2016-06-23 22:12:02.000000000
- **Updated:** 2016-06-23 22:18:13.000000000

**Commit Message:**

```
etherpad-restore: Use etherpad1001b

Bug: T138516
Change-Id: Ia2aa8b4f64a72491d0ea780189d4ed5bc0d5cc22
```

**Messages:** 6
**Inline Comments:** 0

**Message 1: Αλέξανδρος Κοσιάρης (@akosiaris)** - 6/23/2016, 10:12:02 PM
Uploaded patch set 1.

**Message 2: Αλέξανδρος Κοσιάρης (@akosiaris)** - 6/23/2016, 10:12:31 PM
Patch Set 2: Patch Set 1 was rebased

**Message 3: Αλέξανδρος Κοσιάρης (@akosiaris)** - 6/23/2016, 10:12:49 PM
Patch Set 2: Code-Review+2 Verified+2

**Message 4: Αλέξανδρος Κοσιάρης (@akosiaris)** - 6/23/2016, 10:12:55 PM
Change has been successfully merged into the git repository.

**Message 5:** 🤖 6/23/2016, 10:13:37 PM - Main: Main test build succeeded
**Message 6:** 🤖 6/23/2016, 10:18:13 PM - Post-: Post-merge build succeeded.

## Review 19: 392681 - Remove unused scripts

- **URL:** https://gerrit.wikimedia.org/r/c/392681
- **Author:** Adam Wight (@awight) <adam.wight@wikimedia.de>
- **Project:** mediawiki/services/ores/deploy
- **Branch:** master
- **Status:** MERGED
- **Created:** 2017-11-21 17:21:49.000000000
- **Updated:** 2017-11-21 19:04:31.000000000

**Commit Message:**

```
Remove unused scripts

I'm not 100% certain there isn't some magic that does actually call these.

Bug: T181071
Change-Id: Ie453700090379c3511393262cede4bbea234b3e0
```

**Messages:** 4
**Inline Comments:** 0

**Message 1: Adam Wight (@awight)** - 11/21/2017, 5:21:49 PM
Uploaded patch set 1.

**Message 2: Adam Wight (@awight)** - 11/21/2017, 5:40:41 PM
Uploaded patch set 2: Commit message was updated.

**Message 3: امیر سرآبادانی (@ladsgroup)** - 11/21/2017, 7:03:57 PM
Patch Set 2: Verified+2 Code-Review+2

We were planning to separate web and worker nodes so it might be useful in the future but we can revive it if we decide to go to that direction.

**Message 4: امیر سرآبادانی (@ladsgroup)** - 11/21/2017, 7:04:31 PM
Change has been successfully merged by Ladsgroup


## Review 20: 705729 - logstash: complete restbase transition to ECS

- **URL:** https://gerrit.wikimedia.org/r/c/705729
- **Author:** Cwhite (@cwhite) <cwhite@wikimedia.org>
- **Project:** operations/puppet
- **Branch:** production
- **Status:** MERGED
- **Created:** 2021-07-20 18:05:39.000000000
- **Updated:** 2021-07-27 15:18:51.000000000

**Commit Message:**

```
logstash: complete restbase transition to ECS

Bug: T234565
Change-Id: Ifad02dc5975de79532a1270e23894e190cfd68e4
```

**Messages:** 6
**Inline Comments:** 0

**Message 1: Cwhite (@cwhite)** - 7/20/2021, 6:05:39 PM
Uploaded patch set 1.

**Message 2:** 🤖 7/20/2021, 6:07:28 PM - Verified+2: Main test build succeeded (2 jobs)
**Message 3: Filippo Giunchedi (@filippo)** - 7/21/2021, 3:22:15 PM
Patch Set 1: Code-Review+1

**Message 4: Herron (@herron)** - 7/21/2021, 3:26:51 PM
Patch Set 1: Code-Review+1

**Message 5: Cwhite (@cwhite)** - 7/27/2021, 3:18:26 PM
Patch Set 1: Code-Review+2

**Message 6: Cwhite (@cwhite)** - 7/27/2021, 3:18:51 PM
Change has been successfully rebased and submitted as ea9420190bd6f08352373903c43e075872a318d7 by Cwhite


## Review 21: 292558 - assign labs::nfs::secondary to labstore100[45]

- **URL:** https://gerrit.wikimedia.org/r/c/292558
- **Author:** Rush (@rush) <rush@wikimedia.org>
- **Project:** operations/puppet
- **Branch:** production
- **Status:** MERGED
- **Created:** 2016-06-03 13:52:41.000000000
- **Updated:** 2016-06-03 14:02:16.000000000

**Commit Message:**

```
assign labs::nfs::secondary to labstore100[45]

Bug: T126083
Change-Id: I7f07cbbc6075972789a4c109d911aa3aa4cb9890
```

**Messages:** 5
**Inline Comments:** 0

**Message 1: Rush (@rush)** - 6/3/2016, 1:52:41 PM
Uploaded patch set 1.

**Message 2:** 🤖 6/3/2016, 1:53:56 PM - Verified+2: Main test build succeeded
**Message 3: Rush (@rush)** - 6/3/2016, 1:54:52 PM
Patch Set 1: Code-Review+2

**Message 4: Rush (@rush)** - 6/3/2016, 1:54:54 PM
Change has been successfully merged into the git repository.

**Message 5:** 🤖 6/3/2016, 2:02:16 PM - Post-: Post-merge build succeeded.

## Review 22: 447110 - Don't save to ParserCache if not parsing for current user

- **URL:** https://gerrit.wikimedia.org/r/c/447110
- **Author:** Marius Hoch (Hoo man) (@hoo) <mail@mariushoch.de>
- **Project:** mediawiki/extensions/Wikibase
- **Branch:** master
- **Status:** MERGED
- **Created:** 2018-07-21 00:08:24.000000000
- **Updated:** 2018-07-24 08:06:27.000000000

**Commit Message:**

```
Don't save to ParserCache if not parsing for current user

This is more of a hack than a nice solution...

Bug: T199983
Change-Id: I165ffb3f337f288d83568900c667ca4b7a2890ed
```

**Messages:** 33
**Inline Comments:** 13

**Message 1: Marius Hoch (Hoo man) (@hoo)** - 7/21/2018, 12:08:24 AM
Uploaded patch set 1.

**Message 2:** 🤖 7/21/2018, 12:33:24 AM - Verified-1: Main test build failed
**Message 3: Marius Hoch (Hoo man) (@hoo)** - 7/21/2018, 12:36:10 AM
Uploaded patch set 2.

**Message 4:** 🤖 7/21/2018, 12:51:27 AM - Verified+2: Main test build succeeded
**Message 5: Anomie (@anomie)** - 7/21/2018, 8:36:08 PM
Patch Set 2: Code-Review-1

(3 comments)

If something related to 92e964274 did cause T199983, the problem is more likely that you have some code path somewhere in code used to produce parser output that is not fetching the user language via ParserOptions or Parser as it should.

> **Inline Comments (3):**
>
> **/COMMIT_MSG:7** - Anomie
> Yes, there are. See the detailed explanation in T190712.
>
> **repo/includes/Content/EntityContent.php:212** - Anomie
> I note that this change will cause EntityContent to use a different value of $pOpt->getTidy() compared to every other Content implementation, likely a different value of ->getEnableLimitReport() too, and different values for various user-dependent options of which the user language is only one.
>
> **repo/includes/Content/EntityHandler.php:142** - Anomie
> This does not actually do anything. All calls to this method were removed in I01373b29 and the various extension patches at with topic:bug/T194263-deprecate-ContentHandler-makeParserOptions
>

**Message 6: Marius Hoch (Hoo man) (@hoo)** - 7/21/2018, 10:04:29 PM
Patch Set 2:

(3 comments)

This is not meant to be permanent, but rather a short-sighted fix for now (but IMO still less awful than a straight revert).

> **Inline Comments (3):**
>
> **/COMMIT_MSG:7** - Hoo man
> That would require probably at least changing EntityHandler::getPageViewLanguage… but I don't know how that would look like.
>
> **repo/includes/Content/EntityContent.php:212** - Hoo man
> I know that this is pretty awful, but probably best for now.
>
> **repo/includes/Content/EntityHandler.php:142** - Hoo man
> Weird, because I tested this.
>

**Message 7: Marius Hoch (Hoo man) (@hoo)** - 7/22/2018, 2:50:43 AM
Uploaded patch set 3.

**Message 8: Marius Hoch (Hoo man) (@hoo)** - 7/22/2018, 2:52:03 AM
Patch Set 3:

I tested this with the current master and my version from PS2 doesn't actually work… yikes.

Replaced the hack with another hack, so that this at least works for now. There's something weird going on here for sure… but I can't quite figure it out yet.

**Message 9: Marius Hoch (Hoo man) (@hoo)** - 7/22/2018, 2:52:58 AM
Uploaded patch set 4.

**Message 10:** 🤖 7/22/2018, 3:12:53 AM - Verified-1: Main test build failed
**Message 11: Daniel Kinzler 👾 (@daniel)** - 7/22/2018, 10:07:45 AM
Patch Set 4:

(2 comments)

> **Inline Comments (2):**
>
> **/COMMIT_MSG:7** - Daniel Kinzler
> "canonical" is a bit misleading - in practice, it's the ParserOptions used to generate and cache output on save. We can't do that for all languages. The max we could do for "no canonical" would be to not put anything into the parser cache on save.
> 
> As a side note: getPageViewLanguage() should not exist in my mind, introducing it was a mistake. Content should know what language it is in, ParserOptions shhould know what language is desired, and ParserOutput should know what language it is in. The effective output language is determined based on the content's language and the desired target language by the code that generates the ParserOutput. getPageViewLanguage() is really a distraction. Compare T114640 and T109705.
>
> **repo/includes/Content/EntityContent.php:212** - Daniel Kinzler
> The fact that this seems to be needed implies to me that there are callers that should be passing $options explicitly, but do not. These callers should be identified and fixed.
>

**Message 12: WMDE-leszek (@wmde-leszek)** - 7/23/2018, 9:34:38 AM
Patch Set 4:

recheck

**Message 13:** 🤖 7/23/2018, 9:54:00 AM - Verified+2: Main test build succeeded
**Message 14: WMDE-leszek (@wmde-leszek)** - 7/23/2018, 10:21:52 AM
Patch Set 4:

Daniel, Hoo man, please correct me if I say complete rubbish:

> If something related to 92e964274 did cause T199983, the problem is more likely that you have some code path somewhere in code used to produce parser output that is not fetching the user language via ParserOptions or Parser as it should.

Wouldn't the potential code path like described above be the stemming from the fact that the EntityViewFactory, which EntityParserOutputGenerator(Factory) use is using the language, through ViewFactory (WikibaseRepo::getViewFactory), which is $wgLang (via WikibaseRepo::getUserLanguage.

This could maybe lead to some parts of view using that language from ParserOptions, and the other parts from $wgLang?

Does this make any sense? Could this lead to issue reported in T199983? I cannot tell how this relates to 92e964274.

Sorry if this is completely shooting in the dark (and missing).

**Message 15: Marius Hoch (Hoo man) (@hoo)** - 7/23/2018, 10:23:21 AM
Patch Set 4:

@Leszek: This could very likely be it, yes… the language used for view should not be derived from global state, ever :/

**Message 16: WMDE-leszek (@wmde-leszek)** - 7/23/2018, 11:12:48 AM
Patch Set 4:

I honestly admit I have no idea of ParserOutput/Options, so what happens here is pure black magic to me. If this fixes the issue, then good :)

While trying to understand the change, Anomie's comment got me to re-check how Wikibase generates its parser output/HTML. I ended up making Ic0af544ff6e11adc6a3f555d93505a7be3fd2b16. Maybe it is of relevance for T199983, maybe it is a completely missed shot.

**Message 17: Daniel Kinzler 👾 (@daniel)** - 7/23/2018, 2:09:55 PM
Patch Set 4:

Leszek you are probably right, but I have not looked into this closely.

One thing I remember encountering when writing this is the fact that ParserOpptions::getTargetLanguage() will often return null. The semantics of this is undefined, but IIRC the expectation is that this will result in the site's content language to be used. But for wikibase, that would be wrong, the user language should be used instead.

To avoid this ambiguity and confusion, one would have to ensure that ParserOptions::getTargetLanguage never returns null.

**Message 18: Anomie (@anomie)** - 7/23/2018, 3:41:00 PM
Patch Set 4:

(2 comments)

> One thing I remember encountering when writing this is the fact that ParserOpptions::getTargetLanguage() will often return null. The semantics of this is undefined, but IIRC the expectation is that this will result in the site's content language to be used.

I don't know what the intended semantics are, but the actual behavior seems to be intended to override Parser::getTargetLanguage() rather than to be used directly. Specifically, the fallback chain is:

* ParserOptions::getTargetLanguage() is used if it's non-null.
* If ParserOptions::getInterfaceMessage() is set, it uses ParserOptions::getUserLangObj()
* Otherwise it uses $title->getPageLanguage().

Wikibase, if it wants the user language, should just use ParserOptions::getUserLangObj().

> **Inline Comments (2):**
>
> **repo/includes/Content/EntityContent.php:212** - Anomie
> I suspect the bit below would be sufficient to work around the linked bug, where non-English text is showing up from the 'en' cache for users with their language set to English (or using uselang=en).
> 
> The change to this line would fix a bug where people were seeing English when their own language is set to something else. Has that also been reported?
>
> **repo/includes/Content/EntityContent.php:217** - Anomie
> You could probably more directly check $options->getUserLang() !== RequestContext::getMain()->getLanguage()->getCode().
> 
> Or are there other user-related preferences that Wikibase might be pulling directly instead of from ParserOptions?
>

**Message 19: WMDE-leszek (@wmde-leszek)** - 7/23/2018, 3:48:20 PM
Patch Set 4:

(1 comment)

> **Inline Comments (1):**
>
> **repo/includes/Content/EntityContent.php:212** - WMDE-leszek
> > The change to this line would fix a bug where people were seeing English when their own language is set to something else. Has that also been reported?
> 
> I don't think so
>

**Message 20: WMDE-leszek (@wmde-leszek)** - 7/24/2018, 6:44:26 AM
Patch Set 4: Verified+1

Finally got my head around how to reproduce the issue. Tested current patchset and it seems to do the trick.
Now going to check the more specific condition as Anomie suggested (which I would also be more fond of, as it is specifically mentioning user language).

**Message 21: WMDE-leszek (@wmde-leszek)** - 7/24/2018, 6:47:46 AM
Uploaded patch set 5.

**Message 22: WMDE-leszek (@wmde-leszek)** - 7/24/2018, 6:48:35 AM
Patch Set 5:

Version in PS5 also seem to work.

I don't fully understand all the magic, but will merge as it fixes the blocking bug.

**Message 23:** 🤖 7/24/2018, 7:16:49 AM - Verified+2: Main test build succeeded
**Message 24: WMDE-leszek (@wmde-leszek)** - 7/24/2018, 7:25:31 AM
Patch Set 5: Code-Review+2

**Message 25:** 🤖 7/24/2018, 7:25:37 AM - -Verified: Starting gate
**Message 26: Fomafix (@fomafix)** - 7/24/2018, 7:30:42 AM
Patch Set 5: Code-Review-1

(1 comment)

> **Inline Comments (1):**
>
> **repo/includes/Content/EntityContent.php:217** - Fomafix
> Better use
> 
>  !$options->getUserLangObj()->equals( RequestContext::getMain()->getLanguage() )
>

**Message 27: WMDE-leszek (@wmde-leszek)** - 7/24/2018, 7:37:24 AM
Uploaded patch set 6.

**Message 28: WMDE-leszek (@wmde-leszek)** - 7/24/2018, 7:37:48 AM
Patch Set 6: Code-Review+2

(1 comment)

> **Inline Comments (1):**
>
> **repo/includes/Content/EntityContent.php:217** - WMDE-leszek
> Done
>

**Message 29:** 🤖 7/24/2018, 7:37:54 AM - Starting: Starting gate
**Message 30:** 🤖 7/24/2018, 7:56:08 AM - Verified+2: Main test build succeeded
**Message 31:** 🤖 7/24/2018, 8:05:21 AM - Gate: Gate pipeline
**Message 32:** 🤖 7/24/2018, 8:05:21 AM - Change has been successfully merged by j...
**Message 33:** 🤖 7/24/2018, 8:06:27 AM - Post-: Post-merge build succeeded.

## Review 23: 537220 - Move VariantSettings back to InitialiseSettings now that the migration is done

- **URL:** https://gerrit.wikimedia.org/r/c/537220
- **Author:** Jdforrester (🙄) (@jforrester) <jforrester@wikimedia.org>
- **Project:** operations/mediawiki-config
- **Branch:** master
- **Status:** MERGED
- **Created:** 2019-09-16 22:55:46.000000000
- **Updated:** 2019-09-25 01:14:18.000000000

**Commit Message:**

```
Move VariantSettings back to InitialiseSettings now that the migration is done

Bug: T223602
Change-Id: Ie898a90b89ba5bfbcba2c0104f2a570be96ffa2f
```

**Messages:** 31
**Inline Comments:** 0

**Message 1: Jdforrester (🙄) (@jforrester)** - 9/16/2019, 10:55:46 PM
Uploaded patch set 1.

**Message 2:** 🤖 9/16/2019, 11:01:06 PM - Verified-1: Main test build failed
**Message 3: Jdforrester (🙄) (@jforrester)** - 9/18/2019, 9:04:34 PM
Uploaded patch set 2.

**Message 4:** 🤖 9/18/2019, 9:05:34 PM - Verified+2: Main test build succeeded
**Message 5: Timo Tijhof (@krinkle)** - 9/20/2019, 9:12:35 PM
Patch Set 2:

The diff is a bit slow to load, but from Gitiles, it looks like the labs realm condition got lost. Can you double check? Moving that out to CS or MWConfig class makes sense, but isn't in the current parent hiearchy.

**Message 6: Jdforrester (🙄) (@jforrester)** - 9/20/2019, 9:13:41 PM
Patch Set 2:

> Patch Set 2:
> 
> The diff is a bit slow to load, but from Gitiles, it looks like the labs realm condition got lost. Can you double check? Moving that out to CS or MWConfig class makes sense, but isn't in the current parent hiearchy.

It didn't get lost, it got moved. Look at CommonSettings.php. :-)

Other than the broken-by-design Cirrus tests, nothing in the world is currently loading InitialiseSettings.php.

**Message 7: Timo Tijhof (@krinkle)** - 9/20/2019, 9:16:15 PM
Patch Set 2:

In this commit:

LHS/Before: Shows IS.php including VS.php with labs realm check to load IS-labs.php, then assigns wgConf->settings.

RHS/After: Shows IS.php is what VS.php used to be, and CS.php updated to include that instead going forward. So where did the labs check go?

**Message 8: Timo Tijhof (@krinkle)** - 9/20/2019, 9:16:48 PM
Patch Set 2: Code-Review+1

Ah, looks like that was already inlined in CS.php, got it. Assuming that's dead, can we remove that in a separate patch quickly first?

**Message 9: Jdforrester (🙄) (@jforrester)** - 9/20/2019, 9:23:47 PM
Patch Set 2:

> Patch Set 2: Code-Review+1
> 
> Ah, looks like that was already inlined in CS.php, got it. Assuming that's dead, can we remove that in a separate patch quickly first?

Sure. But I can't do that without deleting/skipping or re-writing the Cirrus tests first, and I'm tired of endlessly rebasing. :-)

**Message 10: Timo Tijhof (@krinkle)** - 9/20/2019, 9:30:21 PM
Patch Set 2:

I thought the fix for that just landed. And it did, but it only fixed the PHP error, not the general hacky way of loading IS. Indeed, that's still unresolved.

But, if this commit passes CI with the IS.php code removed, then presumably a separate one could as well. It just means we'll still have to disable the Ciruss test, just as this commt's parent does already.

**Message 11: Timo Tijhof (@krinkle)** - 9/20/2019, 9:56:57 PM
Uploaded patch set 3.

**Message 12:** 🤖 9/20/2019, 9:57:55 PM - Verified-1: Main test build failed
**Message 13: Timo Tijhof (@krinkle)** - 9/20/2019, 10:01:07 PM
Uploaded patch set 4: Patch Set 3 was rebased.

**Message 14:** 🤖 9/20/2019, 10:02:12 PM - Verified-1: Main test build failed
**Message 15: Timo Tijhof (@krinkle)** - 9/20/2019, 10:08:32 PM
Uploaded patch set 5.

**Message 16:** 🤖 9/20/2019, 10:09:38 PM - Verified+2: Main test build succeeded
**Message 17: Jdforrester (🙄) (@jforrester)** - 9/20/2019, 10:24:37 PM
Uploaded patch set 6.

**Message 18:** 🤖 9/20/2019, 10:25:47 PM - Verified+2: Main test build succeeded
**Message 19: Jdforrester (🙄) (@jforrester)** - 9/20/2019, 10:30:38 PM
Uploaded patch set 7.

**Message 20:** 🤖 9/20/2019, 10:31:33 PM - Verified+2: Main test build succeeded
**Message 21: Jdforrester (🙄) (@jforrester)** - 9/20/2019, 10:33:09 PM
Patch Set 7:

Scap order: IS (create), CS, src/WmfClusters, VS (delete)

**Message 22: Timo Tijhof (@krinkle)** - 9/25/2019, 12:48:03 AM
Uploaded patch set 8.

**Message 23: Timo Tijhof (@krinkle)** - 9/25/2019, 12:48:24 AM
Uploaded patch set 9: Commit message was updated.

**Message 24:** 🤖 9/25/2019, 12:49:47 AM - Verified+2: Main test build succeeded
**Message 25: Timo Tijhof (@krinkle)** - 9/25/2019, 12:55:42 AM
Patch Set 9:

* Checked there are no more references to VariantSettings.
* Checked none of the diffs change the trailing part of "Settings.php".
* Checked that all uses of "Settings.php", when excluding '(Private|Common|Default|PoolCounter|Local|FatalError|Initialise)Settings', has no other results (against typos).

**Message 26: Timo Tijhof (@krinkle)** - 9/25/2019, 12:55:47 AM
Patch Set 9: Code-Review+2

**Message 27:** 🤖 9/25/2019, 12:55:53 AM - -Verified: Starting gate
**Message 28:** 🤖 9/25/2019, 12:56:38 AM - Verified+2: Gate pipeline
**Message 29:** 🤖 9/25/2019, 12:56:38 AM - Change has been successfully merged by j...
**Message 30:** 🤖 9/25/2019, 12:56:56 AM - Post-: Post-merge build succeeded.
**Message 31: Timo Tijhof (@krinkle)** - 9/25/2019, 1:14:18 AM
Patch Set 9:

Sync commands for historical record:

 A wmf-config/InitialiseSettings.php

 M README

 M docroot/noc
  M createTxtFileSymlinks.sh
  D docroot/noc/conf/VariantSettings.php.txt

 M tests/

 M src/WmfClusters [for noc]

 M wmf-config/


## Review 24: 735039 - default_mail_relay: add VO retry config to production host MTAs

- **URL:** https://gerrit.wikimedia.org/r/c/735039
- **Author:** Herron (@herron) <kherron@wikimedia.org>
- **Project:** operations/puppet
- **Branch:** production
- **Status:** MERGED
- **Created:** 2021-10-27 17:57:06.000000000
- **Updated:** 2021-10-27 18:02:24.000000000

**Commit Message:**

```
default_mail_relay: add VO retry config to production host MTAs

aggressively retry from exim host MTAs as they are in the path for
VO alerts in some cases (e.g. the alert hosts)

Bug: T294166
Change-Id: I778df5d5d4fc844cfdab7bbb40db9586c910fc0e
```

**Messages:** 5
**Inline Comments:** 2

**Message 1: Herron (@herron)** - 10/27/2021, 5:57:06 PM
Uploaded patch set 1.

**Message 2:** 🤖 10/27/2021, 5:58:45 PM - Verified+2: Main test build succeeded (1 job)
**Message 3: Herron (@herron)** - 10/27/2021, 5:59:33 PM
Patch Set 1:

(1 comment)

> **Inline Comments (1):**
>
> **Patchset:** - Herron
> https://puppet-compiler.wmflabs.org/compiler1002/31958/
>

**Message 4: Herron (@herron)** - 10/27/2021, 6:02:06 PM
Patch Set 1: Code-Review+2

(1 comment)

> **Inline Comments (1):**
>
> **Patchset:** - Herron
> adding VO retry config to default_mail_relay template that was missed in I18389cfe0b3f9acb802ddf91c8692df1f1cc34ec
>

**Message 5: Herron (@herron)** - 10/27/2021, 6:02:24 PM
Change has been successfully rebased and submitted as e52ce07961fb44e58a3df3643d130e7d955cb061


## Review 25: 961858 - Add an option to disable producing errors to kafka

- **URL:** https://gerrit.wikimedia.org/r/c/961858
- **Author:** DCausse (@dcausse) <dcausse@wikimedia.org>
- **Project:** wikidata/query/rdf
- **Branch:** master
- **Status:** MERGED
- **Created:** 2023-09-28 17:25:05.000000000
- **Updated:** 2023-09-28 19:52:10.000000000

**Commit Message:**

```
Add an option to disable producing errors to kafka

usefull for a test environment that does not have all the
reconciliation mechanism in place but also work-around the problem
described in the attached ticket while we don't have a proper way to tag
the provenance of these errors.

Bug: T347515
Change-Id: I979329c6ae1ae97fdee39a8b765d7078820e59ec
```

**Messages:** 9
**Inline Comments:** 0

**Message 1: DCausse (@dcausse)** - 9/28/2023, 5:25:05 PM
Uploaded patch set 1.

**Message 2: SonarQube Bot (@sonarqubebot)** - 9/28/2023, 5:36:30 PM
Patch Set 1: Verified+1

✔ Quality gate passed!


* ✔ reliability rating
* ✔ security rating
* ✔ maintainability rating
* ✔ coverage
* ✔ duplicated lines density
* ✔ security hotspots reviewed

Report: https://sonarcloud.io/dashboard?id=org.wikidata.query.rdf%3Aquery-service-parent&branch=961858-1 Please give feedback and report false positives at https://www.mediawiki.org/wiki/Talk:Continuous_integration/Codehealth_Pipeline

**Message 3:** 🤖 9/28/2023, 5:36:35 PM - Verified+2: Main test build succeeded (1 job)
**Message 4: Ebernhardson (@ebernhardson)** - 9/28/2023, 7:15:10 PM
Patch Set 1: Code-Review+2

**Message 5:** 🤖 9/28/2023, 7:15:15 PM - -Verified: Starting gate
**Message 6: SonarQube Bot (@sonarqubebot)** - 9/28/2023, 7:26:03 PM
Patch Set 1:

✔ Quality gate passed!


* ✔ reliability rating
* ✔ security rating
* ✔ maintainability rating
* ✔ coverage
* ✔ duplicated lines density
* ✔ security hotspots reviewed

Report: https://sonarcloud.io/dashboard?id=org.wikidata.query.rdf%3Aquery-service-parent&branch=961858-1 Please give feedback and report false positives at https://www.mediawiki.org/wiki/Talk:Continuous_integration/Codehealth_Pipeline

**Message 7:** 🤖 9/28/2023, 7:26:17 PM - Verified+2: Gate pipeline (1 job)
**Message 8:** 🤖 9/28/2023, 7:26:17 PM - Change has been successfully merged
**Message 9:** 🤖 9/28/2023, 7:52:10 PM - Post-: Post-merge build succeeded. (1 job)

## Review 26: 845651 - cp4045: enable single_backend mode

- **URL:** https://gerrit.wikimedia.org/r/c/845651
- **Author:** BBlack (@bblack) <bblack@wikimedia.org>
- **Project:** operations/puppet
- **Branch:** production
- **Status:** MERGED
- **Created:** 2022-10-21 17:46:57.000000000
- **Updated:** 2022-10-26 15:05:50.000000000

**Commit Message:**

```
cp4045: enable single_backend mode

Bug: T288106
Change-Id: I1d8254b685687ba7c417239efd42d670193b8aa0
```

**Messages:** 19
**Inline Comments:** 2

**Message 1: BBlack (@bblack)** - 10/21/2022, 5:46:57 PM
Uploaded patch set 1.

**Message 2:** 🤖 10/21/2022, 5:49:09 PM - Verified+2: Main test build succeeded (1 job)
**Message 3: BBlack (@bblack)** - 10/21/2022, 6:03:35 PM
Uploaded patch set 2: Patch Set 1 was rebased.

**Message 4:** 🤖 10/21/2022, 6:05:32 PM - Verified+2: Main test build succeeded (1 job)
**Message 5: BBlack (@bblack)** - 10/21/2022, 6:09:28 PM
Uploaded patch set 3: Patch Set 2 was rebased.

**Message 6:** 🤖 10/21/2022, 6:11:30 PM - Verified+2: Main test build succeeded (1 job)
**Message 7: BBlack (@bblack)** - 10/21/2022, 6:33:07 PM
Uploaded patch set 4: Patch Set 3 was rebased.

**Message 8:** 🤖 10/21/2022, 6:34:43 PM - Verified+2: Main test build succeeded (1 job)
**Message 9: BBlack (@bblack)** - 10/21/2022, 8:56:46 PM
Uploaded patch set 5: New patch set was added with same tree, parent, and commit message as Patch Set 4.

**Message 10:** 🤖 10/21/2022, 8:58:53 PM - Verified+2: Main test build succeeded (1 job)
**Message 11: Valentin Gutierrez (@vgutierrez)** - 10/26/2022, 10:04:14 AM
Patch Set 5: Code-Review+1

(1 comment)

> **Inline Comments (1):**
>
> **Patchset:** - Vgutierrez
> looks good, please add Bug: T288106 to the commit message before merging
>

**Message 12: BBlack (@bblack)** - 10/26/2022, 2:54:33 PM
Uploaded patch set 6.

**Message 13:** 🤖 10/26/2022, 2:57:12 PM - Verified+2: Main test build succeeded (1 job)
**Message 14: BBlack (@bblack)** - 10/26/2022, 2:58:05 PM
Uploaded patch set 7: Commit message was updated.

**Message 15: BBlack (@bblack)** - 10/26/2022, 2:58:42 PM
Patch Set 7:

(1 comment)

> **Inline Comments (1):**
>
> **Patchset:** - BBlack
> Done
>

**Message 16:** 🤖 10/26/2022, 2:59:28 PM - Verified+2: Main test build succeeded (1 job)
**Message 17: Valentin Gutierrez (@vgutierrez)** - 10/26/2022, 3:04:52 PM
Patch Set 7: Code-Review+1

**Message 18: BBlack (@bblack)** - 10/26/2022, 3:05:45 PM
Patch Set 7: Code-Review+2

**Message 19: BBlack (@bblack)** - 10/26/2022, 3:05:50 PM
Change has been successfully rebased and submitted as 3a6a6af5c78783a4bf7098bb6a1e6eb13166ca8c


## Review 27: 570942 - NewFilesPager: Apply STRAIGHT_JOIN to all code paths

- **URL:** https://gerrit.wikimedia.org/r/c/570942
- **Author:** Anomie (@anomie) <anomie.wikipedia@gmail.com>
- **Project:** mediawiki/core
- **Branch:** master
- **Status:** MERGED
- **Created:** 2020-02-07 19:18:13.000000000
- **Updated:** 2020-02-07 21:06:57.000000000

**Commit Message:**

```
NewFilesPager: Apply STRAIGHT_JOIN to all code paths

In Iad7c96ed4 we added a STRAIGHT_JOIN to one code path to work around
MariaDB planner oddities. Now similar problems have occurred with a much
simpler code path, so let's apply the STRAIGHT_JOIN unconditionally.

Bug: T244533
Change-Id: I6f3740b7ce6c2d929240e9842e61dad45d8290df
```

**Messages:** 12
**Inline Comments:** 0

**Message 1: Anomie (@anomie)** - 2/7/2020, 7:18:13 PM
Uploaded patch set 1.

**Message 2:** 🤖 2/7/2020, 7:20:42 PM - PHP: PHP test coverage increased (or stayed t...
**Message 3:** 🤖 2/7/2020, 7:21:18 PM - This: This patch might be adding a page load c...
**Message 4:** 🤖 2/7/2020, 7:34:59 PM - Verified-1: Main test build failed
**Message 5: SonarQube Bot (@sonarqubebot)** - 2/7/2020, 7:39:11 PM
Patch Set 1: Verified+1

✔ Quality gate passed!


* ✔ reliability rating
* ✔ security rating
* ✔ maintainability rating
* ✔ duplicated lines density

Report: https://sonarcloud.io/dashboard?id=mediawiki-core&branch=570942-1 Please give feedback and report false positives at https://www.mediawiki.org/wiki/Talk:Continuous_integration/Codehealth_Pipeline

**Message 6: Anomie (@anomie)** - 2/7/2020, 7:45:36 PM
Patch Set 1:

recheck

**Message 7:** 🤖 2/7/2020, 8:03:05 PM - Verified+2: Main test build succeeded
**Message 8: Jdforrester (🙄) (@jforrester)** - 2/7/2020, 8:40:47 PM
Patch Set 1: Code-Review+2

**Message 9:** 🤖 2/7/2020, 8:40:53 PM - -Verified: Starting gate
**Message 10:** 🤖 2/7/2020, 8:55:14 PM - Verified+2: Gate pipeline
**Message 11:** 🤖 2/7/2020, 8:55:14 PM - Change has been successfully merged by j...
**Message 12:** 🤖 2/7/2020, 9:06:57 PM - Post-: Post-merge build succeeded.

## Review 28: 595149 - monitoring: remove usages of 'dba' contact group

- **URL:** https://gerrit.wikimedia.org/r/c/595149
- **Author:** Jaime Crespo (@jynus) <jcrespo@wikimedia.org>
- **Project:** operations/puppet
- **Branch:** production
- **Status:** MERGED
- **Created:** 2020-05-08 10:39:35.000000000
- **Updated:** 2020-05-13 07:04:13.000000000

**Commit Message:**

```
monitoring: remove usages of 'dba' contact group

Bug: T237927
Bug: T172492
Change-Id: Ie00778d0d8a1f23bea423dc23f057ba1d5efd9a2
```

**Messages:** 9
**Inline Comments:** 1

**Message 1: Jaime Crespo (@jynus)** - 5/8/2020, 10:39:35 AM
Uploaded patch set 1.

**Message 2:** 🤖 5/8/2020, 10:40:43 AM - Verified+2: Main test build succeeded
**Message 3: Jaime Crespo (@jynus)** - 5/8/2020, 10:46:47 AM
Patch Set 1:

This should stop the sms of non-critical alerts.

**Message 4: Marostegui (@marostegui)** - 5/8/2020, 10:49:58 AM
Patch Set 1:

(1 comment)

> **Inline Comments (1):**
>
> **modules/mariadb/manifests/monitor_process.pp:5** - Marostegui
> I think this should be sms or something, It is critical enough to page if processes crash and with this change looks like it will just be IRC: 
> https://puppet-compiler.wmflabs.org/compiler1003/22420/db1097.eqiad.wmnet/index.html
>

**Message 5: Marius Hoch (Hoo man) (@hoo)** - 5/8/2020, 11:01:46 AM
Patch Set 1: Code-Review+1

**Message 6: Jaime Crespo (@jynus)** - 5/13/2020, 7:02:15 AM
Patch Set 2: Patch Set 1 was rebased

**Message 7:** 🤖 5/13/2020, 7:03:21 AM - Verified+2: Main test build succeeded
**Message 8: Jaime Crespo (@jynus)** - 5/13/2020, 7:04:09 AM
Patch Set 2: Code-Review+2

+2 after discussing this with manuel last week clarifying the (mostly) noop.

**Message 9: Jaime Crespo (@jynus)** - 5/13/2020, 7:04:13 AM
Change has been successfully merged by Jcrespo


## Review 29: 838182 - envoy: Add service proxys for cirrussearch read traffic

- **URL:** https://gerrit.wikimedia.org/r/c/838182
- **Author:** Ebernhardson (@ebernhardson) <ebernhardson@wikimedia.org>
- **Project:** operations/puppet
- **Branch:** production
- **Status:** NEW
- **Created:** 2022-10-04 15:41:59.000000000
- **Updated:** 2023-01-30 08:56:59.000000000

**Commit Message:**

```
envoy: Add service proxys for cirrussearch read traffic

These proxies will be used to serve all read traffic for cirrussearch,
allowing traffic to be shifted between datacenters with the typical
SRE tooling rather than a bespoke configuration parameter in
mediawiki-config.

Bug: T143553
Change-Id: Ie6dfb586f6b22867a13b8b29d920da8409e94015
```

**Messages:** 3
**Inline Comments:** 6

**Message 1: Ebernhardson (@ebernhardson)** - 10/4/2022, 3:41:59 PM
Uploaded patch set 1.

**Message 2:** 🤖 10/4/2022, 3:42:35 PM - Verified+2: Main test build succeeded (1 job)
**Message 3: joe (@oblivian)** - 1/30/2023, 8:56:59 AM
Patch Set 1: Code-Review-1

(2 comments)

> **Inline Comments (2):**
>
> **Patchset:** - Giuseppe Lavagetto
> LGTM, minus the fact you also need to add the services to the allowed_listeners list below (see comment inline)
>
> **hieradata/common/profile/services_proxy/envoy.yaml:302** - Giuseppe Lavagetto
> You should add your new listeners here if you want it to get to the mediawiki appservers and mediawiki ok k8s
>


## Review 30: 344152 - authdns: never restart gdnsd, keep initial install working right

- **URL:** https://gerrit.wikimedia.org/r/c/344152
- **Author:** BBlack (@bblack) <bblack@wikimedia.org>
- **Project:** operations/puppet
- **Branch:** production
- **Status:** MERGED
- **Created:** 2017-03-22 14:33:51.000000000
- **Updated:** 2017-03-22 16:09:01.000000000

**Commit Message:**

```
authdns: never restart gdnsd, keep initial install working right

Change-Id: I750e258dc5d55b3290c626fd90a14cb70f4c8705
```

**Messages:** 8
**Inline Comments:** 0

**Message 1: BBlack (@bblack)** - 3/22/2017, 2:33:51 PM
Uploaded patch set 1.

**Message 2:** 🤖 3/22/2017, 2:37:58 PM - Verified-1: Main test build failed
**Message 3: BBlack (@bblack)** - 3/22/2017, 2:50:50 PM
Uploaded patch set 2.

**Message 4:** 🤖 3/22/2017, 2:51:45 PM - Verified+2: Main test build succeeded
**Message 5: BBlack (@bblack)** - 3/22/2017, 4:01:11 PM
Uploaded patch set 3: Patch Set 2 was rebased.

**Message 6:** 🤖 3/22/2017, 4:02:13 PM - Verified+2: Main test build succeeded
**Message 7: BBlack (@bblack)** - 3/22/2017, 4:08:59 PM
Patch Set 3: Code-Review+2

**Message 8: BBlack (@bblack)** - 3/22/2017, 4:09:01 PM
Change has been successfully merged by BBlack


## Review 31: 619258 - mariadb: Add memory check to most other mariadb roles other than core

- **URL:** https://gerrit.wikimedia.org/r/c/619258
- **Author:** Jaime Crespo (@jynus) <jcrespo@wikimedia.org>
- **Project:** operations/puppet
- **Branch:** production
- **Status:** MERGED
- **Created:** 2020-08-10 08:16:59.000000000
- **Updated:** 2020-08-10 13:53:37.000000000

**Commit Message:**

```
mariadb: Add memory check to most other mariadb roles other than core

After proving the memory check works on hosts with the core role,
apply it to most other mariadb hosts to check for missconfigurations/
bad states.

In particular, apply to tendril, and dbstore (including analytics) and
wikireplicas hosts that had memory leaks/high pressure in the past.

Bug: T172490
Change-Id: Ic5b0f93222308bea7b322d09d7891aeedf8ff2ae
```

**Messages:** 11
**Inline Comments:** 0

**Message 1: Jaime Crespo (@jynus)** - 8/10/2020, 8:16:59 AM
Uploaded patch set 1.

**Message 2:** 🤖 8/10/2020, 8:18:20 AM - Verified+2: Main test build succeeded
**Message 3: Jaime Crespo (@jynus)** - 8/10/2020, 8:28:44 AM
Topic backups removed

**Message 4: Jaime Crespo (@jynus)** - 8/10/2020, 8:28:49 AM
Topic set to memory_check

**Message 5: Jaime Crespo (@jynus)** - 8/10/2020, 9:09:18 AM
Patch Set 2: Commit message was updated.

**Message 6:** 🤖 8/10/2020, 9:10:39 AM - Verified+2: Main test build succeeded
**Message 7: Marostegui (@marostegui)** - 8/10/2020, 9:31:58 AM
Patch Set 2: Code-Review+1

**Message 8: Filippo Giunchedi (@filippo)** - 8/10/2020, 1:21:43 PM
Patch Set 2: Code-Review+1

**Message 9: Elukey (@elukey)** - 8/10/2020, 1:25:47 PM
Patch Set 2: Code-Review+1

**Message 10: Jaime Crespo (@jynus)** - 8/10/2020, 1:53:32 PM
Patch Set 2: Code-Review+2

**Message 11: Jaime Crespo (@jynus)** - 8/10/2020, 1:53:37 PM
Change has been successfully rebased and submitted as 0cba0da322a28111c0887f583870f4e0ebbf3231 by Jcrespo


## Review 32: 319806 - Allow SSL (TLS) and performance_schema on misc servers

- **URL:** https://gerrit.wikimedia.org/r/c/319806
- **Author:** Jaime Crespo (@jynus) <jcrespo@wikimedia.org>
- **Project:** operations/puppet
- **Branch:** production
- **Status:** MERGED
- **Created:** 2016-11-04 09:28:05.000000000
- **Updated:** 2016-11-04 10:48:54.000000000

**Commit Message:**

```
Allow SSL (TLS) and performance_schema on misc servers

Bug: T111654
Bug: T99485
Change-Id: If2ccbdd6eaa0cac268ce26bcd9985658cc298dc5
```

**Messages:** 13
**Inline Comments:** 0

**Message 1: Jaime Crespo (@jynus)** - 11/4/2016, 9:28:05 AM
Uploaded patch set 1.

**Message 2:** 🤖 11/4/2016, 9:29:24 AM - Verified+2: Main test build succeeded
**Message 3: Jaime Crespo (@jynus)** - 11/4/2016, 10:15:09 AM
Patch Set 2: Patch Set 1 was rebased

**Message 4:** 🤖 11/4/2016, 10:15:35 AM - Verified-1: Merge Failed.
**Message 5: Jaime Crespo (@jynus)** - 11/4/2016, 10:32:43 AM
Uploaded patch set 3.

**Message 6:** 🤖 11/4/2016, 10:33:49 AM - Verified-1: Main test build failed
**Message 7: Jaime Crespo (@jynus)** - 11/4/2016, 10:35:59 AM
Patch Set 3: Code-Review+2 Verified+2

**Message 8: Jaime Crespo (@jynus)** - 11/4/2016, 10:43:41 AM
Patch Set 4: Patch Set 3 was rebased

**Message 9:** 🤖 11/4/2016, 10:45:09 AM - Verified-1: Main test build failed
**Message 10: Jaime Crespo (@jynus)** - 11/4/2016, 10:45:23 AM
Patch Set 4: Verified+2

**Message 11: joe (@oblivian)** - 11/4/2016, 10:47:26 AM
Patch Set 4: Verified+2

**Message 12: joe (@oblivian)** - 11/4/2016, 10:47:46 AM
Removed the following votes:

* Verified-1 by jenkins-bot <>


**Message 13: Unknown** - 11/4/2016, 10:48:54 AM
Change has been successfully merged by Jcrespo


## Review 33: 616564 - admins: turn all wdqs-admins into wdqs-roots

- **URL:** https://gerrit.wikimedia.org/r/c/616564
- **Author:** Daniel Zahn (@dzahn) <dzahn@wikimedia.org>
- **Project:** operations/puppet
- **Branch:** production
- **Status:** ABANDONED
- **Created:** 2020-07-27 17:28:34.000000000
- **Updated:** 2020-07-30 17:45:02.000000000

**Commit Message:**

```
admins: turn all wdqs-admins into wdqs-roots

As requested and approved in today's SRE meeting, turn all
wdqs-admins into full wdqs-roots.

replacing Ic709e02c352c and I536f37d7ec7d

After it's not used anymore also remove the wdqs-admins group.

Adjust which group gets used on deployment servers to make
sure the same people keep access there.

Bug: T258739
Change-Id: I181b230db3a2a8f61c7d562e9ac3420ad0613b01
```

**Messages:** 14
**Inline Comments:** 4

**Message 1: Daniel Zahn (@dzahn)** - 7/27/2020, 5:28:34 PM
Uploaded patch set 1.

**Message 2:** 🤖 7/27/2020, 5:29:30 PM - Verified+2: Main test build succeeded
**Message 3: Daniel Zahn (@dzahn)** - 7/27/2020, 5:30:13 PM
Topic 616159 removed

**Message 4: Daniel Zahn (@dzahn)** - 7/27/2020, 5:30:17 PM
Topic set to access-requests

**Message 5: Daniel Zahn (@dzahn)** - 7/27/2020, 5:31:24 PM
Uploaded patch set 2.

**Message 6:** 🤖 7/27/2020, 5:32:24 PM - Verified+2: Main test build succeeded
**Message 7: Daniel Zahn (@dzahn)** - 7/27/2020, 5:34:30 PM
Uploaded patch set 3.

**Message 8:** 🤖 7/27/2020, 5:35:24 PM - Verified+2: Main test build succeeded
**Message 9: Daniel Zahn (@dzahn)** - 7/27/2020, 8:08:43 PM
Assignee added: Herron <kherron@wikimedia.org>

**Message 10: Herron (@herron)** - 7/27/2020, 8:46:05 PM
Patch Set 3:

(2 comments)

Thanks for this!  Please see comments inline.

Also, I see some a few other references to wdqs-admins in puppet, but afaict are independent from the shell user (monitoring and cron contacts).  Possibly worth aligning those but wouldn't need to happen for this effort.

> **Inline Comments (2):**
>
> **/COMMIT_MSG:14** - Herron
> I think we can drop this line since it's being removed here
>
> **modules/admin/data/data.yaml:410** - Herron
> we'll need to ensure: absent this before deleting the block, yes?
>

**Message 11: Daniel Zahn (@dzahn)** - 7/27/2020, 8:49:53 PM
Patch Set 3:

(2 comments)

> **Inline Comments (2):**
>
> **/COMMIT_MSG:14** - Dzahn
> Bad wording. I meant to say that this patch also fully removes the group since now it doesn't have any members and is not used anymore. Amended.
>
> **modules/admin/data/data.yaml:410** - Dzahn
> Yea, that's right. Actually this should be 2 separate patches as i originally started. Let me split this up into multiple patches.
>

**Message 12: Daniel Zahn (@dzahn)** - 7/27/2020, 8:51:24 PM
Patch Set 3:

> Also, I see some a few other references to wdqs-admins in puppet, but afaict are independent from the shell user (monitoring and cron contacts)

Yes, that threw me off as well but then it looked like that is just an Icinga contact group that has the same name but is not further related to the shell group.

**Message 13: Daniel Zahn (@dzahn)** - 7/27/2020, 9:01:12 PM
Patch Set 3: Code-Review-2

let's start with just this https://gerrit.wikimedia.org/r/c/operations/puppet/+/616593

**Message 14: Daniel Zahn (@dzahn)** - 7/30/2020, 5:45:02 PM
Abandoned

replaced by multiple steps that are already merged, ticket is resolved


## Review 34: 450228 - mariadb: Enable read_only monitoring on core mariadb hosts

- **URL:** https://gerrit.wikimedia.org/r/c/450228
- **Author:** Jaime Crespo (@jynus) <jcrespo@wikimedia.org>
- **Project:** operations/puppet
- **Branch:** production
- **Status:** MERGED
- **Created:** 2018-08-03 13:55:04.000000000
- **Updated:** 2018-09-19 07:37:37.000000000

**Commit Message:**

```
mariadb: Enable read_only monitoring on core mariadb hosts

Check all hosts are in read_only = 1 status,
except the masters of the primary_db, which are in read_only = 0.
While this uses puppet, it is in origin conftool-controlled.

Bug: T172489
Change-Id: I2b07f3b21a6124b15d3d73d2c29f9faabc12aaae
```

**Messages:** 21
**Inline Comments:** 0

**Message 1: Jaime Crespo (@jynus)** - 8/3/2018, 1:55:04 PM
Uploaded patch set 1.

**Message 2:** 🤖 8/3/2018, 1:55:44 PM - Verified-1: Main test build failed
**Message 3: Jaime Crespo (@jynus)** - 8/3/2018, 1:59:35 PM
Uploaded patch set 2.

**Message 4:** 🤖 8/3/2018, 2:00:13 PM - Verified-1: Main test build failed
**Message 5: Jaime Crespo (@jynus)** - 8/3/2018, 2:01:54 PM
Uploaded patch set 3.

**Message 6:** 🤖 8/3/2018, 2:02:30 PM - Verified+2: Main test build succeeded
**Message 7: Jaime Crespo (@jynus)** - 8/3/2018, 2:19:59 PM
Patch Set 3:

This conflicts with https://gerrit.wikimedia.org/r/449742 , depending which goes first, it will need changes to not use ::mw_primary

**Message 8: Jaime Crespo (@jynus)** - 9/11/2018, 1:13:28 PM
Uploaded patch set 4.

**Message 9:** 🤖 9/11/2018, 1:14:02 PM - Verified+2: Main test build succeeded
**Message 10: Jaime Crespo (@jynus)** - 9/13/2018, 4:24:40 PM
Uploaded patch set 5: Patch Set 4 was rebased.

**Message 11:** 🤖 9/13/2018, 4:25:21 PM - Verified+2: Main test build succeeded
**Message 12: Jaime Crespo (@jynus)** - 9/14/2018, 11:05:03 AM
Uploaded patch set 6: Patch Set 5 was rebased.

**Message 13:** 🤖 9/14/2018, 11:05:54 AM - Verified+2: Main test build succeeded
**Message 14: Jaime Crespo (@jynus)** - 9/18/2018, 7:24:48 AM
Uploaded patch set 7: Patch Set 6 was rebased.

**Message 15:** 🤖 9/18/2018, 7:25:33 AM - Verified+2: Main test build succeeded
**Message 16: Jaime Crespo (@jynus)** - 9/19/2018, 7:33:36 AM
Patch Set 8: Patch Set 7 was rebased

**Message 17:** 🤖 9/19/2018, 7:34:12 AM - Verified+2: Main test build succeeded
**Message 18: Jaime Crespo (@jynus)** - 9/19/2018, 7:36:37 AM
Patch Set 9: Patch Set 8 was rebased

**Message 19:** 🤖 9/19/2018, 7:37:16 AM - Verified+2: Main test build succeeded
**Message 20: Jaime Crespo (@jynus)** - 9/19/2018, 7:37:33 AM
Patch Set 9: Code-Review+2

**Message 21: Jaime Crespo (@jynus)** - 9/19/2018, 7:37:37 AM
Change has been successfully merged by Jcrespo


## Review 35: 743910 - cache: enable single backend experiment on cp3051

- **URL:** https://gerrit.wikimedia.org/r/c/743910
- **Author:** Ema (@ema) <ema@wikimedia.org>
- **Project:** operations/puppet
- **Branch:** production
- **Status:** MERGED
- **Created:** 2021-12-06 09:21:04.000000000
- **Updated:** 2021-12-08 10:25:36.000000000

**Commit Message:**

```
cache: enable single backend experiment on cp3051

Set cache::single_backend_fqdn to cp3051 for upload@esams. There are
currently two puppet roles used in esams to configure cache_upload
nodes, namely cache::upload and cache::upload_haproxy. Set the hiera
value for both.

Bug: T288106
Hosts: cp3051.esams.wmnet,cp3053.esams.wmnet,cp3065.esams.wmnet
Change-Id: Ib0dfb5ba16c03c19cd6e56f82b3c559424b1a2b5
```

**Messages:** 6
**Inline Comments:** 1

**Message 1: Ema (@ema)** - 12/6/2021, 9:21:04 AM
Uploaded patch set 1.

**Message 2:** 🤖 12/6/2021, 9:22:27 AM - Verified+2: Main test build succeeded (1 job)
**Message 3: Ema (@ema)** - 12/6/2021, 9:24:10 AM
Patch Set 1:

(1 comment)

> **Inline Comments (1):**
>
> **Patchset:** - Ema
> check experimental
>

**Message 4:** 🤖 12/6/2021, 9:25:31 AM - Experimental: Experimental build succeeded. (1 job)
**Message 5: Ema (@ema)** - 12/8/2021, 10:25:33 AM
Patch Set 1: Code-Review+2

**Message 6: Ema (@ema)** - 12/8/2021, 10:25:36 AM
Change has been successfully rebased and submitted as 8e112f2dc383772b219cc76ffdad186495f8b435


## Review 36: 450145 - Register all command line options

- **URL:** https://gerrit.wikimedia.org/r/c/450145
- **Author:** Bill Pirkle (@bpirkle) <bpirkle@wikimedia.org>
- **Project:** mediawiki/extensions/DumpHTML
- **Branch:** master
- **Status:** MERGED
- **Created:** 2018-08-02 20:32:55.000000000
- **Updated:** 2018-08-06 04:54:44.000000000

**Commit Message:**

```
Register all command line options

T110209 causes maintenance scripts to fail on unknown options.
Ensure all recognized options are registered.

Bug: T110209
Change-Id: I7fe691cfd2678531a00305b791416679c7516347
```

**Messages:** 11
**Inline Comments:** 1

**Message 1: Bill Pirkle (@bpirkle)** - 8/2/2018, 8:32:55 PM
Uploaded patch set 1.

**Message 2:** 🤖 8/2/2018, 8:51:47 PM - Verified+2: Main test build succeeded
**Message 3: Bill Pirkle (@bpirkle)** - 8/3/2018, 3:24:21 PM
Patch Set 1:

Adding as reviewers some people from T99268, which is also maintenance-related

**Message 4: Reedy (@reedy)** - 8/4/2018, 1:32:05 AM
Patch Set 1: Code-Review-1

(1 comment)

> **Inline Comments (1):**
>
> **dumpHTML.php:42** - Reedy
> Can we do this without excessive indenting? :)
> 
> Generally, in MW code style, we would just add one level of indenting with each round brackets
>

**Message 5: Timo Tijhof (@krinkle)** - 8/6/2018, 12:23:10 AM
Patch Set 2: Published edit on patch set 1.

**Message 6: Timo Tijhof (@krinkle)** - 8/6/2018, 12:24:31 AM
Patch Set 2: Code-Review+1

**Message 7:** 🤖 8/6/2018, 12:29:04 AM - Verified+2: Main test build succeeded
**Message 8: Tim Starling (@tstarling)** - 8/6/2018, 4:47:52 AM
Patch Set 2: Code-Review+2

**Message 9:** 🤖 8/6/2018, 4:47:57 AM - -Verified: Starting gate
**Message 10:** 🤖 8/6/2018, 4:54:44 AM - Verified+2: Gate pipeline
**Message 11:** 🤖 8/6/2018, 4:54:44 AM - Change has been successfully merged by j...

## Review 37: 391997 - db-eqiad.php: Increase weight for some hosts

- **URL:** https://gerrit.wikimedia.org/r/c/391997
- **Author:** Marostegui (@marostegui) <marostegui@wikimedia.org>
- **Project:** operations/mediawiki-config
- **Branch:** master
- **Status:** MERGED
- **Created:** 2017-11-17 07:39:51.000000000
- **Updated:** 2017-11-17 08:28:32.000000000

**Commit Message:**

```
db-eqiad.php: Increase weight for some hosts

Give more traffic to the hosts that were out after the schema change
revert

Bug: T180714
Change-Id: Ie7bb65a02d185ee8159cfd695eff4a2bc6a1f322
```

**Messages:** 7
**Inline Comments:** 0

**Message 1: Marostegui (@marostegui)** - 11/17/2017, 7:39:51 AM
Uploaded patch set 1.

**Message 2:** 🤖 11/17/2017, 7:41:05 AM - Verified+2: Main test build succeeded
**Message 3: Marostegui (@marostegui)** - 11/17/2017, 8:27:07 AM
Patch Set 1: Code-Review+2

**Message 4:** 🤖 11/17/2017, 8:27:13 AM - -Verified: Starting gate
**Message 5:** 🤖 11/17/2017, 8:28:21 AM - Change has been successfully merged by j...
**Message 6:** 🤖 11/17/2017, 8:28:21 AM - Verified+2: Gate pipeline
**Message 7:** 🤖 11/17/2017, 8:28:32 AM - Post-: Post-merge build succeeded.

## Review 38: 539551 - Add commit action to the Homer class

- **URL:** https://gerrit.wikimedia.org/r/c/539551
- **Author:** Volans (@volans) <rcoccioli@wikimedia.org>
- **Project:** operations/software/homer
- **Branch:** master
- **Status:** MERGED
- **Created:** 2019-09-27 15:15:14.000000000
- **Updated:** 2019-10-07 17:35:20.000000000

**Commit Message:**

```
Add commit action to the Homer class

* Add a commit action that requires a commit message
* Move CLI actions into subparsers

Bug: T228388
Change-Id: I62f1468db9918afeec3a2afb669f37be442079b1
```

**Messages:** 24
**Inline Comments:** 8

**Message 1: Volans (@volans)** - 9/27/2019, 3:15:14 PM
Uploaded patch set 1.

**Message 2:** 🤖 9/27/2019, 3:18:33 PM - Verified+2: Main test build succeeded
**Message 3: Volans (@volans)** - 9/27/2019, 9:43:20 PM
Uploaded patch set 2: Patch Set 1 was rebased.

**Message 4:** 🤖 9/27/2019, 9:46:11 PM - Verified+2: Main test build succeeded
**Message 5: Volans (@volans)** - 9/27/2019, 9:52:35 PM
Uploaded patch set 3.

**Message 6:** 🤖 9/27/2019, 9:55:41 PM - Verified+2: Main test build succeeded
**Message 7: Arzhel (@ayounsi)** - 9/27/2019, 10:44:55 PM
Patch Set 3:

(3 comments)

Looks good overall, a few comments inline.

> **Inline Comments (3):**
>
> **homer/__init__.py:151** - Ayounsi
> Extra indentation?
>
> **homer/__init__.py:169** - Ayounsi
> typo
>
> **homer/transports/junos.py:76** - Ayounsi
> We should pass a comment parameter with at least the name of the person doing the commit if ran as the "homer" user. We could also force the user to provide a commit message in the prompt, or the command line.
> 
> Also do a commit confirm 2, then right after a commit check to make it permanent.
> That way if the commit causes connectivity loss to the device, it will rollback automatically after 2 min.
>

**Message 8: Volans (@volans)** - 9/30/2019, 4:45:13 PM
Patch Set 3:

(3 comments)

REplies inline, no changes yet.

> **Inline Comments (3):**
>
> **homer/__init__.py:151** - Volans
> No, that's a function defined inside the method to be passed at line 173 to the commit() call. Rememeber, almost everything is an object in python, including functions themselves ;)
>
> **homer/__init__.py:169** - Volans
> Done
>
> **homer/transports/junos.py:76** - Volans
> Thanks for the suggestions, I'll add them both in the next PS.
>

**Message 9: Volans (@volans)** - 10/3/2019, 6:06:00 PM
Uploaded patch set 4.

**Message 10:** 🤖 10/3/2019, 6:09:19 PM - Verified-1: Main test build failed
**Message 11: Volans (@volans)** - 10/3/2019, 6:13:11 PM
Uploaded patch set 5.

**Message 12:** 🤖 10/3/2019, 6:18:03 PM - Verified+2: Main test build succeeded
**Message 13: Volans (@volans)** - 10/3/2019, 8:49:40 PM
Uploaded patch set 6.

**Message 14:** 🤖 10/3/2019, 8:53:03 PM - Verified+2: Main test build succeeded
**Message 15: Volans (@volans)** - 10/3/2019, 9:22:02 PM
Uploaded patch set 7.

**Message 16:** 🤖 10/3/2019, 9:25:20 PM - Verified+2: Main test build succeeded
**Message 17: Volans (@volans)** - 10/3/2019, 9:41:05 PM
Uploaded patch set 8.

**Message 18:** 🤖 10/3/2019, 9:43:48 PM - Verified+2: Main test build succeeded
**Message 19: Arzhel (@ayounsi)** - 10/7/2019, 5:26:05 PM
Uploaded patch set 9.

**Message 20:** 🤖 10/7/2019, 5:28:53 PM - Verified+2: Main test build succeeded
**Message 21: Arzhel (@ayounsi)** - 10/7/2019, 5:32:43 PM
Patch Set 9: Code-Review+2

(2 comments)

There is a bug on (at least some of) the SRXs where the commit check times out and never validates the commit check.
We will investigate it later on, but this works for all the other devices types tested.

> **Inline Comments (2):**
>
> **homer/__init__.py:151** - Ayounsi
> Done
>
> **homer/transports/junos.py:76** - Ayounsi
> Done
>

**Message 22: Arzhel (@ayounsi)** - 10/7/2019, 5:32:49 PM
Change has been successfully merged by Ayounsi

**Message 23:** 🤖 10/7/2019, 5:33:45 PM - Post-: Post-merge build succeeded.
**Message 24:** 🤖 10/7/2019, 5:35:20 PM - Gate: Gate pipeline

## Review 39: 241111 - puppet-lint: enable quoted_booleans-check

- **URL:** https://gerrit.wikimedia.org/r/c/241111
- **Author:** Antoine Musso (@hashar) <hashar@free.fr>
- **Project:** operations/puppet
- **Branch:** production
- **Status:** MERGED
- **Created:** 2015-09-25 18:39:01.000000000
- **Updated:** 2015-10-02 13:58:50.000000000

**Commit Message:**

```
puppet-lint: enable quoted_booleans-check

Because mixing quoted booleans and unquoted ones are a source of
confusion and nasty errors.

Bug: T113783
Change-Id: Ia783c5fc0c8314809065f0fcb2412e1b66f42f86
```

**Messages:** 13
**Inline Comments:** 0

**Message 1: Antoine Musso (@hashar)** - 9/25/2015, 6:39:01 PM
Uploaded patch set 1.

**Message 2:** 🤖 9/25/2015, 6:39:52 PM - Verified+2: Main test build succeeded
**Message 3: Andrew Bogott (@andrew)** - 9/25/2015, 6:44:09 PM
Patch Set 1:

I love this but need to do a lot of fixing first

**Message 4: Daniel Zahn (@dzahn)** - 9/25/2015, 6:46:35 PM
Patch Set 1:

there are quite a few other checks disabled that we can maybe enable already or are closer to being fixed globally. for example, how about --no-variables_not_enclosed-check , i'll take a look

**Message 5: Daniel Zahn (@dzahn)** - 9/29/2015, 11:16:12 PM
Patch Set 1:

only after all the existing issues have been fixed or the special comment has been added to disable the checks

**Message 6: Andrew Bogott (@andrew)** - 10/2/2015, 1:33:31 PM
Patch Set 2: Patch Set 1 was rebased

**Message 7:** 🤖 10/2/2015, 1:34:15 PM - Verified+2: Main test build succeeded
**Message 8: Antoine Musso (@hashar)** - 10/2/2015, 1:44:27 PM
Patch Set 2:

Note since quoted_boolean is just a warning, that is only caught by the strict job which is NOT voting.

I commented about it on T113783


If we manage to fix all warnings, we can drop the 'lenient' job and make the 'strict' one which will catch any warnings and prevent future addition of quoted booleans.

**Message 9: Andrew Bogott (@andrew)** - 10/2/2015, 1:55:14 PM
Patch Set 3: Patch Set 2 was rebased

**Message 10:** 🤖 10/2/2015, 1:55:55 PM - Verified+2: Main test build succeeded
**Message 11: Andrew Bogott (@andrew)** - 10/2/2015, 1:57:21 PM
Patch Set 3: Code-Review+2

**Message 12: Andrew Bogott (@andrew)** - 10/2/2015, 1:57:23 PM
Change has been successfully merged into the git repository.

**Message 13:** 🤖 10/2/2015, 1:58:50 PM - Post-: Post-merge build succeeded.

## Review 40: 661539 - profile: onboard icinga logging to common logging schema

- **URL:** https://gerrit.wikimedia.org/r/c/661539
- **Author:** Cwhite (@cwhite) <cwhite@wikimedia.org>
- **Project:** operations/puppet
- **Branch:** production
- **Status:** MERGED
- **Created:** 2021-02-04 00:48:27.000000000
- **Updated:** 2021-02-04 16:03:22.000000000

**Commit Message:**

```
profile: onboard icinga logging to common logging schema

Bug: T234565
Change-Id: I4149d23acd88580dcee98a929719ac3dadb93793
```

**Messages:** 6
**Inline Comments:** 0

**Message 1: Cwhite (@cwhite)** - 2/4/2021, 12:48:27 AM
Uploaded patch set 1.

**Message 2: Cwhite (@cwhite)** - 2/4/2021, 12:49:36 AM
Uploaded patch set 2: Commit message was updated.

**Message 3:** 🤖 2/4/2021, 12:51:17 AM - Verified+2: Main test build succeeded (2 jobs)
**Message 4: Filippo Giunchedi (@filippo)** - 2/4/2021, 11:44:03 AM
Patch Set 2: Code-Review+1

**Message 5: Cwhite (@cwhite)** - 2/4/2021, 4:03:18 PM
Patch Set 2: Code-Review+2

**Message 6: Cwhite (@cwhite)** - 2/4/2021, 4:03:22 PM
Change has been successfully rebased and submitted as fc28eaec7904172992309d3a393fadf60eb73180 by Cwhite


## Review 41: 565019 - cache: enable systemd resources accounting on cp4026

- **URL:** https://gerrit.wikimedia.org/r/c/565019
- **Author:** Ema (@ema) <ema@wikimedia.org>
- **Project:** operations/puppet
- **Branch:** production
- **Status:** MERGED
- **Created:** 2020-01-15 13:56:25.000000000
- **Updated:** 2020-01-15 15:13:16.000000000

**Commit Message:**

```
cache: enable systemd resources accounting on cp4026

Bug: T183146
Change-Id: I32319f14a70e3e00d647e11b173a7c556c5488d9
```

**Messages:** 15
**Inline Comments:** 0

**Message 1: Ema (@ema)** - 1/15/2020, 1:56:25 PM
Uploaded patch set 1.

**Message 2:** 🤖 1/15/2020, 1:58:36 PM - Verified+2: Main test build succeeded
**Message 3: Ema (@ema)** - 1/15/2020, 1:59:37 PM
Uploaded patch set 2.

**Message 4:** 🤖 1/15/2020, 2:02:04 PM - Verified+2: Main test build succeeded
**Message 5: Ema (@ema)** - 1/15/2020, 2:03:24 PM
Uploaded patch set 3.

**Message 6:** 🤖 1/15/2020, 2:05:31 PM - Verified+2: Main test build succeeded
**Message 7: Ema (@ema)** - 1/15/2020, 2:31:00 PM
Uploaded patch set 4: Patch Set 3 was rebased.

**Message 8:** 🤖 1/15/2020, 2:33:28 PM - Verified+2: Main test build succeeded
**Message 9: Ema (@ema)** - 1/15/2020, 2:35:05 PM
Uploaded patch set 5: Patch Set 4 was rebased.

**Message 10:** 🤖 1/15/2020, 2:37:25 PM - Verified+2: Main test build succeeded
**Message 11: Muehlenhoff (@jmm)** - 1/15/2020, 2:45:00 PM
Patch Set 5: Code-Review+1

Let's give it a shot, curious to see the performance impact!

**Message 12: Ema (@ema)** - 1/15/2020, 2:48:19 PM
Uploaded patch set 6: Patch Set 5 was rebased.

**Message 13:** 🤖 1/15/2020, 2:49:21 PM - Verified+2: Main test build succeeded
**Message 14: Ema (@ema)** - 1/15/2020, 3:13:14 PM
Patch Set 6: Code-Review+2

**Message 15: Ema (@ema)** - 1/15/2020, 3:13:16 PM
Change has been successfully rebased and submitted as ba8393998c5b8631fbaf86d82f84778661bf338a by Ema


## Review 42: 766577 - appserver: remove http pool from backends

- **URL:** https://gerrit.wikimedia.org/r/c/766577
- **Author:** joe (@oblivian) <glavagetto@wikimedia.org>
- **Project:** operations/puppet
- **Branch:** production
- **Status:** MERGED
- **Created:** 2022-02-28 09:26:10.000000000
- **Updated:** 2022-03-01 12:41:23.000000000

**Commit Message:**

```
appserver: remove http pool from backends

Bug: T244843
Change-Id: Ic908932f3c39e75e6e94931d8c2032427f5c6465
```

**Messages:** 6
**Inline Comments:** 0

**Message 1: joe (@oblivian)** - 2/28/2022, 9:26:10 AM
Uploaded patch set 1.

**Message 2:** 🤖 2/28/2022, 9:30:43 AM - Verified+2: Main test build succeeded (1 job)
**Message 3: joe (@oblivian)** - 3/1/2022, 12:20:32 PM
Patch Set 2: Patch Set 1 was rebased

**Message 4:** 🤖 3/1/2022, 12:21:54 PM - Verified+2: Main test build succeeded (1 job)
**Message 5: joe (@oblivian)** - 3/1/2022, 12:41:14 PM
Patch Set 2: Code-Review+2

**Message 6: joe (@oblivian)** - 3/1/2022, 12:41:23 PM
Change has been successfully merged


## Review 43: 238152 - Add instrumentation

- **URL:** https://gerrit.wikimedia.org/r/c/238152
- **Author:** joe (@oblivian) <glavagetto@wikimedia.org>
- **Project:** operations/debs/pybal
- **Branch:** master
- **Status:** MERGED
- **Created:** 2015-09-14 14:48:20.000000000
- **Updated:** 2015-09-17 20:39:56.000000000

**Commit Message:**

```
Add instrumentation

Pybal has always been pretty private on its own internal state to
outside observers, making it a bit difficult to monitor or poll its
state.

We add a simple HTTP listener chain of monitoring endpoints describing
the actual state (pooled/depooled, up/down) of all servers (or a single
one) in a pool

Url space is left free for others to use for stats or other kind of
instrumentation in the future.

Bug: T102394
Change-Id: Ied88d44e63f91df3816df4b44f29bb0cd444cd05
```

**Messages:** 11
**Inline Comments:** 8

**Message 1: joe (@oblivian)** - 9/14/2015, 2:48:20 PM
Uploaded patch set 1.

**Message 2:** 🤖 9/14/2015, 2:48:39 PM - Verified+2: Main test build succeeded
**Message 3: Filippo Giunchedi (@filippo)** - 9/15/2015, 8:14:26 AM
Patch Set 1: Code-Review-1

(4 comments)

LGTM overall

> **Inline Comments (4):**
>
> **pybal/instrumentation.py:23** - Filippo Giunchedi
> nothing happens if no Accept?
>
> **pybal/instrumentation.py:57** - Filippo Giunchedi
> possibly a path argument to specify where to "mount" the pool, and pass the name at initialization time in pybal.py
>
> **pybal/instrumentation.py:68** - Filippo Giunchedi
> it'd be nice to return newline-separated output to humans
>
> **pybal/instrumentation.py:88** - Filippo Giunchedi
> ditto, perhaps "server: state" one per line
>

**Message 4: joe (@oblivian)** - 9/16/2015, 6:11:02 AM
Patch Set 1:

(4 comments)

> **Inline Comments (4):**
>
> **pybal/instrumentation.py:23** - Giuseppe Lavagetto
> Indentation fail.
>
> **pybal/instrumentation.py:57** - Giuseppe Lavagetto
> Done
>
> **pybal/instrumentation.py:68** - Giuseppe Lavagetto
> Done
>
> **pybal/instrumentation.py:88** - Giuseppe Lavagetto
> Done
>

**Message 5: joe (@oblivian)** - 9/16/2015, 10:44:13 AM
Uploaded patch set 2.

**Message 6:** 🤖 9/16/2015, 10:44:33 AM - Verified+2: Main test build succeeded
**Message 7: Filippo Giunchedi (@filippo)** - 9/16/2015, 11:36:45 AM
Patch Set 2: Code-Review+1

nice work!

**Message 8: Ori (@ori)** - 9/17/2015, 8:39:34 PM
Patch Set 2: Code-Review+2

This is awesome. Very well done.

**Message 9:** 🤖 9/17/2015, 8:39:36 PM - -Verified: Starting gate
**Message 10:** 🤖 9/17/2015, 8:39:55 PM - Verified+2: Gate pipeline
**Message 11:** 🤖 9/17/2015, 8:39:56 PM - Change has been successfully merged into...

## Review 44: 771868 - wmfbackups: Add manpages for all executables and config files

- **URL:** https://gerrit.wikimedia.org/r/c/771868
- **Author:** Jaime Crespo (@jynus) <jcrespo@wikimedia.org>
- **Project:** operations/software/wmfbackups
- **Branch:** master
- **Status:** MERGED
- **Created:** 2022-03-18 12:40:29.000000000
- **Updated:** 2022-03-18 16:00:39.000000000

**Commit Message:**

```
wmfbackups: Add manpages for all executables and config files

The following commands:

* backup-mariadb
* recover-dump
* check-mariadb-backups
* remote-backup-mariadb

And the following config files:

* backup.cnf
* remote_backup.cnf

Are now fully documented on man pages, so one can check its
syntax on the hosts where they are installed, without having
to run --help.

Bug: T138562
Change-Id: I081f2390112076e50cb84232fb0a3a2c28c5748a
```

**Messages:** 8
**Inline Comments:** 0

**Message 1: Jaime Crespo (@jynus)** - 3/18/2022, 12:40:29 PM
Uploaded patch set 1.

**Message 2:** 🤖 3/18/2022, 12:41:02 PM - Verified+2: Main test build succeeded (1 job)
**Message 3: Jaime Crespo (@jynus)** - 3/18/2022, 1:19:40 PM
Uploaded patch set 2: Patch Set 1 was rebased.

**Message 4:** 🤖 3/18/2022, 1:21:14 PM - Verified+2: Main test build succeeded (1 job)
**Message 5: Jaime Crespo (@jynus)** - 3/18/2022, 2:05:57 PM
Uploaded patch set 3: Patch Set 2 was rebased.

**Message 6:** 🤖 3/18/2022, 2:06:34 PM - Verified+2: Main test build succeeded (1 job)
**Message 7: Jaime Crespo (@jynus)** - 3/18/2022, 4:00:36 PM
Patch Set 3: Code-Review+2

**Message 8: Jaime Crespo (@jynus)** - 3/18/2022, 4:00:39 PM
Change has been successfully merged


## Review 45: 318226 - dynamicproxy: Fix health check endpoint location

- **URL:** https://gerrit.wikimedia.org/r/c/318226
- **Author:** Madhuvishy (@madhuvishy) <mviswanathan@wikimedia.org>
- **Project:** operations/puppet
- **Branch:** production
- **Status:** MERGED
- **Created:** 2016-10-26 23:39:38.000000000
- **Updated:** 2016-10-26 23:41:22.000000000

**Commit Message:**

```
dynamicproxy: Fix health check endpoint location

Bug: T143638
Change-Id: I0705074e38fafb3d374901101f68378bb0e4d1a8
```

**Messages:** 5
**Inline Comments:** 0

**Message 1: Madhuvishy (@madhuvishy)** - 10/26/2016, 11:39:38 PM
Uploaded patch set 1.

**Message 2:** 🤖 10/26/2016, 11:40:37 PM - Verified+2: Main test build succeeded
**Message 3: Madhuvishy (@madhuvishy)** - 10/26/2016, 11:40:48 PM
Patch Set 1: Code-Review+2

**Message 4: Unknown** - 10/26/2016, 11:40:50 PM
Change has been successfully merged by Madhuvishy

**Message 5:** 🤖 10/26/2016, 11:41:22 PM - Post-: Post-merge build failed.

## Review 46: 812331 - prometheus: blackbox icmp probes for hosts

- **URL:** https://gerrit.wikimedia.org/r/c/812331
- **Author:** Filippo Giunchedi (@filippo) <fgiunchedi@wikimedia.org>
- **Project:** operations/puppet
- **Branch:** production
- **Status:** MERGED
- **Created:** 2022-07-08 14:08:01.000000000
- **Updated:** 2022-07-11 08:38:37.000000000

**Commit Message:**

```
prometheus: blackbox icmp probes for hosts

The list is more-or-less ported from what Smokeping is targeting. Going
forward the list must be replaced by data from Netbox instead.

Bug: T169860
Change-Id: I8568ced005c218d4f610e456a1af803df7d3011c
```

**Messages:** 10
**Inline Comments:** 4

**Message 1: Filippo Giunchedi (@filippo)** - 7/8/2022, 2:08:01 PM
Uploaded patch set 1.

**Message 2:** 🤖 7/8/2022, 2:11:51 PM - Verified+2: Main test build succeeded (1 job)
**Message 3: Filippo Giunchedi (@filippo)** - 7/8/2022, 2:19:54 PM
Patch Set 1:

(1 comment)

> **Inline Comments (1):**
>
> **Patchset:** - Filippo Giunchedi
> Not the perfect solution but good enough for now IMHO, and one step closer to being able to turn down smokeping!
>

**Message 4: Arzhel (@ayounsi)** - 7/11/2022, 8:17:16 AM
Patch Set 1: Code-Review+1

(1 comment)

> **Inline Comments (1):**
>
> **Patchset:** - Ayounsi
> LGTM nice work!
>

**Message 5: Arzhel (@ayounsi)** - 7/11/2022, 8:19:47 AM
Patch Set 1:

(1 comment)

> **Inline Comments (1):**
>
> **Patchset:** - Ayounsi
> Note that it's fine to ping those from their local site only.
>

**Message 6: Filippo Giunchedi (@filippo)** - 7/11/2022, 8:35:15 AM
Uploaded patch set 2.

**Message 7: Filippo Giunchedi (@filippo)** - 7/11/2022, 8:35:26 AM
Patch Set 1:

(1 comment)

> **Inline Comments (1):**
>
> **Patchset:** - Filippo Giunchedi
> Thank you, I've expanded the comment to mention as much
>

**Message 8:** 🤖 7/11/2022, 8:38:18 AM - Verified+2: Main test build succeeded (1 job)
**Message 9: Filippo Giunchedi (@filippo)** - 7/11/2022, 8:38:34 AM
Patch Set 2: Code-Review+2

**Message 10: Filippo Giunchedi (@filippo)** - 7/11/2022, 8:38:37 AM
Change has been successfully rebased and submitted as 33c11754f6ef8febcd54a1e664a3f6bd6113a9d9


## Review 47: 491013 - maintain_dbusers: add the new database VM

- **URL:** https://gerrit.wikimedia.org/r/c/491013
- **Author:** Bstorm (@bstorm) <bastorm@pm.me>
- **Project:** operations/puppet
- **Branch:** production
- **Status:** MERGED
- **Created:** 2019-02-16 20:37:58.000000000
- **Updated:** 2019-02-18 18:36:21.000000000

**Commit Message:**

```
maintain_dbusers: add the new database VM

First pass at adding the database VM to replace toolsdb.  The database
is not currently set up for roles, so it needs to be converted.

Bug: T193264
Change-Id: Id5fef94201279c7b19b13049f9a764895df7cc55
```

**Messages:** 17
**Inline Comments:** 0

**Message 1: Bstorm (@bstorm)** - 2/16/2019, 8:37:58 PM
Uploaded patch set 1.

**Message 2:** 🤖 2/16/2019, 8:38:38 PM - Verified+2: Main test build succeeded
**Message 3: Bstorm (@bstorm)** - 2/16/2019, 8:52:31 PM
Patch Set 1:

This is blocked on network.  The VM cannot be contacted by the labstore cluster at the moment.

**Message 4: Bstorm (@bstorm)** - 2/16/2019, 9:54:22 PM
Patch Set 1:

This is presuming we are using the publicly routable static IP.  I am curious if there are alternatives to doing that, not that it doesn't seem easy to lock down with SGs and/or ferm.

**Message 5: Bryan Davis 🦄 (@bd808)** - 2/17/2019, 12:26:09 AM
Patch Set 1:

I think this should be either 'clouddb1001.clouddb-services.eqiad.wmflabs' or maybe better 'tools.db.svc.eqiad.wmflabs'.

I do not think we should plan on leaving a public ip on this instance. The only reason I can think of at all for a public ip here would be to make it easier to hook into tendril, but I'm not sure that it would even be necessary for that, or ultimately desirable. We would probably be better off in the long run to setup our own tendril system to track db usage and issues in isolation from the production network.

**Message 6: Bstorm (@bstorm)** - 2/17/2019, 12:36:25 AM
Patch Set 1:

> Patch Set 1:
> 
> I think this should be either 'clouddb1001.clouddb-services.eqiad.wmflabs' or maybe better 'tools.db.svc.eqiad.wmflabs'.
> 
> I do not think we should plan on leaving a public ip on this instance. The only reason I can think of at all for a public ip here would be to make it easier to hook into tendril, but I'm not sure that it would even be necessary for that, or ultimately desirable. We would probably be better off in the long run to setup our own tendril system to track db usage and issues in isolation from the production network.

I agree.  As of now, clouddb1001.clouddb-services.eqiad.wmflabs does not resolve on there.  That makes me think the latter won't either, but I can check :)

**Message 7: Bryan Davis 🦄 (@bd808)** - 2/17/2019, 12:58:01 AM
Patch Set 1:

> I agree.  As of now, clouddb1001.clouddb-services.eqiad.wmflabs
 > does not resolve on there.  That makes me think the latter won't
 > either, but I can check :)

Oh! This runs on the NFS server which is in the production realm. Hmmm... I think maybe we will want to add some mechanism for that server to resolve wmflabs DNS.

**Message 8: Bstorm (@bstorm)** - 2/17/2019, 2:40:12 AM
Patch Set 1:

> Patch Set 1:
> 
> Oh! This runs on the NFS server which is in the production realm. Hmmm... I think maybe we will want to add some mechanism for that server to resolve wmflabs DNS.

Yup, also it cannot reach the cloud IPs.  However, as I mentioned on Whatsapp, connections to the internal network on the mysql port drop at vip-gw-cloudnet.wikimedia.org, which is cloudinstances2b virtual router.  I do believe that means it is within our power to open that up to certain production servers (meaning the labstores and mariadb servers).

**Message 9: Bstorm (@bstorm)** - 2/18/2019, 4:00:31 PM
Uploaded patch set 2.

**Message 10:** 🤖 2/18/2019, 4:01:09 PM - Verified+2: Main test build succeeded
**Message 11: Andrew Bogott (@andrew)** - 2/18/2019, 4:01:54 PM
Patch Set 2: Code-Review+1

**Message 12: Bryan Davis 🦄 (@bd808)** - 2/18/2019, 4:06:11 PM
Patch Set 2: Code-Review+1

**Message 13: Arturo Borrero Gonzalez (@aborrero)** - 2/18/2019, 4:41:35 PM
Patch Set 2: Code-Review+1

**Message 14: Bstorm (@bstorm)** - 2/18/2019, 6:32:35 PM
Patch Set 3: Patch Set 2 was rebased

**Message 15:** 🤖 2/18/2019, 6:33:51 PM - Verified+2: Main test build succeeded
**Message 16: Arturo Borrero Gonzalez (@aborrero)** - 2/18/2019, 6:36:17 PM
Patch Set 3: Code-Review+2

**Message 17: Arturo Borrero Gonzalez (@aborrero)** - 2/18/2019, 6:36:21 PM
Change has been successfully merged by Arturo Borrero Gonzalez


## Review 48: 489906 - make-wmf-branch: branch special_extensions

- **URL:** https://gerrit.wikimedia.org/r/c/489906
- **Author:** Thcipriani (@thcipriani) <tcipriani@wikimedia.org>
- **Project:** mediawiki/tools/release
- **Branch:** master
- **Status:** MERGED
- **Created:** 2019-02-11 22:37:34.000000000
- **Updated:** 2019-02-12 18:24:46.000000000

**Commit Message:**

```
make-wmf-branch: branch special_extensions

Currently we have 1 special_extension in config.json (CentralNotice).
Rather than create new branches of this extension every month, we add
the wmf_deploy branch of this repo as a submodule. The result of this is
that whenever CentralNotice SWAT deploys in the middle of the week a
backport to the single wmf_deploy branch bumps the CentralNotice
submodule for both wmf branches in production. This causes confusion.

Sometimes a SWAT deployer will fetch and deploy CentralNotice submodule
for one wmf branch, but miss the other wmf branch. The next time someone
pulls a backport for SWAT in the other deployed wmf branch, they pull
down unexpected changes for CentralNotice.

In general, we should avoid special cases; however, in this instance the
special case can be handled at branching rather than at deployment time.
That is, we can create a new wmf/VERSION branch each week for
CentralNotice, except rather than create that branch from master, we
create that branch from wmf_deploy. This allows all workflows for
CentralNotice to stay the same and it simplifies the SWAT workflow.

Bug: T136904
Change-Id: I376b5d0fc406a8f7557c2c9a946ef2859693a86e
```

**Messages:** 10
**Inline Comments:** 0

**Message 1: Thcipriani (@thcipriani)** - 2/11/2019, 10:37:34 PM
Uploaded patch set 1.

**Message 2:** 🤖 2/11/2019, 10:38:11 PM - Verified-1: Main test build failed
**Message 3: Thcipriani (@thcipriani)** - 2/11/2019, 10:42:03 PM
Uploaded patch set 2.

**Message 4:** 🤖 2/11/2019, 10:42:31 PM - Verified+2: Main test build succeeded
**Message 5: Mukunda Modell (@twentyafterfour)** - 2/11/2019, 10:45:58 PM
Patch Set 2: Code-Review+1

+1 would merge if necessary

**Message 6: Jdforrester (🙄) (@jforrester)** - 2/12/2019, 12:07:29 AM
Patch Set 2: Code-Review+1

**Message 7: Thcipriani (@thcipriani)** - 2/12/2019, 6:24:16 PM
Patch Set 2: Code-Review+2

**Message 8:** 🤖 2/12/2019, 6:24:22 PM - -Verified: Starting gate
**Message 9:** 🤖 2/12/2019, 6:24:46 PM - Verified+2: Gate pipeline
**Message 10:** 🤖 2/12/2019, 6:24:46 PM - Change has been successfully merged by j...

## Review 49: 573272 - prometheus: add cadvisor jobs

- **URL:** https://gerrit.wikimedia.org/r/c/573272
- **Author:** Ema (@ema) <ema@wikimedia.org>
- **Project:** operations/puppet
- **Branch:** production
- **Status:** MERGED
- **Created:** 2020-02-19 12:36:46.000000000
- **Updated:** 2020-02-19 15:33:21.000000000

**Commit Message:**

```
prometheus: add cadvisor jobs

Bug: T183146
Change-Id: If8a0dd15160477985478bf32b3df4a55d0137459
```

**Messages:** 7
**Inline Comments:** 0

**Message 1: Ema (@ema)** - 2/19/2020, 12:36:46 PM
Uploaded patch set 1.

**Message 2:** 🤖 2/19/2020, 12:39:47 PM - Verified+2: Main test build succeeded
**Message 3: Filippo Giunchedi (@filippo)** - 2/19/2020, 2:20:02 PM
Patch Set 1: Code-Review+1

**Message 4: Ema (@ema)** - 2/19/2020, 3:28:44 PM
Patch Set 1: Code-Review+2

**Message 5: Ema (@ema)** - 2/19/2020, 3:28:48 PM
Patch Set 2: Patch Set 1 was rebased

**Message 6:** 🤖 2/19/2020, 3:32:28 PM - Verified+2: Main test build succeeded
**Message 7: Ema (@ema)** - 2/19/2020, 3:33:21 PM
Change has been successfully merged by Ema


## Review 50: 320696 - Revert "cp1008: disable do_ocsp_int while experimenting with nginx packages"

- **URL:** https://gerrit.wikimedia.org/r/c/320696
- **Author:** BBlack (@bblack) <bblack@wikimedia.org>
- **Project:** operations/puppet
- **Branch:** production
- **Status:** MERGED
- **Created:** 2016-11-09 22:18:58.000000000
- **Updated:** 2016-11-09 22:24:04.000000000

**Commit Message:**

```
Revert "cp1008: disable do_ocsp_int while experimenting with nginx packages"

This reverts commit ae73ffe9d9d80dd2433da889196321796d1ec608.

Bug: T93927
Change-Id: Ied9e89ba08adc3f6bd025ac5051bd4100c25bf6a
```

**Messages:** 4
**Inline Comments:** 0

**Message 1: BBlack (@bblack)** - 11/9/2016, 10:18:58 PM
Uploaded patch set 1.

**Message 2:** 🤖 11/9/2016, 10:20:47 PM - Verified+2: Main test build succeeded
**Message 3: BBlack (@bblack)** - 11/9/2016, 10:23:58 PM
Patch Set 1: Code-Review+2

**Message 4: Unknown** - 11/9/2016, 10:24:04 PM
Change has been successfully merged by BBlack


## Review 51: 274905 - Ferm rule: allow deployment hosts to connect to iridium ssh (for scap)

- **URL:** https://gerrit.wikimedia.org/r/c/274905
- **Author:** Mukunda Modell (@twentyafterfour) <mmodell@wikimedia.org>
- **Project:** operations/puppet
- **Branch:** production
- **Status:** ABANDONED
- **Created:** 2016-03-04 06:38:22.000000000
- **Updated:** 2016-03-04 17:00:49.000000000

**Commit Message:**

```
Ferm rule: allow deployment hosts to connect to iridium ssh (for scap)

Bug: T114363
Change-Id: I2a590b813631ccb0cbc97736356de49a4d3c01b3
```

**Messages:** 7
**Inline Comments:** 0

**Message 1: Mukunda Modell (@twentyafterfour)** - 3/4/2016, 6:38:22 AM
Uploaded patch set 1.

**Message 2:** 🤖 3/4/2016, 6:40:23 AM - Verified+2: Main test build succeeded
**Message 3: ArielGlenn (@ariel)** - 3/4/2016, 9:02:47 AM
Patch Set 1:

scap::ferm is already included on iridium via scap::target, from modules/phabricator/manifests/init.pp so isn't this redundant?

**Message 4: Ldaptestaccount123 (@testaccount123)** - 3/4/2016, 2:59:32 PM
Patch Set 1: Code-Review-1

yes this would be duplicate afaik:

iridium: /etc/ferm/conf.d/10_deployment-ssh

**Message 5: Rush (@rush)** - 3/4/2016, 3:00:39 PM
Patch Set 1:

oops, made with my test account accidentally^

**Message 6: Daniel Zahn (@dzahn)** - 3/4/2016, 3:49:35 PM
Patch Set 1:

like others have said. already existing rules:

[iridium:~] $ sudo iptables -L | grep ssh
ACCEPT     tcp  --  bast1001.wikimedia.org  anywhere             tcp dpt:ssh
ACCEPT     tcp  --  bast2001.wikimedia.org  anywhere             tcp dpt:ssh
ACCEPT     tcp  --  hooft.esams.wikimedia.org  anywhere             tcp dpt:ssh
ACCEPT     tcp  --  bast4001.wikimedia.org  anywhere             tcp dpt:ssh
ACCEPT     tcp  --  iron.wikimedia.org   anywhere             tcp dpt:ssh
ACCEPT     tcp  --  tin.eqiad.wmnet      anywhere             tcp dpt:ssh
ACCEPT     tcp  --  mira.codfw.wmnet     anywhere             tcp dpt:ssh
ACCEPT     tcp  --  anywhere             iridium-vcs.eqiad.wmnet  tcp dpt:ssh
ACCEPT     tcp  --  anywhere             git-ssh.eqiad.wikimedia.org  tcp dpt:ssh

**Message 7: Mukunda Modell (@twentyafterfour)** - 3/4/2016, 5:00:49 PM
Abandoned

duplicated by mistake, I'm sorry


## Review 52: 591309 - mariadb-backups: Move OK alert description to wikitech

- **URL:** https://gerrit.wikimedia.org/r/c/591309
- **Author:** Jaime Crespo (@jynus) <jcrespo@wikimedia.org>
- **Project:** operations/puppet
- **Branch:** production
- **Status:** MERGED
- **Created:** 2020-04-21 09:24:35.000000000
- **Updated:** 2020-04-21 12:33:48.000000000

**Commit Message:**

```
mariadb-backups: Move OK alert description to wikitech

Document parameters of returning an OK check of backups on
Wikitech:

https://wikitech.wikimedia.org/wiki/MariaDB/Backups#Alerting

As it is now fully documented there, shorten the OK message
so it is more human readable, with just the mimimum parameters.

It will be more explicit about what went wrong anyway when it is
not OK.

Bug: T138562
Change-Id: I73ea9da2d46f4505a58d6581a59a7a23d218ff4d
```

**Messages:** 9
**Inline Comments:** 0

**Message 1: Jaime Crespo (@jynus)** - 4/21/2020, 9:24:35 AM
Uploaded patch set 1.

**Message 2:** 🤖 4/21/2020, 9:25:17 AM - Verified+2: Main test build succeeded
**Message 3: Marostegui (@marostegui)** - 4/21/2020, 9:35:44 AM
Patch Set 1: Code-Review+1

**Message 4: Jaime Crespo (@jynus)** - 4/21/2020, 10:14:47 AM
Patch Set 1: Code-Review+2

**Message 5: Jaime Crespo (@jynus)** - 4/21/2020, 10:14:59 AM
Patch Set 2: Patch Set 1 was rebased

**Message 6:** 🤖 4/21/2020, 10:15:36 AM - Verified+2: Main test build succeeded
**Message 7: Jaime Crespo (@jynus)** - 4/21/2020, 10:18:14 AM
Change has been successfully merged by Jcrespo

**Message 8: Jaime Crespo (@jynus)** - 4/21/2020, 12:33:30 PM
Patch Set 2:

sudo -u nagios ./check_mariadb_backups.py --section=s3 --datacenter=codfw --type=snapshot --warn-size-percentage=0
Last snapshot for s3 at codfw (db2098.codfw.wmnet:3313) taken on 2020-04-20 09:03:14 is 853 GB, but previous one was 852 GB, a change of 0.2%

^this is a warning

**Message 9: Jaime Crespo (@jynus)** - 4/21/2020, 12:33:48 PM
Patch Set 2:

> Patch Set 2:
> 
> sudo -u nagios ./check_mariadb_backups.py --section=s3 --datacenter=codfw --type=snapshot --warn-size-percentage=0
> Last snapshot for s3 at codfw (db2098.codfw.wmnet:3313) taken on 2020-04-20 09:03:14 is 853 GB, but previous one was 852 GB, a change of 0.2%
> 
> ^this is a warning

WRONG patch, sorry.


## Review 53: 366462 - Update ldap-corp.{eqiad,codfw}.wikimedia certs

- **URL:** https://gerrit.wikimedia.org/r/c/366462
- **Author:** Faidon Liambotis (@faidon) <faidon@wikimedia.org>
- **Project:** operations/puppet
- **Branch:** production
- **Status:** MERGED
- **Created:** 2017-07-19 21:05:00.000000000
- **Updated:** 2017-07-19 21:05:18.000000000

**Commit Message:**

```
Update ldap-corp.{eqiad,codfw}.wikimedia certs

Update:
- ldap-corp.eqiad.wikimedia.org.crt
- ldap-corp.codfw.wikimedia.org.crt
...to be issued by the new WMF 2017-2020 CA.

Change-Id: I14d1fa6ff2ffd5a1c2f148659c8420089169d5d4
```

**Messages:** 3
**Inline Comments:** 0

**Message 1: Faidon Liambotis (@faidon)** - 7/19/2017, 9:05:00 PM
Uploaded patch set 1.

**Message 2: Faidon Liambotis (@faidon)** - 7/19/2017, 9:05:10 PM
Patch Set 1: Verified+2 Code-Review+2

**Message 3: Faidon Liambotis (@faidon)** - 7/19/2017, 9:05:18 PM
Change has been successfully merged by Faidon Liambotis


## Review 54: 295757 - cache::misc: Set up a temporary etherpad host

- **URL:** https://gerrit.wikimedia.org/r/c/295757
- **Author:** Αλέξανδρος Κοσιάρης (@akosiaris) <akosiaris@wikimedia.org>
- **Project:** operations/puppet
- **Branch:** production
- **Status:** MERGED
- **Created:** 2016-06-23 21:19:57.000000000
- **Updated:** 2016-06-23 21:31:48.000000000

**Commit Message:**

```
cache::misc: Set up a temporary etherpad host

Set up a temporary etherpad host to allow interested users to self-serve
restoring pads that were not restored previously while bringing the
service into a working state again after the recent database corruption.
We go for this approach only because it's Wikimania 2016 time and a lot
of interesting pads might have be lost irrevocably before their
users/owners had any chance to follow the best practice of archiving
them elsewhere.

Bug: T138516
Change-Id: I860eb2af2fe1310f19c1c3a1e48a69fa723b2cef
```

**Messages:** 9
**Inline Comments:** 0

**Message 1: Αλέξανδρος Κοσιάρης (@akosiaris)** - 6/23/2016, 9:19:57 PM
Uploaded patch set 1.

**Message 2:** 🤖 6/23/2016, 9:21:25 PM - Verified+2: Main test build succeeded
**Message 3: BBlack (@bblack)** - 6/23/2016, 9:21:36 PM
Patch Set 1: Code-Review+1

**Message 4: Αλέξανδρος Κοσιάρης (@akosiaris)** - 6/23/2016, 9:23:09 PM
Patch Set 1: Code-Review+2

**Message 5: Αλέξανδρος Κοσιάρης (@akosiaris)** - 6/23/2016, 9:23:13 PM
Patch Set 2: Patch Set 1 was rebased

**Message 6: Αλέξανδρος Κοσιάρης (@akosiaris)** - 6/23/2016, 9:23:29 PM
Patch Set 2: Verified+2

**Message 7: Αλέξανδρος Κοσιάρης (@akosiaris)** - 6/23/2016, 9:23:34 PM
Change has been successfully merged into the git repository.

**Message 8:** 🤖 6/23/2016, 9:24:29 PM - Main: Main test build succeeded
**Message 9:** 🤖 6/23/2016, 9:31:48 PM - Post-: Post-merge build succeeded.

## Review 55: 494771 - osm: Add a cloud-internal address for the osmdb cluster

- **URL:** https://gerrit.wikimedia.org/r/c/494771
- **Author:** Bstorm (@bstorm) <bastorm@pm.me>
- **Project:** operations/puppet
- **Branch:** production
- **Status:** MERGED
- **Created:** 2019-03-06 16:36:59.000000000
- **Updated:** 2019-03-28 23:55:49.000000000

**Commit Message:**

```
osm: Add a cloud-internal address for the osmdb cluster

This should allow us to point the main osmdb.eqiad.wmnet address to
a cloud-internal address once we have it all ready to allow legacy apps
to connect.

Bug: T193264
Change-Id: I9e1b7b96ba0be8a09f6e3db9251d88b556e2b2db
```

**Messages:** 13
**Inline Comments:** 0

**Message 1: Bstorm (@bstorm)** - 3/6/2019, 4:36:59 PM
Uploaded patch set 1.

**Message 2:** 🤖 3/6/2019, 4:37:42 PM - Verified+2: Main test build succeeded
**Message 3: Bstorm (@bstorm)** - 3/6/2019, 4:46:42 PM
Removed reviewer Arturo Borrero Gonzalez.

**Message 4: Bstorm (@bstorm)** - 3/6/2019, 4:46:42 PM
Removed reviewer Alex Monk.

**Message 5: Bstorm (@bstorm)** - 3/6/2019, 4:47:29 PM
Patch Set 1:

If this looks right, I may still wait to merge it until the migration is closer to change over just in case it causes confusion.

**Message 6: Andrew Bogott (@andrew)** - 3/6/2019, 4:57:03 PM
Patch Set 1: Code-Review+1

**Message 7: Bryan Davis 🦄 (@bd808)** - 3/6/2019, 5:35:54 PM
Patch Set 1: Code-Review+1

**Message 8: Andrew Bogott (@andrew)** - 3/27/2019, 1:53:42 PM
Patch Set 3: Patch Set 1 was rebased

**Message 9:** 🤖 3/27/2019, 1:54:44 PM - Verified+2: Main test build succeeded
**Message 10: Bstorm (@bstorm)** - 3/28/2019, 11:52:32 PM
Uploaded patch set 4.

**Message 11:** 🤖 3/28/2019, 11:54:01 PM - Verified+2: Main test build succeeded
**Message 12: Bstorm (@bstorm)** - 3/28/2019, 11:55:41 PM
Patch Set 4: Code-Review+2

**Message 13: Bstorm (@bstorm)** - 3/28/2019, 11:55:49 PM
Change has been successfully merged by Bstorm


## Review 56: 321838 - Remove passwordreset capture feature

- **URL:** https://gerrit.wikimedia.org/r/c/321838
- **Author:** Brian Wolff (@bawolff) <bawolff+wn@gmail.com>
- **Project:** mediawiki/core
- **Branch:** master
- **Status:** MERGED
- **Created:** 2016-11-16 04:09:25.000000000
- **Updated:** 2020-04-13 02:40:07.000000000

**Commit Message:**

```
Remove passwordreset capture feature

If anyone wants such a thing, they can make their own extension.

I asked stewards, and they said they don't use this.

See also T32636 / 9de2bfd1fe

Bug: T150930
Change-Id: I3ab5962dba668e5d628e55ad0c0feae471d82b5e
```

**Messages:** 23
**Inline Comments:** 5

**Message 1: Brian Wolff (@bawolff)** - 11/16/2016, 4:09:25 AM
Uploaded patch set 1.

**Message 2:** 🤖 11/16/2016, 4:09:47 AM - Verified-1: Merge Failed.
**Message 3: Brian Wolff (@bawolff)** - 11/16/2016, 4:15:40 AM
Uploaded patch set 2.

**Message 4:** 🤖 11/16/2016, 4:22:23 AM - Verified-1: Main test build failed
**Message 5: Brian Wolff (@bawolff)** - 11/16/2016, 4:49:36 AM
Uploaded patch set 3.

**Message 6:** 🤖 11/16/2016, 4:55:42 AM - Verified-1: Main test build failed
**Message 7: Brian Wolff (@bawolff)** - 11/16/2016, 5:01:10 AM
Uploaded patch set 4.

**Message 8:** 🤖 11/16/2016, 5:07:05 AM - Verified+2: Main test build succeeded
**Message 9: MZMcBride (@mzmcbride)** - 11/16/2016, 5:50:38 AM
Patch Set 4:

I left some comments at <https://phabricator.wikimedia.org/T32636#2798040>.

**Message 10: Anomie (@anomie)** - 11/16/2016, 4:20:57 PM
Patch Set 4:

(3 comments)

> **Inline Comments (3):**
>
> **includes/user/PasswordReset.php:75** - Anomie
> The nonexistent parameter is still documented. If you remove that, this text doesn't make much sense until you look at old revisions and realize that "displayPassword" was the name of the removed argument.
>
> **includes/user/PasswordReset.php:122** - Anomie
> This text doesn't make much sense until you look at old revisions and realize that "displayPassword" was the name of the removed argument.
>
> **includes/user/PasswordReset.php:240** - Anomie
> This variable is useless now, you could just pass a literal `[]` on line 250 for BC.
>

**Message 11: Gergő Tisza (@tgr)** - 11/17/2016, 6:24:05 AM
Patch Set 5: Commit message was updated.

**Message 12:** 🤖 11/17/2016, 6:24:27 AM - Verified-1: Merge Failed.
**Message 13: Siebrand (@siebrand)** - 11/17/2016, 1:27:17 PM
Patch Set 5: Code-Review-1

(1 comment)

i18n/L10n reviewed.: OK.

See inline comment.

> **Inline Comments (1):**
>
> **RELEASE-NOTES-1.29:10** - Siebrand
> This needs to be followed by an empty line.
>

**Message 14: Gergő Tisza (@tgr)** - 11/22/2016, 11:58:29 PM
Patch Set 6: Published edit on patch set 5.

**Message 15:** 🤖 11/22/2016, 11:58:52 PM - Verified-1: Merge Failed.
**Message 16: Gergő Tisza (@tgr)** - 11/23/2016, 12:03:07 AM
Uploaded patch set 7.

**Message 17:** 🤖 11/23/2016, 12:09:50 AM - Verified+2: Main test build succeeded
**Message 18: Gergő Tisza (@tgr)** - 11/23/2016, 1:08:39 AM
Patch Set 7: Code-Review+2

**Message 19:** 🤖 11/23/2016, 1:08:45 AM - -Verified: Starting gate
**Message 20:** 🤖 11/23/2016, 1:17:37 AM - Verified+2: Gate pipeline
**Message 21: Unknown** - 11/23/2016, 1:17:38 AM
Change has been successfully merged by jenkins-bot

**Message 22:** 🤖 11/23/2016, 1:28:00 AM - Post-: Post-merge build succeeded.
**Message 23: Sam Wilson (@samwilson)** - 4/13/2020, 2:40:07 AM
Patch Set 7:

(1 comment)

> **Inline Comments (1):**
>
> **includes/user/PasswordReset.php:127** - Samwilson
> This is now incorrect. I've made a patch to remove it and the $password var: https://gerrit.wikimedia.org/r/c/mediawiki/core/+/588196
>


## Review 57: 445658 - Revert "Pedantic strict equals."

- **URL:** https://gerrit.wikimedia.org/r/c/445658
- **Author:** Daniel Kinzler 👾 (@daniel) <dkinzler@wikimedia.org>
- **Project:** mediawiki/core
- **Branch:** master
- **Status:** MERGED
- **Created:** 2018-07-13 19:27:02.000000000
- **Updated:** 2018-07-13 20:49:25.000000000

**Commit Message:**

```
Revert "Pedantic strict equals."

This reverts commit b24fafd6066f8bffeb2b4c0b9e8e22d1b2f07cf2.

Reason for revert: T199504

The strict comparisons changes semantics when parameters are not set and thus null.

This could be fixed by setting the right defaults when getting parameter values, but needs a closer look. 

Bug: T199504
Change-Id: I7b3e5d4f4d50af6603b3414be099d5bda6571387
```

**Messages:** 9
**Inline Comments:** 0

**Message 1: Daniel Kinzler 👾 (@daniel)** - 7/13/2018, 7:27:02 PM
Uploaded patch set 1.

**Message 2: Daniel Kinzler 👾 (@daniel)** - 7/13/2018, 7:27:42 PM
Patch Set 2: Commit message was updated.

**Message 3:** 🤖 7/13/2018, 7:45:29 PM - Verified+2: Main test build succeeded
**Message 4:** 🤖 7/13/2018, 7:51:16 PM - PHP: PHP test coverage increased (or stayed t...
**Message 5: Jdforrester (🙄) (@jforrester)** - 7/13/2018, 8:30:24 PM
Patch Set 2: Code-Review+2

**Message 6:** 🤖 7/13/2018, 8:30:30 PM - -Verified: Starting gate
**Message 7:** 🤖 7/13/2018, 8:45:37 PM - Verified+2: Gate pipeline
**Message 8:** 🤖 7/13/2018, 8:45:38 PM - Change has been successfully merged by j...
**Message 9:** 🤖 7/13/2018, 8:49:25 PM - Post-: Post-merge build succeeded.

## Review 58: 462779 - Catch and gracefully handle when service is not responding properly to ApiHooksHandler

- **URL:** https://gerrit.wikimedia.org/r/c/462779
- **Author:** امیر سرآبادانی (@ladsgroup) <Ladsgroup@gmail.com>
- **Project:** mediawiki/extensions/ORES
- **Branch:** master
- **Status:** MERGED
- **Created:** 2018-09-25 17:48:25.000000000
- **Updated:** 2018-10-01 15:57:55.000000000

**Commit Message:**

```
Catch and gracefully handle when service is not responding properly to ApiHooksHandler

Bug: T204961
Change-Id: I0660797dc43cbddb5b6d892ca5884e1b723d0489
```

**Messages:** 8
**Inline Comments:** 0

**Message 1: امیر سرآبادانی (@ladsgroup)** - 9/25/2018, 5:48:25 PM
Uploaded patch set 1.

**Message 2:** 🤖 9/25/2018, 5:55:41 PM - Verified+2: Main test build succeeded
**Message 3:** 🤖 9/25/2018, 5:59:01 PM - PHP: PHP test coverage decreased
**Message 4: Adam Wight (@awight)** - 10/1/2018, 3:48:28 PM
Patch Set 1: Code-Review+2

Seems elegant.

**Message 5:** 🤖 10/1/2018, 3:48:34 PM - -Verified: Starting gate
**Message 6:** 🤖 10/1/2018, 3:55:44 PM - Verified+2: Gate pipeline
**Message 7:** 🤖 10/1/2018, 3:55:44 PM - Change has been successfully merged by j...
**Message 8:** 🤖 10/1/2018, 3:57:55 PM - Post-: Post-merge build succeeded.

## Review 59: 766575 - appservers: remove monitoring for http-only

- **URL:** https://gerrit.wikimedia.org/r/c/766575
- **Author:** joe (@oblivian) <glavagetto@wikimedia.org>
- **Project:** operations/puppet
- **Branch:** production
- **Status:** MERGED
- **Created:** 2022-02-28 09:26:10.000000000
- **Updated:** 2022-03-01 10:49:06.000000000

**Commit Message:**

```
appservers: remove monitoring for http-only

Bug: T244843
Change-Id: I57eb56961592cf72bfb53790bee986cf62d88ab0
```

**Messages:** 6
**Inline Comments:** 0

**Message 1: joe (@oblivian)** - 2/28/2022, 9:26:10 AM
Uploaded patch set 1.

**Message 2:** 🤖 2/28/2022, 9:28:44 AM - Verified+2: Main test build succeeded (1 job)
**Message 3: joe (@oblivian)** - 3/1/2022, 10:42:58 AM
Patch Set 2: Patch Set 1 was rebased

**Message 4:** 🤖 3/1/2022, 10:43:52 AM - Verified+2: Main test build succeeded (1 job)
**Message 5: joe (@oblivian)** - 3/1/2022, 10:48:42 AM
Patch Set 2: Code-Review+2

**Message 6: joe (@oblivian)** - 3/1/2022, 10:49:06 AM
Change has been successfully merged


## Review 60: 801762 - Revert "maintenance::wikidata: Update cron with lb and lb-pool params"

- **URL:** https://gerrit.wikimedia.org/r/c/801762
- **Author:** joe (@oblivian) <glavagetto@wikimedia.org>
- **Project:** operations/puppet
- **Branch:** production
- **Status:** MERGED
- **Created:** 2022-06-01 08:34:51.000000000
- **Updated:** 2022-10-10 14:14:25.000000000

**Commit Message:**

```
Revert "maintenance::wikidata: Update cron with lb and lb-pool params"

This reverts commit 2b4befc3a47c813d89677c565aeb9670e17c2113.

Contrary to what stated in the task, the script doesn't accept the two
parameters I just added.

If the script is fixed, we can proceed with re-merging this change.

Bug: T238751
Change-Id: Ib9c578a500107879b451a7f65738e47c9382fffe
```

**Messages:** 6
**Inline Comments:** 0

**Message 1: joe (@oblivian)** - 6/1/2022, 8:34:51 AM
Uploaded patch set 1.

**Message 2: joe (@oblivian)** - 6/1/2022, 8:35:44 AM
Patch Set 2: Commit message was updated.

**Message 3: joe (@oblivian)** - 6/1/2022, 8:37:01 AM
Patch Set 2: Verified+2 Code-Review+2

**Message 4: joe (@oblivian)** - 6/1/2022, 8:37:15 AM
Change has been successfully rebased and submitted as 40bedcb0f64c00267f77387cd881c995e5fc7b7a

**Message 5:** 🤖 6/1/2022, 8:38:42 AM - Verified+2: Main test build succeeded (1 job)
**Message 6: Marius Hoch (Hoo man) (@hoo)** - 10/10/2022, 2:14:25 PM
Created a revert of this change as Idc7f1ddfc63e805ab307b457fab602c64023793e


