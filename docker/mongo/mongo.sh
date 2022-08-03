o "Run Build Shell Name :$0"
echo "Docker Run Reatart"

HOSTPORT=3000 #主机开发端口
MONGONAME=mongo-blog
DBPATH=/scripts/mongo/db #主机数据库
REMOTEDBPATH=/data/db #容器数据库

docker build -f Dockerfile -t mongo-test:1.0.1 . 

docker run -itd --name ${MONGONAME} \
                -p ${HOSTPORT}:27017 \
                -v ${DBPATH}:${REMOTEDBPATH} \
                $(docker images -qf reference=mongo-test:1.0.1) --auth  #/* 一定要加auth */
                
docker exec -it ${MONGONAME} mongo admin #这段抱错的话手动执行一下

echo "------------docker entry------------"