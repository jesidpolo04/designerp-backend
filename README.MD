## Levantando un ambiente local

### Base de datos

Utiliza el siguiente comando docker run para levantar un contenedor en docker con sqlserver:2022-latest

```
docker run -e "ACCEPT_EULA=Y" \
   -e "MSSQL_SA_PASSWORD=TuPasswordFuerte123!" \
   -p 1433:1433 \
   -v sql_data:/var/opt/mssql \
   --name sql_server_container \
   -d mcr.microsoft.com/mssql/server:2022-latest
```
