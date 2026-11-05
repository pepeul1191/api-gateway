require 'sinatra'

# Configurar el puerto del Frontend (ej. 3000) y la dirección
set :port, ENV.fetch('PORT', 3000)
set :bind, '0.0.0.0'

# Habilitar logs en consola
enable :logging

# Rutas del Frontend
get '/' do
  # Si usas vistas ERB: erb :home
  "<h1>Bienvenido al Frontend con Sinatra </h1><br><a href='/about'>About</a>"
end

get '/about' do
  "<h1>Acerca de nosotros - Frontend Sinatra</h1><br><a href='/'>Home</a>"
end