require 'sinatra'

# Lee la variable de entorno PORT o usa 3002 por defecto
set :port, ENV.fetch('PORT', 3002)
set :bind, '0.0.0.0'

enable :logging

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
    }.compact.to_json # .compact remueve las llaves que sean nil si prefieres no mostrarlas, o déjalas explícitas si quieres que siempre aparezcan.
  end
end

get '/api/products' do
  content_type :json

  json_response(
    success: true,
    message: "Listado de productos",
    data: { service: "Sinatra Products API", products: ["Laptop", "Teclado", "Mouse"] },
    error: nil
  )
end