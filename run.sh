

docker buildx build --platform linux/amd64 -t metafi/vrm-demo:0.1.2 --load .

docker buildx build --platform linux/amd64,linux/arm64 -t metafi/vrm-demo:0.1.2 --push .

docker push metafi/vrm-demo:0.1.2