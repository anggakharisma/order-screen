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
    docker build -t spice-republic-api -f Dockerfile.dev .
    docker run --name spice-republic-api -dit -p 3232:8080 -v $(pwd):/usr/src/app spice-republic-api:latest
    docker exec -it spice-republic-api air
    ```
