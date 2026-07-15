# ATSデモ

中小企業向け採用管理システム(ATS)のデモ版。

## セットアップ

1. Supabaseで新規プロジェクトを作成
2. SQL Editorで `supabase/schema.sql` → `supabase/seed.sql` の順に実行
3. `.env.example` をコピーして `.env.local` を作成し、SupabaseのURL/anonキーを設定
4. Claude Code / Cowork にこのフォルダを開かせ、「CLAUDE.md を読んで実装を始めて」と指示

## 構成

```
ats-demo/
├── CLAUDE.md              # AI向けプロジェクト指示
├── docs/
│   └── ATS_DEMO_SPEC.md   # 要件定義書
├── supabase/
│   ├── schema.sql         # DBスキーマ
│   └── seed.sql           # デモ用ダミーデータ
└── .env.example
```
