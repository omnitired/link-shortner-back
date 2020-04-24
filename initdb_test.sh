#!/bin/sh                                                                                                                                                                                                          
echo "SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE datname = 'test';" | psql postgres -Upostgres
dropdb -Upostgres --if-exists test
createdb -Upostgres test

for f in src/migrations/*; do
  echo "running migration for: $f"
  psql test -U shortner < $f || true
done
