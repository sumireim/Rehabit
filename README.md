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
Rehabit/
├── App.tsx
├── index.ts
├── app.json
├── package.json
├── package-lock.json
├── tsconfig.json
├── assets/
│   ├── splash-icon.png
│   ├── icon.png
│   ├── adaptive-icon.png
│   └── favicon.png
└── src/
    ├── screens/
    │   ├── TodayLogScreen.tsx
    │   └── HistoryScreen.tsx
    ├── hooks/
    │   └── useDailyLog.ts
    ├── storage/
    │   └── dailyLogRepository.ts
    ├── styles/
    │   └── theme.ts
    └── types/
        └── dailyLog.ts

```


```bash
npx expo start --tunnel
```