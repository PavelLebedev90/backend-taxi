для прогона тестов поднимаем контейнер:
docker run -d \
--name taxi-mongo \
-p 27018:27017 \
mongo:7
