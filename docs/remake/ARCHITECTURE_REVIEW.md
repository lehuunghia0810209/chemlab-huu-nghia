# ChemLab Remake — Architecture Review (Phase 0)

## Hiện trạng

```
index.html
└─ src/main.js            app shell (innerHTML), router (hash), command palette, view switch
   ├─ appMeta.js          sinh bởi scripts/sync-release.mjs
   ├─ routeModuleLoader.js lazy-load module theo route (10 module)
   ├─ periodicWorkspace.js (5.2k dòng) → periodicDataV5.js, chemContextBridge.js,
   │                       atom3d.js, elementOrbital3D.js (Three.js, lazy)
   ├─ final/homeDashboard.js
   ├─ progress/progressStorage.js  localStorage `chemlab-v1-progress`
   ├─ accessibility.js, userPreferences.js (theme qua html[data-theme])
   ├─ [lazy] toolHub, balancer, chemCalculator, solubilityTable, ionEngine(+Reset),
   │         orbitalAtlas, compoundStudio, reactionStudio
   ├─ [lazy] quiz.js (Learning), lab/experiments/*
   ├─ [lazy] virtualLab.js → lab/chemicals.js, lab/reactions.js, lab/reactionEngine.js
   └─ [lazy] ai/chemAI.js → ai/contextBuilder.js → POST /api/chat
src/production.js          service worker, badge "HN", boot screen
functions/api/chat.js      Gemini generateContent (+ _knowledge.js grounding)
public/sw.js               network-first navigation, cache-first /assets/
```

## Hợp đồng công khai cần giữ nguyên

- Hash routes: `#home`, `#periodic`, `#tools`, `#tools/<toolId>`, `#learning`, `#lab`.
- `window.ChemLabApp` (navigate / openTool / openChemAI / context), `window.ChemLabTools`.
- Sự kiện `chemlab:view-change`, `chemlab:progress-changed`.
- Thuộc tính điều hướng: `data-view`, `data-app-view`, `data-app-tool`, `data-chemai-open`, `data-retry-view`.
- ID host: `#app`, `#workspace-main`, `#view-*`, `#home-dashboard-root`, `#periodic-workspace-root`, `#tools`, `#learning-host`, `#lab-host`, `#element-drawer`.
- Storage keys: `chemlab-v1-progress`, `chemlab-v6-last-view`, `chemlab-active-tool`, khóa preferences, sessionStorage ChemAI.
- `/api/chat` request/response schema.

## Điểm mạnh (giữ)

- Lazy loading theo route hoạt động đúng; Three.js không nằm trong bundle đầu.
- Dữ liệu hóa học tách khỏi UI (`lab/*.js`, `periodicDataV5.js`, `lab/experiments/*`), có validator.
- `safeInit` cô lập lỗi module; backend ChemAI có hardening tốt.

## Vấn đề kiến trúc

1. **CSS global theo lớp đè** (11 file, 2.125 `!important`, 6 hệ token) — nguyên nhân gốc của sự thiếu nhất quán và chi phí bảo trì. Không có ranh giới module.
2. **Bốn bản renderer Three.js** tự quản lý vòng đời riêng, lặp code (scene/camera/controls/resize/dispose); orbital geometry lặp ở 3 file.
3. **Không có lớp toán học orbital tách khỏi render** → không thể kiểm thử tính đúng đắn khoa học.
4. Markup sinh bằng template string lớn trong file 5k dòng; class đặt tên theo phiên bản (`v4-`, `v5-`, `pv5-`, `cl6-`).
5. `check:ui` kiểm tra bằng grep chuỗi → dễ PASS dù UI hỏng (đã chứng minh với lỗi B1).

## Kiến trúc đích

```
src/styles/
  tokens.css       primitive + semantic tokens, dark/light
  base.css         reset, typography, focus, reduced motion
  components.css   button, icon-button, card, chip, segmented, input, badge, ...
  shell.css        app shell (sidebar / topbar / bottom nav / workspace mode)
src/three/
  sceneHost.js     vòng đời renderer dùng chung: DPR cap, resize, pause khi ẩn,
                   context loss, dispose, WebGL fallback, quality tier
src/chem/
  orbitalMath.js   hàm sóng hydrogen-like (R_nl, Y_lm thực), lấy mẫu mật độ — thuần JS, có test
```

CSS của từng module (`balancer.css`, `virtualLab.css`…) được viết lại tại chỗ trên token mới. Lớp CSS global legacy bị xóa khi mọi workspace đã có style mới.
