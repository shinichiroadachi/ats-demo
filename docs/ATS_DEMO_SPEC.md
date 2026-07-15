# ATSデモ 要件定義書(Claude Code用インプット)

## プロジェクト概要

中小企業向け採用管理システム(ATS)のデモ版。
知り合いの経営者にデモを見せ、フィードバックを引き出すことが目的。
本番運用は想定せず、**見た目の完成度と操作の気持ちよさを最優先**する。

- 想定ユーザー: 中小企業の社長・採用担当者(1〜2名)
- デモ形式: ローカルまたはVercelデプロイでブラウザ画面を見せる
- 認証: デモでは不要(ログイン画面なし、直接ダッシュボードへ)

## 技術スタック

- **フレームワーク**: Next.js 14+ (App Router)
- **DB/BaaS**: Supabase (PostgreSQL)
- **スタイリング**: Tailwind CSS
- **ドラッグ&ドロップ**: @dnd-kit/core (カンバン用)
- **チャート**: Recharts (ダッシュボード用)
- **言語**: TypeScript
- **UI言語**: 日本語

## 画面構成(4画面)

### 1. 候補者パイプライン(カンバンボード) — 最重要画面

デモの主役。最初に作り込む。

- 選考ステージを列として横に並べる:
  `応募 → 書類選考 → 一次面接 → 最終面接 → 内定 → 入社`
- 各列に候補者カードを表示。カードには氏名・応募職種・経路バッジ・応募日を表示
- **ドラッグ&ドロップでステージ間を移動できる**(移動時にDBのステータス更新+選考履歴に自動記録)
- 各列の上部に人数バッジ
- 「不採用」「辞退」はカードのメニューから選択(列としては表示しない。アーカイブ扱い)
- カードクリックで候補者詳細(画面2)をモーダルまたはサイドパネルで開く

### 2. 候補者詳細

- 基本情報: 氏名、ふりがな、メールアドレス、電話番号、応募職種(求人と紐付け)、応募経路(求人媒体/人材紹介/リファラル/直接応募)、応募日
- 履歴書・職務経歴書の添付ファイル欄(デモではダミーのPDFファイル名表示でよい。実アップロードはSupabase Storageで実装できれば尚可)
- フリーテキストのメモ欄(面接所感などを記録する想定。追記式で投稿者名と日時付き)
- 選考履歴タイムライン: ステージ移動の履歴を時系列表示(「10/1 応募 → 10/5 書類選考通過 → …」)

### 3. 求人管理

- 求人票の一覧テーブル: 職種名、雇用形態(正社員/契約/アルバイト)、公開ステータス(公開中/停止)、紐づく候補者数、作成日
- 求人の新規作成・編集フォーム: 職種名、雇用形態、勤務地、給与レンジ、仕事内容(テキスト)、公開ステータス
- 求人詳細から、その求人に紐づく候補者一覧へ遷移できる

### 4. ダッシュボード(トップページ)

社長に「数字が見える」ことを訴求する画面。

- KPIカード4枚: 総応募数(今月)、選考中人数、内定数(今月)、平均選考日数(応募→内定)
- 経路別応募数の円グラフまたは棒グラフ
- ステージ別人数のファネル的な棒グラフ
- 直近の応募者リスト(5件、パイプラインへのリンク)

## データモデル(Supabase)

```sql
-- 求人
create table jobs (
  id uuid primary key default gen_random_uuid(),
  title text not null,                -- 職種名
  employment_type text not null,      -- 正社員/契約社員/アルバイト
  location text,
  salary_range text,
  description text,
  status text not null default '公開中', -- 公開中/停止
  created_at timestamptz default now()
);

-- 候補者
create table candidates (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  kana text,
  email text,
  phone text,
  job_id uuid references jobs(id),
  source text not null,               -- 求人媒体/人材紹介/リファラル/直接応募
  stage text not null default '応募',  -- 応募/書類選考/一次面接/最終面接/内定/入社/不採用/辞退
  resume_filename text,
  applied_at date not null,
  created_at timestamptz default now()
);

-- メモ
create table notes (
  id uuid primary key default gen_random_uuid(),
  candidate_id uuid references candidates(id) on delete cascade,
  author text not null default '採用担当',
  body text not null,
  created_at timestamptz default now()
);

-- 選考履歴
create table stage_history (
  id uuid primary key default gen_random_uuid(),
  candidate_id uuid references candidates(id) on delete cascade,
  from_stage text,
  to_stage text not null,
  changed_at timestamptz default now()
);
```

RLSはデモでは無効でよい(または全許可ポリシー)。

## ダミーデータ(シードスクリプトを作成すること)

- 求人: 3件(例: 「営業職(法人営業)」「経理スタッフ」「店舗スタッフ」)
- 候補者: 15名程度。ステージにばらけさせる(応募4/書類3/一次3/最終2/内定1/入社1/不採用1)
- 氏名は自然な日本人名のダミー(例: 佐藤健太、鈴木美咲、など)
- 応募日は直近2ヶ月に分散させ、ダッシュボードのグラフが成立するようにする
- 各候補者に1〜2件のメモと選考履歴を入れる

## デザイン方針

- クリーンなSaaS風UI(白基調+アクセントカラー1色。青系推奨)
- サイドバーナビゲーション: ダッシュボード / パイプライン / 候補者 / 求人
- デモはPCブラウザで見せるためデスクトップ優先(レスポンシブは不要)
- 日本語フォントが自然に見えること(Noto Sans JPなど)

## スコープ外(実装しないこと)

以下は意図的に実装しない。デモ時のヒアリングネタとして残す。

- メール送信・自動通知
- 面接日程調整機能
- ユーザー認証・権限管理(複数ユーザー対応)
- 求人媒体(Indeed等)との連携
- 検索・高度なフィルタ(パイプラインの職種フィルタ程度はあってよい)

## 実装順序の推奨

1. Supabaseスキーマ+シードデータ
2. 画面1: カンバンボード(D&D含む) ← ここに一番時間をかける
3. 画面2: 候補者詳細
4. 画面3: 求人管理
5. 画面4: ダッシュボード
6. 全体のデザイン調整
