# Measurement: on September 20, 2026

Pinned `jev-1.13.0`, 16 unique fixtures × 2 repetitions, sequential calls from this machine:

| Measurement | Result |
| --- | --- |
| API calls | 30 successful; 2 empty inputs handled locally |
| Median successful API round trip | 0.682 s |
| Maximum successful API round trip | 1.142 s |
| Batch wall time | 21.138 s |
| Reported input tokens | 14,518 |
| Estimated API cost | $0.000610 |
| Raw outcome agreement with authored labels | 32/32 |
| At confidence threshold 0.8 | 30 accepted, 2 review, 0 errors |
| Correct among accepted | 30/30 at 93.75% coverage |

Cost is usage multiplied by the documented $0.042 per million input tokens; outputs are free.
It is an estimate, not a bill. The run records model, timestamp, code/data hashes and raw answers.
The [included snapshot](run.json) comes from the initial runner in commit `f520d21`; subsequent changes
add custom dataset support. Offline tests verify that its decisions still replay identically.
The [pricing source](https://docs.typesafe.ai/models) was checked on the measurement date.

These fixtures are deliberately short and mostly unambiguous. The same author designed the
questions and labels. **This is a smoke test, not a general accuracy claim.** Repeated calls
measure stability; there are still only 16 unique cases. No LLM comparison was run here.
0.8 is an illustrative threshold, not a calibrated operating point.

## Limitations that matter

- A verbatim quotation can still be misinterpreted. The model can choose the wrong typed answer.
- Candidate coverage is assumed. Long documents need retrieval and context-aware chunking;
  measure missed evidence and qualifiers before applying this approach there.
- English and Finnish have only a few examples here; this does not validate multilingual quality.
- The injection example is one simple negative control, not a prompt-injection security evaluation.
- Time-sensitive or conflicting sources need explicit source/date rules beyond this demo.
- Network/service errors are distinct from model decisions and reduce coverage. This measurement
  runner intentionally makes no automatic retries, so API trouble remains visible.
- Every live report includes its input text. Review and sanitize before publishing your own runs.
