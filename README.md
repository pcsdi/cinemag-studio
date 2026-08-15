# CINEMAG 무API 테스트 버전

이 브랜치는 Netlify에서 먼저 시험하기 위한 CINEMAG 무API 버전입니다.

- 브랜치: `cinemag-noapi-test`
- AI API 키 사용 안 함
- 사용자 영상 주제/프로젝트/결과물 저장 안 함
- 관리자 운영 설정만 Netlify Blobs에 저장
- 관리자 ID: `pcsdi2026`
- 관리자 비밀번호: `123456`
- 기본 입장코드: `0810`
- 기본 강사용 코드: `2580`

## Netlify 테스트

Netlify에서 Production branch를 변경하지 말고 이 브랜치로 Branch deploy/Deploy Preview를 만들어 시험합니다.
Build command: `npm run build`
Publish directory: `dist`

테스트가 끝나기 전에는 main 브랜치에 병합하지 않습니다.
