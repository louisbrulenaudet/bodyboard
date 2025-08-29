init: ## Initialize the project
	@echo "🔧 Initializing the project..."
	npm install

check: ## Check the codebase for issues
	@echo "🔍 Checking codebase..."
	npm run check

build: ## Build the project
	@echo "🏗️ Building the project..."
	npm run build

format: ## Format the codebase using Biome
	@echo "📝 Formatting code..."
	npm run format

lint: ## Lint the codebase using Biome
	@echo "🔍 Running code analysis..."
	npm run lint
