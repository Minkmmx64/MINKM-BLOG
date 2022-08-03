### 后台接口服务
# docker 数据卷
docker run -itd -v 主机文件路径:容器文件路径 -p 主机端口:容器端口 --name 容器名 容器ID /bin/bash
具名挂载 -v name:/容器路径 docker volume inspect name  保存在主机/var/lib/docker/volumes/name/_data
匿名挂载 -v /容器路径:ro 只读，只能从外部访问,默认rw