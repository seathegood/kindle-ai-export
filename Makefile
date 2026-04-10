.PHONY: bootstrap doctor check lint format format-check unit clean-local extract transcribe export-pdf export-markdown export-audio

bootstrap:
	pnpm install --frozen-lockfile --strict-peer-dependencies

doctor:
	node --version
	pnpm --version
	pnpm exec tsc --version
	@if [ ! -f .env ]; then echo 'Missing .env (copy from .env.example)'; fi

check: format-check lint unit

lint:
	pnpm run lint

format:
	pnpm run format

format-check:
	pnpm run format-check

unit:
	pnpm run unit

extract:
	pnpm exec tsx src/extract-kindle-book.ts

transcribe:
	pnpm exec tsx src/transcribe-book-content.ts

export-pdf:
	pnpm exec tsx src/export-book-pdf.ts

export-markdown:
	pnpm exec tsx src/export-book-markdown.ts

export-audio:
	pnpm exec tsx src/export-book-audio.ts

clean-local:
	rm -rf _tmp
	rm -f run.log
