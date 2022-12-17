PROJ=kycaml-service
ORG_PATH=github.com/container23
REPO_PATH=$(ORG_PATH)/$(PROJ)

DOCKER_IMAGE=$(PROJ)

# Version
VERSION ?= $(shell chmod +x ./scripts/git-version.sh && ./scripts/git-version.sh)
COMMIT_HASH ?= $(shell git rev-parse HEAD 2>/dev/null)
BUILD_TIME ?= $(shell date +%FT%T%z)
PWD ?= $(pwd)

build: clean
	@npm run build

clean:
	@echo "Cleaning Build Folders"
	@rm -rf dist/*
	@rm -rf coverage/*

start: build
	@npm run start

start-dev:
	@npm run dev

test: 
	@echo "Running unit tests..."
	@npm test

lint: 
	@npm run lint

lint-fix: 
	@npm run lint-and-fix

test-coverage:
	@npm run testc

docker-image: clean
	@echo "Building $(DOCKER_IMAGE) image"
	@docker build --build-arg VERSION=$(VERSION) --build-arg COMMIT_HASH=$(COMMIT_HASH) --build-arg BUILD_TIME=$(BUILD_TIME) -t $(DOCKER_IMAGE) --rm -f Dockerfile .

docker-run:
	@echo "Starting container..."
	@docker run --rm --name=kycaml-service --env-file=./.env -p 8080:8080 kycaml-service:latest

release: clean
	@echo "Building release: ${COMMIT_HASH}"
	@echo "Installing dependencies"
	@npm install
	# TODO: unable to run on server
	# @echo "Linting code..."
	# @npm run lint
	@echo "Running unit tests..."
	@npm run test
	@echo "Building app..."
	@npm run build
	@echo "Cleaning dev dependencies..."
	@npm prune --omit=dev

refresh-aml-list: 
	@chmod +x ./scripts/refresh-aml-list.sh
	@bash ./scripts/refresh-aml-list.sh

.PHONY: clean \
		docker-run-api \
		test \
		start \
		start-dev \
		test-coverage \
		refresh-aml-list \
		release \
		lint \
		lint-fix \
		build 