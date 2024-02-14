.PHONY: reset start metadata migrate metadata-reload console

export HASURA_GRAPHQL_ADMIN_SECRET = $(value LOCAL_HASURA_GRAPHQL_ADMIN_SECRET)
export CLOUD_FUNCTIONS_ENDPOINT = $(value LOCAL_CLOUD_FUNCTIONS_ENDPOINT)

all: start metadata migrate metadata-reload console

start:
	@echo "PS: Make sure you started Docker."
	@echo "Docker containers starting..."
	docker-compose up -d
	sleep 3

metadata:
	@echo "hasura metadata applying..."
	yarn hasura metadata apply
	sleep 3

metadata-reload:
	@echo "hasura metadata reloading..."
	yarn hasura metadata reload
	sleep 3

migrate:
	@echo "hasura migrations applying..."
	yarn hasura migrate apply --all-databases
	sleep 3

console:
	@echo "hasura console starting..."
	yarn hasura console

reset:
	@echo "Docker containers reseting..."
	docker-compose down
	docker volume prune
