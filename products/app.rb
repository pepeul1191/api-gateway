require 'sinatra'
require 'jwt'
require 'json'

# Lee la variable de entorno PORT o usa 3002 por defecto
set :port, ENV.fetch('PORT', 3002)
set :bind, '0.0.0.0'

enable :logging

# Misma clave secreta configurada en el microservicio de Auth
SECRET_KEY = ENV.fetch('JWT_SECRET', 'mi_clave_secreta_super_segura')

before do
  headers "X-Powered-By" => "Sinatra"
end

helpers do
  def json_response(success:, message:, data: nil, error: nil, status_code: 200)
    status status_code
    content_type :json
    {
      success: success,
      message: message,
      data: data,
      error: error
    }.compact.to_json
  end

  def extract_jwt_token
    auth_header = request.env['HTTP_AUTHORIZATION']
    return nil unless auth_header && auth_header.start_with?('Bearer ')

    auth_header.split(' ', 2).last.strip
  end

  def decode_jwt(token)
    return nil if token.nil? || token.empty?

    JWT.decode(token, SECRET_KEY, true, { algorithm: 'HS256' })[0]
  rescue JWT::DecodeError
    nil
  end
end

get '/api/products' do
  content_type :json

  token = extract_jwt_token
  payload = decode_jwt(token)
  puts payload

  json_response(
    success: true,
    message: "Listado de productos",
    data: {
      service: "Sinatra Products API",
      port: settings.port,
      user: payload ? { id: payload['sub'], username: payload['username'], role: payload['role'] } : nil,
      products: ["Laptop", "Teclado", "Mouse"]
    },
    error: nil
  )
end