# 🚀 API Gateway local con Nginx, Flask y Sinatra

Este repositorio es un entorno de desarrollo local que implementa un **API Gateway** utilizando **Nginx** en Ubuntu, el cual redirige peticiones hacia dos microservicios independientes:

1. **Servicio de Usuarios:** Desarrollado en **Flask (Python)** corriendo en el puerto `3001`.

2. **Servicio de Productos:** Desarrollado en **Sinatra (Ruby)** corriendo en el puerto `3002`.

## 🛠️ Tecnologías utilizadas

* **Servidor Web / API Gateway:** Nginx

* **Microservicio 1:** Python / Flask

* **Microservicio 2:** Ruby / Sinatra

* **Orquestador:** Concurrently (Node.js)

## 📂 Estructura del Proyecto

```
aprendiendo/
├── users/
│   ├── server.py
│   ├── requirements.txt
│   ├── venv/
│   └── .gitignore
├── products/
│   ├── app.rb
│   ├── Gemfile
│   ├── Gemfile.lock
│   └── .gitignore
├── package.json
├── README.md
└── .gitignore

```

Instalar Nginx

    $ sudo apt-get install nginx nginx-extras

## ⚙️ Configuración y Requisitos Previos

Asegúrate de tener instalado en tu sistema Ubuntu:

* Nginx (`sudo apt install nginx`)

* Python 3 y Pip

* Ruby y Bundler

* Node.js y npm

### 1. Configuración del API Gateway en Nginx

El gateway está configurado para escuchar en el **puerto 90** y redirigir las rutas:

* Archivo de configuración: `/etc/nginx/sites-available/api-gateway`

```
# ==============================================================================
# Definición de Upstreams (Servicios Backend y Frontend)
# ==============================================================================

upstream backend_users {
    server 127.0.0.1:3001;
}

upstream backend_products {
    server 127.0.0.1:3002;
    server 127.0.0.1:3003;
}

# Nuevo Upstream para el Frontend en Sinatra (Puerto 3000)
upstream frontend_sinatra {
    server 127.0.0.1:3000;
}

upstream backend_static {
    server 127.0.0.1:3004;
}

# ==============================================================================
# Servidor API Gateway (Puerto 90)
# ==============================================================================
server {
    listen 90;
    server_name localhost;
	more_set_headers "Server: nginx/1.24.0 (Ubuntu); Ruby";

    # --------------------------------------------------------------------------
    # 1. Microservicio de Usuarios (Flask - Puerto 3001)
    # --------------------------------------------------------------------------
    location /api/users {
        proxy_pass http://backend_users;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_pass_header X-Powered-By;
    }

    # --------------------------------------------------------------------------
    # 2. Microservicio de Productos (Sinatra - Puertos 3002 y 3003)
    # --------------------------------------------------------------------------
    location /api/products {
        proxy_pass http://backend_products;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_pass_header X-Powered-By;
    }

    # --------------------------------------------------------------------------
    # 3. Frontend (Sinatra - Puerto 3000)
    # --------------------------------------------------------------------------
    location / {
        proxy_pass http://frontend_sinatra;
        
        # Cabeceras de proxy estándar y soporte para WebSockets/Keep-Alive
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;

        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

	# --------------------------------------------------------------------------
    # 4. Static Files
    # --------------------------------------------------------------------------

	location /static/ {
		proxy_pass http://backend_static/;
		proxy_http_version 1.1;
		proxy_set_header Host $host;
		
		# Opcional: Activar caché en Nginx para assets estáticos masivos
		expires 30d;
		add_header Cache-Control "public, no-transform";
	}
}
```

Reiniciar el servicio:

    $ sudo nginx -t
    $ sudo systemctl restart nginx


## 🚀 Ejecución del Proyecto

Para levantar ambos microservicios de forma concurrente con un solo comando desde la raíz del proyecto:

1. Instala las dependencias de Node.js (necesarias para `concurrently`):

   ```
   npm install
   
   ```

2. Arranca ambos servidores (Flask y Sinatra) en paralelo:

   ```
   npm run start:all
   
   ```

## 🧪 Pruebas de los Endpoints

Una vez que Nginx esté corriendo (`sudo systemctl restart nginx`) y los servicios estén activos, puedes realizar peticiones a través del API Gateway en el puerto **90**:

* **Consultar Usuarios (Flask):**

  ```
  curl -I http://localhost:90/api/users
  
  ```

* **Consultar Productos (Sinatra):**

  ```
  curl -I http://localhost:90/api/products
  
  ```

Las respuestas incluirán la cabecera `X-Powered-By: Flask` o `X-Powered-By: Sinatra` respectivamente, permitiendo su detección con herramientas como Wappalyzer.# Gemas instaladas localmente (si usas bundle install --path vendor/bundle)

vendor/bundle/

\# Archivos generados por Ruby/Bundler

.bundle/

Gemfile.lock

\# Logs y temporales

\*.log

tmp/

\# IDEs

.vscode/

.idea/