echo "transfer"
cd VUE
npm run build
cd ../
cp -r ./VUE/dist/* ./docker/nginx/dist
scp -r ./docker/* root@IpAddr:/scripts

