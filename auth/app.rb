require 'sinatra'
require 'jwt'
require 'json'

set :port, ENV.fetch('PORT', 3005)
set :bind, '0.0.0.0'

# Clave secreta (en producción usa una variable de entorno segura o RS256 con llave privada)
SECRET_KEY = ENV.fetch('JWT_SECRET', 'mi_clave_secreta_super_segura')

helpers do
  def json_response(success:, message:, data: nil, error: nil, status_code: 200)
    status status_code
    content_type :json
    {
      success: success,
      message: message,
      data: data,
      error: error
    }.compact.to_json # .compact remueve las llaves que sean nil si prefieres no mostrarlas, o déjalas explícitas si quieres que siempre aparezcan.
  end
end

post '/api/auth/login' do
  content_type :json
  
  # Recibir credenciales del body (JSON o form)
  request.body.rewind
  data = JSON.parse(request.body.read) rescue {}
  
  username = data['username']
  password = data['password']

  # Validación simulada (aquí consultarías tu base de datos PostgreSQL)
  if username == 'admin' && password == '123456'
    # Generar el payload del JWT con expiración (ej. 2 horas)
    payload = {
      sub: 1, # ID del usuario
      username: username,
      role: 'admin',
      exp: Time.now.to_i + 7200 
    }

    token = JWT.encode(payload, SECRET_KEY, 'HS256')

    json_response(
      success: true,
      message: "Autenticación exitosa",
      data: { token: token },
      error: nil
    )
  else
    status 401
    json_response(
      success: false,
      message: "Fallo en la autenticación",
      data: nil,
      error: "Credenciales inválidas",
      status_code: 401
    )
  end
end