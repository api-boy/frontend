PARAMS = $(filter-out $@,$(MAKECMDGOALS))

# Ignore `No rule to make target` errors
%:
	@echo ""

# Install development tools
tools:
	@go get -u github.com/andybar2/team
	@sudo npm install -g netlify-cli
.PHONY: tools

# Install vendor dependencies
deps:
	@npm install
.PHONY: deps

# Run linter
lint:
	@npm run lint
.PHONY: lint

# Fix lint issues
lint.fix:
	@npm run lint:fix
.PHONY: lint.fix

# Run development environment
dev:
	@mkdir -p .team/development
	@team env print -s "development" > .team/development/env
	@npm run dev
.PHONY: dev

# Deploy production environment
production:
	@read -p "Do you really want to deploy to production? (y/n) " RESP; \
	if [ "$$RESP" = "y" ]; then \
		mkdir -p .team/production; \
		team env print -s "production" > .team/production/env; \
		npm run production; \
	fi
.PHONY: production
