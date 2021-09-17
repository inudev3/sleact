# sleact
slack clone
mySQL 설치 후
1. cd back 에서 npm i
2. .env 에 MYSQL_PASSWORD에 비밀번호 작성
3. config/config.json에 host 주소 작성
4. npx sequelize db:create
5. npm run dev했다가 끄기
6. npx sequelize db:seed:all
7. 다시 npm run dev 하시고
8. alecture폴더(프론트엔드) 로 이동하셔서 npm run dev 하신 후 
10. localhost:3090으로 접속하시면 됩니다.
