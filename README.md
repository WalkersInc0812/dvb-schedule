# dvb-schedule

## Using

- [pnpm](https://pnpm.io)
- [Next.js](https://nextjs.org/)
- [shadcn/ui](https://ui.shadcn.com/)

## Running Locally

1. Install dependencies using pnpm:

```sh
pnpm install
```

2. Copy `.env.example` to `.env` and update the variables.

```sh
cp .env.example .env
```

3. Start the development server:

```sh
pnpm dev
```

## 開発フロー

- ローカルで開発する (db: https://vercel.com/zig-zag-llc/dvb-schedule/stores/integration/neon/store_EoSSDRIIewMhw98X/guides)
- PR を作成して Preview 環境で動作確認する (vercel: https://vercel.com/zig-zag-llc/dvb-schedule, db: https://vercel.com/zig-zag-llc/dvb-schedule/stores/integration/neon/store_EoSSDRIIewMhw98X/guides)
- main ブランチにマージして prod 環境にデプロイする (vercel: https://vercel.com/zig-zag-llc/dvb-schedule, db: https://vercel.com/zig-zag-llc/dvb-schedule/stores/integration/neon/store_H8hsXLERGXsjdvgM/guides)

