# THEBAND architecture

## Scene model

The portrait scene has four vertical performance zones. The piano/ghost occupies the sky. Its keyboard spans the entire width and acts as the visual boundary between sky and street. Guitar and drums occupy the middle. The bass creature anchors the bottom.

## Stem contract

Every stem produces normalized frames:

- level: perceived energy, 0..1
- onset: attack/transient strength, 0..1
- low/mid/high: spectral energy, 0..1
- pitchHz: optional detected pitch
- time: source time in seconds

## Event contract

Frames become semantic events: hit, sustain, rise, or fall. Performers should react to events, not raw FFT bins.

## Performer rules

Each performer owns a state machine and can affect the shared world. The Band Director will eventually arbitrate cross-performer events such as fills, drops, section changes, and full-mix impacts.

## Audio roadmap

1. File selection for four stems.
2. Web Audio decoding and synchronized playback.
3. Offline/worker analysis where practical.
4. Transient and envelope extraction.
5. Pitch tracking for melodic stems.
6. Drum-specific onset grouping.
7. Semantic event stream.
8. Deterministic renderer replay from event JSON.

That final replay layer matters: once a performance can be represented as events, the same song can be rendered repeatedly without re-running expensive audio analysis.
