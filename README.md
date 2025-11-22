# Rehabit

## 1. 目的

生活習慣・気分・行動計画を整えて、自分の"理想"に戻す

## 2. core value

- 習慣を積み重ねる
- 現状と、理想のギャップを可視化

## 3. Concept Motifs

- **軌跡（Habit）**  
- **整う（Balance）**  
- **リセット（Reset）**  
- **成長（Progress）**  



```
rehabit/
├── README.md
├── package.json
├── app.json           # Expo 設定
├── tsconfig.json      # TypeScript 設定（TS使う前提でおすすめ）
├── babel.config.js
└── src/
    ├── App.tsx        # エントリーポイント（後で分割してもOK）
    ├── screens/
    │   └── TodayLogScreen.tsx      # 今日のログ画面（PBL-01のメイン）
    ├── components/
    │   ├── MoodSelector.tsx        # 気分5段階セレクタ
    │   ├── SleepInput.tsx          # 睡眠時間入力
    │   └── FocusSelector.tsx       # 集中度入力
    ├── hooks/
    │   └── useDailyLog.ts          # 今日のログを扱うカスタムフック
    ├── storage/
    │   └── dailyLogRepository.ts   # AsyncStorage で保存する層
    └── types/
        └── dailyLog.ts             # DailyLog 型定義

```


```bash
npx expo start --tunnel
```