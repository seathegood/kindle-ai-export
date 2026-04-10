# AGENTS.md

This repository uses `make` as the local and CI command contract.

## First Run

1. Copy `.env.example` to `.env` and set required values.
2. Run `make bootstrap`.
3. Run `make doctor`.
4. Run `make check`.

## Canonical Commands

- `make bootstrap`: install dependencies exactly from lockfile.
- `make doctor`: verify local toolchain and `.env` presence.
- `make check`: run format, lint, and type checks.
- `make format`: auto-format supported files.
- `make extract`: extract Kindle screenshots + metadata.
- `make transcribe`: OCR screenshots into `content.json`.
- `make export-pdf`: produce PDF output.
- `make export-markdown`: produce Markdown output.
- `make export-audio`: produce audiobook output.
- `make clean-local`: remove transient local artifacts.

## Directory Conventions

- `_tmp/`: transient local artifacts only. Never commit.
- `_reports/`: generated outputs. Default report root.
- `out/`: legacy output location; still read for backward compatibility.

## Environment Contract

Required variables are documented in `.env.example`.

- Required: `AMAZON_EMAIL`, `AMAZON_PASSWORD`, `ASIN`, `OPENAI_API_KEY`
- Optional: `REPORTS_DIR`, debug toggles, and audiobook settings.

## Agent Operating Rules

- Prefer `make` targets over ad hoc command sequences.
- Prefer safe incremental edits and preserve backward compatibility.
- Do not commit `.env`, `_tmp`, or generated report outputs.
- If output-path behavior is changed, preserve legacy `out/` reads unless explicitly removed.
