# Docker images
docker-build:
	@echo "Building Docker image for $(ui)"
	cd $(ui) && docker build -t registry.resources.lan/autobar/ui-$(ui):latest . && docker push registry.resources.lan/autobar/ui-$(ui):latest && cd ..
	@echo "Docker image for $(ui) built and pushed successfully."

docker-build-all:
	$(foreach ui, dashboard app, $(MAKE) docker-build ui=$(ui);)