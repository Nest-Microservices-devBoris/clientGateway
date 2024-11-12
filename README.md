##CLIENT GATEWAY

Este microservicio es el cliente de todos los servicios de la aplicación. 

## dev

1. Clonar el repositorio
2. Instalar dependencias
3. Crear el archivo `.env` basado en el `.env.template`
4. Levantar el servidor de NATS
```bash
docker run -d --name nats-server -p 4222:4222 -p 8223:8222 nats
```
5. Tener corriendo los servicios que se van a consumir
6. Ejecutar el comando `npm run start:dev`

## Nats
Para levantar el servidor de NATS, ejecutar el siguiente comando:
```bash
docker run -d --name nats-server -p 4222:4222 -p 8223:8222 nats
```

## prod
Levantar imagen de producción del client-gateway
```bash
docker build -f dockerfile.prod -t client-gateway .
```