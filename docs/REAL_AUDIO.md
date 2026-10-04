# Real audio pipeline

The first implementation now has the real decoding and synchronized playback boundary. The next refinement is to route each stem through its own analyser before the master output.

Target inputs: guitar.wav, piano.wav, drums.wav, bass.wav.

Each source should expose normalized features rather than leaking Web Audio implementation details into performers.

The current feature extractor is deliberately a first pass. Low/mid/high values are placeholders until frequency-bin grouping is implemented. Onset detection is envelope-based and is not yet drum-aware.

Do not treat this as finished musical transcription. The architecture is ready for better analysis without changing the performer API.
