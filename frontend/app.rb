require 'sinatra'
require 'dotenv/load' # Carga automática del archivo .env

# Configurar el puerto del Frontend (ej. 3000) y la dirección
set :port, ENV.fetch('PORT', 3000)
set :bind, '0.0.0.0'

# Habilitar logs en consola
enable :logging

# Configurar headers globales
before do
  headers 'X-Powered-By' => 'Ruby'
  headers 'Server' => 'nginx,Ruby'
end

# Rutas del Frontend
get '/' do
  @title = "Página de Inicio"
  erb :home
end

get '/about' do
  @title = "Acerca de Nosotros"
  erb :about
end