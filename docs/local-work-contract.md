# Local Work Contract

This project has one local command contract shared by humans, CI, and coding agents.

## Bootstrap

```sh
make bootstrap
make doctor
```

## Validation

```sh
make check
```

## Main Workflows

```sh
make extract
make transcribe
make export-pdf
make export-markdown
make export-audio
```

## Output and Transient Paths

- `_reports/` is the default generated output root.
- `out/` is treated as a legacy location and is still read for compatibility.
- `_tmp/` is for local transient artifacts.

## Environment

- Keep real secrets in `.env` (untracked).
- Keep structure and docs in `.env.example` (tracked).
- Add new env vars to `.env.example` as required or optional.
