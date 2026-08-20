<div align="center">
  <strong><img width="1920" height="1080" alt="중커톤 표지" src="https://github.com/user-attachments/assets/f4627886-5d58-4ac4-a803-079f3d24fd37" /></strong>
</div>

---

## 🧴 HALE 프로젝트 개요

### 서비스 소개
시술 정보와 매일의 피부 상태를 AI로 분석해, 시술 후 매일 달라지는 피부에 맞춘 오늘의 회복 루틴을 제공하는 서비스

> **개발 기간**: 2026.07.26 ~ 2026.08.21

---

## 👥 백엔드 팀원 소개

<table align="center">
  <thead>
    <tr>
      <th>김예나</th>
      <th>허윤</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td align="center"><img src="https://avatars.githubusercontent.com/aney0714" alt="김예나님 사진" width="200" height="200"></td>
      <td align="center"><img src="https://avatars.githubusercontent.com/gjdbsdk" alt="허윤아님 사진" width="200" height="200"></td>
    </tr>
    <tr>
      <td align="center"><a href="https://github.com/leewatertrue">@aney0714</a></td>
      <td align="center"><a href="https://github.com/naeuun">@gjdbsdk</a></td>
    </tr>
    <tr>
      <td valign="top">
        <ul>
          <li>집중 코스 케어페이지</li>
          <li>데일리 코스 케어페이지</li>
          <li>제품 추천 페이지</li>
          <li>글꼴 타이포그래피 파일 작업</li>
        </ul>
      </td>
      <td valign="top">
        <ul>
          <li>초기 프로젝트 세팅</li>
          <li>프론트엔드 배포</li>
          <li>홈페이지</li>
          <li>마이페이지</li>
        </ul>
      </td>
    </tr>
  </tbody>
</table>

---


## ⚙️ 기술 스택

<div align="center">
<table width="100%">
<tr>
<th align="center">Core / Library</th>
<td align="left">
<img src="https://skillicons.dev/icons?i=react,ts,vite" alt="React, TypeScript, Vite">
</td>
</tr>
<tr>
<th align="center">Styling</th>
<td align="left">
<img src="https://skillicons.dev/icons?i=styledcomponents" alt="styled-components">
</td>
</tr>
<tr>
<th align="center">Routing / Data Fetching</th>
<td align="left">
<img src="https://img.shields.io/badge/React_Router-CA4245?style=flat-square&logo=reactrouter&logoColor=white" height="28" alt="React Router">
<img src="https://img.shields.io/badge/Axios-5A29E4?style=flat-square&logo=axios&logoColor=white" height="28" alt="Axios">
</td>
</tr>
<tr>
<th align="center">Code Quality</th>
<td align="left">
<img src="https://skillicons.dev/icons?i=eslint,prettier" alt="ESLint, Prettier">
</td>
</tr>
<tr>
<th align="center">Package Manager / Deploy</th>
<td align="left">
<img src="https://skillicons.dev/icons?i=yarn,vercel" alt="Yarn, Vercel">
</td>
</tr>
<tr>
<th align="center">Collaboration</th>
<td align="left">
<img src="https://skillicons.dev/icons?i=git,github,figma,notion,discord" alt="Git, GitHub, Figma, Notion, Discord">
</td>
</tr>
</table>
</div>

---


## 📂 프로젝트 구조



```

📦FRONTEND

 ┣ 📁.github

 ┣ 📁node_modules

 ┣ 📂public

 ┃  ┣ 📁favicons

 ┃  ┗ 📁fonts

 ┃  ┣ 📁routes

 ┣ 📂src

 ┃  ┣ 📁components

 ┃  ┣ 📂lib

 ┃  ┃  ┗ 📜colorPalette.ts

 ┃  ┣ 📁routes

 ┃  ┣ 📁styles

 ┃  ┣ 📜App.css

 ┃  ┣ 📜App.tsx

 ┃  ┣ 📜index.css

 ┃  ┗ 📜main.tsx

 ┣ 📜.gitignore

 ┣ 📜eslint.config.js

 ┣ 📜index.html

 ┣ 📜package.json

 ┣ 📜README.md

 ┣ 📜tsconfig.app.json

 ┣ 📜tsconfig.json

 ┣ 📜tsconfig.node.json

 ┣ 📜vite.config.js

 ┗ 📜yarn.lock

``` 
---

## 🚀 시작하기

- **Default Port**: `3000`

```
bash
# 의존성 패키지 설치
yarn install

# 로컬 개발 서버 실행
yarn dev

# 배포용 프로덕션 빌드
yarn build
```

---

## ⌨️ Code Styling

- **camelCase**
  - 변수명, 함수명에 적용
  - 첫글자는 소문자로 시작, 띄어쓰기는 붙이고 뒷 단어의 시작을 대문자로
    - ex- handleDelete
  - 언더바 사용 X (클래스명은 허용)


## 🔗 Git Convention



### 💫 Git Flow



```

main ← feat

```



- main : 배포 및 전체 개발 브랜치 (feat이 merge되는 브랜치) -> 1차 배포 브랜치

- feat : 페이지/기능 별 브랜치

- refactor : 리펙토링/수정 별 브랜치



### 🔥 Commit Message Convention



- **커밋 유형**



  - ✨ Feat: 새로운 기능 추가

  - 🐛 Fix : 버그 수정

  - ✏️ Typing Error : 오타 수정

  - ♻️ Refactor : 코드 리펙토링

  - 🚀 Init: 프로젝트 세팅



- **형식**: `커밋유형: 상세설명 (#이슈번호)`

- **예시**:

  - 🚀 Init: 프로젝트 초기 세팅 (#1)

  - ✨ Feat: 메인페이지 개발 (#2)



### 🌿 Branch Convention



**Branch Naming 규칙**



- **브랜치 종류**

  - `Feat`: 새로운 기능 추가

  - `Fix` : 버그 수정

  - `Refactor` : 코드 리펙토링

  - `Init`: 프로젝트 세팅

- **형식**: `브랜치종류/#이슈번호/상세기능`

- **예시**:

  - Init/#1/init

  - Fix/#2/splash



### 📋 Issue Convention



**Issue Title 규칙**



- **태그 목록**:

  - `✨ Feat`: 새로운 기능 추가

  - `🐛 Fix` : 버그 수정

  - `♻️ Refactor` : 코드 리펙토링

  - `🚀 Init`: 프로젝트 세팅

- **예시**:

  - ✨ Feat - Header 컴포넌트 구현

  - 🚀 Init - 프로젝트 초기 세팅



### Issue Template



- **제목**: ✨ Feat - 간단한 요약

- **내용**:



```

## 📄 About



해당 이슈에서 작업할 내용을 작성해주세요.



## ✅ To Do



해당 이슈와 관련된 할 일을 작성해주세요.

할 일을 완료했다면 체크 표시로 기록해주세요.



- [ ] todo

- [ ] todo



## 🎨 Preview



작업하고자 하는 내용의 뷰를 첨부해주세요.



```



## 🔄 Pull Request (PR) Convention



**PR Title 규칙**



- **형식**: `[태그] 제목`

- **태그 목록**:

  - `✨Feat`: 새로운 기능 추가

  - `🐛Fix` : 버그 수정

  - `♻️Refactor` : 코드 리펙토링

  - `🚀Init`: 프로젝트 세팅

- **예시**:

  - [✨Feat] Header 컴포넌트 구현

  - [🐛Fix] Header 컴포넌트 버그 수정



### PR Template



- **PR 작성 규칙**:



```

<!-- PR 제목은 '[✨Feat] 작업 내용' 과 같은 형태로 작성해주세요.  -->



### 📑 이슈 번호



<!-- 이슈 번호를 작성해주세요. 해당 PR이 Merge되면 자동으로 이슈가 close됩니다. ex) #1 -->



- close #



<br>



### ✨️ 작업 내용



<!-- 작업 내용을 간략히 설명해주세요. 프로토타입 캡쳐본을 함께 올려주시면 좋습니다! -->



<br>



### 💭 코멘트



<!-- 코드 리뷰가 필요한 부분이나 궁금한 점을 자유롭게 남겨주세요! -->



<br>



### 📸 구현 결과



<!-- 구현한 기능이 모두 결과물에 포함되도록 자유롭게 첨부해주세요 (스크린샷, gif, 동영상, 배포링크 등) -->



<!-- PR 제목 컨벤션에 맞게 잘 작성했는지, assignee 지정했는지 체크하기 !! -->



```
