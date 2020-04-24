#!/bin/sh                                                                                                                                                                                                          
set -e
echo "SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE datname = 'shortner';" | psql postgres -Upostgres
dropdb -Upostgres --if-exists shortner
createdb -Upostgres shortner
echo "create role shortner with login password '1234'" | psql postgres -Upostgres

for f in src/migrations/*; do
  echo "running migration for: $f"
  psql shortner -U shortner < $f
done
