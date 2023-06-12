# Spice Republic API

## Development

```
go mod download
go run main.go

or

go run .

// if you want to use auto-reload add this
go install github.com/cosmtrek/air@latest

and then just run 

air
```

### you can use docker for development if you want
```
cp .env.example .env
docker build -t spice_republic_api -f Dockerfile.dev .
docker run --name spice_republic_api -dit -p 3232:8080 -v $(pwd):/usr/src/app spice-republic-api:latest
docker exec -it spice_republic_api air
```

then open localhost:3232


## Production
```
docker build -t spice_republic_api -f Dockerfile .
docker run -dit -e API_TOKEN=<API_TOKEN> --name abc -p 3244:8080  spice_republic_api_production:latest
