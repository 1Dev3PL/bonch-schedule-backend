//команда для постгреса
docker run -p 5432:5432 --name some-postgres -e POSTGRES_PASSWORD=password -d postgres

//команда для редиса
docker run -p 6379:6379 --name some-redis -d redis
