echo "Run Build Shell Name :$0"
echo "Docker Run Reatart"

CONFPATH=/scripts/redis/redis.conf #本地nginx配置文件
REMOTECONF=/etc/redis/redis.conf #容器redis配置文件
DOCKERNAME=blog-redis #容器名
DBCONFOG=/scripts/redis/data #本地绑定的数据库
REMOTEDBCONFIG=/data #redis数据库

docker build -f Dockerfile -t redis-test:1.0.1 . 

#                 本地配置文件:容器配置文件 
docker run -it -v ${CONFPATH}:${REMOTECONF} \
               -v ${DBCONFOG}:${REMOTEDBCONFIG} \
               -p 8080:6379 --name ${DOCKERNAME} \
               -d $(docker images -qf reference=redis-test:1.0.1) \
               redis-server /etc/redis/redis.conf --appendonly yes

#docker exec -it $(docker ps -qf name=${DOCKERNAME}) /bin/bash

echo "------------docker entry------------"

