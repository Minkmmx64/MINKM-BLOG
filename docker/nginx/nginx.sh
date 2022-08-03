echo "Run Build Shell Name :$0"
echo "Docker Run Reatart"

CONFPATH=/scripts/nginx/nginx.conf #本地nginx配置文件
DISTPATH=/scripts/nginx/dist #本地静态资源文件
REMOTECONF=/etc/nginx/nginx.conf #容器nginx配置文件
REMOTEDIST=/scripts/vue/dist #容器根目录,和nginx.conf中的root对应好
DOCKERNAME=blog-nginx #容器名

docker build -f Dockerfile -t nginx-test:1.0.1 . 

#                 本地配置文件:容器配置文件     本地资源目录:容器资源目录
docker run -itd -v ${CONFPATH}:${REMOTECONF} \
                -v ${DISTPATH}:${REMOTEDIST} \
                -p 80:80 --name ${DOCKERNAME} \
                $(docker images -qf reference=nginx-test:1.0.1)  /bin/bash

docker exec -it $(docker ps -qf name=blog-nginx) /bin/bash

echo "------------docker entry------------"

