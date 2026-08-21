# The DAU Practice Ecosystem

One host, one contract, eight labs. Every lesson in Dead Air University has a
Practice card that opens the right interactive machine; finished takes post
back to the host and land in the practice log.

```
                    ┌──────────────────────────────┐
                    │  idle-time-learning-doodad   │
                    │  (host · curriculum · SRS)   │
                    └──────────────┬───────────────┘
                                   │ builds ?practice=<payload>
                                   │ window.open + postMessage back
        ┌──────────────┬───────────┼───────────┬──────────────┐
        ▼              ▼           ▼           ▼              ▼
   chudbox       movement-bench    fab-lab   pipeline-     compiler-
   (156 music    (82 horology)     (86       playground    workbench
   lessons)                        semi)     (89 cpu/gpu)  (78 cmp)
        │              │            │      packet-lab         │
        │              │            │      (78 net)           │
        │              │            │      os-lab (82) ml-lab (83)
        └──────────────┴────────────┴──────────┴───────────────┘
                       all speak dau-practice-labs
                  (the contract: schemas, transport, adapters)
```

## Repos

| Repo | Role | Port |
|---|---|---|
| `idle-time-learning-doodad` | Host app — curriculum, SRS, Practice cards | 8090 |
| `dau-practice-labs` | **The contract**: request/result schemas, URL-safe base64 transport, per-lab adapters, registry | — |
| `chudbox` | Rhythm sequencer lab | 8080 |
| `movement-bench` | Watch-movement lab | 8091 |
| `fab-lab` | Semiconductor manufacturing lab | 8092 |
| `pipeline-playground` | CPU/GPU microarchitecture lab | 8093 |
| `compiler-workbench` | Compilers lab | 8094 |
| `packet-lab` | Networking lab | 8095 |
| `os-lab` | Operating systems lab | 8096 |
| `ml-lab` | Machine learning lab | 8097 |

## The contract in one paragraph

A launch is a URL: `<lab-base>/?practice=<url-safe-base64-json>`. The payload
carries `{schemaVersion, sourceApp, labId, conceptId, lessonId, practiceType,
goal, …}` and is validated by the lab against its own zod schema. When the
learner finishes, the lab posts `{type: "<lab>:practice-result", result}` to
`window.opener`; the host validates the sender's origin, adapts the envelope
into the canonical result shape, and logs it. Labs never write DAU state.

## Adding lab #9

1. Write an adapter in `dau-practice-labs/src/practice-labs/adapters/`
   (copy a sibling; change the id regex, message type, practice-type enum).
2. Register it in `registry/labs.ts` with a `launchUrl`.
3. Export it from the package index.
4. In idle-doodad's `src/lib/practice/labs.ts`: one entry in `LAUNCHERS`,
   one entry in the listener's origin set, one prefix route in
   `buildPracticeRequestForLesson`, one routing function in `practice-map.ts`.
5. Extend the exhaustive coverage test to the new family.

Everything else — Practice cards, result logging, origin checks — follows.

## Local development

```sh
deploy/start-all.sh     # installs, starts all nine, prints health
deploy/stop-all.sh
```

Host at http://localhost:8090 · every lab also runs standalone via
`?practice=demo`.

## Deployment

See [`deploy/README.md`](./README.md) for the NAS/Tailscale docker-compose
deployment (Caddy path-routing, deploy-time URL overrides).
