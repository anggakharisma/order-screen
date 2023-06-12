FROM golang:1.20
WORKDIR /app
ENV MODE=production

COPY go.mod go.sum ./
RUN go mod download

COPY . .

RUN go mod tidy
RUN go build 

CMD ["./api"]
