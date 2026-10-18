# Understanding the way tasks are created before an incident

Total tasks analyzed: 233
Tasks with valid dates: 206
Tasks created before incident: 200

Days before incident statistics:

```
Mean: 330.46 days
Min: 1 days
Q1: 35 days
Median: 159 days
Q3: 455 days
Max: 3476 days
```

## General analysis

./pre-incident-task-analysis.yaml

Looked at 15 out of 233 entries. Seems like there are some salient themes

- Close to the incident, it can often be that symptoms are showing before or that the incident itself takes place over some time.
- Far from the incident, it seems there are long standing "cool ideas" or requests for comments that don't exist as meaningful and intentional work to be taken on.


## How many of those Tasks were prevent, detect, mitigate

This only makes sense in the context of an incident. If they were not initiated from an IR, then this analysis isn't useful.

## How many of those Tasks end in completed

```
Status breakdown:
closed, resolved      : 148 tasks (74.0%)
closed, declined      :  15 tasks (7.5%)
open, medium          :  14 tasks (7.0%)
open, high            :   6 tasks (3.0%)
open, low             :   5 tasks (2.5%)
open, stalled, medium :   4 tasks (2.0%)
open, needs triage    :   4 tasks (2.0%)
closed, invalid       :   2 tasks (1.0%)
closed, duplicate     :   1 tasks (0.5%)
open, stalled, low    :   1 tasks (0.5%)
```